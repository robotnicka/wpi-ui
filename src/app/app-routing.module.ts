import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { GuardService } from 'app/modules/core/guard.service';
const routes: Routes = [
	{ path: '', loadChildren: () => import('app/modules/home/home.module').then(m => m.HomeModule) },
	{ path: 'auth', loadChildren: () => import('app/modules/auth/auth.module').then(m => m.AuthModule)},
	{ path: 'locations', loadChildren: () => import('app/modules/locations/locations.module').then(m => m.LocationsModule), canActivate: [GuardService]},
	{ path: 'members', loadChildren: () => import('app/modules/members/members.module').then(m => m.MembersModule), canActivate: [GuardService]}
	
];

@NgModule({
	imports: [RouterModule.forRoot(routes,{ preloadingStrategy: PreloadAllModules })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
