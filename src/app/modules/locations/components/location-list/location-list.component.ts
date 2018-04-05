import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { switchMap } from 'rxjs/operators';
import { HubService} from 'app/modules/core/hub.service';
import { OrgUnitSearch, OrgUnit} from 'app/modules/core/models/';

@Component({
	selector: 'app-location-list',
	templateUrl: './location-list.component.html',
	styles: []
})
export class LocationListComponent implements OnInit, OnDestroy {
	searchParams: OrgUnitSearch;
	orgSearchCriteria: BehaviorSubject<OrgUnitSearch>;
	searchSubscription: Subscription;
	orgUnits: OrgUnit[];
	constructor( private hubService: HubService) {
		this.searchParams  = new OrgUnitSearch();
		this.orgSearchCriteria = new BehaviorSubject(this.searchParams);
	}

	ngOnInit() {
		this.searchSubscription = this.orgSearchCriteria.asObservable().pipe(switchMap(
			(search: OrgUnitSearch) => {
				return this.hubService.getOrgUnits(search);
			}
		)).subscribe(
			(orgUnits:OrgUnit[]) => { this.orgUnits = orgUnits}  
		);
	}
	
	ngOnDestroy(){
		this.searchSubscription.unsubscribe();
	}

}