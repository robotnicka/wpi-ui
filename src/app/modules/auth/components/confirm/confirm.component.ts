import {Component, OnDestroy, OnInit, Inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CognitoUtil, CognitoResponse, LoginResponse} from "app/modules/core/cognito.service";

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html'
})
export class ConfirmComponent implements OnInit, OnDestroy {
    confirmationCode: string;
    email: string;
    errorMessage: string;
    private sub: any;

    constructor(public router: Router, public route: ActivatedRoute, @Inject('cognitoMain') private cognitoMain: CognitoUtil) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.email = params['email'];

        });

        this.errorMessage = null;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onConfirmRegistration() {
        this.errorMessage = null;
        //this.cognitoMain.confirmRegistration(this.email, this.confirmationCode, this);
    }

    cognitoCallback(message: string, result: any) {
        if (message != null) { //error
            this.errorMessage = message;
            console.log("message: " + this.errorMessage);
        } else { //success
            //move to the next step
            console.log("Moving to securehome");
            // this.configs.curUser = result.user;
            this.router.navigate(['/securehome']);
        }
    }
}





