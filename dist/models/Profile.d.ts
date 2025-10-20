import { Model } from 'sequelize-typescript';
import Incident from './Incident';
declare class Profile extends Model {
    incidentId: number;
    profileType: string;
    incident: Incident;
}
export default Profile;
