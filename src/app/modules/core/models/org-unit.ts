import {Office} from './office';
export class OrgUnit {
  id: number;
  code: string;
  name: string;
  type: string;
  children: OrgUnit[];
  offices: Office[];
}
