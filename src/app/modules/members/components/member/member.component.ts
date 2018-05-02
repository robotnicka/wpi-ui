import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { HubService} from 'app/modules/core/hub.service';
import { Office, User} from 'app/modules/core/models/';


@Component({
	selector: 'app-member',
	templateUrl: './member.component.html'
})
export class MemberComponent implements OnInit, OnDestroy {
	memberSubscription: Subscription;
	officeSubscription: Subscription;
	transferModalRef: BsModalRef;
	member: User;
	userOffices: Office[];
	selectedOffice: Office;
	isTransferring: boolean = false;
	constructor(private hubService: HubService,
		private route: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private modalService: BsModalService) { }

	ngOnInit() {
		this.getMember();
		this.getUserOffices();
	}
	getMember(){
		if(this.memberSubscription) this.memberSubscription.unsubscribe();
		this.memberSubscription = this.route.params
			.pipe(switchMap((params: Params) => {
				return this.hubService.getUser(params['id'], {offices: 1, children: 1});
			})).subscribe(
				(member) => {
					this.member = member;
					console.log('got member',this.member);
				}
			);
	}
	getUserOffices(){
		if(this.officeSubscription) this.officeSubscription.unsubscribe();
		this.officeSubscription = this.route.params
			.pipe(switchMap((params: Params) => {
				return this.hubService.getUserAuthority(params['id']);
			})).subscribe(
				(offices:Office[]) => {
					this.userOffices = offices;
					console.log('user offices',this.userOffices);
					if(this.userOffices.length == 0) this.selectedOffice = null;
					else{
						this.selectedOffice = this.userOffices[0];
					}
					
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
	ngOnDestroy(){
		this.memberSubscription.unsubscribe();
		this.officeSubscription.unsubscribe();
	}
}