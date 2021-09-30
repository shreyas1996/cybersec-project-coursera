import { Injectable } from '@angular/core';
import * as CryptoJS from "crypto-js"
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CipherService {

  constructor() { }

  encryptMessage(plainText): Observable<any> {
    const encrypt = CryptoJS.AES.encrypt(plainText, environment.aes.secret)
    console.log("encrypt", encrypt.toString());
    return of(encrypt.toString())
  }

  decryptMessage(cipherText): Observable<any> {
      const bytes = CryptoJS.AES.decrypt(cipherText, environment.aes.secret)
      console.log("bytes", bytes.toString())
      const decrypt = bytes.toString(CryptoJS.enc.Utf8)
      console.log("decrypt", decrypt);
      return of(decrypt)
  }

}
