import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../model/api-response';
import { UserResponse } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}`;
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  getCurrentUser(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/me`, this.httpOptions);
  }

  updateProfile(username: string | null, data: {
    fullname?: string;
    bio?: string;
  }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/updateprofile/${username}`, data, this.httpOptions);
  }

  updatePassword(username: string | null, data: {
    password: string;
    new_password: string;
  }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/changepassword/${username}`, data, this.httpOptions);
  }

  enable2FA(code: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/totp/enable?code=${code}`, {}, this.httpOptions);
  }
  generate2FAQRCode(): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/totp/generate`, {}, this.httpOptions);
  }

  verify2FA(code: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/totp/verify?code=${code}`, this.httpOptions);
  }

  disable2FA(): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/totp/disable`, {}, this.httpOptions);
  }

  getRecoveryCodes(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/totp/recovery-codes`, this.httpOptions);
  }

  generateNewRecoveryCodes(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/totp/recovery-codes/generate`, {}, this.httpOptions);
  }
} 