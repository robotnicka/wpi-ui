import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { map, switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import { environment } from 'environments/environment';
import {CognitoUtil} from "app/modules/core/cognito.service";
@Injectable()
export class HubService {
	httpOptions: any;
	private currentIdToken: BehaviorSubject<string> = new BehaviorSubject(null);
	constructor(private http: HttpClient, @Inject('cognitoMain') private cognitoMain: CognitoUtil) {
		this.httpOptions = {
		  headers: new HttpHeaders({
		    'Content-Type':  'application/json',
		  })
		};
		this.cognitoMain.getIdToken().subscribe(
			(idToken: string)=>
			{
				console.log('HubService setting id token:', idToken);
				if(idToken == null){
					if(this.httpOptions.headers.has('Authorization')){
						this.httpOptions.headers = this.httpOptions.headers.delete('Authorization');
					}
				}
				else this.httpOptions.headers = this.httpOptions.headers.set('Authorization', idToken);
				this.currentIdToken.next(idToken);
			}
		);
	}
	
	getCurrentUser():Observable<any>{
		//Current user depends on the current ID Token. Switchmap on the idToken so that we can update the user as needed
		return this.currentIdToken.asObservable()
		.pipe(switchMap(
			(idToken) => {
				if(idToken == null){
					return Observable.of(null);
				}
				else{
					return this.http.get(environment.hub.url+'user/me',this.httpOptions);
				}
			}
		));
	}
	
	
}
