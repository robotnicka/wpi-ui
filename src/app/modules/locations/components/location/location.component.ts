import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { HubService} from 'app/modules/core/hub.service';
import { OrgUnit} from 'app/modules/core/models/';


@Component({
	selector: 'app-location',
	templateUrl: './location.component.html'
})
export class LocationComponent implements OnInit, OnDestroy {
	orgSubscription: Subscription;
	orgUnit: OrgUnit;
	constructor(private hubService: HubService,
		private route: ActivatedRoute,
		private router: Router) { }

	ngOnInit() {
		this.orgSubscription = this.route.params
			.pipe(switchMap((params: Params) => {
				return this.hubService.getOrgUnit(params['id'],false);
			})).subscribe(
				(orgUnit) => {this.orgUnit = orgUnit; console.log(this.orgUnit);}
			);
	}
	ngOnDestroy(){
		this.orgSubscription.unsubscribe();
	}
}