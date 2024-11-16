import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegistrationRequest, User, Response } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:7724/api/Auth';
  private userSubject = new BehaviorSubject<User | null>(null);
  
  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  login(loginRequest: LoginRequest): Observable<Response<LoginResponse>> {
    return this.http.post<Response<LoginResponse>>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          if (response.isSuccess && response.result) {
            localStorage.setItem('token', response.result.token);
            localStorage.setItem('user', JSON.stringify(response.result.user));
            this.userSubject.next(response.result.user);
          }
        })
      );
  }

  register(registrationRequest: RegistrationRequest): Observable<Response<void>> {
    return this.http.post<Response<void>>(`${this.apiUrl}/register`, registrationRequest);
  }

  assignRole(email: string, role: string): Observable<Response<void>> {
    return this.http.post<Response<void>>(`${this.apiUrl}/assignRole`, { email, role });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  get currentUser$(): Observable<User | null> {
    return this.userSubject.asObservable();
  }
}
