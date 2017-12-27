import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserService } from 'app/modules/core/user.service';
const routes: Routes = [
	{ path: '', loadChildren: 'app/modules/home/home.module#HomeModule' },
	{ path: 'login', loadChildren: 'app/modules/login/login.module#LoginModule'},
	{ path: 'user', loadChildren: 'app/modules/user/user.module#UserModule', canActivate: [UserService]},
	//{ path: 'user', loadChildren: 'app/modules/user/user.module#UserModule',},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
