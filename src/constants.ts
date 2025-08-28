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

type Categories = typeof CATEGORIES;

export type Category = keyof Categories;

export type Subcategory<T extends Category> = (typeof CATEGORIES)[T][number];

export type CategorySubcategory<T extends Category> = `${T}/${Subcategory<T>}`;
