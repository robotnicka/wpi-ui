import {OrgUnit} from './org-unit';
export class Office {
  email: string;
  name:string;
  id: number;
  parentOfficeID: number;
  parentOffice: Office;
  parentOrgID: number;
  userID: number;
  unit: OrgUnit;
  roles: string[];
}