export interface TypeImage {
  url: string;
  metadata: {
    width: number;
    height: number;
  };
}

export interface GalleryItem {
  id: number;
  title: string;
  slug: string;
  mainImage: string;
}

export interface GalleryDetail {
  id?: number;
  title: string;
  images: TypeImage[];
}
