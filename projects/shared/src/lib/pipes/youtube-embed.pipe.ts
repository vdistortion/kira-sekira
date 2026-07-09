import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'youtubeEmbed',
  standalone: true,
})
export class YoutubeEmbedPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    const videoId = this.extractVideoId(url);
    if (!videoId) {
      // Если ID не удалось извлечь, возвращаем пустую безопасную строку
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`,
    );
  }

  private extractVideoId(url: string): string {
    if (!url) return '';

    // Формат youtu.be/VIDEO_ID
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1]?.split('?')[0] || '';
    }
    // Формат youtube.com/watch?v=VIDEO_ID
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1]?.split('&')[0] || '';
    }
    // Можно добавить другие форматы при необходимости
    return '';
  }
}
