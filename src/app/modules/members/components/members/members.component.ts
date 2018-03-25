import { Component, OnDestroy, OnInit } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {HubService} from "app/modules/core/hub.service";
@Component({
	selector: 'app-members',
	templateUrl: './members.component.html'
})
export class MembersComponent implements OnInit, OnDestroy {
	userSubscription: Subscription;
	constructor(private hubService: HubService){
		this.userSubscription = this.hubService.getCurrentUser().subscribe(
			(user) =>
			{
				console.log('have user in user component',user);
			}
		);
	}

	ngOnInit() {
	}
	
	ngOnDestroy(){
		this.userSubscription.unsubscribe();
	}

}
