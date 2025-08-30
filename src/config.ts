export const ONE_HOUR = 3600;
export const ONE_DAY = 24 * ONE_HOUR;
export const ONE_WEEK = 7 * ONE_DAY;
export const COLLECTION_ID = "cache";
export const ENDPOINT_HOST = "https://www.drivingtests.co.nz/roadcode";

const BASE_SUBCATEGORIES = [
  "core",
  "behaviour",
  "parking",
  "emergencies",
  "road-position",
  "intersection",
  "theory",
  "signs",
] as const;

export const CATEGORIES = {
  motorbike: ["motorbike-specific-questions", ...BASE_SUBCATEGORIES],
  car: [...BASE_SUBCATEGORIES],
  heavy_vehicle: [
    "heavy-vehicle-specific-questions-class-2",
    "heavy-vehicle-specific-questions-class-3-5",
    ...BASE_SUBCATEGORIES,
  ],
} as const;

export const PUPPETEER_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--disable-accelerated-2d-canvas",
  "--no-first-run",
  "--no-zygote",
  "--disable-gpu",
];

export const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export const EXTRA_HEADERS = {
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
};

type Categories = typeof CATEGORIES;

export type Category = keyof Categories;

export type Subcategory<T extends Category> = (typeof CATEGORIES)[T][number];

export type CategorySubcategory<T extends Category> = `${T}/${Subcategory<T>}`;
