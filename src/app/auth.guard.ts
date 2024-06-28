import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SupabaseService } from './services/supabase.service';

export const authGuard: CanActivateFn = async (_, state) => {
  const isAdminPanel = state.url === '/admin';
  const isAuth = inject(SupabaseService).isAuth();
  const isAdmin = inject(SupabaseService).isAdmin();
  const router = inject(Router);

  if (isAdminPanel) {
    if (isAuth) {
      if (isAdmin) return true;
      await router.navigateByUrl('');
      return false;
    }
    await router.navigateByUrl('auth');
    return false;
  } else {
    if (!isAuth) return true;
    if (isAdmin) await router.navigateByUrl('admin');
    else await router.navigateByUrl('');
    return false;
  }
};
