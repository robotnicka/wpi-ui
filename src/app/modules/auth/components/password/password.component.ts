import {Component, OnInit, Inject} from "@angular/core";
import {Router} from "@angular/router";
import {CognitoUtil, CognitoResponse, NewPasswordUser} from "app/modules/core/cognito.service";


/**
 * This component is responsible for displaying and controlling
 * the registration of the user.
 */
@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
	registrationUser: NewPasswordUser;
	errorMessage: string;
	extraAttributes: any;

	constructor(@Inject('cognitoMain') private cognitoMain: CognitoUtil, public router: Router) {
		this.registrationUser = new NewPasswordUser();
		this.errorMessage = null;
		this.extraAttributes = {};
	}

	ngOnInit() {
		/*this.errorMessage = null;
		console.log("Checking if the user is already authenticated. If so, then redirect to the user page");
		this.cognitoMain.isAuthenticated().subscribe(
			(response:LoginResponse)=>{
				if(response.loggedIn){
					this.router.navigate(['/user']);
				}
			}	
		);
		*/
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
					this.router.navigate(['/user']);
				}
			}
		);
	}
}
