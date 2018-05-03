import { Component, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { switchMap } from 'rxjs/operators';
import {HubService} from "app/modules/core/hub.service";
import { OrgUnit, UserSearch, User} from 'app/modules/core/models/';
@Component({
	selector: 'app-member-search',
	templateUrl: './member-search.component.html'
})
export class MemberSearchComponent implements OnInit, OnDestroy {
	membershipTypeOptions: string[];
	searchParams: UserSearch;
	userSearchCriteria: BehaviorSubject<UserSearch>;
	searchSubscription: Subscription;
	selectedMember: User = null;
	@Output('selectedMember') selectedMemberOutput = new EventEmitter();
	@Input() defaultType: string;
	@Input() disabledTypes: string[];
	@Input() defaultOrgUnitId: number;
	users: User[];
	constructor( private hubService: HubService) {
		this.searchParams  = new UserSearch();
		
		this.membershipTypeOptions = ['Any','None','Full','Suspended','Resigned','Expelled'];
		this.searchParams.type=this.membershipTypeOptions[0];
		
		this.userSearchCriteria = new BehaviorSubject(this.searchParams);
	}

	ngOnInit() {
		if(this.defaultType){
			let defaultTypeIndex = this.membershipTypeOptions.indexOf(this.defaultType);
			if(defaultTypeIndex) this.searchParams.type=this.membershipTypeOptions[defaultTypeIndex];
		}
		if(this.defaultOrgUnitId) this.searchParams.orgUnit = this.defaultOrgUnitId;
		console.log('member search starting searchparams',this.searchParams);
		this.searchSubscription = this.userSearchCriteria.asObservable().pipe(switchMap(
			(search: UserSearch) => {
				return this.hubService.getUsers(search);
			}
		)).subscribe(
			(users:User[]) => { this.users = users}  
		);
	}
	
	search(){
		console.log('searching', this.searchParams);
		this.selectMember(null);
		this.userSearchCriteria.next(this.searchParams);
	}
	
	selectMember(member: User){
		this.selectedMember = member;
		this.selectedMemberOutput.emit(this.selectedMember);
	}
	
	ngOnDestroy(){
		this.searchSubscription.unsubscribe();
	}


}
