import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LocationsRoutingModule } from './locations-routing.module';
import { LocationListComponent } from './components/location-list/location-list.component';
import { LocationListItemComponent } from './components/location-list-item/location-list-item.component';
import { LocationComponent } from './components/location/location.component';
import { LocationOfficerComponent } from './components/location-officer/location-officer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    LocationsRoutingModule
  ],
  declarations: [LocationListComponent, LocationListItemComponent, LocationComponent, LocationOfficerComponent],
  entryComponents: [LocationOfficerComponent]
})
export class LocationsModule { }
