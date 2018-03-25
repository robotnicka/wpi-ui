import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { MembersComponent } from './components/members/members.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: '',
				component: MembersComponent,
			}
		])
	],
	exports: [
		RouterModule
	]
})
export class MembersRoutingModule {}