import { Component, OnDestroy, OnInit } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {HubService} from "app/modules/core/hub.service";
@Component({
	selector: 'app-members',
	templateUrl: './members.component.html'
})
export class MembersComponent implements OnInit, OnDestroy {
	constructor(private hubService: HubService){

	}

	ngOnInit() {
	}
	
	ngOnDestroy(){
	}

}
