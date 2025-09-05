export const ONE_HOUR = 3600;
export const ONE_DAY = 24 * ONE_HOUR;
export const ONE_WEEK = 7 * ONE_DAY;
export const COLLECTION_ID = "cache";
export const ENDPOINT_HOST = "https://www.drivingtests.co.nz/roadcode";

export const COMMON_SUBCATEGORIES = [
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
  motorbike: ["motorbike-specific-questions", ...COMMON_SUBCATEGORIES],
  car: [...COMMON_SUBCATEGORIES],
  heavy_vehicle: [
    "heavy-vehicle-specific-questions-class-2",
    "heavy-vehicle-specific-questions-class-3-5",
    ...COMMON_SUBCATEGORIES,
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

export const VIEWPORT = {
  width: 1280,
  height: 720,
};

export const TIMEOUT = 10_000;
export const MAX_ATTEMPTS = 20;
export const WAIT_TIME = 1_000;
export const MAX_EMPTY_ATTEMPTS = 25;

type Categories = typeof CATEGORIES;

export type Category = keyof Categories;

export type Subcategory<T extends Category> = (typeof CATEGORIES)[T][number];

export type CategorySubcategory<T extends Category> = `${T}/${Subcategory<T>}`;
