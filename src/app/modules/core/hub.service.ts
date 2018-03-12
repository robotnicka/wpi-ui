import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { environment } from 'environments/environment';
import {CognitoUtil} from "app/modules/core/cognito.service";
@Injectable()
export class HubService {
	httpOptions: any;
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
			}
		);
	}
	
	getUser():Observable<any>{
		return this.http.get(environment.hub.url+'user',this.httpOptions);
	}
	
	
}
