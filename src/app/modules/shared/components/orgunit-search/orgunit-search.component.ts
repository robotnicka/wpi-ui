import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HubService} from 'app/modules/core/hub.service';
import { OrgUnitSearch, OrgUnit} from 'app/modules/core/models/';

@Component({
	selector: 'app-orgunit-search',
	templateUrl: './orgunit-search.component.html'
})
export class OrgunitSearchComponent implements OnInit {
	@Input() parent: number;
	searchParams: OrgUnitSearch;
	orgUnits: OrgUnit[];
	@Output('selectedOrgUnit') selectedOrgUnitOutput = new EventEmitter();
	selectedOrgUnit: OrgUnit = null;
	
	constructor(private hubService: HubService) {
		this.searchParams  = new OrgUnitSearch();
		this.searchParams.types = ['Nation','Region','Chapter'];
	}

	ngOnInit() {
		console.log('orgunit-search parent', this.parent);
		if(this.parent) this.searchParams.parent = this.parent;
		this.hubService.getOrgUnits(this.searchParams).subscribe(
				(orgUnits:OrgUnit[]) => { this.orgUnits = orgUnits}  
		);
	}
	selectOrgUnit(orgUnit: OrgUnit){
		this.selectedOrgUnit = orgUnit;
		this.selectedOrgUnitOutput.emit(this.selectedOrgUnit);
	}

}
