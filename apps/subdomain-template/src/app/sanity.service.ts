import { Injectable } from '@angular/core';
import { createClient } from '@sanity/client';

@Injectable({
  providedIn: 'root',
})
export class SanityService {
  private client = createClient({
    projectId: 'cqrff891',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2023-05-03',
  });

  async getGalleries() {
    const query = `*[_type == "gallery"]{
      title,
      "imageUrls": images[].asset->url
    }`;
    return this.client.fetch(query);
  }
}
