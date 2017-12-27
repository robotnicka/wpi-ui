import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {
	AuthenticationDetails,
	CognitoIdentityServiceProvider,
	CognitoUser,
	CognitoUserAttribute,
	CognitoUserPool
} from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";
import * as awsservice from "aws-sdk/lib/service";
import * as CognitoIdentity from "aws-sdk/clients/cognitoidentity";


interface CallbackFunction {
	(error: any, result: any): void;
}

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

function subToHandler<T>(subject: Subject<T>, successFn: (m:any) => T, errorFn?: (a:any) => any): CallbackFunction {
	return (error:any, result:any) => {
		if (!!error) {
			if (!!errorFn) {
				subject.error(errorFn(error));
			}
			else {
				subject.error(error);
			}
		}
		else {
			subject.next(successFn(result));
		}
	};
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

	public cognitoCreds: AWS.CognitoIdentityCredentials;

	getUserPool() {
		if (environment.cognito.idp_endpoint) {
			CognitoUtil._POOL_DATA.endpoint = environment.cognito.idp_endpoint;
		}
		return new CognitoUserPool(CognitoUtil._POOL_DATA);
	}

	getCurrentUser() {
		return this.getUserPool().getCurrentUser();
	}

	// AWS Stores Credentials in many ways, and with TypeScript this means that 
	// getting the base credentials we authenticated with from the AWS globals gets really murky,
	// having to get around both class extension and unions. Therefore, we're going to give
	// developers direct access to the raw, unadulterated CognitoIdentityCredentials
	// object at all times.
	setCognitoCreds(creds: AWS.CognitoIdentityCredentials) {
		this.cognitoCreds = creds;
	}

	getCognitoCreds() {
		return this.cognitoCreds;
	}

	// This method takes in a raw jwtToken and uses the global AWS config options to build a
	// CognitoIdentityCredentials object and store it for us. It also returns the object to the caller
	// to avoid unnecessary calls to setCognitoCreds.

	buildCognitoCreds(idTokenJwt: string) {
		let url = 'cognito-idp.' + CognitoUtil._REGION.toLowerCase() + '.amazonaws.com/' + CognitoUtil._USER_POOL_ID;
		if (environment.cognito.idp_endpoint) {
			url = environment.cognito.idp_endpoint + '/' + CognitoUtil._USER_POOL_ID;
		}
		let logins: CognitoIdentity.LoginsMap = {};
		logins[url] = idTokenJwt;
		let params = {
			IdentityPoolId: CognitoUtil._IDENTITY_POOL_ID, /* required */
			Logins: logins
		};
		let serviceConfigs : awsservice.ServiceConfigurationOptions = {};
		if (environment.cognito.identity_endpoint) {
			serviceConfigs.endpoint = environment.cognito.identity_endpoint;
		}
		let creds = new AWS.CognitoIdentityCredentials(params, serviceConfigs);
		this.setCognitoCreds(creds);
		return creds;
	}


	getCognitoIdentity(): string {
		return this.cognitoCreds.identityId;
	}

	getAccessToken(): Observable<string> {
		let accessTokenResult = new Subject<string>();
		if (this.getCurrentUser() != null)
			this.getCurrentUser().getSession(function (err, session) {
				if (err) {
					console.log("CognitoUtil: Can't set the credentials:" + err);
					accessTokenResult.next(null);
				}

				else {
					if (session.isValid()) {
						accessTokenResult.next(session.getAccessToken().getJwtToken());
					}
				}
			});
		else
			accessTokenResult.next(null);
		return accessTokenResult.asObservable();
	}

	getIdToken(): Observable<string> {
		let idTokenResult = new Subject<string>();
		if (this.getCurrentUser() != null)
			this.getCurrentUser().getSession(function (err, session) {
				if (err) {
					console.log("CognitoUtil: Can't set the credentials:" + err);
					idTokenResult.next(null);
				}
				else {
					if (session.isValid()) {
						idTokenResult.next(session.getIdToken().getJwtToken());
					} else {
						console.log("CognitoUtil: Got the id token, but the session isn't valid");
						idTokenResult.next(null);
					}
				}
			});
		else
			idTokenResult.next(null);
		return idTokenResult.asObservable();
	}

	getRefreshToken(): Observable<string> {
		let refreshTokenResult = new Subject<string>();
		if (this.getCurrentUser() != null)
			this.getCurrentUser().getSession(function (err, session) {
				if (err) {
					console.log("CognitoUtil: Can't set the credentials:" + err);
					refreshTokenResult.next(null);
				}

				else {
					if (session.isValid()) {
						refreshTokenResult.next(session.getRefreshToken());
					}
				}
			});
		else
			refreshTokenResult.next(null);
		return refreshTokenResult.asObservable();
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
}