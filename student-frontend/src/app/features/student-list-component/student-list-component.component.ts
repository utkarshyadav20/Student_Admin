import { Component, inject, OnInit } from '@angular/core';
import {  Router, RouterLink } from '@angular/router';
import { AlertService } from '../../shared/alert.service';
import { AlertComponent } from "../../shared/alert/alert.component";
import { Student,StudentService } from '../../core/api/student.service';
import { CourseService } from '../../core/api/course.service';
import { debounceTime, distinctUntilChanged, finalize, Subject, Subscription } from 'rxjs';
import { DataService } from '../../shared/data.service';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { formatDate } from '../../shared/utils/dateFormateer';

@Component({
  selector: 'app-student-list-component',
  standalone:true,
  imports: [
    CommonModule,
    FormsModule, 
    NgbPaginationModule,
    LucideAngularModule,
    AlertComponent,
     
  ],
  templateUrl: './student-list-component.component.html',
  styleUrl: './student-list-component.component.css'
})

export class StudentListComponentComponent {


  private studentService = inject(StudentService);
  private dataService = inject(DataService);
  private alertService = inject(AlertService);
  private modalService = inject(NgbModal);
  private router = inject(Router);
  private courseService=inject(CourseService);
  public formatDate=formatDate;
  students: Student[] = [];
  isLoading = false;
  
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 5; 
  totalStudents = 0; 

  isSortedAsc = true;
  searchQuery = '';
  courseOptions: { value: string, label: string }[] = [];
  selectedCourse: string="";
  
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  

  studentToDelete: Student | null = null;
  enlargedImageUrl: string | null = null;
  

  ngOnInit(): void {
    this.loadStudents();
    this.loadCourseOptions();
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(600),
      distinctUntilChanged() 
    ).subscribe(() => {
      this.currentPage = 1; 
      this.loadStudents();
    });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadStudents(): void {
    this.isLoading = true;
     
    const params = {
      page: this.currentPage,
      search: this.searchQuery,
      isSorted: this.isSortedAsc,
      selectedCourse: this.selectedCourse
    };
    
    this.studentService.getStudents(params).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        this.students = response.students;
        this.totalPages = response.totalPages;
        this.totalStudents = response.totalStudents;
        if (!this.searchQuery && !this.selectedCourse) {
          this.dataService.setStudentCount(response.totalStudents);
        }
      },
      error: (err) => {
        this.alertService.showAlert('Failed to load students.', 'danger');
        console.error(err);
      }
    });
  }

  
  loadCourseOptions(): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courseOptions = courses.courses.map(c => ({ value: c.course, label: c.course }));
      },
      error: (err) => console.error("Failed to load course options", err)
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadStudents();
  }

  onSortClick(): void {
    this.isSortedAsc = !this.isSortedAsc;
    this.onFilterChange();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadStudents();
  }

  navigateToEdit(email: string): void {
    this.router.navigate(['/admin/student-form/edit', email]);
  }

  openDeleteModal(modalContent: any, student: Student): void {
    this.studentToDelete = student;
    this.modalService.open(modalContent, { centered: true }).result.then(
      (result) => {
        if (result === 'delete') {
          this.deleteStudent();
        }
      },
      (reason) => {
        this.studentToDelete = null;
      }
    );
  }
  
  deleteStudent(): void {
    if (!this.studentToDelete) return;
    this.studentService.deleteByEmail(this.studentToDelete.email).subscribe({
      next: () => {
        this.alertService.showAlert('Student deleted successfully!', 'success');
        this.dataService.setStudentCount(this.dataService.getStudentCount() - 1);
        this.loadStudents();
        this.studentToDelete = null;
      },
      error: (err) => {
        this.alertService.showAlert('Failed to delete student.', 'danger');
        this.studentToDelete = null;
      }
    });
  }
  
  openImageModal(modalContent: any, student: Student): void {
    if (student.image?.data) {
      const byteArray = new Uint8Array(student.image.data);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      this.enlargedImageUrl = URL.createObjectURL(blob);
      this.modalService.open(modalContent, { centered: true, size: 'lg' });
    }
  }


  changeImagFormat(image:any):any{
      const byteArray = new Uint8Array(image);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });    
    return URL.createObjectURL(blob);
  }


}


