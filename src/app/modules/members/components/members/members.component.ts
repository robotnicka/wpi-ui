import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { switchMap } from 'rxjs/operators';
import {HubService} from "app/modules/core/hub.service";
import { UserSearch, User} from 'app/modules/core/models/';
@Component({
	selector: 'app-members',
	templateUrl: './members.component.html'
})
export class MembersComponent implements OnInit, OnDestroy {
	membershipTypeOptions: string[];
	searchParams: UserSearch;
	userSearchCriteria: BehaviorSubject<UserSearch>;
	searchSubscription: Subscription;
	users: User[];
	constructor( private hubService: HubService) {
		this.searchParams  = new UserSearch();
		
		this.membershipTypeOptions = ['Any','None','Full','Suspended','Resigned','Expelled'];
		this.searchParams.type=this.membershipTypeOptions[0];
		this.userSearchCriteria = new BehaviorSubject(this.searchParams);
	}

	ngOnInit() {
		this.searchSubscription = this.userSearchCriteria.asObservable().pipe(switchMap(
			(search: UserSearch) => {
				return this.hubService.getUsers(search);
			}
		)).subscribe(
			(users:User[]) => { this.users = users}  
		);
	}
	
	search(){
		this.userSearchCriteria.next(this.searchParams);
	}
	
	ngOnDestroy(){
		this.searchSubscription.unsubscribe();
	}


}
