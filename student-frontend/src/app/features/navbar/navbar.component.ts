
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd, ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { filter, map, mergeMap } from 'rxjs';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Output() logoutRequest = new EventEmitter<void>();
  private router = inject(Router);
  dataService = inject(DataService); // Make public to access in template
  
  // Observables to determine which section we're in
  isCourseSection$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map((event: any) => event.urlAfterRedirects.includes('/admin/courses'))
  );



  onLogout(): void {
    this.logoutRequest.emit();
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}