import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';
import { AppService } from './app.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public loggedIn = false;
  public sidebarVisibilityChange: BehaviorSubject<boolean> ;

  constructor(
    private http: HttpClient,
    private appService: AppService
    ) { 
      if (this.appService.getToken()) {
        // logged in so return true
        this.loggedIn  = true;
      }
      this.sidebarVisibilityChange = new BehaviorSubject<boolean>(this.loggedIn);
    }

  register(body: any): Observable<any> {
    return this.http.post(environment.configUrl + "/signup", body)
  }

  login(body: any): Observable<any> {
    return this.http.post(environment.configUrl + "/login", body)
  }

  getAllUsers(): Observable<any> {
    return this.http.get(environment.configUrl +"/getUsers")
  }

  isLoggedIn(): Observable<boolean>{
    return this.sidebarVisibilityChange.asObservable();
}
  logout() {
      let self = this;
      this.loggedIn = false;
      self.sidebarVisibilityChange.next(self.loggedIn)

      // remove user from local storage to log user out
      localStorage.removeItem('userInfo');
  }
}
