import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppService } from './services/app.service';
import { UserService } from './services/user.service';
import { MessageService } from './services/message.service';

import { AuthGuard } from './guards/auth.guard';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { CipherService } from './services/cipher.service';


const services = [
  AppService,
  UserService,
  MessageService,
  CipherService
]

const interceptors = [
  TokenInterceptor,
  ErrorInterceptor
]

const guards = [
  AuthGuard
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [...services, ...guards, ...interceptors]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }
 }
