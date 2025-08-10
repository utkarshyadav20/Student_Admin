import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  tap,
  catchError,
  of,
  throwError,
} from 'rxjs';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);


  private apiBaseUrl = environment.apiBaseUrl;

  private tokenSubject = new BehaviorSubject<string | null>(
    this.getTokenFromStorage()
  );

  public token$ = this.tokenSubject.asObservable();

  login(credentials: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiBaseUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            this.tokenSubject.next(response.token);
          }
        }),
        catchError((error) => {
          console.error('Login failed:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    const token = this.tokenSubject.value;
    if (token) {
      this.http.post(`${this.apiBaseUrl}/logout`, {}).subscribe({
        next: () => {
          console.log('Server-side logout successful');
        },
        error: (err) => {
          console.warn('Server-side logout failed', err);
        },
        complete: () => {
          localStorage.removeItem('token');
          this.tokenSubject.next(null);
          this.router.navigate(['/login'], {
            state: { logoutMsg: true },
          });
        },
      });
    }
  }

  isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }

  checkTokenValidity(): Observable<any> {
    const token = this.tokenSubject.value;
    if (!token) {
      return of(null);
    }
    return this.http.get(`${this.apiBaseUrl}/token-check`).pipe(
      catchError((error) => {
        localStorage.removeItem('token');
        return throwError(() => new Error('Token is invalid or expired'));
      })
    );
  }

  getTokenFromStorage(): string | null {
    if (localStorage) {
      return localStorage.getItem('token');
    }
    return 'No Token';
  }
}
