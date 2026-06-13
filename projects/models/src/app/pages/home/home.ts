import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SafeResourcePipe } from '../../pipes/safe-resource.pipe';

@Component({
  selector: 'app-home',
  imports: [RouterLink, SafeResourcePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  model = signal<any>(null);
  galleries = signal<any[]>([]);
  aboutHtml = signal('');

  buildYoutubeUrl(url: string): string {
    const videoId = this.extractYoutubeId(url);
    return `https://www.youtube.com/embed/${videoId}`;
  }

  private extractYoutubeId(url: string): string {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || '';
    }
    return videoId;
  }
}
