import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { LocationListComponent } from './components/location-list/location-list.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: '',
				component: LocationListComponent,
			}
		])
	],
	exports: [
		RouterModule
	]
})
export class LocationsRoutingModule {}