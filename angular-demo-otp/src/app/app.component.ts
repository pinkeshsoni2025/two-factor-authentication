import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `<app-header></app-header>
  <router-outlet></router-outlet><app-footer></app-footer>`
})
export class AppComponent {
  title = 'my-angular-app';

  constructor(private authService:AuthService){
   
  }
} 