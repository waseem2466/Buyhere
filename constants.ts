import { Product } from './types';

export const APP_NAME = "Shopora.lk";
export const CURRENCY_SYMBOL = "LKR";
export const WHATSAPP_NUMBER = "947649500844"; 

// FIX: Google Drive links don't work for websites. Using a generated logo that matches the theme.
export const LOGO_URL = "https://ui-avatars.com/api/?name=Shopora&background=7c3aed&color=fff&size=128&bold=true";

export const CATEGORIES = [
  "Baby Items",
  "Footwear",
  "Hand Bags",
  "Wallets",
  "Kitchen",
  "Electrical",
  "Toys",
  "Beauty"
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Luxury Hand Bag",
    slug: "luxury-hand-bag",
    description: "Experience premium sophistication with our Luxury Hand Bag, crafted with elegant finishes, spacious internal compartments and a custom-milled golden chain.",
    price_retail: 4000,
    stock: 25,
    category: "Hand Bags",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop"],
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Smart Watch",
    slug: "smart-watch",
    description: "Redefining connectivity on your wrist. Features fully customized health sensors, high-fidelity dynamic color display, sleep tracking, and a premium metal frame.",
    price_retail: 8500,
    stock: 15,
    category: "Electrical",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop"],
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Modern Sneakers",
    slug: "modern-sneakers",
    description: "High-comfort premium luxury footwear with an shock-absorbing responsive sole, light-weight design, and customized breathable outer layer.",
    price_retail: 6500,
    stock: 50,
    category: "Footwear",
    images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop"],
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Glow Vitamin C Serum",
    slug: "glow-vitamin-c-serum",
    description: "Daily skin-brightening professional formula with 15% active Vitamin C, green tea extracts, and hyaluronic acid for standard facial glow and skin health protection.",
    price_retail: 3500,
    stock: 100,
    category: "Beauty",
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop"],
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "Classic Leather Wallet",
    slug: "classic-leather-wallet",
    description: "Premium full-grain genuine leather bi-fold wallet. Features RFID blocking technology, 8 card slots, and an ultra-thin minimalist profile perfect for your front pocket.",
    price_retail: 3200,
    stock: 12,
    category: "Wallets",
    images: ["https://images.unsplash.com/photo-1627123424538-76afeaf82658?q=80&w=1200&auto=format&fit=crop"],
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "6",
    title: "Organics Soft Baby Blanket",
    slug: "organics-soft-baby-blanket",
    description: "Handcrafted from 100% GOTS certified organic Egyptian cotton. Breathable, hypoallergenic, and extremely soft on sensitive baby skin.",
    price_retail: 2800,
    stock: 80,
    category: "Baby Items",
    images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop"],
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "7",
    title: "Chef Chef Stainless Steel Knife Set",
    slug: "chef-chef-knife-set",
    description: "Professional high-carbon forged stainless steel kitchen knives. Includes 8-inch chef's knife, utility knife, paring knife, and a solid magnetic block organizer.",
    price_retail: 9500,
    stock: 20,
    category: "Kitchen",
    images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1200&auto=format&fit=crop"],
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "8",
    title: "Eco Wooden Blocks Playset",
    slug: "eco-wooden-blocks-playset",
    description: "Sustainable natural pine building blocks set. Hand-painted with non-toxic, child-safe paint, designed to foster fine motor skills and creative development.",
    price_retail: 4500,
    stock: 30,
    category: "Toys",
    images: ["https://images.unsplash.com/photo-1515488042361-404e9250afef?q=80&w=1200&auto=format&fit=crop"],
    featured: false,
    createdAt: new Date().toISOString()
  }
];

/**
 * GOOGLE MAP CONFIGURATION
 * Updated with the specific embed link for "WR smile & supplies"
 */
export const MAP_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d704838.7529036993!2d80.39160330836863!3d8.19351563770641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afb9d3d0f5c5fbd%3A0x58acad7ea5a59796!2sWR%20smile%20%26%20supplies!5e0!3m2!1sen!2slk!4v1765387918782!5m2!1sen!2slk";