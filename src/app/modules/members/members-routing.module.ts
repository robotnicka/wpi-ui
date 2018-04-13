import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { MembersComponent } from './components/members/members.component';
import { MemberComponent } from './components/member/member.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: '',
				component: MembersComponent
			},
			{
				path: ':id',
				component: MemberComponent
			},
			{
				path: 'profile',
				component: ProfileComponent
			}
		])
	],
	exports: [
		RouterModule
	]
})
export class MembersRoutingModule {}