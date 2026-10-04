import "dotenv/config";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type BusinessType } from "../lib/generated/prisma/client";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

type SeedBusiness = {
  slug: string;
  name: string;
  type: BusinessType;
  category: string;
  description: string;
  address?: string;
  city?: string;
  region?: string;
  website?: string;
  phone?: string;
};

const BUSINESSES: SeedBusiness[] = [
  {
    slug: "ikes-cafe-and-grill",
    name: "Ike's Cafe and Grill",
    type: "PHYSICAL",
    category: "Restaurant",
    description:
      "A fine dining African full-service restaurant offering a traditional experience in an elegant ambiance — seafood, beef and chicken suya, jollof rice, waakye, red red, yam porridge (asaro), egusi and much more, plus a full bar of drinks from across the African continent.",
    address: "Ghana National Cultural Centre",
    city: "Kumasi",
    region: "Ashanti",
    phone: "+233503113110",
  },
  {
    slug: "atta-b-rice",
    name: "Atta B Rice",
    type: "PHYSICAL",
    category: "Fast Food",
    description: "Popular student spot for fried rice, jollof and chicken, served fast and in generous portions.",
    address: "Adjacent Christian Service University",
    city: "Kumasi",
    region: "Ashanti",
  },
  {
    slug: "rakho-fufu",
    name: "Rakho Fufu",
    type: "PHYSICAL",
    category: "Restaurant",
    description: "Local chop bar serving fufu with light soup, groundnut soup and palm nut soup with goat, beef and fish.",
    address: "Opposite Rakho Primary School",
    city: "Kotei",
    region: "Ashanti",
  },
  {
    slug: "lancaster-hotel-accra",
    name: "Lancaster Hotel",
    type: "PHYSICAL",
    category: "Hotel",
    description: "Hotel with a pool, restaurant and conference facilities in central Accra.",
    address: "Liberation Road",
    city: "Accra",
    region: "Greater Accra",
  },
  {
    slug: "super-mc-restaurant",
    name: "Super-Mc Restaurant",
    type: "PHYSICAL",
    category: "Restaurant",
    description: "Busy restaurant serving Ghanaian and continental dishes, with indoor seating and takeaway.",
    address: "JK Acheampong Ave",
    city: "Kumasi",
    region: "Ashanti",
  },
  {
    slug: "pizzaman-chickenman-kumasi",
    name: "Pizzaman Chickenman",
    type: "PHYSICAL",
    category: "Fast Food",
    description: "Pizza and fried chicken chain with branches across Ghana. Dine in, takeaway and delivery.",
    address: "Opposite Animal Science Department, Mango Rd",
    city: "Kumasi",
    region: "Ashanti",
  },
  {
    slug: "bloombar-osu",
    name: "Bloombar",
    type: "PHYSICAL",
    category: "Bar & Lounge",
    description: "Bar and lounge known for live music nights, cocktails and grills.",
    address: "Oxford Street, Osu",
    city: "Accra",
    region: "Greater Accra",
  },
  {
    slug: "kfc-baatsona",
    name: "KFC Baatsona",
    type: "PHYSICAL",
    category: "Fast Food",
    description: "KFC restaurant serving fried chicken, burgers and sides. Drive-through available.",
    address: "Spintex Road, Baatsona",
    city: "Accra",
    region: "Greater Accra",
  },
  {
    slug: "dominos-pizza-east-legon",
    name: "Domino's Pizza",
    type: "PHYSICAL",
    category: "Fast Food",
    description: "Pizza delivery and carry-out.",
    address: "Lagos Avenue, East Legon",
    city: "Accra",
    region: "Greater Accra",
  },
  {
    slug: "jumia-ghana",
    name: "Jumia Ghana",
    type: "ONLINE",
    category: "Online Store",
    description: "Online marketplace selling electronics, fashion, groceries and more, with delivery across Ghana.",
    website: "https://www.jumia.com.gh",
  },
  {
    slug: "tonaton",
    name: "Tonaton",
    type: "ONLINE",
    category: "Online Store",
    description: "Classifieds marketplace for buying and selling cars, property, phones, electronics and more in Ghana.",
    website: "https://tonaton.com",
  },
  {
    slug: "melcom-online",
    name: "Melcom Online",
    type: "ONLINE",
    category: "Online Store",
    description: "Online shop of Ghana's large retail chain — household goods, electronics, furniture and more.",
    website: "https://www.melcom.com",
  },
];

/** Photos placed in public/images/businesses/<slug>/ are picked up automatically. */
function imagesFor(slug: string): string[] {
  const dir = path.join(process.cwd(), "public", "images", "businesses", slug);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
    .sort()
    .map((f) => `/images/businesses/${slug}/${f}`);
}

// Demo content for local development only (from the Figma "Review Ticker").
const DEMO_REVIEWERS = [
  { name: "John Achimota", email: "john@example.com" },
  { name: "Karen Taifa", email: "karen@example.com" },
  { name: "Tom Virginia", email: "tom@example.com" },
  { name: "Daniel Santasi", email: "daniel@example.com" },
  { name: "Wilson East Legon", email: "wilson@example.com" },
  { name: "Sarah Kokomlemle", email: "sarah@example.com" },
  { name: "Mark Sokoban", email: "mark@example.com" },
  { name: "Emma Ablekuma", email: "emma@example.com" },
];

const DEMO_REVIEWS: [string, number, string][] = [
  ["A great place to relax and enjoy", 4, "A great place with a wonderful atmosphere. The food was delicious, especially the beef Wellington. The presentation was top-notch. However, the service was a bit slow, which is why I am giving it 4 stars instead of 5. Despite that, I would definitely return for another meal."],
  ["Cozy Atmosphere, Strong Coffee", 4, "Enjoyed the cozy atmosphere. The coffee was a bit too strong for my taste, but the pastries were delightful."],
  ["Good Food, Overpriced and Slow Service", 3, "Good food but overpriced. The service was a bit slow for my liking, and we waited almost forty minutes for mains."],
  ["Amazing Brunch Spot", 5, "Amazing brunch spot! The avocado toast and mimosas were top-notch. Great place to start your weekend with friends."],
  ["Juicy Burger, Crispy Fries Needed", 4, "Nice place with friendly staff. The burger was juicy and delicious, but the fries could have been crispier."],
  ["Amazing Desserts and Cozy Ambiance", 5, "Loved the ambiance and the dessert menu is to die for. Highly recommend the tiramisu and the chocolate lava cake!"],
  ["Great Atmosphere, Overcooked Pasta", 3, "Great atmosphere and delicious food overall. The pasta was a bit overcooked, but the staff were quick to offer a replacement."],
  ["Lovely staff, will come back", 5, "The staff were warm and attentive from the moment we arrived. Everything we ordered came out hot and well seasoned."],
];

async function main() {
  // --- Admin ---
  const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? "admin@ratingsghana.local").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: {
      email: adminEmail,
      name: "RatingsGhana Admin",
      passwordHash: await bcrypt.hash(adminPassword, 10),
      emailVerified: new Date(),
      role: "ADMIN",
    },
  });

  // --- Businesses ---
  for (const b of BUSINESSES) {
    const local = imagesFor(b.slug);
    const existing = await prisma.business.findUnique({ where: { slug: b.slug }, select: { images: true } });
    // The seed runs on every deploy: keep community photos admins have approved since,
    // and only add local photos that aren't listed yet.
    const images = existing ? [...existing.images, ...local.filter((u) => !existing.images.includes(u))] : local;
    const data = { ...b, status: "APPROVED" as const, images };
    await prisma.business.upsert({ where: { slug: b.slug }, update: data, create: data });
  }
  console.log(`Seeded admin (${adminEmail}) and ${BUSINESSES.length} businesses.`);

  if (process.env.SEED_DEMO_DATA !== "true") {
    console.log("Skipping demo reviews (set SEED_DEMO_DATA=true to add them — never in production).");
    return;
  }

  // --- Demo reviewers + reviews ---
  const passwordHash = await bcrypt.hash("Password123", 10);
  const reviewers = [];
  for (const [i, r] of DEMO_REVIEWERS.entries()) {
    reviewers.push(
      await prisma.user.upsert({
        where: { email: r.email },
        update: {},
        create: {
          ...r,
          passwordHash,
          emailVerified: new Date(),
          phone: `+2332400000${String(i).padStart(2, "0")}`,
          phoneVerifiedAt: new Date(),
        },
      }),
    );
  }

  const businesses = await prisma.business.findMany({ where: { type: "PHYSICAL" } });
  let n = 0;
  for (const [bi, business] of businesses.entries()) {
    // Vary how many reviews each business gets so the listing order is interesting.
    const count = Math.max(1, DEMO_REVIEWERS.length - bi);
    for (let k = 0; k < count; k++) {
      const user = reviewers[(bi + k) % reviewers.length];
      const [title, rating, body] = DEMO_REVIEWS[(bi * 3 + k) % DEMO_REVIEWS.length];
      await prisma.review.upsert({
        where: { userId_businessId: { userId: user.id, businessId: business.id } },
        update: {},
        create: {
          userId: user.id,
          businessId: business.id,
          rating,
          title,
          body,
          createdAt: new Date(Date.now() - (k * 5 + bi) * 24 * 60 * 60 * 1000),
        },
      });
      n++;
    }
    const agg = await prisma.review.aggregate({
      where: { businessId: business.id, status: "PUBLISHED" },
      _avg: { rating: true },
      _count: { _all: true },
    });
    await prisma.business.update({
      where: { id: business.id },
      data: { avgRating: Math.round((agg._avg.rating ?? 0) * 10) / 10, reviewCount: agg._count._all },
    });
  }
  console.log(`Seeded ${reviewers.length} demo reviewers (password "Password123") and ${n} demo reviews.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
