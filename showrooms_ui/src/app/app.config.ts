import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
  withJsonpSupport,
} from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules) // Optional: Preload modules after main bundle
    ),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
      withInterceptors([errorInterceptor]),
      withJsonpSupport()
    ),
    provideAnimations(),
  ],
};
