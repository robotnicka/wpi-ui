import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'app/modules/shared/shared.module';
import { MembersComponent } from './components/members/members.component';
import { MembersRoutingModule } from './members-routing.module';
import { MemberComponent } from './components/member/member.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    SharedModule,
    MembersRoutingModule
  ],
  declarations: [MembersComponent, MemberComponent]
})
export class MembersModule { }
