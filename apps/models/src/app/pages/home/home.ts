import { ChangeDetectionStrategy, Component, inject, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { lexicalToHtml } from '@kira-sekira/shared';
import { SafeResourcePipe } from '../../pipes/safe-resource.pipe';
import { PayloadService } from '../../payload.service';
import { HostService } from '../../host.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, SafeResourcePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private payload = inject(PayloadService);
  private hostService = inject(HostService);

  model = signal<any>(null);
  galleries = signal<any[]>([]);
  aboutHtml = signal('');

  constructor() {
    effect(async () => {
      const subdomain = this.hostService.getSubdomain();
      const modelData = await this.payload.getModelBySubdomain(subdomain);
      if (modelData) {
        this.model.set(modelData);
        if (modelData.about) {
          this.aboutHtml.set(lexicalToHtml(modelData.about));
        }
        const galleriesData = await this.payload.getGalleriesByModel(modelData.id);
        this.galleries.set(galleriesData);
      }
    });
  }

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
