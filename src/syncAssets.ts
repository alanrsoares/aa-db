import fetch from "node-fetch";
import fs from "fs";

import { IMAGE_PREFIX } from "./constants";
import { CacheKey, Question } from "./Cache";

const ROOT_DIR = `${__dirname}/..`;
const ASSETS_DIR = `${ROOT_DIR}/db/assets`;

function downloadFromUrl(url = "", verbose = false) {
  return new Promise(async (resolve) => {
    const response = await fetch(url);
    const buffer = await response.buffer();

    const fileName = url.replace(IMAGE_PREFIX, "");

    fs.writeFile(`${ASSETS_DIR}/${fileName}`, buffer, () => {
      if (verbose) {
        console.log(`Downloaded: ${fileName}`);
      }
      resolve(`${fileName}`);
    });
  });
}

export default async function syncAssets(items: CacheKey<Question>[] = []) {
  const IMG_URLS = items.map((item) => item.value.image.uri);

  return new Promise<void>((resolve, reject) => {
    try {
      const downloads = IMG_URLS.map((url) =>
        downloadFromUrl(`${IMAGE_PREFIX}/${url}`)
      );
      fs.mkdir(ASSETS_DIR, async () => {
        console.log("Downloading assets");
        await Promise.all(downloads);
        console.log(`Finished downloading assets!`);
      });
      resolve();
    } catch (e) {
      console.log("Failed to sync assets:", e);
      reject(e);
    }
  });
}

module.exports = syncAssets;
