import {Component, OnDestroy, OnInit, Inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CognitoUtil, CognitoResponse} from "app/modules/core/cognito.service";

@Component({
	selector: 'app-resend',
	templateUrl: './resend.component.html'
})
export class ResendComponent implements OnInit, OnDestroy {
	pathUsername: string;
	username: string;
	notFoundEmail: boolean = false;
	errorMessage: string;
	private sub: any;

	constructor(public router: Router, public route: ActivatedRoute, @Inject('cognitoMain') private cognitoMain: CognitoUtil) {
	}

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			if(params['username'] != null && params['username'].length > 0){
				this.pathUsername = params['username'];
				this.username = this.pathUsername;
			}
			else this.pathUsername=null;

		});

		this.errorMessage = null;
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}
	
	resendCode() {
		this.errorMessage = null;
		this.notFoundEmail = false;
        this.cognitoMain.resendCode(this.username).subscribe(
        	(response: CognitoResponse) => {
				if (response.message != null) {
				this.errorMessage = "Something went wrong...please try again";
				} else {
					this.router.navigate(['/auth/confirm', this.username]);
				}
        	}
        );
    }

}
