import { Product } from './types.ts';

export const APP_NAME = "WR Smile & Supplies";
export const CURRENCY_SYMBOL = "LKR";
export const WHATSAPP_NUMBER = "947649500844"; 

// FIX: Google Drive links don't work for websites. Using a generated logo that matches the theme.
export const LOGO_URL = "https://ui-avatars.com/api/?name=WR&background=7c3aed&color=fff&size=128&bold=true";

export const CATEGORIES = ["Electronics", "Home & Living", "Beauty", "Fashion", "Toys"];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Sony WH-1000XM5 Wireless Headphones",
    slug: "sony-wh-1000xm5",
    description: "Industry-leading noise cancellation with two processors controlling 8 microphones for unprecedented noise cancellation.",
    price_retail: 115000,
    discount: 10,
    stock: 25,
    category: "Electronics",
    images: ["https://picsum.photos/600/600?random=1", "https://picsum.photos/600/600?random=11"],
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "MacBook Air M2 Midnight",
    slug: "macbook-air-m2",
    description: "Redesigned around the next-generation M2 chip, MacBook Air is startingly thin and exceptionally fast.",
    price_retail: 385000,
    stock: 5,
    category: "Electronics",
    images: ["https://picsum.photos/600/600?random=2"],
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Ceramic Minimalist Vase Set",
    slug: "ceramic-vase-set",
    description: "Handcrafted ceramic vases perfect for modern home aesthetics. Comes in a set of 3.",
    price_retail: 12500,
    stock: 50,
    category: "Home & Living",
    images: ["https://picsum.photos/600/600?random=3"],
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Glow Serum Vitamin C",
    slug: "glow-serum-vit-c",
    description: "Brightening serum with 15% pure Vitamin C. Dermatologically tested for all skin types.",
    price_retail: 4500,
    stock: 100,
    category: "Beauty",
    images: ["https://picsum.photos/600/600?random=4"],
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "Mechanical Keyboard RGB",
    slug: "mech-keyboard-rgb",
    description: "Tactile brown switches with customizable per-key RGB lighting and hot-swappable board.",
    price_retail: 28000,
    discount: 15,
    stock: 12,
    category: "Electronics",
    images: ["https://picsum.photos/600/600?random=5"],
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "6",
    title: "Modern Lounge Chair",
    slug: "modern-lounge-chair",
    description: "Ergonomic design meets premium velvet upholstery. A statement piece for any living room.",
    price_retail: 45000,
    stock: 8,
    category: "Home & Living",
    images: ["https://picsum.photos/600/600?random=6"],
    featured: true,
    createdAt: new Date().toISOString()
  }
];

/**
 * GOOGLE MAP CONFIGURATION
 * Updated with the specific embed link for "WR smile & supplies"
 */
export const MAP_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d704838.7529036993!2d80.39160330836863!3d8.19351563770641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afb9d3d0f5c5fbd%3A0x58acad7ea5a59796!2sWR%20smile%20%26%20supplies!5e0!3m2!1sen!2slk!4v1765387918782!5m2!1sen!2slk";