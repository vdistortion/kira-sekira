// Интерфейсы для файлов Directus
export interface DirectusFile {
  id: string;
  filename_download: string;
  [key: string]: any;
}

// --- main_site ---
export interface MainSite {
  id: string;
  site_name: string;
  logo?: DirectusFile;
  main_photo?: DirectusFile;
  working_hours?: string;
  advantages_md?: string;
  videos?: Array<{ url: string; title: string }>;
  galleries?: Gallery[];
  // вспомогательные, формируемые сервисом
  main_photo_url?: string;
  logo_url?: string;
}

// --- contacts ---
export interface Contacts {
  id: string;
  telegram?: string;
  whatsapp?: string;
  phone?: string;
  email?: string;
}

// --- prices ---
export interface PriceItem {
  id: string;
  sort?: number;
  name: string;
  price: number;
  image?: DirectusFile;
  description?: string;
  image_url?: string; // добавляется сервисом
}

// --- models ---
export interface Model {
  id: string;
  subdomain: string;
  name: string;
  main_photo?: DirectusFile;
  description?: string;
  bust?: string;
  waist?: string;
  hips?: string;
  height?: string;
  weight?: string;
  clothing_size?: string;
  shoe_size?: string;
  hair_color?: string;
  eye_color?: string;
  videos?: Array<{ url: string; title: string }>;
  galleries?: Gallery[];
  main_photo_url?: string; // добавляется сервисом
}

// --- galleries ---
export interface Gallery {
  id: string;
  slug: string;
  title: string;
  cover?: DirectusFile;
  images?: GalleryImage[];
  cover_url?: string; // добавляется сервисом
}

// --- gallery_images ---
export interface GalleryImage {
  id: string;
  image?: DirectusFile;
  url?: string; // добавляется сервисом
}
