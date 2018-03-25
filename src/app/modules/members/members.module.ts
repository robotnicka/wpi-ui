import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersComponent } from './components/members/members.component';
import { MembersRoutingModule } from './members-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MembersRoutingModule
  ],
  declarations: [MembersComponent]
})
export class MembersModule { }
