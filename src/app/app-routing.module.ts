import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLoginService } from 'app/modules/core/user-login.service';
const routes: Routes = [
	{ path: '', loadChildren: 'app/modules/home/home.module#HomeModule' },
	{ path: 'auth', loadChildren: 'app/modules/auth/auth.module#AuthModule'},
	{ path: 'user', loadChildren: 'app/modules/user/user.module#UserModule', canActivate: [UserLoginService]},
	//{ path: 'user', loadChildren: 'app/modules/user/user.module#UserModule',},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
