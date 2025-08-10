
import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { take } from 'rxjs/operators';


export interface Alert {
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})


export class AlertService {

  private alertSubject = new BehaviorSubject<Alert | null>(null);

  public alert$ = this.alertSubject.asObservable();

  private timeoutSubscription: any;
  
  constructor() { }

  showAlert(message: string, type: Alert['type'] = 'success', duration: number = 4000): void {
    if (this.timeoutSubscription) {
      this.timeoutSubscription.unsubscribe();
    }

    this.alertSubject.next({ message, type });
    
    this.timeoutSubscription = timer(duration).pipe(take(1)).subscribe(() => {
      this.dismissAlert();
    });
  }
  dismissAlert(): void {
    if (this.timeoutSubscription) {
      this.timeoutSubscription.unsubscribe();
    }
    this.alertSubject.next(null);
  }
}