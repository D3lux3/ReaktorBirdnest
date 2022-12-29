import { ArrayOfDroneSchema, droneSchemaType } from "../types";
import { addAbsentPilotsToDatabase } from "./pilotService";
import { Op, QueryTypes } from "sequelize";
import { sequelize } from "../util/database";
import { BULK_UPSERT_DRONES_QUERY, DELETE_EXPIRED_DRONES_QUERY } from "../util/databaseQueries";
import { Drone, Pilot } from "../models";
import express from "express"


/**
 * Adds a list of drones and their pilots to the database.
 * @param drones An array of objects representing drones.
 */
export const addPilotsAndDronesToDatabase = async (drones: unknown) => {
    try {
        const validatedDrones = await ArrayOfDroneSchema.validate(drones);
        const serials = validatedDrones.map((drone) => drone.serialNumber);
        await bulkUpsertDrones(validatedDrones);
        await addAbsentPilotsToDatabase(serials);
    } catch (error) {
        throw new Error(`Error while adding pilot and drones: ${error}`);
    }
}
/**
 * 
 * @returns A list of drones and their pilots that have been added/updated in the last 10 minutes.
 */
const getNonExpiredDronesAndPilots = async () => {
    try {
        const dronesAndPilots = await Drone.findAll(
            {
                include: { model: Pilot, as: 'pilot', required: true },
                order: [['timestamp', 'DESC']],
                where: {
                    timestamp: {
                        [Op.gt]: (new Date().getTime() - 600000),
                    }
                }
            });
        return dronesAndPilots;
    } catch (error) {
        throw new Error(`Error while getting non expired drones and pilots: ${error}`);
    }
}

/**
 * Writes a list of drones and their pilots to the response stream.
 * @param res The response object.
 */
export const writeDronesAndPilotsToStream = async (res: express.Response) => {
    try {
        const dronesAndPilots = await getNonExpiredDronesAndPilots();
        res.write('event: ' + "message" + '\n' + 'data: ' + JSON.stringify(dronesAndPilots) + '\n\n');
    } catch (error) {
        console.log(error);
        res.write('event: ' + "error" + '\n' + 'data: ' + '\n\n');
    }
}

/**
 * Upserts a list of drones to the database.
 * @param drones 
 */
const bulkUpsertDrones = async (drones: droneSchemaType[]) => {
    try {
        await sequelize.query(BULK_UPSERT_DRONES_QUERY, {
            type: QueryTypes.INSERT, replacements:
                [
                    drones.map((drone) => drone.serialNumber),
                    drones.map((drone) => drone.positionX),
                    drones.map((drone) => drone.positionY),
                    drones.map((drone) => drone.timestamp),
                    drones.map((drone) => drone.distanceFromNest)
                ],
        });
    } catch (error) {
        throw new Error(`Error while bulk upserting drones: ${error}`);
    }
}
/**
 * Deletes drones that have not been updated in the last 10 minutes.
 */
export const deleteExpiredDronesFromDatabase = async () => {
    try {
        await sequelize.query(
            DELETE_EXPIRED_DRONES_QUERY,
            {
                type: QueryTypes.DELETE
            }
        );
    } catch (error) {
        console.log('Deleting expired drones failed', error)
    }
}
