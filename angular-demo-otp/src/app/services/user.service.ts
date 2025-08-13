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

  enable2FA(username:string | null ,code: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/qrcode/validate/${username}`, {totpKey:code}, this.httpOptions);
  }
  generate2FAQRCode(username:string |null): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/qrcode/get/${username}`, this.httpOptions);
  }

  verify2FA(username:string | null ,code: string): Observable<ApiResponse> {
    return this.enable2FA(username,code);
  }

  disable2FA(username: string | null, data: {
    mfa?: string;

  }): Observable<ApiResponse> {
    return this.update2faVerifyProfile(username,data);
  }

  getRecoveryCodes(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/totp/recovery-codes`, this.httpOptions);
  }

  generateNewRecoveryCodes(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/totp/recovery-codes/generate`, {}, this.httpOptions);
  }

  update2faVerifyProfile(username: string | null, data: {
    mfa?: string;

  }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/mfa/${username}`, data, this.httpOptions);
  }
} 