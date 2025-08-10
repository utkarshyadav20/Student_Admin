
import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { StudentService } from '../core/api/student.service';

@Injectable({ providedIn: 'root' })
export class StudentResolver implements Resolve<any> {
    private studentservice=inject(StudentService)
    
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const mode = route.paramMap.get('mode');
    const email = route.queryParamMap.get('email');

    if (mode === 'edit' && email) {
      return this.studentservice.getStudentbyEmail(email);
    } else {
      return of(null); 
    }
  }
}
