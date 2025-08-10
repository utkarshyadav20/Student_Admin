import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, of, switchMap } from 'rxjs';
import { Student, StudentService } from '../../core/api/student.service';
import { DataService } from '../../shared/data.service';
import { AlertService } from '../../shared/alert.service';
import { CourseService } from '../../core/api/course.service';
import { CountryService } from '../../core/api/country.service';
import { StateService } from '../../core/api/state.service';
import { LucideAngularModule } from 'lucide-angular';

export interface SelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule
  ],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})


export class StudentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  
  private countryService = inject(CountryService);
  private stateService = inject(StateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);
  private dataService = inject(DataService);
  private alertService = inject(AlertService);
  private courseService = inject(CourseService);

  studentForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  private originalEmail = '';

  courseOptions: SelectOption[] = [];
  stateOptions: SelectOption[] = [];
  countryOptions: SelectOption[] = [];

  imagePreview: string | null = null;
  private imageBase64: string | null = null;

  ngOnInit(): void {
    this.initializeForm();
    this.loadDropdownData();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.studentForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s.'-]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      course: [null, Validators.required],
      country: [null],
      state: [null],
      city: [''],
      address: [''],
      about_student: ['']
    });

    this.studentForm.get('country')?.valueChanges.subscribe(countryId => {
      this.studentForm.get('state')?.reset(null, { emitEvent: false });
      this.stateOptions = [];
      if (countryId) {
        this.loadStates(countryId);
      }
    });
  }

  private loadDropdownData(): void {
    this.courseService.getCourses({ page: 1, search: '', isSorted: true }).subscribe(response => {
      this.courseOptions = response.courses.map(c => ({ value: c.course, label: c.course }));
    });
    this.countryService.getCountries().subscribe(response => {
      this.countryOptions = response.countries.map(c => ({ value: c.id, label: c.name }));
    });
  }

  private loadStates(countryId: number): void {
    this.stateService.getStates(countryId).subscribe(response => {
      this.stateOptions = response.states.map(s => ({ value: s.id, label: s.name }));
    });
  }

  private checkEditMode(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const email = params.get('email');
        if (email) {
          this.isEditMode = true;
          this.originalEmail = email;
          this.studentForm.get('email');
          return this.studentService.getStudentbyEmail(email);
        }
        return of(null);
      })
    ).subscribe(student => {
      if (student) {
        this.populateForm(student);
      }
    });
  }

  private populateForm(student: Student): void {
    this.studentForm.patchValue({
      name: student.name,
      email: student.email,
      mobile: student.mobile,
      city: student.city,
      address: student.address,
      about_student: student.about_student,
      course: student.course,
    });


    const country = this.countryOptions.find(c => c.label === student.country);
    if (country) {
      this.studentForm.get('country')?.setValue(country.value);
      setTimeout(() => {
        const state = this.stateOptions.find(s => s.label === student.state);
        if (state) this.studentForm.get('state')?.setValue(state.value);
      }, 500);
    }

    if (student.image?.data) {
      const base64String = btoa(String.fromCharCode(...new Uint8Array(student.image.data)));
      const imageUrl = `data:image/jpeg;base64,${base64String}`;
      this.imagePreview = imageUrl;
      this.imageBase64 = base64String;
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      this.imageBase64 = null;
      this.imagePreview = null;
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      this.alertService.showAlert('Image size should not exceed 4MB.', 'danger');
      (event.target as HTMLInputElement).value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.imageBase64 = (reader.result as string).split(',')[1];
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imagePreview = null;
    this.imageBase64 = null;
  }

  private prepareStudentData(): Student {
    const formValue = this.studentForm.getRawValue();

    const student: Student = {
      name: formValue.name,
      email: formValue.email,
      mobile: formValue.mobile,
      course: formValue.course,
      country: this.countryOptions.find(c => c.value === formValue.country)?.label || '',
      state: this.stateOptions.find(s => s.value === formValue.state)?.label || '',
      city: formValue.city,
      address: formValue.address,
      about_student: formValue.about_student,
      image: this.imageBase64
    };
    return student;
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      this.alertService.showAlert('Please fill all required fields correctly.', 'warning');
      return;
    }
    this.isLoading = true;
    const studentData = this.prepareStudentData();

    const action = this.isEditMode
      ? this.studentService.updateStudent(this.originalEmail, studentData)
      : this.studentService.addStudent(studentData);

    action.pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        if (!this.isEditMode) {
          const currentCount = this.dataService.getStudentCount();
          this.dataService.setStudentCount(currentCount + 1);
        }
        const message = this.isEditMode ? 'Student updated successfully!' : 'Student added successfully!';
        this.alertService.showAlert(message, 'success');
        this.router.navigate(['/admin/dashboard']);
      },
      error: err => {
        this.alertService.showAlert(err.error?.msg || 'An error occurred.', 'danger');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/dashboard']);

  }
}