import { Model } from "sequelize-typescript";
import Incident from "./Incident";
declare class Capture extends Model {
    incidentId: number;
    eventLocation: string;
    eventLocationOther?: string;
    authorities: string[];
    authoritiesOther?: string;
    authorityVehicles: string[];
    authorityVehiclesOther?: string;
    eventType: string[];
    eventTypeOther?: string;
    communityReaction: string;
    communityReactionOther?: string;
    violenceIndicators: string[];
    attemptedResources: string[];
    attemptedResourcesOther?: string;
    organizationName?: string;
    organizationPhone?: string;
    takenTo: string[];
    takenToOther?: string;
    hasDisability: string;
    isLGBTQ: string;
    description: string;
    attachments?: string[];
    incident: Incident;
}
export default Capture;
