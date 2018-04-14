import {OrgUnit} from './org-unit';
export class Office {
  email: string;
  name:string;
  id: number;
  parentOfficeID: number;
  parentOrgID: number;
  unit: OrgUnit;
  roles: string[];
}