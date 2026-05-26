export interface PayloadMedia {
  id: number;
  url?: string;
  filename?: string;
  width?: number;
  height?: number;
  sizes?: {
    thumbnail?: { url?: string; width?: number; height?: number };
    medium?: { url?: string; width?: number; height?: number };
    gallery?: { url?: string; width?: number; height?: number };
  };
}
