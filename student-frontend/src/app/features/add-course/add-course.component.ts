import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { CourseService } from '../../core/api/course.service';
import { DataService } from '../../shared/data.service';
import { AlertService } from '../../shared/alert.service';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-course.component.html',
})

export class AddCourseComponent {
  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);
  private dataService = inject(DataService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  isLoading = false;

  courseForm = this.fb.group({
    courseName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]]
  });

  get courseName() { return this.courseForm.get('courseName'); }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const name = this.courseName?.value || '';

    this.courseService.addCourse(name).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.alertService.showAlert('Course added successfully!', 'success');
        this.dataService.setCourseCount(this.dataService.getCourseCount()+ 1);
        this.router.navigate(['/admin/courses']);
      },
      error: (err) => this.alertService.showAlert(err.error?.msg || 'Failed to add course.', 'danger')
    });
  }
}