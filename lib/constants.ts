export const CATEGORIES = [
  "Restaurant",
  "Fast Food",
  "Hotel",
  "Bar & Lounge",
  "Online Store",
  "Electronics",
  "Fashion",
  "Beauty & Salon",
  "Telecom",
  "Bank & Fintech",
  "Transport & Delivery",
  "Health",
  "Education",
  "Other",
] as const;

export const REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Western North",
  "Central",
  "Eastern",
  "Volta",
  "Oti",
  "Northern",
  "Savannah",
  "North East",
  "Upper East",
  "Upper West",
  "Bono",
  "Bono East",
  "Ahafo",
] as const;

export const REPORT_REASONS = [
  "Fake or paid review",
  "Not about this business",
  "Offensive or abusive",
  "Contains personal information",
  "Other",
] as const;

export const REVIEWS_PER_DAY_LIMIT = 10;
export const PAGE_SIZE = 12;

/** Sort orders for the business list (`?sort=`). The first one is the default. */
export const BUSINESS_SORTS = [
  { value: "popular", label: "Most reviewed" },
  { value: "rating", label: "Highest rated" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name (A–Z)" },
] as const;
export type BusinessSort = (typeof BUSINESS_SORTS)[number]["value"];
export const PHOTO_UPLOADS_PER_DAY = 20;

/** Shown to the person who suggested a business when an admin rejects it. */
export const REJECTION_REASONS = [
  "We couldn't verify that this business exists",
  "This business is already listed",
  "It doesn't appear to be a business in Ghana",
  "The details are incomplete or incorrect",
  "Spam or inappropriate content",
  "Other",
] as const;
