import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { UserService } from './user.service';
import { UserLoginService } from './user-login.service';
import { UserRegistrationService } from './user-registration.service';
import { CognitoUtil } from './cognito.service';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
  //  UserService,
    UserLoginService,
    UserRegistrationService,
    CognitoUtil
]
})
export class CoreModule { }
