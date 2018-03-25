import { Inject } from '@angular/core';
import { CollapseModule } from 'ng2-bootstrap/collapse';
import { HubService } from 'app/modules/core/hub.service';
import { CognitoUtil, LoginResponse } from 'app/modules/core/cognito.service';
import { SubmenuService } from 'app/modules/core/submenu.service';
import { SubmenuItem } from 'app/modules/core/submenu-item.model';

import {
	Component,
	OnInit,
	trigger,
	state,
	style,
	transition,
	animate
} from '@angular/core';

 @Component({
	 selector: 'app-nav',
	 templateUrl: './nav.component.html',
 })
export class NavComponent implements OnInit {

	public user: Object;
	public hubUser: Object;
	public showNav: Boolean = false;
	private submenuItems:SubmenuItem[];
	constructor(@Inject('cognitoMain') private cognitoMain: CognitoUtil, private hubService: HubService, private submenuService: SubmenuService) { }
	
	ngOnInit() {
		this.cognitoMain.isAuthenticated().subscribe(
			(response: LoginResponse) => {
				if(response.loggedIn == true){
					this.user = this.cognitoMain.getCurrentUser();
					console.log('setting Nav cognito User');
					console.log(this.user);
				}else{
					this.user = null;
				}
			},
			err => console.log(err)
		);
		
		this.hubService.getCurrentUser().subscribe(
			(user) => {
				console.log('setting Nav Hub User');
				this.hubUser = user;
				console.log(this.hubUser);
			},
			err => console.log(err)
		);
		
		this.submenuService.getItems().subscribe(
			(items) => { this.submenuItems = items; console.log('submenu items', this.submenuItems);}
		);
		
	}

	onNavClick() {
		console.log('nav click happened');
		this.showNav = ! this.showNav;
		console.log(this.showNav);
	}
	logout(){
		this.cognitoMain.logout();
	}

}
