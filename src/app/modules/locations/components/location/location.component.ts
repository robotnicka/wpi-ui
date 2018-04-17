import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import { HubService} from 'app/modules/core/hub.service';
import { Office, OrgUnit} from 'app/modules/core/models/';


@Component({
	selector: 'app-location',
	templateUrl: './location.component.html'
})
export class LocationComponent implements OnInit, OnDestroy {
	orgSubscription: Subscription;
	officeSubscription: Subscription;
	orgUnit: OrgUnit;
	editOrgUnit: OrgUnit;
	userOffices: Office[];
	selectedOffice: Office;
	editing: boolean = false;
	constructor(private hubService: HubService,
		private route: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService) { }

	ngOnInit() {
		this.getOrg();
		this.officeSubscription = this.route.params
			.pipe(switchMap((params: Params) => {
				return this.hubService.getOrgUnitAuthority(params['id']);
			})).subscribe(
				(offices:Office[]) => {
					this.userOffices = offices;
					console.log('unit offices',this.userOffices);
					if(this.userOffices.length == 0) this.selectedOffice = null;
					else{
						this.selectedOffice = this.userOffices[0];
						this.officePermissions(this.selectedOffice);
					}
					
				}
			);
	}
	getOrg(){
		if(this.orgSubscription) this.orgSubscription.unsubscribe();
		this.orgSubscription = this.route.params
			.pipe(switchMap((params: Params) => {
				return this.hubService.getOrgUnit(params['id'],false);
			})).subscribe(
				(orgUnit:OrgUnit) => {
					this.orgUnit = orgUnit;
					console.log('got location unit',this.orgUnit);
				}
			);
	}
	editOrg(){
		this.editOrgUnit = Object.assign({}, this.orgUnit);
		this.editing=true;
	}
	cancelOrg(){
		this.editing=false;
	}
	saveOrg(){
		this.hubService.updateOrgUnit(this.editOrgUnit).subscribe(
			(orgUnit:OrgUnit)=>
			{
				this.editing=false;
				this.getOrg();
				this.toastr.success('Location updated!');
			},
			(error)=>{
				let message = '';
				if(error.error && error.error.message) message = error.error.message;
				else if(error.message) message = error.message;
				else message='Unknown server error';
				this.toastr.error(message);
			}
		);
	}
	ngOnDestroy(){
		this.orgSubscription.unsubscribe();
		this.officeSubscription.unsubscribe();
	}
	officePermissions(office){
		console.log('selected office', office);
	}
}