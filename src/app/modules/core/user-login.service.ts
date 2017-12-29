import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import {CognitoUtil, CognitoResponse, LoginResponse} from "./cognito.service";
import {CognitoPasswordChallenge, UserRegistrationService} from './user-registration.service';
import {AuthenticationDetails, CognitoUser} from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";
import * as STS from "aws-sdk/clients/sts";
import { CanActivate, Router } from '@angular/router';
@Injectable()
export class UserLoginService implements CanActivate {
	private $loggedIn: BehaviorSubject<LoginResponse>;
	constructor(public cognitoUtil: CognitoUtil, private register: UserRegistrationService, private router: Router) {
	}
	
	canActivate(): Observable<boolean> {
		return this.isAuthenticated().first().map(
			(response:LoginResponse)=>{
				console.log('map called!');
				console.log('loggedIn?',response.loggedIn);
				if(response.loggedIn){
					console.log('returning true!');
					return true;
				}
				else {
					console.log('navigating to login!');
					this.router.navigate(['/auth/login']);
					console.log('returning false!');
					return false;
				}
			}
		).catch(
			(err: any, caught: Observable<boolean>) => {
				console.log('received error!');
				this.router.navigate(['/auth/login']);
				return Observable.of(false);
			}
		);
			
	}

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
			Pool: this.cognitoUtil.getUserPool()
		};

		console.log("UserLoginService: Params set...Authenticating the user");
		let cognitoUser = new CognitoUser(userData);
		console.log("UserLoginService: config is " + AWS.config);
		var self = this;
		cognitoUser.authenticateUser(authenticationDetails, {
			newPasswordRequired: function (userAttributes, requiredAttributes) {
				self.register.setAuthChallenge(new CognitoPasswordChallenge(userAttributes, requiredAttributes));
				authenticateResult.next(new CognitoResponse(`User needs to set password.`, null));
			},
			onSuccess: function (result) {

				console.log("In authenticateUser onSuccess callback");

				let creds = self.cognitoUtil.buildCognitoCreds(result.getIdToken().getJwtToken());

				AWS.config.credentials = creds;

				// So, when CognitoIdentity authenticates a user, it doesn't actually hand us the IdentityID,
				// used by many of our other handlers. This is handled by some sly underhanded calls to AWS Cognito
				// API's by the SDK itself, automatically when the first AWS SDK request is made that requires our
				// security credentials. The identity is then injected directly into the credentials object.
				// If the first SDK call we make wants to use our IdentityID, we have a
				// chicken and egg problem on our hands. We resolve this problem by "priming" the AWS SDK by calling a
				// very innocuous API call that forces this behavior.
				let clientParams:any = {};
				if (environment.cognito.sts_endpoint) {
					clientParams.endpoint = environment.cognito.sts_endpoint;
				}
				let sts = new STS(clientParams);
				sts.getCallerIdentity(function (err, data) {
					console.log("UserLoginService: Successfully set the AWS credentials");
					authenticateResult.next(new CognitoResponse(null, result));
					self.$loggedIn.next(new LoginResponse("User logged in", true));
				});

			},
			onFailure: function (err) {
				authenticateResult.next(new CognitoResponse(err.message, null));
			},
		});
		return authenticateResult.asObservable().first(); 
	}

	forgotPassword(username: string) {
		let forgotResult = new ReplaySubject<CognitoResponse>();
		let userData = {
			Username: username,
			Pool: this.cognitoUtil.getUserPool()
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

	confirmNewPassword(email: string, verificationCode: string, password: string) {
		let confirmResult = new ReplaySubject<CognitoResponse>();
		let userData = {
			Username: email,
			Pool: this.cognitoUtil.getUserPool()
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
		this.cognitoUtil.getCurrentUser().signOut();
		this.$loggedIn.next(new LoginResponse("User logged out", false));

	}

	isAuthenticated() {
		if(this.$loggedIn == null){
			this.$loggedIn = new BehaviorSubject<LoginResponse>(null);
			let cognitoUser = this.cognitoUtil.getCurrentUser();
	
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

}
