import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Student {
  name: string;
  email: string;
  mobile: string;
  course: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  about_student?: string;
  image?: any; 
  isActive?: boolean;
  added_at?: string;
  edited_at?: string;
}

export interface StudentApiResponse {
  students: Student[];
  totalStudents: number;
  currentPage: number;
  totalPages:number;
}


@Injectable({
  providedIn: 'root'
})

export class StudentService {
   private http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl; 

  constructor() { 
  }

  getStudents(params:{ page: number, search: string, isSorted: boolean, selectedCourse?: string | null }):Observable<StudentApiResponse>{
    
    let httpParams=new HttpParams()
    .set('page',params.page.toString())
    .set('search',params.search)
    .set('isSorted',params.isSorted.toString())

    if(params.selectedCourse){
     httpParams= httpParams.set('course',params.selectedCourse);

    }

    return this.http.get<StudentApiResponse>(`${this.apiUrl}/students/`,{params:httpParams})

  }

  getStudentbyEmail(email:string):Observable<Student>  {
    return this.http.get<Student>(`${this.apiUrl}/students/${email}`)
  }

  deleteByEmail(email:string):Observable<any>{
    return this.http.delete(`${this.apiUrl}/students/${email}`)
  }


  addStudent(studentData:Student):Observable<Student>{
    console.log(studentData);
    return this.http.post<Student>(`${this.apiUrl}/students`,studentData)
  }

  updateStudent(email:string,studentData:Student):Observable<Student>{
    return this.http.put<Student>(`${this.apiUrl}/students/${email}`,studentData);
  }

}
