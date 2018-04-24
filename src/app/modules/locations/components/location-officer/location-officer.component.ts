import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Office, OrgUnit} from 'app/modules/core/models/';
import { Subscription } from 'rxjs/Rx';
import { HubService} from 'app/modules/core/hub.service';

@Component({
	selector: 'app-location-officer',
	templateUrl: './location-officer.component.html'
})
export class LocationOfficerComponent implements OnInit, OnChanges, OnDestroy {
	userOffices: Office[];
	office: Office;
	selectedOffice: Office;
	officeSubscription: Subscription;
	constructor(private hubService: HubService) { }
	ngOnInit() {
		this.loadPermissions();
	}
	loadPermissions(){
		if(this.officeSubscription) return;
		console.log('looking up officer office',this.office);
		this.officeSubscription = this.hubService.getOfficerAuthority(this.office.id).subscribe(
				(offices:Office[]) => {
					this.userOffices = offices;
					console.log('officer offices',this.userOffices);
					if(this.userOffices.length == 0) this.selectedOffice = null;
					else{
						this.selectedOffice = this.userOffices[0];
					}
					console.log('officer selectedOffice',this.selectedOffice);
					
				}
			);
	}
	ngOnDestroy() {
		if(this.officeSubscription) this.officeSubscription.unsubscribe();
	}

}
