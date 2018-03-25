import { Component, OnDestroy, OnInit } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {HubService} from "app/modules/core/hub.service";

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html'
})
export class ProfileComponent  implements OnInit, OnDestroy {
	hubUserSubscription: Subscription;
	hubUser: any;
	constructor(private hubService: HubService) {
		this.hubUserSubscription = this.hubService.getCurrentUser().subscribe(
			(hubUser) =>
			{
				console.log('have hub user in profile component',hubUser);
				this.hubUser = hubUser;
			}
		);
	}
	ngOnInit(){ }
	ngOnDestroy() {
		this.hubUserSubscription.unsubscribe();
	}

}
