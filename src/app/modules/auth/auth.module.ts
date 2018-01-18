import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import { LoginComponent } from './components/login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './components/auth/auth.component';
import { PasswordComponent } from './components/password/password.component';
import { RegisterComponent } from './components/register/register.component';
import { ConfirmComponent } from './components/confirm/confirm.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule
  ],
  declarations: [LoginComponent, AuthComponent, PasswordComponent, RegisterComponent, ConfirmComponent]
})
export class AuthModule {
	constructor() {
		console.log('auth module constructor!');
	}
}
