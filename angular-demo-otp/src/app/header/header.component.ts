import { Component,  OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements  OnDestroy {
token: string | null = null;
private authSubscription: Subscription | undefined;
isLoggedIn: boolean = false;

  
constructor(
    private router: Router,
    private authService:AuthService

  ) {
      this.authSubscription = this.authService.isLoggedIn$.subscribe(status => {
        this.isLoggedIn = status;
       });
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  public goToRegister(){
    this.router.navigate(['/register']);
  }
}
