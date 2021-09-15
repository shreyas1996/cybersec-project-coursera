import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() { }

  setUserInfo(data) {
    if(data) {
      localStorage.setItem('userInfo', JSON.stringify({jwt: data.token, username: data.username}))
    }
  }
  getToken() {
    return localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo'))['jwt']: null
  }
  getUserName() {
    return localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo'))['username']: null
  }
}
