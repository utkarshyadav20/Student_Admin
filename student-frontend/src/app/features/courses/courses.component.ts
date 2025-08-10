import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../shared/data.service';
import { Course, CourseService } from '../../core/api/course.service';
import { AlertService } from '../../shared/alert.service';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import {  debounceTime, distinctUntilChanged, finalize, Subject, Subscription } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../../shared/alert/alert.component';
import { formatDate } from '../../shared/utils/dateFormateer';
import { response } from 'express';

@Component({
  selector: 'app-courses',
  imports: [ 
    CommonModule,
    FormsModule, 
    NgbPaginationModule,
    LucideAngularModule,
    AlertComponent,
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})

export class CoursesComponent {
  private courseService=inject(CourseService);
  private dataService=inject(DataService)
  private alertService=inject(AlertService);
  private modalService=inject(NgbModal);
  private router=inject(Router);
  
  public formatDate=formatDate;

  courses:Course[]=[];
  isLoading=false;
  isSorted=true;
  currentPage=1;
  totalPages=1;
  itemsPerPage=10;
  totalCourses=0;
  isVisble=false;
  searchQuery='';
  
  private searchSubject = new Subject<string>();
  private searchSubscription!:Subscription;

  courseToDelete:Course| null=null;

  ngOnInit():void{
    this.loadCourses();

    this.searchSubscription=this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(()=>{
      this.currentPage=1;
      this.loadCourses();
    })

  }
  ngOnDestroy():void{
    if(this.searchSubscription){
        this.searchSubscription.unsubscribe();
    }
  }

  loadCourses():void{
    this.isLoading=true;
    const params={
      page:this.currentPage,
      search:this.searchQuery,
      isSorted:this.isSorted
    };
    this.courseService.getCourses(params).pipe(
      finalize(()=>this.isLoading=false)
    ).subscribe(
      {
        next:(response)=>{
          this.courses=response.courses,
          this.totalPages=response.totalPages
          this.totalCourses=response.totalCourses

          if(!this.searchQuery){
              this.dataService.setCourseCount(this.totalCourses)
          }
        },error:(err)=>{
          this.alertService.showAlert('Failed to Load Courses','danger')
          console.error(err)
        }
      }
    )
  }


  toggleStatus(course:Course) {
    this.courseService.toggleCourseStatus(course.course,!course.isActive).subscribe({
      next:(response)=>{
      }
    })
  }

  onSearchChange():void{
    this.searchSubject.next(this.searchQuery);
  }
  onSortClick():void{
    this.isSorted=!this.isSorted;
  }
  onPageChange(page:number):void{
    this.currentPage=page;
    this.loadCourses();
  }
  naivigateToEdit(course:String):void{
    this.router.navigate([`/admin/courses/edit`,course])
  }//check this

  openDeleteModal(modalContent:any,course:Course):void{
    this.courseToDelete=course;
    this.modalService.open(modalContent,{centered:true}).result.then(
        (result) => {
        if (result === 'delete') {
          this.deleteCourse();
        }
      },
      (reason) => {
        this.courseToDelete = null;
      }
    )
  }
  deleteCourse():void{
    if(!this.courseToDelete){
      return;
    }
    this.courseService.deleteCourse(this.courseToDelete.course).subscribe({
      next:()=>{
        this.alertService.showAlert('Student Deleted Successfully','success');
        this.dataService.setCourseCount(this.dataService.getCourseCount()-1);
        this.loadCourses();
        this.courseToDelete=null;
      },error:(err)=>{
        this.alertService.showAlert('Failed to delete course.','danger');
        this.courseToDelete=null;
      }
    })
  }
 
}
