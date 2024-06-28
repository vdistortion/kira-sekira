import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss',
})
export class AuthPageComponent {
  constructor(
    private router: Router,
    private base: SupabaseService,
  ) {}

  auth(e: Event) {
    e.preventDefault();
    this.base.auth();
  }

  toHome() {
    this.router.navigateByUrl('');
  }
}
