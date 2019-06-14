import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CookieService } from 'ngx-cookie-service';
import { ToastrModule } from 'ngx-toastr';
import { SidebarModule } from 'ng-sidebar';
import { CoreModule } from './modules/core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent} from './nav/nav.component';

@NgModule({
	declarations: [
		AppComponent,
		NavComponent
	],
	imports: [
		AppRoutingModule,
		BrowserModule,
		CoreModule,
		BsDatepickerModule.forRoot(),
		SidebarModule.forRoot(),
		BrowserAnimationsModule, // required animations module
		ToastrModule.forRoot() // ToastrModule added
	],
	exports: [ ],
	providers: [CookieService],
	bootstrap: [AppComponent]
})
export class AppModule { }
