import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../ui/icon/icon';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Icon],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Input() public title: string = '';
}
