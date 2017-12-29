import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {UserRegistrationService} from "app/modules/core/user-registration.service";

export class RegistrationUser {
    name: string;
    email: string;
    password: string;
}
/**
 * This component is responsible for displaying and controlling
 * the registration of the user.
 */
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
    registrationUser: RegistrationUser;
    router: Router;
    errorMessage: string;

    constructor(public userRegistration: UserRegistrationService, router: Router) {
        this.router = router;
        this.registrationUser = new RegistrationUser();
        this.errorMessage = null;
    }
    
    ngOnInit(){
    	
    }

    onRegister() {
        this.errorMessage = null;
        //this.userRegistration.register(this.registrationUser, this);
    }

    cognitoCallback(message: string, result: any) {
        if (message != null) { //error
            this.errorMessage = message;
            console.log("result: " + this.errorMessage);
        } else { //success
            //move to the next step
            console.log("redirecting");
            this.router.navigate(['/home/confirmRegistration', result.user.username]);
        }
    }
}