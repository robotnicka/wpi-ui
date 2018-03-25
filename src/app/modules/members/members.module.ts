import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersComponent } from './components/members/members.component';
import { MembersRoutingModule } from './members-routing.module';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  imports: [
    CommonModule,
    MembersRoutingModule
  ],
  declarations: [MembersComponent, ProfileComponent]
})
export class MembersModule { }
