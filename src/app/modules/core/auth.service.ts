import { Injectable } from '@angular/core';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { from, of, Observable, BehaviorSubject, combineLatest, throwError, forkJoin } from 'rxjs';
import { map,tap, catchError, concatMap, switchMap, shareReplay, take, filter } from 'rxjs/operators';
import "rxjs/add/observable/interval";
import "rxjs/observable/IntervalObservable";
import { Router } from '@angular/router';
import {environment} from "../../../environments/environment";

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	// Create an observable of Auth0 instance of client
	auth0Client$ = (from(
		createAuth0Client({
			domain: environment.auth0.domain,
			client_id: environment.auth0.clientId,
			redirect_uri: `${window.location.origin}`,
			audience: environment.auth0.audience
		})
	) as Observable<Auth0Client>).pipe(
		shareReplay(1), // Every subscription receives the same shared value
		catchError(err => throwError(err))
	);
	// Define observables for SDK methods that return promises by default
	// For each Auth0 SDK method, first ensure the client instance is ready
	// concatMap: Using the client instance, call SDK method; SDK returns a promise
	// from: Convert that resulting promise into an observable
	authenticateCheckSubject = new BehaviorSubject(0);

	isAuthenticated$ = this.authenticateCheckSubject.asObservable().pipe(
		switchMap(() => this.auth0Client$))
		.pipe(
		concatMap((client: Auth0Client) => from(client.isAuthenticated())),
		tap(res => this.loggedIn = res));
	
	/*isAuthenticated$ = Observable.interval(200).pipe(
		concatMap(() => this.auth0Client$),
		concatMap((client: Auth0Client) => from(client.isAuthenticated())),
		tap(res => this.loggedIn = res),
		take(5),
	);*/
	//check if the user has a verified email
	//
	isVerified(): Observable<number>{
		return combineLatest([
			this.getUser$(),
			this.isAuthenticated$
		]).pipe(map(
			([user, loggedIn])=>{
				if(loggedIn == false) {
					console.log('isVerified: Not logged in');
					return 0;
				}
				if(user == false || user == null){
					console.log('isVerified: User is false');
					return 0;
				}
				console.log('isVerified user?',user);
				if(user.email_verified == null) return 0; // don't have a valid user at all
				if(user.email_verified == false) return 2; // valid but not verified
				else return 1; // valid and verified
			}
		));
	}
	
		/*
	

	isAuthenticated$ = this.auth0Client$.pipe(
		concatMap((client: Auth0Client) => from(client.isAuthenticated())),
		tap(res => this.loggedIn = res),
		switchMap(
			(res) => {
				if(res)
					return this.getUser$();
				else
					return of(0);
			}
		)
	).pipe(map(
		(res) =>{
			if(res == false) return 0;
			else{
				console.log('have user?', res);
				if(res.email_verified) return 1;
				else return 2;
			}
		}
	));*/
	handleRedirectCallback$ = this.auth0Client$.pipe(
		concatMap((client: Auth0Client) => from(client.handleRedirectCallback()))
	);
	// Create subject and public observable of user profile data
	private userProfileSubject$ = new BehaviorSubject<any>(null);
	userProfile$ = this.userProfileSubject$.asObservable();
	// Create a local property for login status
	loggedIn: boolean = null;

	constructor(private router: Router, private http: HttpClient) {
		// On initial load, check authentication state with authorization server
		// Set up local auth streams if user is already authenticated
		this.localAuthSetup();
		// Handle redirect from Auth0 login
		this.handleAuthCallback();
	}

	// When calling, options can be passed if desired
	// https://auth0.github.io/auth0-spa-js/classes/auth0client.html#getuser
	getUser$(options?): Observable<any> {
		return this.authenticateCheckSubject.asObservable().pipe( //we want to check user again after login
			switchMap(() => this.auth0Client$))
			.pipe(
			concatMap((client: Auth0Client) => from(client.getUser(options))),
			tap(user => this.userProfileSubject$.next(user))
		);
	}

	private localAuthSetup() {
		// This should only be called on app initialization
		// Set up local authentication streams
		const checkAuth$ = this.isAuthenticated$.pipe(
			concatMap((loggedIn: boolean) => {
				if (loggedIn) {
					// If authenticated, get user and set in app
					// NOTE: you could pass options here if needed
					return this.getUser$();
				}
				// If not authenticated, return stream that emits 'false'
				return of(loggedIn);
			})
		);
		checkAuth$.subscribe();
	}

	login(redirectPath: string = '/', mode=null) {
		// A desired redirect path can be passed to login method
		// (e.g., from a route guard)
		// Ensure Auth0 client instance exists
		this.auth0Client$.subscribe((client: Auth0Client) => {
			// Call method to log in
			var loginOptions:any = {
				redirect_uri: `${window.location.origin}`,
				appState: { target: redirectPath }
			};
			if(mode){
				loginOptions.mode=mode;
				loginOptions.initialScreen=mode;
			}
			console.log('login Options', loginOptions);

			client.loginWithRedirect(loginOptions);
		});
	}

	private handleAuthCallback() {
		// Call when app reloads after user logs in with Auth0
		const params = window.location.search;
		if (params.includes('code=') && params.includes('state=')) {
			let targetRoute: string; // Path to redirect to after login processsed
			const authComplete$ = this.handleRedirectCallback$.pipe(
				// Have client, now call method to handle auth callback redirect
				tap(cbRes => {
					// Get and set target redirect route from callback results
					targetRoute = cbRes.appState && cbRes.appState.target ? cbRes.appState.target : '/';
				}),
				concatMap(() => {
					console.log('iterating authenticate subject');
					this.authenticateCheckSubject.next(1); //iterate auth subject now that we've actually logged in
					// Redirect callback complete; get user and login status
					return combineLatest([
						this.getUser$(),
						this.isAuthenticated$
					]);
				})
			);
			// Subscribe to authentication completion observable
			// Response will be an array of user and login status
			authComplete$.subscribe(([user, loggedIn]) => {
				// Redirect to target route after callback processing
				this.router.navigate([targetRoute]);
			});
		}
	}

	logout() {
		// Ensure Auth0 client instance exists
		this.auth0Client$.subscribe((client: Auth0Client) => {
			// Call method to log out
			client.logout({
				client_id: environment.auth0.clientId,
				returnTo: `${window.location.origin}`
			});
		});
	}

	getAccessTokenSilently$(options?): Observable<string> {
		return this.auth0Client$.pipe(
			concatMap((client: Auth0Client) => from(client.getTokenSilently(options)))
		);
	}

	getAccessTokenLoudly$(options?): Observable<string> {
		return this.auth0Client$.pipe(
			concatMap((client: Auth0Client) => from(client.getTokenWithPopup(options)))
		);
	}

	getIdTokenSilently$(options?): Observable<string> {
		return this.getAccessTokenSilently$(options).pipe(switchMap( (token) => this.auth0Client$.pipe(
			concatMap((client: Auth0Client) => from(client.getIdTokenClaims()))
		).pipe(map((claims) => {console.log('claims',claims); return claims.__raw;}))));
	}

	getManagementToken$(): Observable<string> {
		return this.getAccessTokenLoudly$({
			audience: environment.auth0.managementAudience,
			scope: 'update:users'
		});
	}

	resetPassword(): Observable<string>{
		return this.getUser$().pipe(switchMap(
			(user) => {
				let params = {'client_id': environment.auth0.clientId, 'email': user.email, 'connection': environment.auth0.dbConnection};
				const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
				return this.http.post('https://'+environment.auth0.domain+'/dbconnections/change_password',JSON.stringify(params), {headers: headers,responseType: 'text'});
			}
		));
		
	}

	/*updateUser(user){
		forkJoin({
			profile: this.getUser$().first()
		})

	}*/

}