import {Component, OnDestroy, OnInit, Inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { HubService } from 'app/modules/core/hub.service';

@Component({
	selector: 'app-confirm',
	templateUrl: './confirm.component.html'
})
export class ConfirmComponent implements OnInit, OnDestroy {
	public confirmationCode: string;
	public pathUsername: string;
	public username: string;
	public notFoundEmail: boolean = false;
	public submitting : boolean = false;
	public errorMessage: string;

	constructor(public router: Router, public route: ActivatedRoute, private hubService: HubService) {
	}

	ngOnInit() {
		this.errorMessage = null;
	}

	ngOnDestroy() {
	}

	resendConfirmEmail(){
		this.hubService.resendConfirmEmail().subscribe(
			(response) => {
				console.log('resend response', response);
			}
		)
	}

	
}





