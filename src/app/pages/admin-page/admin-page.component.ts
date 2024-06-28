import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent {
  protected readonly isAdmin: boolean;

  constructor(
    private router: Router,
    private base: SupabaseService,
  ) {
    this.isAdmin = this.base.isAdmin();
    if (!this.isAdmin) this.router.navigateByUrl('');
  }
}
