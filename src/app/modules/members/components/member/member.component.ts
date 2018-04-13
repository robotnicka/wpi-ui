import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { HubService} from 'app/modules/core/hub.service';
import { User} from 'app/modules/core/models/';


@Component({
	selector: 'app-member',
	templateUrl: './member.component.html'
})
export class MemberComponent implements OnInit, OnDestroy {
	memberSubscription: Subscription;
	member: User;
	constructor(private hubService: HubService,
		private route: ActivatedRoute,
		private router: Router) { }

	ngOnInit() {
		this.memberSubscription = this.route.params
			.pipe(switchMap((params: Params) => {
				return this.hubService.getUser(params['id'], {offices: 1, children: 1});
			})).subscribe(
				(member) => {
					this.member = member;
					console.log('got member',this.member);
				}
			);
	}
	ngOnDestroy(){
		this.memberSubscription.unsubscribe();
	}
}