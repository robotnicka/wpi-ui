import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from "@angular/router";
import { AuthService} from 'app/modules/core/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
	returnUrl: string;
	username: string;
	errorMessage: string;
	needConfirm: boolean = false;
	notFoundEmail: boolean = false;
	loggedIn: boolean = false;
	public submitting: boolean = false;
	
	constructor(private route: ActivatedRoute, public router: Router, private authService: AuthService){
		console.log("RegisterComponent constructor");
	}

	ngOnInit() {
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
		this.errorMessage = null;
		this.authService.login(this.returnUrl, 'signUp');
		
	}

}
