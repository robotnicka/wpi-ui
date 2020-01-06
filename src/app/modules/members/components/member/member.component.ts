import { Component, Inject, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Subscription ,  Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { environment } from 'environments/environment';
import { HubService} from 'app/modules/core/hub.service';
import { AuthService} from 'app/modules/core/auth.service';

import { ApiErrorResponse, Office, User, PasswordChange } from 'app/modules/core/models/';


@Component({
	selector: 'app-member',
	templateUrl: './member.component.html'
})
export class MemberComponent implements OnInit, OnDestroy {
	memberSubscription: Subscription;
	officeSubscription: Subscription;
	transferModalRef: BsModalRef;
	confirmModalRef: BsModalRef;
	editModalRef: BsModalRef;
	member: User;
	currentId: number = 0;
	editModel: any;
	passwordChangeModel: PasswordChange;
	confirmPassword: string;
	userOffices: Office[];
	selectedOffice: Office;
	isTransferring: boolean = false;
	error: any;
	managementToken: string;
	constructor(public hubService: HubService,
		public authService : AuthService,
		private route: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private modalService: BsModalService) { }

	ngOnInit() {
		this.getMember();
		this.getUserOffices();
	}
	getMember(refresh:boolean = false){
		if(this.memberSubscription) this.memberSubscription.unsubscribe();
		this.memberSubscription = this.route.params
			.pipe(switchMap((params: Params) => {
				this.currentId = params['id'];
				console.log('user switchmap called');
				this.error=null;
				let getParams:any = {offices: 1, children: 1, private: 1};
				if(refresh) getParams.refresh=1;
				return this.hubService.getUser(params['id'], getParams);
			})).subscribe(
				(response) => {
					if(response instanceof ApiErrorResponse){
						console.log('got error for member!', response);
						this.error = response;
					}
					else{
						this.member = response;
						console.log('got member',this.member);
					}
				}
			);
	}
	getUserOffices(){
		if(this.officeSubscription) this.officeSubscription.unsubscribe();
		this.officeSubscription = this.route.params
			.pipe(switchMap((params: Params) => {
				console.log('user offices switch map called');
				return this.hubService.getUserAuthority(params['id']);
			})).subscribe(
				(offices:Office[]) => {
					this.userOffices = offices;
					console.log('user offices',this.userOffices);
					if(this.userOffices.length == 0) this.selectedOffice = null;
					else{
						this.selectedOffice = this.userOffices[0];
					}
					
				},
				(error) => {
					console.log('got offices error', error);
				}
			);
	}
	
	transferModal(template){
		this.isTransferring = true;
		this.transferModalRef = this.modalService.show(template);
	}
	
	doneTransfer(result:boolean){
		this.transferModalRef.hide();
		this.isTransferring = false;
		if(result) this.getMember();
	}
	
	confirmModal(template: TemplateRef<any>) {
		this.confirmModalRef = this.modalService.show(template, {class: 'modal-sm'});
	}
	
	approveMembership(){
		this.hubService.approveMember(this.member.id,this.selectedOffice).subscribe(
			(response:any)=>
			{
				this.toastr.success('Membership approved!');
				this.getMember();
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
	editUserModal(template: TemplateRef<any>){
		console.log('making edit modal');
		console.log(this.member);
		
		/*this.authService.getUser$().subscribe(
			(user) => {
				console.log(user);
				let metakey = environment.auth0.metadataKey;
				this.editModel = {};
				if(user[metakey]){
					this.editModel.name = user[metakey].full_name;
					this.editModel.nickname = user[metakey].preferred_name;
					this.editModel.address = user[metakey].address;
				}
				console.log('editModel', this.editModel);
				this.editModalRef = this.modalService.show(template);
			}
		);*/
		
	}
	
	/*getManagementToken(){
		this.authService.getManagementToken$().subscribe(
			(managementToken) => {
				console.log('got management token');
				console.log(managementToken);
				this.managementToken = managementToken;
			}
		)
	}*/

	editPasswordModal(template: TemplateRef<any>){
		this.editModalRef = this.modalService.show(template);
	}
	editUser(){
		
		/*this.cognitoMain.updateAttributes(this.editModel).subscribe(
			data => {
				this.toastr.success('Details Updated!');
				this.getMember(true);
				this.editModalRef.hide();
			},
			err => {
				this.toastr.error(err);
			}
			
		)*/
	}
	
	resetPassword(){
		this.authService.resetPassword().subscribe(
			(response) => {console.log('got reset password response', response);
				this.toastr.success(response);
				this.editModalRef.hide();
			},
			err => {
				this.toastr.error(err.message);
			}
		);
	}
	ngOnDestroy(){
		this.memberSubscription.unsubscribe();
		this.officeSubscription.unsubscribe();
	}
}