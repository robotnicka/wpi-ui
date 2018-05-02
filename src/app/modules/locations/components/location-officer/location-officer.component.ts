import { Component, OnInit, OnDestroy, TemplateRef, EventEmitter, Output } from '@angular/core';
import { Office, OrgUnit, User} from 'app/modules/core/models/';
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
	hireModalRef: BsModalRef;
	editModalRef: BsModalRef;
	isHiring: boolean = false;
	isEditing: boolean = false;
	isAdding: boolean = false;
	userOffices: Office[];
	orgUnit: OrgUnit;
	office: Office;
	primaryOffice: Office;
	selectedOffice: Office
	selectedHireMember: User = null;

	officeSubscription: Subscription;
	constructor(public bsModalRef: BsModalRef, private modalService: BsModalService, private toastr: ToastrService, private hubService: HubService) { }
	ngOnInit() {
		console.log('location-officer-location', this.orgUnit);
		this.loadPermissions();
	}
	loadOffice(){
		this.hubService.getOffice(this.office.id).subscribe(
			(office:Office) =>
			{
				if(office.parentOffice) office.parentOfficeID = office.parentOffice.id;
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
					else if(this.userOffices.length == 1){
						this.selectedOffice = this.userOffices[0];
					}else{
						//Let's see if we have an office that can actually do something here. If so, let's do use that
						let userWithAuthority = -1;
						for(let i = 0; i < this.userOffices.length; i++){
							if(this.userOffices[i].roles.indexOf('office_assign') !==-1){
								userWithAuthority = i;
								break;
							}
						}
						
						if(userWithAuthority != -1) this.selectedOffice = this.userOffices[userWithAuthority];
						else this.selectedOffice = this.userOffices[0];
					}
					console.log('officer selectedOffice',this.selectedOffice);
					
				}
			);
	}
	ngOnDestroy() {
		if(this.officeSubscription) this.officeSubscription.unsubscribe();
		this.action.emit(0);
	}
	confirmModal(template: TemplateRef<any>) {
		this.confirmModalRef = this.modalService.show(template, {class: 'modal-sm'});
	}
	
	hireModal(template: TemplateRef<any>) {
		this.isHiring = true;
		this.hireModalRef = this.modalService.show(template);
	}
	doneHiring(){
		this.hireModalRef.hide();
		this.isHiring = false;
	}
	
	hireOffice(){
		this.hubService.assignOffice(this.office.id,this.selectedHireMember.id,this.selectedOffice).subscribe(
			(response:any)=>
			{
				this.toastr.success('Officer hired!');
				console.log('Officer hired');
				this.loadOffice();
				this.action.emit(1);
				this.doneHiring();
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
	
	vacateOffice(){
		this.hubService.assignOffice(this.office.id,0,this.selectedOffice).subscribe(
			(response:any)=>
			{
				this.toastr.success('Office vacated');
				this.loadOffice();
				this.action.emit(1);
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
	
	resignOffice(){
		this.hubService.assignOffice(this.office.id,0,this.office).subscribe(
			(response:any)=>
			{
				this.toastr.success('Resigned from office. You\'re free!');
				this.loadOffice();
				this.action.emit(2);
				this.confirmModalRef.hide();
				this.bsModalRef.hide();
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
	
	editOffice(template: TemplateRef<any>){
		this.isEditing = true;
		this.editModalRef = this.modalService.show(template);
	}
	
	editResult(resultOffice: Office){
		if(resultOffice == null){
			this.doneEdit();
			return;
		}
		console.log(resultOffice);
		this.hubService.updateOffice(resultOffice,this.selectedOffice).subscribe(
			(response:any)=>
			{
				this.toastr.success('Office updated');
				this.loadOffice();
				this.action.emit(2);
				this.doneEdit();
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
	
	doneEdit(){
		this.editModalRef.hide();
		this.isEditing = false;
	}
	
	addAssistant(template: TemplateRef<any>){
		this.isAdding = true;
		this.editModalRef = this.modalService.show(template);
	}
	
	addAssistantResult(resultOffice: Office){
		if(resultOffice == null){
			this.doneAddAssistant();
			return;
		}
		console.log(resultOffice);
		this.hubService.addAssistantOffice(resultOffice,this.selectedOffice).subscribe(
			(response:any)=>
			{
				this.toastr.success('Assistant Added');
				this.loadOffice();
				this.action.emit(2);
				this.doneAddAssistant();
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
	
	doneAddAssistant(){
		this.editModalRef.hide();
		this.isAdding = false;
	}
	
	deleteAssistant(){
		this.hubService.deleteAssistantOffice(this.office.id,this.selectedOffice).subscribe(
			(response:any)=>
			{
				this.toastr.success('Office Deleted');
				this.confirmModalRef.hide();
				this.bsModalRef.hide();
				this.action.emit(2);
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
