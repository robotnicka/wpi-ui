import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersComponent } from './components/members/members.component';
import { MembersRoutingModule } from './members-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { MemberComponent } from './components/member/member.component';

@NgModule({
  imports: [
    CommonModule,
    MembersRoutingModule
  ],
  declarations: [MembersComponent, ProfileComponent, MemberComponent]
})
export class MembersModule { }
