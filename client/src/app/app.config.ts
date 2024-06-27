<<<<<<< HEAD
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { LucideAngularModule, icons } from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = { 
  providers: [provideRouter(routes), provideHttpClient(), importProvidersFrom(LucideAngularModule.pick(icons))],
=======
import { ApplicationConfig,importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import {LucideAngularModule, ArrowUpRight, File, Home, Menu, UserCheck, icons, LoaderCircle} from "lucide-angular";

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(),
    importProvidersFrom(LucideAngularModule.pick({LoaderCircle}))],

>>>>>>> e313427a60de4d70f7a4ae93c268df1d965deb2a
};
