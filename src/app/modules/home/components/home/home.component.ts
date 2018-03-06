import { Component, Inject, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {HubService} from "app/modules/core/hub.service";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy{
	userSubscription: Subscription;
	constructor(private hubService: HubService){
		this.userSubscription = this.hubService.getUser().subscribe(
			(user) =>
			{
				console.log('have user in home component',user);
			}
		);
	}
	
	ngOnDestroy(){
		this.userSubscription.unsubscribe();
	}
	

}
