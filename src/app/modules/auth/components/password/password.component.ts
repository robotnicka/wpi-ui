import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {UserRegistrationService} from "app/modules/core/user-registration.service";
import {UserLoginService} from "app/modules/core/user-login.service";
import {CognitoResponse} from "app/modules/core/cognito.service";

export class NewPasswordUser {
	username: string;
	existingPassword: string;
	password: string;
}
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

	constructor(public userRegistration: UserRegistrationService, public userService: UserLoginService, public router: Router) {
		this.registrationUser = new NewPasswordUser();
		this.errorMessage = null;
		this.extraAttributes = {};
	}

	ngOnInit() {
		/*this.errorMessage = null;
		console.log("Checking if the user is already authenticated. If so, then redirect to the user page");
		this.userService.isAuthenticated().subscribe(
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
		this.userRegistration.newPassword(this.registrationUser, this.extraAttributes).subscribe(
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
