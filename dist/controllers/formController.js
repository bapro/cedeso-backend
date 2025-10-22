"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormById = exports.getForms = exports.submitForm = void 0;
const database_1 = __importDefault(require("../config/database"));
const models_1 = require("../models"); // Import models directly
const submitForm = async (req, res) => {
    try {
        const formData = req.body;
        // Start a transaction
        const transaction = await database_1.default.transaction();
        try {
            const incidentTime = new Date(formData.incident.time)
                .toTimeString()
                .split(" ")[0];
            // Create incident record
            const incident = await models_1.Incident.create({
                reporterType: formData.incident.reporterType,
                //otherReporterType: formData.incident.otherReporterType,
                phone: formData.incident.phone,
                date: formData.incident.date,
                time: incidentTime,
                ampm: formData.incident.ampm,
                province: formData.incident.province,
                municipio: formData.incident.municipio,
                community: formData.incident.community,
                females: formData.incident.females,
                males: formData.incident.males,
                totalAffected: formData.incident.totalAffected,
                userName: formData.incident.userName,
            }, { transaction });
            // Create profile record
            await models_1.Profile.create({
                incidentId: incident.id,
                profileType: formData.profile.profileType,
            }, { transaction });
            // Create capture record
            await models_1.Capture.create({
                incidentId: incident.id,
                eventLocation: formData.capture.eventLocation,
                eventLocationOther: formData.capture.eventLocationOther,
                authorities: formData.capture.authorities,
                authoritiesOther: formData.capture.authoritiesOther,
                authorityVehicles: formData.capture.authorityVehicles,
                authorityVehiclesOther: formData.capture.authorityVehiclesOther,
                eventType: formData.capture.eventType,
                eventTypeOther: formData.capture.eventTypeOther,
                communityReaction: formData.capture.communityReaction,
                communityReactionOther: formData.capture.communityReactionOther,
                violenceIndicators: formData.capture.violenceIndicators,
                attemptedResources: formData.capture.attemptedResources,
                attemptedResourcesOther: formData.capture.attemptedResourcesOther,
                organizationName: formData.capture.organizationName,
                organizationPhone: formData.capture.organizationPhone,
                takenTo: formData.capture.takenTo,
                takenToOther: formData.capture.takenToOther,
                hasDisability: formData.capture.hasDisability,
                isLGBTQ: formData.capture.isLGBTQ,
                description: formData.capture.description,
                //attachment: formData.capture.attachment,
                attachments: formData.capture.attachments, // Change from attachment to attachments
            }, { transaction });
            // Commit the transaction
            await transaction.commit();
            res.status(201).json({
                message: "Form submitted successfully",
                incidentId: incident.id,
            });
        }
        catch (error) {
            // Rollback the transaction in case of error
            await transaction.rollback();
            throw error;
        }
    }
    catch (error) {
        console.error("Error submitting form:", error);
        res.status(500).json({
            message: "Error submitting form",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.submitForm = submitForm;
// export const getForms = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const forms = await Incident.findAll({
//       include: [
//         { model: Profile, as: "profile" },
//         { model: Capture, as: "capture" },
//       ],
//       order: [["createdAt", "DESC"]],
//     });
//     res.status(200).json(forms);
//   } catch (error) {
//     console.error("Error fetching forms:", error);
//     res.status(500).json({
//       message: "Error fetching forms",
//       error: error instanceof Error ? error.message : "Unknown error",
//     });
//   }
// };
const getForms = async (req, res) => {
    try {
        const forms = await models_1.Incident.findAll({
            include: [
                { model: models_1.Profile, as: "profile", attributes: ["profileType"] }, // Include Profile, but only get profileType
                { model: models_1.Capture, as: "capture" },
            ],
            order: [["createdAt", "DESC"]],
        });
        // *** Data Transformation - IMPORTANT ***
        const formattedForms = forms.map((form) => {
            const { profile, ...incidentData } = form.toJSON(); // Use toJSON() and destructure
            return {
                ...incidentData,
                profileType: profile ? profile.profileType : null, // Extract profileType or null
            };
        });
        res.status(200).json(formattedForms);
    }
    catch (error) {
        console.error("Error fetching forms:", error);
        res.status(500).json({
            message: "Error fetching forms",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getForms = getForms;
const getFormById = async (req, res) => {
    try {
        const { id } = req.params;
        const form = await models_1.Incident.findByPk(id, {
            include: [
                { model: models_1.Profile, as: "profile" },
                { model: models_1.Capture, as: "capture" },
            ],
        });
        if (!form) {
            res.status(404).json({ message: "Form not found" });
            return;
        }
        res.status(200).json(form);
    }
    catch (error) {
        console.error("Error fetching form:", error);
        res.status(500).json({
            message: "Error fetching form",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getFormById = getFormById;
