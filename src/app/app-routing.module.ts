import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuardService } from 'app/modules/core/guard.service';
const routes: Routes = [
	{ path: '', loadChildren: 'app/modules/home/home.module#HomeModule' },
	{ path: 'auth', loadChildren: 'app/modules/auth/auth.module#AuthModule'},
	{ path: 'locations', loadChildren: 'app/modules/locations/locations.module#LocationsModule', canActivate: [GuardService]},
	{ path: 'members', loadChildren: 'app/modules/members/members.module#MembersModule', canActivate: [GuardService]}
	
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
