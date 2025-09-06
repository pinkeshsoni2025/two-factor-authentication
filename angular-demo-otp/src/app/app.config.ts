import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
//import { authInterceptor } from './interceptors/auth.interceptor';
import { ToastrModule, provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    /*provideHttpClient(
      withInterceptors([authInterceptor])
    ),*/
    provideHttpClient(),
    importProvidersFrom(
      ToastrModule.forRoot()
    ),
    provideAnimations(), // required animations providers
    provideToastr(),
  ]
}; 