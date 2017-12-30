import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/login/login.component';
import { PasswordComponent } from './components/password/password.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: '',
				component: AuthComponent,
				children: [
					{ path: '', redirectTo: 'login', pathMatch: 'full' },
					{ path: 'login', component: LoginComponent },
					{ path: 'password', component: PasswordComponent },
					{ path: 'register', component: RegisterComponent }
				]
			}
		])
	],
	exports: [
		RouterModule
	]
})
export class AuthRoutingModule {}