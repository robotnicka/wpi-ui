import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {CognitoUtil, LoginResponse } from "app/modules/core/cognito.service";


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
	loggedInSub: Subscription;
	public loggedIn: boolean;
	constructor(@Inject('cognitoMain') private cognitoMain: CognitoUtil){ }
	title = 'app';
	ngOnInit() {
		this.loggedInSub = this.cognitoMain.isAuthenticated().subscribe(
			(response:LoginResponse)=>{
				this.loggedIn = response.loggedIn;
			}
		);
		
	
	}
	
	ngOnDestroy() {
		if(this.loggedInSub != null) this.loggedInSub.unsubscribe();
	}
	logout(){
		this.cognitoMain.logout();
		return false;
	}
}
