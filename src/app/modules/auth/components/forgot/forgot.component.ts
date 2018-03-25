import {Component, Inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CognitoUtil, CognitoResponse} from "app/modules/core/cognito.service";

@Component({
	selector: 'app-forgot',
	templateUrl: './forgot.component.html'
})
export class ForgotComponent {
	public notFoundEmail: boolean = false;
	public username: string;
	public errorMessage: string = null;
	public codeStep: boolean = false;
	public verificationCode: string = '';
	public newPassword: string = '';
	constructor(public router: Router, @Inject('cognitoMain') private cognitoMain: CognitoUtil) {}

	onNext(send:boolean) {
		this.errorMessage = null;
		if(send){
			this.cognitoMain.forgotPassword(this.username).subscribe(
				(response: CognitoResponse) => {
					if (response.message != null) { //error
						this.errorMessage = response.message;
						console.log("message: " + this.errorMessage);
						if(this.errorMessage == 'Username/client id combination not found.'){
							if(this.cognitoMain.isEmail(this.username)){
								this.notFoundEmail = true;
							}
						}
					} else { //success
						console.log('Reset code sent!');
						this.codeStep = true;
					}
				}		
			);
		}
		else this.codeStep = true;
	}
	
	verify(){
		this.cognitoMain.confirmNewPassword(this.username,this.verificationCode,this.newPassword).subscribe(
			(response: CognitoResponse) => {
				if (response.message != null) { //error
					this.errorMessage = response.message;
					console.log("message: " + this.errorMessage);
					if(this.errorMessage == 'Username/client id combination not found.'){
						if(this.cognitoMain.isEmail(this.username)){
							this.notFoundEmail = true;
						}
					}
				} else { //success
					this.router.navigate(['/auth/login']);
				}
			}		
		);
	}
}
