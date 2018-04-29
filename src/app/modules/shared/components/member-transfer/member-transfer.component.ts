import { Component, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {HubService} from "app/modules/core/hub.service";
import { Office, OrgUnit, User} from 'app/modules/core/models/';

@Component({
	selector: 'app-member-transfer',
	templateUrl: './member-transfer.component.html'
})
export class MemberTransferComponent implements OnInit {
	@Input() member: User;
	@Input() officer: Office;
	@Output('result') resultOutput = new EventEmitter();
	selectedOrgUnit: OrgUnit = null;
	constructor(private toastr: ToastrService, private hubService: HubService) { }

	ngOnInit() {
		console.log('member transfer office', this.officer);
	}
	
	cancelTransfer(){
		this.resultOutput.emit(false);
	}
	
	transfer(){
		this.hubService.assignMember(this.member.id,this.selectedOrgUnit.id,this.officer).subscribe(
			(response:any)=>
			{
				this.toastr.success('Member transferred!');
				this.resultOutput.emit(true);
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
