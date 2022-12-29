import * as yup from 'yup';

export const DroneSchema = yup.object({
    serialNumber: yup.string().required(),
    positionY: yup.number().required(),
    positionX: yup.number().required(),
    timestamp: yup.number().required(),
    distanceFromNest: yup.number().required(),
}).required();

export const PilotSchema = yup.object({
    pilotId: yup.string().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    phoneNumber: yup.string().required(),
    email: yup.string().email().required(),
}).required();

export const PilotSerialSchema = yup.array().of(yup.object({
    droneSerial: yup.string().required(),
})).required();

export const TimestampSchema = yup.array().of(yup.object({
    timestamp: yup.number().required(),
})).required();


export const ArrayOfDroneSchema = yup.array().of(DroneSchema).required();

export type ArrayOfDroneSchemaType = yup.InferType<typeof ArrayOfDroneSchema>;
export type droneSchemaType = yup.InferType<typeof DroneSchema>;
export type PilotSchemaType = yup.InferType<typeof PilotSchema>;


export interface PilotDatabaseSchemaType extends yup.InferType<typeof PilotSchema> {
    droneSerial: string;
}

export interface PilotDatabaseNoIdSchemaType extends yup.InferType<typeof PilotSchema> {
    droneSerial: string;
}


export interface PilotCacheType extends yup.InferType<typeof PilotSchema> {
    cachedAt: number;
}

export interface PilotSerialType extends yup.InferType<typeof PilotSerialSchema> { }