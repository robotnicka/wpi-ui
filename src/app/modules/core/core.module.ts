import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CognitoUtil } from './cognito.service';
import { GuardService } from './guard.service';
import { HubService } from './hub.service';
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [],
  providers: [
  	{ provide: 'cognitoMain', useClass: CognitoUtil },
  	GuardService,
  	HubService
]
})
export class CoreModule { }
