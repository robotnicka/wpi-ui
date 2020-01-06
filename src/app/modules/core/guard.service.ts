
import {of as observableOf, Observable} from 'rxjs';

import {catchError, map, first} from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { tap } from 'rxjs/operators';

import { CognitoUtil, LoginResponse } from './cognito.service';
import { AuthService} from 'app/modules/core/auth.service';
@Injectable()
export class GuardService implements CanActivate {

	constructor(@Inject('cognitoMain') private cognitoMain: CognitoUtil, private authService: AuthService, private router: Router) { }
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	  ): Observable<boolean> | Promise<boolean|UrlTree> | boolean {
		return this.authService.isAuthenticated$.pipe(
		  tap(loggedIn => {
			if (!loggedIn) {
			  this.authService.login(state.url);
			}
		  })
		);
	  }

}
