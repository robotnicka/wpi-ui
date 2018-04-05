import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationsRoutingModule } from './locations-routing.module';
import { LocationListComponent } from './components/location-list/location-list.component';
import { LocationListItemComponent } from './components/location-list-item/location-list-item.component';

@NgModule({
  imports: [
    CommonModule,
    LocationsRoutingModule
  ],
  declarations: [LocationListComponent, LocationListItemComponent]
})
export class LocationsModule { }
