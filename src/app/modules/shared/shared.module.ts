import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MemberSearchComponent } from './components/member-search/member-search.component';
import { OrgunitDropdownComponent } from './components/orgunit-dropdown/orgunit-dropdown.component';
import { MemberTransferComponent } from './components/member-transfer/member-transfer.component';
import { OrgunitSearchComponent } from './components/orgunit-search/orgunit-search.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule
  ],
  declarations: [MemberSearchComponent, OrgunitDropdownComponent, MemberTransferComponent, OrgunitSearchComponent],
  exports: [ MemberSearchComponent, OrgunitDropdownComponent, MemberTransferComponent]
})
export class SharedModule { }
