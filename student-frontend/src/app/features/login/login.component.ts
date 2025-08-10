import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../core/auth/auth.service';
import { AlertService } from '../../shared/alert.service';
import { finalize } from 'rxjs';
import { AlertComponent } from "../../shared/alert/alert.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAlertModule,
    AlertComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);
  private route = inject(ActivatedRoute);

  loginForm!: FormGroup;
  isLoading = false;

 constructor() {
  
  const nav = this.router.getCurrentNavigation();
  const state = nav?.extras.state as { logoutMsg?: boolean };

  if (state?.logoutMsg) {
    this.alertService.showAlert('Logout Successful', 'success');

    setTimeout(() => {
      history.replaceState({}, '', this.router.url);
    });
  }
}


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.authService.login(this.loginForm.value).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.router.navigate(['/admin/dashboard'], {
          state: { loginMsg: true }
        });
      },
      error: (err) => {
        const errorMessage = err.error?.msg || 'Login failed. Please check your credentials.';
        this.alertService.showAlert(errorMessage, 'danger');
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
