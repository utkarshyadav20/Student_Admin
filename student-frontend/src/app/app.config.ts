
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes'; 
import { authInterceptor } from './core/auth/auth.interceptor'; 

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LucideAngularModule, House, UserPlus, LogOut, BookOpen, ChevronDown, ChevronUp, Menu, X, BookPlus, Table2, PencilLine, Trash2, AArrowDown, AArrowUp, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Ban, Edit3,User } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(withInterceptors([authInterceptor])),
    
    importProvidersFrom(
      NgbModule,
      
      LucideAngularModule.pick({ 
        User,House, UserPlus, LogOut, BookOpen, ChevronDown, ChevronUp, Menu, X, BookPlus, Table2, PencilLine, Trash2, AArrowDown, AArrowUp, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Ban, Edit3
      })
    )
  ]
};