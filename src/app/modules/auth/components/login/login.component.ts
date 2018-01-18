import {Component, OnInit, Inject} from "@angular/core";
import {Router,ActivatedRoute} from "@angular/router";
import {CognitoUtil, CognitoResponse, LoginResponse} from "app/modules/core/cognito.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    email: string;
    password: string;
    errorMessage: string;
	loggedIn: boolean = false;
    constructor(public router: Router, @Inject('cognitoMain') private cognitoMain: CognitoUtil){
        console.log("LoginComponent constructor");
    }

    ngOnInit() {
        this.errorMessage = null;
        this.cognitoMain.isAuthenticated().subscribe(
        	(response:LoginResponse)=>{
				console.log('login page init');
				console.log('loggedIn?',response.loggedIn);
				if(response.loggedIn){
					this.loggedIn = true;
				}
				else {
					this.loggedIn = false;
				}
			}	
        );
    }

    onLogin() {
        if (this.email == null || this.password == null) {
            this.errorMessage = "All fields are required";
            return;
        }
        this.errorMessage = null;
        this.cognitoMain.authenticate(this.email, this.password).subscribe(
        	(response: CognitoResponse) => {
				if (response.message != null) { //error
					this.errorMessage = response.message;
					if (this.errorMessage === 'User is not confirmed.') {
						console.log("redirecting to confirm");
						this.router.navigate(['/auth/confirm', this.email]);
					} else if (this.errorMessage === 'User needs to set password.') {
						console.log("redirecting to set new password");
						this.router.navigate(['/auth/password']);
					}else{
						
					}
				} else { //success
					this.router.navigate(['/user']);
				}
        	}
        );
    }


}