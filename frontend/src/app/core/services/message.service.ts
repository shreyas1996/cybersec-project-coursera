import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  getMessages(): Observable<any> {
    return this.http.get(environment.configUrl + "/messages")
  }

  sendMessage(data: string, isNew: boolean, second_user: string, messageId?: string): Observable<any> {
    return this.http.post(environment.configUrl + "/message", {username: second_user, message: data})
  }

  getdbDump() {
    return this.http.get(environment.configUrl + "/dbdump")
  }

}
