import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserLogin } from '../../model/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials: UserLogin = {
        username: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          if(response.data.username){
            this.authService.setToken(response.data.secret);
            this.authService.setFullname(response.data.fullname);
            this.authService.setUsername(response.data.username);
            this.authService.setMFA(response.data.mfa);
            this.authService.setBio(response.data.bio);
          }
          if (response.data.mfa) {
            this.router.navigate(['/otp']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (error) => { debugger;
          this.isLoading = false;
          this.errorMessage = error.error.message || 'Login failed. Please try again.';
          this.toastr.error(this.errorMessage, "Error");
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
} 