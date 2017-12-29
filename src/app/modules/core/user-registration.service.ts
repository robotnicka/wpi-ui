import {Inject, Injectable} from "@angular/core";
import {CognitoResponse, CognitoUtil} from "./cognito.service";
import {AuthenticationDetails, CognitoUser, CognitoUserAttribute} from "amazon-cognito-identity-js";
import {RegistrationUser} from "app/modules/auth/components/register/register.component";
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/first';
import {NewPasswordUser} from "app/modules/auth/components/password/password.component";
import * as AWS from "aws-sdk/global";

export class CognitoPasswordChallenge{
	public userAttributes: any;
	public requiredAttributes: any;
	constructor(userAttributes: any, requiredAttributes: any){
		this.userAttributes = userAttributes;
		this.requiredAttributes = requiredAttributes;
	}
	
}

@Injectable()
export class UserRegistrationService {
	public challenge: CognitoPasswordChallenge = null;
	constructor(@Inject(CognitoUtil) public cognitoUtil: CognitoUtil) {

	}
/*
	register(user:RegistrationUser): void {
		console.log("UserRegistrationService: user is " + user);

		let attributeList = [];

		let dataEmail = {
			Name: 'email',
			Value: user.email
		};
		let dataNickname = {
			Name: 'nickname',
			Value: user.name
		};
		attributeList.push(new CognitoUserAttribute(dataEmail));
		attributeList.push(new CognitoUserAttribute(dataNickname));

		this.cognitoUtil.getUserPool().signUp(user.email, user.password, attributeList, null, function (err, result) {
			if (err) {
				callback.cognitoCallback(err.message, null);
			} else {
				console.log("UserRegistrationService: registered user is " + result);
				callback.cognitoCallback(null, result);
			}
		});

	}
*/
/*
	confirmRegistration(username: string, confirmationCode: string, callback: CognitoCallback): void {

		let userData = {
			Username: username,
			Pool: this.cognitoUtil.getUserPool()
		};

		let cognitoUser = new CognitoUser(userData);

		cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
			if (err) {
				callback.cognitoCallback(err.message, null);
			} else {
				callback.cognitoCallback(null, result);
			}
		});
	}
*/
/*
	resendCode(username: string, callback: CognitoCallback): void {
		let userData = {
			Username: username,
			Pool: this.cognitoUtil.getUserPool()
		};

		let cognitoUser = new CognitoUser(userData);

		cognitoUser.resendConfirmationCode(function (err, result) {
			if (err) {
				callback.cognitoCallback(err.message, null);
			} else {
				callback.cognitoCallback(null, result);
			}
		});
	}
*/
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
			Pool: this.cognitoUtil.getUserPool()
		};

		console.log("UserLoginService: Params set...Authenticating the user");
		let cognitoUser = new CognitoUser(userData);
		console.log("UserLoginService: config is " + AWS.config);
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