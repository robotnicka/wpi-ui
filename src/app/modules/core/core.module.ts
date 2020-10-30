import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarModule } from 'ng-sidebar';
import { AuthService } from './auth.service';
import { CognitoUtil } from './cognito.service';
import { GuardService } from './guard.service';
import { HubService } from './hub.service';
import { SubmenuService } from './submenu.service';
import { TitleService } from './title.service';
@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		RouterModule,
		SidebarModule
	],
	declarations: [],
	providers: [
		{ provide: 'cognitoMain', useClass: CognitoUtil },
		AuthService,
		GuardService,
		HubService,
		SubmenuService,
		TitleService
	],
	exports: [
		FormsModule,
		HttpClientModule
	]
})
export class CoreModule { }
