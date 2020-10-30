import {Component, OnInit, Inject, ViewChild, ElementRef} from "@angular/core";
import {Router,ActivatedRoute} from "@angular/router";
import { AuthService} from 'app/modules/core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
	returnUrl: string;
	username: string;
	errorMessage: string;
	needConfirm: boolean = false;
	notFoundEmail: boolean = false;
	loggedIn: boolean = false;
	public submitting: boolean = false;
	
	constructor(private route: ActivatedRoute, public router: Router, private authService: AuthService){
		console.log("LoginComponent constructor");
	}

	ngOnInit() {
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
		this.errorMessage = null;
		this.authService.login(this.returnUrl);
		
	}

	/*onLogin() {
		this.needConfirm = false;
		this.notFoundEmail = false;
		
		if (this.username == null || this.password == null) {
			this.errorMessage = "All fields are required";
			return;
		}
		this.submitting = true;
		this.errorMessage = null;
		this.cognitoMain.authenticate(this.username, this.password).subscribe(
			(response: CognitoResponse) => {
				if (response.message != null) { //error
					this.errorMessage = response.message;
					if (this.errorMessage === 'User is not confirmed.') {
						//console.log("redirecting to /auth/confirm/",this.username);
						//this.router.navigate(['/auth/confirm', this.username]);
						console.log('setting needConfirm');
						this.needConfirm = true;
					} else if (this.errorMessage == 'User does not exist.') {
						if(this.cognitoMain.isEmail(this.username)){
							this.notFoundEmail = true;
						}
					} else if (this.errorMessage === 'User needs to set password.') {
						console.log("redirecting to set new password");
						this.router.navigate(['/auth/password']);
					}
					this.submitting = false;
				} else { //success
					if(this.returnUrl.substring(0,4) == 'http'){
						window.location.href=this.returnUrl;
					}else{
						this.router.navigateByUrl(this.returnUrl);
					}
				}
			}
		);
	}*/


}