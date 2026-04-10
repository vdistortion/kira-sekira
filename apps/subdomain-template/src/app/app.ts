import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { Content } from './components/content/content';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Content],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
