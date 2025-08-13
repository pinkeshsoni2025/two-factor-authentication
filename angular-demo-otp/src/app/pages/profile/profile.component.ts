import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../model/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private toastService = inject(ToastrService);

  profileForm!: FormGroup;
  twoFactorForm!: FormGroup;
  passwordForm!: FormGroup;
  activeTab = 'profile';
  is2FAEnabled = false;
  showQRCode = false;
  qrCodeUrl = '';
  recoveryCodes: string[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  currentUser: UserResponse | null = null;
  userName: string | null =null;

  constructor() {
    this.initializeForms();
  }

  ngOnInit() {
  //  this.loadUserProfile();
  }

  private initializeForms() {
    this.profileForm = this.fb.group({
      fullname: [this.authService.getFullname(), Validators.required],
      username: [{value: this.authService.getUsername(), disabled: true}],
      bio: [this.authService.getBio()]
    });

    this.twoFactorForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.userName = this.authService.getUsername();
  }

/*  private loadUserProfile() {
    this.isLoading = true;
    this.userService.getCurrentUser().subscribe({
      next: (response) => {
        this.currentUser = response.data;
        this.is2FAEnabled = this.currentUser?.mfaEnabled ?? false;
        this.profileForm.patchValue({
          fullname: this.currentUser?.fullName ?? '',
          email: this.currentUser?.username ?? '',
          bio: this.currentUser?.bio ?? ''
        });
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Failed to load profile';
        this.toastService.error(this.errorMessage, "Error");
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }*/

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = {
        fullname: this.profileForm.get('fullname')?.value,
        bio: this.profileForm.get('bio')?.value
      };
      
     

      this.userService.updateProfile(this.userName,formData).subscribe({
        next: (response) => {
          this.successMessage = 'Profile updated successfully';
          this.toastService.success(this.successMessage,"Success");

          if(response.data.username){
            this.authService.setFullname(response.data.fullname);
            this.authService.setBio(response.data.bio);
          }

        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Failed to update profile';
          this.toastService.error(this.errorMessage,"Error");
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  updatePassword() {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { currentPassword, newPassword } = this.passwordForm.value;

      this.userService.updatePassword(this.userName, {password:currentPassword, new_password:newPassword }).subscribe({
        next: () => {
          this.successMessage = 'Password updated successfully';
          this.toastService.success(this.successMessage,"Success");
          this.passwordForm.reset();
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Incorrect password';
          this.toastService.error(this.errorMessage,"Error");
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  toggle2FA() {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.is2FAEnabled) {
      this.userService.disable2FA().subscribe({
        next: () => {
          this.is2FAEnabled = false;
          this.showQRCode = false;
          this.qrCodeUrl = '';
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Failed to disable 2FA';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.userService.generate2FAQRCode().subscribe({
        next: (response) => {
          this.qrCodeUrl = response.data;
          this.showQRCode = true;
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Failed to enable 2FA';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  enable2FA() {
    if (this.twoFactorForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const code = this.twoFactorForm.get('code')?.value;

      this.userService.enable2FA(code).subscribe({
        next: (response) => {
          this.is2FAEnabled = true;
          this.showQRCode = false;
          this.recoveryCodes = response.data.recoveryCodes;
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Invalid verification code';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  generateNewRecoveryCodes() {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.generateNewRecoveryCodes().subscribe({
      next: (response) => {
        this.recoveryCodes = response.data.recoveryCodes;
        this.successMessage = 'New recovery codes generated successfully';
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Failed to generate new recovery codes';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }
} 