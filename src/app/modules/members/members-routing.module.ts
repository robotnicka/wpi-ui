import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { MembersComponent } from './components/members/members.component';
import { MemberComponent } from './components/member/member.component';

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
			}
			
		])
	],
	exports: [
		RouterModule
	]
})
export class MembersRoutingModule {}