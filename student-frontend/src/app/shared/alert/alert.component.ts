import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { Alert, AlertService } from '../alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [
    CommonModule, 
    NgbAlertModule 
  ],
  templateUrl: './alert.component.html'
})


export class AlertComponent implements OnDestroy {
  private alertService = inject(AlertService);
  private subscription: Subscription;

  // The alert object that the template will bind to.
  currentAlert: Alert | null = null;
  
  constructor() {
    // Subscribe to the service's observable. Whenever the service calls
    // `next()`, this code will run, updating the component's state.
    this.subscription = this.alertService.alert$.subscribe(alert => {
      this.currentAlert = alert;
    });
  }

  onClose(): void {
    // When the user clicks the 'x' button on the alert,
    // we tell the service to dismiss it.
    this.alertService.dismissAlert();
  }

  // It's a best practice to unsubscribe from observables when the component
  // is destroyed to prevent memory leaks.
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}