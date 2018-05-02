import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Office, OrgUnit, User} from 'app/modules/core/models/';
import { HubService} from 'app/modules/core/hub.service';

@Component({
	selector: 'app-office-form',
	templateUrl: './office-form.component.html'
})
export class OfficeFormComponent implements OnInit {
	@Input() office: Office;
	@Input() officeAuthority: Office;
	@Input() primaryOffice: Office;
	@Output() officeResult = new EventEmitter();
	editingOffice: Office = null;
	editingOfficeRoles: any[];
	constructor(private hubService: HubService) { }

	ngOnInit() {
		this.editingOffice = new Office();
		if(this.office){
			this.editingOffice.id = this.office.id;
			this.editingOffice.name = this.office.name;
			this.editingOffice.email = this.office.email;
		}
		if(this.primaryOffice) this.editingOffice.parentOfficeID = this.primaryOffice.id;
		if(!this.office || this.office.id != this.officeAuthority.id){
			this.editingOfficeRoles = [];
			let availableRoles = Object.keys(this.hubService.officeRoles);
			for(let i = 0; i < availableRoles.length; i++){
				let disabled = false;
				if(this.officeAuthority.roles.indexOf(availableRoles[i])==-1) disabled = true; //can only add or remove roles from office that we have ourselves
				if(this.primaryOffice){ //Unless this is an assistant, in which case we can only add or remove roles that primary office has
					if(this.primaryOffice.roles.indexOf(availableRoles[i])==-1) disabled = true;
					else disabled = false;
				}
				this.editingOfficeRoles.push(
					{
						'name': availableRoles[i],
						'checked': (this.office && this.office.roles.indexOf(availableRoles[i])!=-1),
						'disabled': disabled
					});
			}
		}
		else this.editingOfficeRoles = null;
	}
	cancel(){
		this.officeResult.emit(null);
	}
	save(){
		if(this.editingOfficeRoles!=null){
			this.editingOffice.roles = this.editingOfficeRoles.filter(role => role.checked).map(role => role.name);
		}
		this.officeResult.emit(this.editingOffice);
	}

}
