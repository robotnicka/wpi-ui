import { Component, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { HubService} from 'app/modules/core/hub.service';
import { Office, OrgUnit} from 'app/modules/core/models/';
import { LocationOfficerComponent } from '../location-officer/location-officer.component';

@Component({
	selector: 'app-location',
	templateUrl: './location.component.html'
})
export class LocationComponent implements OnInit, OnDestroy {
	addOrgModalRef: BsModalRef;
	officerModalRef: BsModalRef;
	orgSubscription: Subscription;
	officeSubscription: Subscription;
	orgUnit: OrgUnit;
	editOrgUnit: OrgUnit;
	userOffices: Office[];
	selectedOffice: Office;
	canAddOrgs: string[];
	orgModel: OrgUnit;
	editing: boolean = false;
	constructor(private hubService: HubService,
		private route: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private modalService: BsModalService) { }

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
		this.hubService.updateOrgUnit(this.editOrgUnit,this.selectedOffice).subscribe(
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
	addOrgModal(template: TemplateRef<any>, addOrgType: string){
		this.orgModel = new OrgUnit();
		this.orgModel.type = addOrgType;
		console.log(this.orgModel);
		this.addOrgModalRef = this.modalService.show(template);
		//this.modalService.show(LocationAddModalComponent, {initialState});
	}
	addOrg(){
		this.hubService.addOrgUnit(this.orgModel,this.orgUnit.id,this.selectedOffice).subscribe(
			(orgUnit:OrgUnit)=>
			{
				this.getOrg();
				this.toastr.success('Location added!');
				this.addOrgModalRef.hide();
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
		this.canAddOrgs = [];
		if(!office || !office.roles || !office.roles.length) return;
		let types = this.hubService.orgUnitTypes;
		let currentOrgTypeIndex = types.indexOf(this.orgUnit.type);
		if(currentOrgTypeIndex != -1){
			for(let i =currentOrgTypeIndex+1; i<types.length; i++){ //loop through all the org unit types smaller than the current unit
				if(office.roles.indexOf('org_create_'+types[i].toLowerCase())!=-1){
					this.canAddOrgs.push(types[i]); //if this officer has permissions to create this unit type, add to list of units we can add here
				}
			}
		}
		console.log('canAddOrgs',this.canAddOrgs);
	}
	officerModal(office){
		const initialState = {
			office: office
		};
		this.officerModalRef = this.modalService.show(LocationOfficerComponent, {initialState});
	}
	/*officerPermissions(office){
		if(this.selectedOffice){
			//we have both a selected office and officers for this unit, let's see what permissions we have over them.
			this.orgUnit.offices.forEach(
				function(office: Office){
					this.hubService;
				}	
				
			);
		}else this.officeOfficerAuthority = null;
	}*/
}