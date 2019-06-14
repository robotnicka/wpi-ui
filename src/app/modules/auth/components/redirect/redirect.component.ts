import { Component, OnInit, Inject } from '@angular/core';
import {Router,ActivatedRoute} from "@angular/router";
import {CognitoUtil} from "app/modules/core/cognito.service";


@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
})
export class RedirectComponent implements OnInit {

  constructor(private route: ActivatedRoute, public router: Router, @Inject('cognitoMain') private cognitoMain: CognitoUtil) {
  	let returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
	if(returnUrl.substring(0,4) == 'http'){
		window.location.href=returnUrl;
	}else{
		this.router.navigateByUrl(returnUrl);
	}
  }

  ngOnInit() {
  }

}
