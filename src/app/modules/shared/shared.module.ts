import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MemberSearchComponent } from './components/member-search/member-search.component';
import { OrgunitDropdownComponent } from './components/orgunit-dropdown/orgunit-dropdown.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule
  ],
  declarations: [MemberSearchComponent, OrgunitDropdownComponent],
  exports: [ MemberSearchComponent, OrgunitDropdownComponent]
})
export class SharedModule { }
