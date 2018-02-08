import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { LoginComponent } from './components/login/login.component';
import { PasswordComponent } from './components/password/password.component';
import { RegisterComponent } from './components/register/register.component';
import { ResendComponent } from './components/resend/resend.component';
@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: '',
				component: AuthComponent,
				children: [
					{ path: '', redirectTo: 'login', pathMatch: 'full' },
					{ path: 'confirm/:username', component: ConfirmComponent },
					{ path: 'confirm', component: ConfirmComponent },
					{ path: 'resend/:username', component: ResendComponent },
					{ path: 'resend', component: ResendComponent },
					{ path: 'login', component: LoginComponent },
					{ path: 'password', component: PasswordComponent },
					{ path: 'register', component: RegisterComponent },
					{ path: 'forgot', component: ForgotComponent },
				]
			}
		])
	],
	exports: [
		RouterModule
	]
})
export class AuthRoutingModule {}