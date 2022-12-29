import * as yup from 'yup';

export const DroneSchema = yup.object({
    serialNumber: yup.string().required(),
    positionY: yup.number().required(),
    positionX: yup.number().required(),
}).required();

export const ArrayOfDroneSchema = yup.array().of(DroneSchema).required();

export const responseSchema = yup.object({
    report: yup.object({
        deviceInformation: yup.object({
            $: yup.object().notRequired(),
            listenRange: yup.number().notRequired(),
            deviceStarted: yup.date().notRequired(),
            uptimeSeconds: yup.number().notRequired(),
            updateIntervalMs: yup.number().default(2000).required(),
        }).notRequired(),
        capture: yup.object({
            $: yup.object({
                snapshotTimestamp: yup.date().required(),
            }).required(),
            drone: ArrayOfDroneSchema.transform((value) => [value].flat()).default([]).required(),
        }).required(),
    }).required(),
});

export type droneSchemaType = yup.InferType<typeof DroneSchema>;

export interface DroneSchemaWithDataType extends  Pick<droneSchemaType, 'serialNumber' | 'positionX' | 'positionY'>  {
    timestamp: number;
    distanceFromNest: number;
}

export type responseSchemaType = yup.InferType<typeof responseSchema>;


