import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackgroundComponent } from './public/background/background.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BackgroundComponent],
  templateUrl: './app.html',
})
export class App {}
