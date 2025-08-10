import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgbAccordionModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgbCollapseModule, // For the collapsible courses section
    LucideAngularModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  private router = inject(Router);

  // This creates an event that the parent (LayoutComponent) can listen to.
  @Output() logoutRequest = new EventEmitter<void>();

  isOpen = false;
  isCoursesOpen = false;

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.isCoursesOpen = false; // Collapse courses when sidebar closes
    }
  }

  // Wrapper function to emit the logout event.
  onLogout(): void {
    this.logoutRequest.emit();
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}