import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Observable} from 'rxjs/Observable';
import { map, switchMap } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import {RegistrationUser, RegistrationAddressInfo} from "app/modules/auth/components/register/register.component";

import {
	AuthenticationDetails,
	CognitoIdentityServiceProvider,
	CognitoUser,
	CognitoUserAttribute,
	CognitoUserPool,
	CognitoUserSession
} from "amazon-cognito-identity-js";
import { CanActivate, Router } from '@angular/router';

export class CognitoResponse{
	public message: string;
	public result: any;
	constructor(message: string, result: any){
		this.message = message;
		this.result = result;
	}
	
}

export class LoginResponse{
	public message: string;
	public loggedIn: boolean;
	constructor(message: string, loggedIn: boolean){
		this.message = message;
		this.loggedIn = loggedIn;
	}
}

export class CognitoPasswordChallenge{
	public userAttributes: any;
	public requiredAttributes: any;
	constructor(userAttributes: any, requiredAttributes: any){
		this.userAttributes = userAttributes;
		this.requiredAttributes = requiredAttributes;
	}
	
}

export class NewPasswordUser {
	username: string;
	existingPassword: string;
	password: string;
}

@Injectable()
export class CognitoUtil {

	public static _REGION = environment.cognito.region;

	public static _IDENTITY_POOL_ID = environment.cognito.identityPoolId;
	public static _USER_POOL_ID = environment.cognito.userPoolId;
	public static _CLIENT_ID = environment.cognito.clientId;

	public static _POOL_DATA:any = {
		UserPoolId: CognitoUtil._USER_POOL_ID,
		ClientId: CognitoUtil._CLIENT_ID
	};
	
	public challenge: CognitoPasswordChallenge = null;
	public registeredUser: CognitoUser = null;

	private $loggedIn: BehaviorSubject<LoginResponse>;
	constructor(private router: Router) {}
	
	authenticate(username: string, password: string) {
		let authenticateResult = new ReplaySubject<CognitoResponse>();
		console.log("UserLoginService: starting the authentication")

		let authenticationData = {
			Username: username,
			Password: password,
		};
		let authenticationDetails = new AuthenticationDetails(authenticationData);

		let userData = {
			Username: username,
			Pool: this.getUserPool()
		};

		console.log("UserLoginService: Params set...Authenticating the user");
		let cognitoUser = new CognitoUser(userData);
		//console.log("UserLoginService: config is " + AWS.config);
		//var self = this;
		cognitoUser.authenticateUser(authenticationDetails, {
			newPasswordRequired: (userAttributes, requiredAttributes) => {
				this.setAuthChallenge(new CognitoPasswordChallenge(userAttributes, requiredAttributes));
				authenticateResult.next(new CognitoResponse(`User needs to set password.`, null));
			},
			onSuccess: (result: CognitoUserSession, userConfirmationNecessary: boolean) => {

				console.log("In authenticateUser onSuccess callback");
				console.log("UserLoginService: Successfully logged in");
				authenticateResult.next(new CognitoResponse(null, result));
				this.$loggedIn.next(new LoginResponse("User logged in", true));
			},
			onFailure: function (err) {
				authenticateResult.next(new CognitoResponse(err.message, null));
			},
		});
		return authenticateResult.asObservable().first(); 
	}

	forgotPassword(username: string): Observable<CognitoResponse> {
		let forgotResult = new ReplaySubject<CognitoResponse>();
		if(!username){
			forgotResult.next(new CognitoResponse('Username is required', null));
			return forgotResult.asObservable().first();
		}
		let userData = {
			Username: username,
			Pool: this.getUserPool()
		};

		let cognitoUser = new CognitoUser(userData);

		cognitoUser.forgotPassword({
			onSuccess: function () {

			},
			onFailure: function (err) {
				forgotResult.next(new CognitoResponse(err.message, null));
			},
			inputVerificationCode() {
				forgotResult.next(new CognitoResponse(null, null));
			}
		});
		return forgotResult.asObservable().first();
	}

	confirmNewPassword(username: string, verificationCode: string, password: string) : Observable<CognitoResponse> {
		let confirmResult = new ReplaySubject<CognitoResponse>();
		let userData = {
			Username: username,
			Pool: this.getUserPool()
		};

		let cognitoUser = new CognitoUser(userData);

		cognitoUser.confirmPassword(verificationCode, password, {
			onSuccess: function () {
				confirmResult.next(new CognitoResponse(null, null));
			},
			onFailure: function (err) {
				confirmResult.next(new CognitoResponse(err.message, null));
			}
		});
		return confirmResult.asObservable().first();
	}

	logout() {
		console.log("UserLoginService: Logging out");
		this.getCurrentUser().signOut();
		this.$loggedIn.next(new LoginResponse("User logged out", false));
		this.router.navigate(['/auth/login']);

	}

	isAuthenticated() {
		if(this.$loggedIn == null){
			this.$loggedIn = new BehaviorSubject<LoginResponse>(null);
			let cognitoUser = this.getCurrentUser();
	
			if (cognitoUser != null) {
				var self = this;
				cognitoUser.getSession(function (err, session) {
					if (err) {
						console.log("UserLoginService: Couldn't get the session: " + err, err.stack);
						self.$loggedIn.next(new LoginResponse(err, false));
					}
					else {
						console.log("UserLoginService: Session is " + session.isValid());
						self.$loggedIn.next(new LoginResponse(err, session.isValid()));
					}
				});
			} else {
				console.log("UserLoginService: can't retrieve the current user");
				this.$loggedIn.next(new LoginResponse("Can't retrieve the CurrentUser", false));
			}
		}
		console.log('returning observable');
		return this.$loggedIn.asObservable();
	}
	getUserPool() {
		if (environment.cognito.idp_endpoint) {
			CognitoUtil._POOL_DATA.endpoint = environment.cognito.idp_endpoint;
		}
		return new CognitoUserPool(CognitoUtil._POOL_DATA);
	}

	getCurrentUser() {
		return this.getUserPool().getCurrentUser();
	}
	
	getUserSession(): Observable<CognitoUserSession>{
		return this.isAuthenticated().pipe(map(
			(response:LoginResponse|null)=>
			{
				if(!response || !response.loggedIn) return null;
				else return this.getCurrentUser();
			}
		)).pipe(switchMap(
			(currentUser:CognitoUser|null)=>{
				let sessionResult = new ReplaySubject<CognitoUserSession>();
				if (currentUser != null)
					currentUser.getSession(function (err, session:CognitoUserSession|null) {
						if (err) {
							console.log("CognitoUtil: Can't get user session:" + err);
							sessionResult.next(null);
						}
						else {
							if (session.isValid()) {
								sessionResult.next(session);
							}else{
								sessionResult.next(null);
							}
						}
					});
				else{
					sessionResult.next(null);
				}
				return sessionResult.asObservable().first();
			}
		));
	}

	getAccessToken(): Observable<string> {
		return this.getUserSession().pipe(map(
			(userSession: CognitoUserSession|null)=>
			{
				if(userSession != null){
					return userSession.getAccessToken().getJwtToken();
				}else{
					return null;
				}
			}
		));
	}

	getIdToken(): Observable<string> {
		return this.getUserSession().pipe(map(
			(userSession: CognitoUserSession|null)=>
			{
				if(userSession != null){
					return userSession.getIdToken().getJwtToken();
				}else{
					return null;
				}
			}
		));
	}

	getRefreshToken(): Observable<string> {
		return this.getUserSession().pipe(map(
			(userSession: CognitoUserSession|null)=>
			{
				if(userSession != null){
					return userSession.getRefreshToken().getToken();
				}else{
					return null;
				}
			}
		));
	}

	refresh(): void {
		this.getCurrentUser().getSession(function (err, session) {
			if (err) {
				console.log("CognitoUtil: Can't set the credentials:" + err);
			}

			else {
				if (session.isValid()) {
					console.log("CognitoUtil: refreshed successfully");
				} else {
					console.log("CognitoUtil: refreshed but session is still not valid");
				}
			}
		});
	}
	
	register(user:RegistrationUser): Observable<CognitoResponse> {
		let registerResult = new ReplaySubject<CognitoResponse>();
		console.log("UserRegistrationService: user is " + user);

		let attributeList = [];
		user.address = JSON.stringify(user.addressInfo);
		let attributeNames = ['email', 'name','address', 'birthdate', 'nickname'];
		for(let i = 0; i < attributeNames.length; i++){
			attributeList.push(new CognitoUserAttribute({Name: attributeNames[i], Value: user[attributeNames[i]]})); 
		}
		console.log(attributeList);

		this.getUserPool().signUp(user.username, user.password, attributeList, null, (err, result) => {
			if (err) {
				registerResult.next(new CognitoResponse(err.message, null));
			} else {
				console.log("UserRegistrationService: registered user is " + result);
				//this.registeredUser = result.user;
				registerResult.next(new CognitoResponse(null, result));
			}
		});
		return registerResult.asObservable();
	}


	confirmRegistration(username: string, confirmationCode: string): Observable<CognitoResponse> {
		let confirmResult = new ReplaySubject<CognitoResponse>();
		let userData = {
			Username: username,
			Pool: this.getUserPool()
		};

		let cognitoUser = new CognitoUser(userData);

		cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
			if (err) {
				confirmResult.next(new CognitoResponse(err.message, null));
			} else {
				confirmResult.next(new CognitoResponse(null, null));
			}
		});
		
		return confirmResult.asObservable().first();
	}
	
	isEmail(username: string) : boolean{
		var emailEx : RegExp = RegExp('^.+@.+\.');
		return emailEx.test(username);
	}


	resendCode(username: string): Observable<CognitoResponse>  {
		let resendResult = new ReplaySubject<CognitoResponse>();
		let userData = {
			Username: username,
			Pool: this.getUserPool()
		};

		let cognitoUser = new CognitoUser(userData);

		cognitoUser.resendConfirmationCode((err, result) => {
			if (err) {
				resendResult.next(new CognitoResponse(err.message, null));
			} else {
				resendResult.next(new CognitoResponse(null, result));
			}
		});
		return resendResult.asObservable().first();
	}

	setAuthChallenge(challenge: CognitoPasswordChallenge){
		console.log(challenge);
		this.challenge=challenge;
	}
	newPassword(newPasswordUser: NewPasswordUser, extraAttributes: any): Observable<CognitoResponse> {
		let newPasswordResult = new ReplaySubject<CognitoResponse>();
		console.log(newPasswordUser);
		console.log(extraAttributes);
		if(!extraAttributes) extraAttributes = {};
		// Get these details and call
		//cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, this);
		let authenticationData = {
			Username: newPasswordUser.username,
			Password: newPasswordUser.existingPassword,
		};
		let authenticationDetails = new AuthenticationDetails(authenticationData);

		let userData = {
			Username: newPasswordUser.username,
			Pool: this.getUserPool()
		};

		console.log("UserLoginService: Params set...Authenticating the user");
		let cognitoUser = new CognitoUser(userData);
		//console.log("UserLoginService: config is " + AWS.config);
		cognitoUser.authenticateUser(authenticationDetails, {
			newPasswordRequired: function (userAttributes, requiredAttributes) {
				// User was signed up by an admin and must provide new
				// password and required attributes, if any, to complete
				// authentication.

				// the api doesn't accept this field back
				delete userAttributes.email_verified;
				cognitoUser.completeNewPasswordChallenge(newPasswordUser.password, extraAttributes, {
					onSuccess: function (result) {
						newPasswordResult.next(new CognitoResponse(null, userAttributes));
					},
					onFailure: function (err) {
						newPasswordResult.next(new CognitoResponse(err, null));
					}
				});
			},
			onSuccess: function (result){
				newPasswordResult.next(new CognitoResponse(null, result));
			},
			onFailure: function (err) {
				newPasswordResult.next(new CognitoResponse(err, null));
			}
		});
		return newPasswordResult.asObservable().first(); 
	}
}