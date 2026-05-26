import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'youtubeId',
  standalone: true,
})
export class YoutubeIdPipe implements PipeTransform {
  transform(url: string): string {
    if (!url) return '';

    let videoId = '';

    // youtu.be/VIDEO_ID
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    }
    // youtube.com/watch?v=VIDEO_ID
    else if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || '';
    }

    return videoId;
  }
}
