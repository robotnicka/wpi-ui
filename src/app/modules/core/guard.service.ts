
import {of as observableOf, Observable} from 'rxjs';

import {catchError, map, first} from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { tap } from 'rxjs/operators';

import { AuthService} from 'app/modules/core/auth.service';
@Injectable()
export class GuardService implements CanActivate {

	constructor(private authService: AuthService, private router: Router) { }
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	  ): Observable<boolean> | Promise<boolean|UrlTree> | boolean {
		return this.authService.isVerified().pipe(
		  tap(loggedIn => {
			if (!loggedIn) {
			  this.authService.login(state.url);
			}
		  }),
		  map((loggedIn) => {
			  console.log('loggedIn? ',loggedIn);
			  if(loggedIn == 0) return false;
			  if(loggedIn == 1) return true;
			  if(loggedIn == 2){
				this.router.navigate(['/auth/confirm'])
				return false;
			  }
			  return false;
		  })
		);
	  }

}
