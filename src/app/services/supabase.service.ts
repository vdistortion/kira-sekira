import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private readonly db = createClient(
    environment.supabaseUrl,
    environment.supabaseKey,
  );

  async auth() {
    const { data, error } = await this.db.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    console.log({ data, error });
  }

  async getUser() {
    const { data, error } = await this.db.auth.getSession();
    console.log({ data, error });
    const {
      data: { user },
    } = await this.db.auth.getUser();
    console.log({ user });
  }
}
