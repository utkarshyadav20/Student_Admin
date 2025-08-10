import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Course {
  id?: number;
  course: string;
  isActive?: boolean;
  added_at?: string;
  edited_at?: string;
}
export interface CourseAPI{
  courses:Course[]
  totalCourses:number,
  currentPage:number,
  totalPages:number
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl;  
  constructor() { }
  
  getAllCourses():Observable<CourseAPI>{
    return this.http.get<CourseAPI>(`${this.apiUrl}/coursesAll`)
  }
  
  getCourses(params:{page:number,search:string,isSorted:boolean}):Observable<CourseAPI>{
    let httpParams=new HttpParams()
    .set('page',params.page.toString())
    .set('search',params.search)
    .set('isSorted',params.isSorted.toString())
    return this.http.get<CourseAPI>(`${this.apiUrl}/courses`,{params:httpParams})
  }


  addCourse(course:string):Observable<Course>{
    return this.http.post<Course>(`${this.apiUrl}/courses/add`,{course})
  }


  editCourse(course:string,newCourse:string):Observable<Course>{
    return this.http.put<Course>(`${this.apiUrl}/courses/${course}`,{newCourse});
  }

  deleteCourse(course:string):Observable<any>{
    return this.http.delete(`${this.apiUrl}/courses/delete`,{body:{course}})
  }

  toggleCourseStatus(course:string,newStatus:boolean):Observable<Course>{
    return this.http.put<Course>(`${this.apiUrl}/courses/status/${course}`,{newStatus})
  }

}
