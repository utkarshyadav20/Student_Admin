import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService } from '../../core/api/course.service';
import { AlertService } from '../../shared/alert.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { OrigamiIcon } from 'lucide-angular';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-edit-course',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './edit-course.component.html',
  styleUrl: './edit-course.component.css'
})
export class EditCourseComponent implements OnInit {
  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private route=inject(ActivatedRoute)
  isLoading = false;

  orginalCourse:any;

  courseForm=this.fb.group({
    courseName:['',[Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]]
  })
  ngOnInit(): void {
    this.orginalCourse=this.route.snapshot.params;
    if(this.orginalCourse){
      this.courseForm.patchValue({courseName:this.orginalCourse.course})
    }
  }
  get courseName() { return this.courseForm.get('courseName'); }

  onSubmit():void{
    if(this.courseForm.invalid){
    this.courseForm.markAllAsTouched();
    return;
    }

    const newName=this.courseName?.value|| "";

    this.courseService.editCourse(this.orginalCourse.course,newName).pipe(
      finalize(()=>this.isLoading=false)
    ).subscribe({
      next:(response)=>{
        this.alertService.showAlert('Course Edited Successfully','success');
        this.router.navigate(['admin/courses']);
      },
      error:(err)=>this.alertService.showAlert(err.error || 'Failed to edit course','danger')
    })
  }


}
