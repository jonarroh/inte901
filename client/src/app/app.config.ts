import { ApplicationConfig,importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import {LucideAngularModule, ArrowUpRight, File, Home, Menu, UserCheck, icons, LoaderCircle} from "lucide-angular";

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(),
    importProvidersFrom(LucideAngularModule.pick({LoaderCircle}))],

};
