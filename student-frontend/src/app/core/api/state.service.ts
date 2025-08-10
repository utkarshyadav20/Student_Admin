import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


export interface State{
  id?        :Number        
  name      :string
  stateCode? :string
  countryId? :Number


}
export interface StateArray{
  states:State[]
} 

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() { }

  private http=inject(HttpClient);
  
  private apiUrl=environment.apiBaseUrl;

  getStates(countryId:number):Observable<StateArray>{

    return this.http.get<StateArray>(`${this.apiUrl}/state`,{
    params:{countryId}
    });

  }
}
