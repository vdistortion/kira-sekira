import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { createClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private readonly db = createClient(
    environment.supabaseUrl,
    environment.supabaseKey,
  );
  public readonly user$: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);

  constructor() {
    this.getSession();
  }

  isAuth() {
    return Boolean(this.user$.getValue());
  }

  isAdmin(): boolean {
    const user = this.user$.getValue();
    if (user?.email) return environment.adminList.includes(user.email);
    return false;
  }

  auth() {
    this.db.auth
      .signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: '/admin',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      .then(() => this.getSession());
  }

  logOut(): void {
    this.db.auth.signOut().then(() => this.user$.next(null));
  }

  getUser() {
    this.db.auth.getUser().then(({ data: { user } }) => {
      this.user$.next(user);
    });
  }

  getSession() {
    this.db.auth.getSession().then(({ data: { session }, error }) => {
      if (error) this.getUser();
      if (session?.user) this.user$.next(session.user);
    });
  }
}
