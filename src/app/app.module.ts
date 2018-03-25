import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
		SidebarModule.forRoot()
	],
	exports: [ ],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
