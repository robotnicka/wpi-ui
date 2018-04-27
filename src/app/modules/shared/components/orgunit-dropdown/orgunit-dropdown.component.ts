import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { HubService} from 'app/modules/core/hub.service';
import { OrgUnitSearch, OrgUnit} from 'app/modules/core/models/';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
	selector: 'app-orgunit-dropdown',
	templateUrl: './orgunit-dropdown.component.html',
	providers: [
		{ 
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => OrgunitDropdownComponent),
			multi: true
		}
	]
})
export class OrgunitDropdownComponent implements OnInit,ControlValueAccessor {
	searchParams: OrgUnitSearch;
	orgUnits: OrgUnit[];
	@Input() _orgUnitValue = null;
	constructor(private hubService: HubService) {
		this.searchParams  = new OrgUnitSearch();
		this.searchParams.types = ['Nation','Region','Chapter'];
	}
	
	propagateChange = (_: any) => {};
	
	registerOnChange(fn) {
		this.propagateChange = fn;
	}
	registerOnTouched() {}
	
	get orgUnitValue() {
		return this._orgUnitValue;
	}
	
	set orgUnitValue(val) {
		this._orgUnitValue = val;
		this.propagateChange(this._orgUnitValue);
	}
	
	writeValue(value) {
		if (value) {
			this.orgUnitValue = value;
		}
	}
	ngOnInit() {
		console.log('dropdown orgUnitValue', this.orgUnitValue);
		this.hubService.getOrgUnits(this.searchParams).subscribe(
				(orgUnits:OrgUnit[]) => { this.orgUnits = orgUnits}  
		);
	}

}
