import {Office} from './office';
import {User} from './user';
export class OrgUnit {
  id: number;
  code: string;
  name: string;
  type: string;
  venueType: string;
  parents: OrgUnit[];
  children: OrgUnit[];
  offices: Office[];
  users: User[];
}