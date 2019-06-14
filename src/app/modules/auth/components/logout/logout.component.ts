import { Component, OnInit, Inject } from '@angular/core';
import {CognitoUtil} from "app/modules/core/cognito.service";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
})
export class LogoutComponent implements OnInit {

  constructor(@Inject('cognitoMain') private cognitoMain: CognitoUtil) {
	this.cognitoMain.logout();	
  }

  ngOnInit() {
  }

}
