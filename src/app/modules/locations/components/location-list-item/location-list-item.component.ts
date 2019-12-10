import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import {OrgUnit} from 'app/modules/core/models/org-unit';
import { HubService} from 'app/modules/core/hub.service';


@Component({
	selector: 'app-location-list-item',
	templateUrl: './location-list-item.component.html'
})
export class LocationListItemComponent implements OnInit {
	@Input() orgUnit: OrgUnit;
	expanded: boolean = false;
	fetchedOrgUnit: OrgUnit;
	children: OrgUnit[];
	constructor(private hubService: HubService) { }

	ngOnInit() {
		console.log(this.orgUnit);
		if(this.orgUnit.hasOwnProperty('children')){
			this.fetchedOrgUnit=this.orgUnit;
			this.children = this.orgUnit.children;
		}
		if(this.expanded==false && (this.orgUnit.type=='Nation'||this.orgUnit.type=='Region')) this.toggle();
	}
	toggle(){
		if(!this.fetchedOrgUnit){
			this.hubService.getOrgUnit(this.orgUnit.id,true).pipe(first()).subscribe(
				(orgUnit:OrgUnit) => { this.fetchedOrgUnit = orgUnit; this.children = orgUnit.children; console.log(this.children); this.expanded = true}
			);
		}else{
			this.expanded = !this.expanded;
		}
	}
}