import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { YoutubeEmbedPipe } from 'shared';

@Component({
  selector: 'app-home',
  imports: [RouterLink, YoutubeEmbedPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  model = signal<any>(null);
  galleries = signal<any[]>([]);
  aboutHtml = signal('');
}
