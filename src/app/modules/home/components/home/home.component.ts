import { Component, OnInit } from '@angular/core';
import { HubService } from 'app/modules/core/hub.service';
import { User } from 'app/modules/core/models/';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit{
	hubUser: User;
	hubResponse: boolean = false;
	constructor(private hubService: HubService){
		this.hubService.getCurrentUser().subscribe(
			(user) => {
				console.log('setting home Hub User');
				this.hubUser = user;
				console.log(this.hubUser);
				this.hubResponse=true;
			},
			err => {
					console.log(err)
					this.hubResponse=true;
				},
			() => {this.hubResponse=true;}
		);
	}
	ngOnInit() {
		
	}
	

}
