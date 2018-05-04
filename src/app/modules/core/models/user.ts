import {OrgUnit} from './org-unit';
import {Office} from './office';
export class User {
  address: string;
  email: string;
  firstName: string;
  fullName: string;
  id: number;
  lastName: string;
  membershipExpiration: string;
  membershipNumber: string;
  membershipType: string;
  nickname: string;
  orgUnit: OrgUnit|number;
  offices: Office[];
}