import { inject, Injectable, signal } from '@angular/core';
import {BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthenticationResponseDTO, UserLogin, UserRegister, UserResponse } from '../model/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../model/api-response';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = signal<boolean>(false);
  private readonly http = inject(HttpClient);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  private readonly TOKEN_KEY = 'secret';
  private readonly USER_NAME = 'username';
  private readonly FULL_NAME = 'fullname';
  private readonly BIO = 'bio';
  private readonly MFA = 'mfa';
  private readonly router = inject(Router);
  
  constructor() {
    const token = localStorage.getItem('secret');
    if (token) {
      this.isAuthenticated.set(true);
    }

    this.isLoggedInSubject.next(!!token);
  }

  
  login(credentials: UserLogin): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/login`, credentials);
  }

  register(user: UserRegister): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/users`, user);
  }

  logout(): void {
    this.clearToken();
     this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  isUserAuthenticated(): boolean {
    this.isLoggedInSubject.next(true);
    return !!this.getToken();
    
  }

  

  updatePassword(currentPassword: string, newPassword: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/auth/update-password`, {
      currentPassword,
      newPassword
    });
  }

  getBio(): string | null {
    return localStorage.getItem(this.BIO);
  }
  setBio(bio: string): void {
    localStorage.setItem(this.BIO, bio);
  }

  getMFA(): string | null {
    return localStorage.getItem(this.MFA);
  }
  setMFA(mfa: string): void {
    localStorage.setItem(this.MFA, mfa);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.USER_NAME);
  }
  setUsername(username: string): void {
    localStorage.setItem(this.USER_NAME, username);
  }

  getFullname(): string | null {
    return localStorage.getItem(this.FULL_NAME);
  }
  setFullname(fullname: string): void {
    localStorage.setItem(this.FULL_NAME, fullname);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.isAuthenticated.set(true);
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticated.set(false);
  }

} 