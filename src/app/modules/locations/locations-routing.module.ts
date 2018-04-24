import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { LocationListComponent } from './components/location-list/location-list.component';
import { LocationComponent } from './components/location/location.component';
import { LocationOfficerComponent } from './components/location-officer/location-officer.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: '',
				component: LocationListComponent,
			},
			{
				path: ':id',
				component: LocationComponent
			}
		])
	],
	exports: [
		RouterModule
	]
})
export class LocationsRoutingModule {}