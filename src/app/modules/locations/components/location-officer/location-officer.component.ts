import { Component, OnInit, OnDestroy, TemplateRef, EventEmitter, Output } from '@angular/core';
import { Office, OrgUnit} from 'app/modules/core/models/';
import { Subscription } from 'rxjs/Rx';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { HubService} from 'app/modules/core/hub.service';

@Component({
	selector: 'app-location-officer',
	templateUrl: './location-officer.component.html'
})
export class LocationOfficerComponent implements OnInit, OnDestroy {
	@Output() action = new EventEmitter();
	confirmModalRef: BsModalRef;
	userOffices: Office[];
	office: Office;
	selectedOffice: Office;
	officeSubscription: Subscription;
	constructor(private modalService: BsModalService, private toastr: ToastrService, private hubService: HubService) { }
	ngOnInit() {
		this.loadPermissions();
	}
	loadOffice(){
		this.hubService.getOffice(this.office.id).subscribe(
			(office:Office) =>
			{
				this.office = office;
			}
		);
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
		this.action.emit(false);
	}
	confirmModal(template: TemplateRef<any>) {
		this.confirmModalRef = this.modalService.show(template, {class: 'modal-sm'});
	}
	
	vacateOffice(){
		this.hubService.assignOffice(this.office.id,0).subscribe(
			(response:any)=>
			{
				this.toastr.success('Office vacated');
				this.loadOffice();
				this.action.emit(true);
				this.confirmModalRef.hide();
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

}
