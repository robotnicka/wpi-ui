import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CoreModule } from './modules/core/core.module';
import { SidebarModule } from 'ng-sidebar';
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
		SidebarModule.forRoot(),
		BrowserAnimationsModule, // required animations module
		ToastrModule.forRoot(), // ToastrModule added
	],
	exports: [ ],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
