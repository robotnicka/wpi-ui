import {Component, OnInit, OnDestroy, Inject} from "@angular/core";
import {Router} from "@angular/router";
import {Subscription} from 'rxjs/Subscription';
import {CognitoUtil, CognitoResponse, LoginResponse, NewPasswordUser} from "app/modules/core/cognito.service";


/**
 * This component is responsible for displaying and controlling
 * the registration of the user.
 */
@Component({
  selector: 'app-password',
  templateUrl: './password.component.html'
})
export class PasswordComponent implements OnInit,OnDestroy {
	registrationUser: NewPasswordUser;
	errorMessage: string;
	extraAttributes: any;
	loggedIn: boolean = false;
	loggedInSub: Subscription;
	constructor(@Inject('cognitoMain') public cognitoMain: CognitoUtil, public router: Router) {
		this.registrationUser = new NewPasswordUser();
		this.errorMessage = null;
		this.extraAttributes = {};
		
	}

	ngOnInit() {
		this.loggedInSub = this.cognitoMain.isAuthenticated().subscribe(
			(response:LoginResponse)=>{
				this.loggedIn = response.loggedIn;
			}
		);
	}
	ngOnDestroy() {
		if(this.loggedInSub) this.loggedInSub.unsubscribe();
	}

	onPassword() {
		console.log(this.registrationUser);
		this.errorMessage = null;
		this.cognitoMain.newPassword(this.registrationUser, this.extraAttributes).subscribe(
			(response:CognitoResponse) =>
			{
				if (response.message != null) { //error
					this.errorMessage = response.message;
					console.log("result: " + this.errorMessage);
				} else { //success
					//move to the next step
					console.log("redirecting");
					this.router.navigate(['/members']);
				}
			}
		);
	}
}
