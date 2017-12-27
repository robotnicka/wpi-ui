import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {CognitoUtil, CognitoResponse, LoginResponse} from "./cognito.service";
import {AuthenticationDetails, CognitoUser} from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";
import * as STS from "aws-sdk/clients/sts";

@Injectable()
export class UserLoginService {

	constructor(public cognitoUtil: CognitoUtil) {
	}

	authenticate(username: string, password: string) {
		let authenticateResult = new Subject<CognitoResponse>();
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
				});

			},
			onFailure: function (err) {
				authenticateResult.next(new CognitoResponse(err.message, null));
			},
		});
		return authenticateResult.asObservable(); 
	}

	forgotPassword(username: string) {
		let forgotResult = new Subject<CognitoResponse>();
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
		return forgotResult.asObservable();
	}

	confirmNewPassword(email: string, verificationCode: string, password: string) {
		let confirmResult = new Subject<CognitoResponse>();
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
		return confirmResult.asObservable();
	}

	logout() {
		console.log("UserLoginService: Logging out");
		this.cognitoUtil.getCurrentUser().signOut();

	}

	isAuthenticated() {
		let authenticatedResult = new Subject<LoginResponse>();
		let cognitoUser = this.cognitoUtil.getCurrentUser();

		if (cognitoUser != null) {
			cognitoUser.getSession(function (err, session) {
				if (err) {
					console.log("UserLoginService: Couldn't get the session: " + err, err.stack);
					authenticatedResult.next(new LoginResponse(err, false));
				}
				else {
					console.log("UserLoginService: Session is " + session.isValid());
					authenticatedResult.next(new LoginResponse(err, session.isValid()));
				}
			});
		} else {
			console.log("UserLoginService: can't retrieve the current user");
			authenticatedResult.next(new LoginResponse("Can't retrieve the CurrentUser", false));
		}
		return authenticatedResult.asObservable();
	}

}
