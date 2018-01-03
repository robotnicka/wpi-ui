import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CognitoUtil } from './cognito.service';
import { GuardService } from './guard.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
  	{ provide: 'cognitoMain', useClass: CognitoUtil },
  	GuardService
]
})
export class CoreModule { }
