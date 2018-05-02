import { Inject, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Location, PopStateEvent } from "@angular/common";
import { CollapseModule } from 'ngx-bootstrap/collapse';
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
	@ViewChild('scrollOutlet') scrollOutlet: ElementRef;
	private lastPoppedUrl: string;
	private yScrollStack: number[] = [];
	public user: Object;
	public hubUser: Object;
	public hubResponse: boolean = false;
	public showNav: Boolean = false;
	public submenuItems:SubmenuItem[];
	constructor(private router: Router, private location: Location, @Inject('cognitoMain') private cognitoMain: CognitoUtil, private hubService: HubService, private submenuService: SubmenuService) { }
	
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
			err => console.log(err),
			() => {this.hubResponse=true;}
		);
		
		this.submenuService.getItems().subscribe(
			(items) => { this.submenuItems = items; console.log('submenu items', this.submenuItems);}
		);
		
		
		
	}
	
	ngAfterViewInit(){
		this.location.subscribe((ev:PopStateEvent) => {
			this.lastPoppedUrl = ev.url;
		});
		
		this.router.events
		.filter(event => event instanceof NavigationStart || event instanceof NavigationEnd)
		.subscribe((ev: NavigationStart | NavigationEnd) => {
			let scrollheight = 0;
			const contentContainer = document.querySelector('.ng-sidebar__content');
			if (ev instanceof NavigationEnd) {
				console.log('ev.url', ev.url);
				console.log('last popped url', this.lastPoppedUrl);
				if (ev.url == this.lastPoppedUrl) {
					this.lastPoppedUrl = undefined;
					scrollheight = this.yScrollStack.pop();
					console.log('stack scrollheight', scrollheight);
				} else{
					scrollheight = 0;
				}
				console.log('scrolling to ',scrollheight);
				contentContainer.scrollTo(0, scrollheight);
			}
			else if (ev instanceof NavigationStart) {
				if (ev.url != this.lastPoppedUrl)
					console.log('current scroll height ', contentContainer.scrollTop);
					this.yScrollStack.push(contentContainer.scrollTop);
			}
			
		});
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
