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
  private readonly mainFilter = '_type == "projects" && siteType == "main"';

  async getAboutImage() {
    return this.client.fetch('*[_type == "homePage"].mainPhoto.asset->url');
  }

  async getTitle() {
    return this.client.fetch('*[_type == "homePage"].title');
  }

  async getProjectsName() {
    return this.client.fetch('*[_type == "homePage"].projectsName');
  }

  async getGalleriesList() {
    const query = `*[${this.mainFilter}]{
    title,
    "slug": slug.current,
    "mainImage": images[0].asset->url
  }`;
    return this.client.fetch(query);
  }

  async getGalleryBySlug(slug: string) {
    const query = `*[${this.mainFilter} && slug.current == $slug]{
    title,
    "images": images[].asset->{
      url,
      "metadata": metadata.dimensions
    }
  }`;
    return this.client.fetch(query, { slug });
  }

  async getAllSlugs() {
    const query = `*[${this.mainFilter}].slug.current`;
    return this.client.fetch<string[]>(query);
  }
}
