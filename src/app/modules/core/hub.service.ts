import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { map, switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import { environment } from 'environments/environment';
import {CognitoUtil} from "app/modules/core/cognito.service";
import { User, OrgUnit, OrgUnitSearch } from './models/';

@Injectable()
export class HubService {
	headers: HttpHeaders;
	private currentIdToken: BehaviorSubject<string> = new BehaviorSubject(null);
	constructor(private http: HttpClient, @Inject('cognitoMain') private cognitoMain: CognitoUtil) {
		this.headers = new HttpHeaders({'Content-Type':  'application/json'});
		this.cognitoMain.getIdToken().subscribe(
			(idToken: string)=>
			{
				console.log('HubService setting id token:', idToken);
				if(idToken == null){
					if(this.headers.has('Authorization')){
						this.headers = this.headers.delete('Authorization');
					}
				}
				else this.headers = this.headers.set('Authorization', idToken);
				this.currentIdToken.next(idToken);
			}
		);
	}
	
	getCurrentUser():Observable<User>{
		//Current user depends on the current ID Token. Switchmap on the idToken so that we can update the user as needed
		return this.currentIdToken.asObservable()
		.pipe(switchMap(
			(idToken) => {
				if(idToken == null){
					return Observable.of(null);
				}
				else{
					return this.getUser('me')
				}
			}
		));
	}
	
	public getUser(id: any, options: any = {}):Observable<User>{
		return this.http.get<User>(environment.hub.url+'user/'+id,{headers: this.headers, params: options});
	}
	
	public getOrgUnits(search: OrgUnitSearch): Observable<OrgUnit[]>{
		let searchParams = new HttpParams({fromObject: search as any});
		console.log('getOrgUnits');
		console.log(searchParams);
		console.log(searchParams.toString());
		console.log(searchParams.toString().length);
		if(searchParams.toString().length==0) searchParams = searchParams.set('type','Nation');
		return this.http.get<OrgUnit[]>(environment.hub.url+'org-unit', 
										{headers: this.headers, params: searchParams} )
					.catch((error:any) => Observable.throw(error.json().error || 'Unknown server error'));
	
	}
	
	public getOrgUnit(id: number, limited: boolean = false): Observable<OrgUnit>{
		let searchParams = {users: '1', offices: '1', parents: '1', children: '-1'};
		if(limited){
			searchParams.users='0';
			searchParams.offices='0';
			searchParams.parents='0';
		}
		let endpointUrl = environment.hub.url+'org-unit/'+id;
		return this.http.get<OrgUnit>(endpointUrl, {headers: this.headers, params: searchParams as any} )
			.catch((error:any) => Observable.throw(error.json().error || 'Unknown server error')); 
	}
	
	
}
