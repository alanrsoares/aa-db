const fetch = require("isomorphic-fetch");
const fs = require("fs");
const db = require("../db/db.json");
const { IMAGE_PREFIX } = require("./constants");

const ROOT_DIR = `${__dirname}/..`;
const ASSETS_DIR = `${ROOT_DIR}/db/assets`;

const IMG_URLS = db.cache.map((item) => item.value.image.uri);

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

try {
  const downloads = IMG_URLS.map((url) => downloadFromUrl(url));
  fs.mkdir(ASSETS_DIR, () => {
    console.log("Downloading assets");
    Promise.all(downloads).then(() => {
      console.log(`Finished downloading assets!`);
    });
  });
} catch (e) {
  console.log("Failed to sync assets:", e);
}