import { Model } from "sequelize-typescript";
import Profile from "./Profile";
import Capture from "./Capture";
declare class Incident extends Model {
    reporterType: string;
    otherReporterType?: string;
    phone?: string;
    date: Date;
    time: string;
    ampm: string;
    province: string;
    municipio: string;
    community: string;
    females: number;
    males: number;
    totalAffected: number;
    userId: number;
    user: User;
    profile: Profile;
    capture: Capture;
}
export default Incident;
