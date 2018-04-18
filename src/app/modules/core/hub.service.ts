import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { map, switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import { environment } from 'environments/environment';
import {CognitoUtil} from "app/modules/core/cognito.service";
import { User, Office, OrgUnit, OrgUnitSearch } from './models/';

@Injectable()
export class HubService {
	headers: HttpHeaders;
	private currentIdToken: BehaviorSubject<string> = new BehaviorSubject(null);
	private currentUser: Observable<User>;
	constructor(private http: HttpClient, @Inject('cognitoMain') private cognitoMain: CognitoUtil) {
		console.log("constructing hub service");
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
		if(!this.currentUser){
			console.log('Constructing currentUser');
			this.currentUser= this.currentIdToken.asObservable()
			.pipe(switchMap(
				(idToken) => {
					console.log('idToken currentUser Switchmap',idToken);
					if(idToken == null){
						return Observable.of(null);
					}
					else{
						return this.getUser('me',{offices: 1});
					}
				}
			));
		}
		return this.currentUser;
	}
	
	getOrgUnitAuthority(id: number): Observable<Office[]>{
		return this.getCurrentUser().pipe(switchMap(
			(user:User)=>{
				if(user.offices && user.offices.length){
					return this.http.get(environment.hub.url+'office/verify/orgunit/'+id,
						{headers: this.headers,
							params:{roles:"user_read_private,user_update,user_assign,user_suspend,org_update,office_update,office_assign,office_create_own_assistants,office_create_assistants,org_create_domain"}})
							.pipe(map((response:any) => response.offices))
							.catch((error:any) => { return Observable.of([] as Observable<Office[]);});
				}
				else return Observable.of([]) as Observable<Office[]>;
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
	
	public updateOrgUnit(orgUnit:OrgUnit,office:Office):Observable<OrgUnit>{
		let post = {};
		let fields = ['name','code','location','defDoc','website'];
		for(let i = 0; i < fields.length; i++){
			if(orgUnit[fields[i]]) post[fields[i]] = orgUnit[fields[i]];
		}
		post['useOffice'] = office.id;
		return this.http.put<OrgUnit>(environment.hub.url+'org-unit/'+orgUnit.id,post,{headers: this.headers});
	}
	
	
}
