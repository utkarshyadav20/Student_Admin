
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private studentCountSubject = new BehaviorSubject<number>(0);
  studentCount$ = this.studentCountSubject.asObservable();
  
  private courseCountSubject = new BehaviorSubject<number>(0);
  courseCount$ = this.courseCountSubject.asObservable();

  getStudentCount():number{
    return this.studentCountSubject.getValue();
  }
  getCourseCount():number{
    return this.courseCountSubject.getValue();
  }
  setStudentCount(count: number) {
    this.studentCountSubject.next(count);
  }

  setCourseCount(count: number) {
    this.courseCountSubject.next(count);
  }
}