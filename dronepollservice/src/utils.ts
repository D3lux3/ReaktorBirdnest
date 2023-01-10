import { droneSchemaType, responseSchema, responseSchemaType } from "./types";
import xml2js from "xml2js";

/**
 * Validates a snapshot against the schema.
 * @param data The data to validate.
 * @returns validated snapshot.
 */
export const validateSnapshot = async (data: unknown) => {
    try {
        const validatedSnapshot = await responseSchema.validate(data);
        validatedSnapshot.report.capture.drone = [validatedSnapshot.report.capture.drone].flat();
        return validatedSnapshot;
    } catch (error) {
        throw new Error(`Error validating drone data ${error}`);
    }
}

/**
 * 
 * @param snapshotTimestamp Timestamp of the snapshot.
 * @param timer Time for next timeout to poll the server.
 */
export const printDebugTimes = (snapshotTimestamp: Date, timer: number) => {
    console.log('____________________________________________________')
    const timestampInMs = new Date(snapshotTimestamp)
    console.log("Time since capture ", Date.now() - timestampInMs.getTime(), "ms")
    console.log('Capture is bigger than now: ', timestampInMs.getTime() > Date.now());
    console.log('Timer: ', timer, 'ms');
    console.log('____________________________________________________')
}
/**
 * Filters a drone snapshot to return only drones that are within 100 meters of the nest.
 * @param snapshot The snapshot object to filter.
 * @returns Drones that are violating the 100 meter no fly zone.
 */
export const getDronesViolatingNdz = (snapshot: responseSchemaType) => {
    const drones = snapshot.report.capture.drone.map((drone: droneSchemaType) => ({
        serialNumber: drone.serialNumber,
        positionX: Math.round(drone.positionX * 1000) / 1000,
        positionY: Math.round(drone.positionY * 1000) / 1000,
        timestamp: new Date(snapshot.report.capture.$.snapshotTimestamp).getTime(),
        distanceFromNest: calculateDistanceFromNest(drone.positionX, drone.positionY)
    }));
    return drones.filter(drone => drone.distanceFromNest <= 100);
}

/**
 * Calculates the euclidian distance from a given position to the nest and rounds it to the nearest integer.
 * @param positionX A number representing the x coordinate of the position.
 * @param positionY A number representing the y coordinate of the position.
 * @returns Distance between the position and the nest in meters.
 */
export const calculateDistanceFromNest = (positionX: number, positionY: number) => {
    return Math.round(Math.hypot((positionX - 250000), (positionY - 250000)) / 1000);
}

/**
 * This function calculates the delay time for a timer that should be approximately synchronized with a given timestamp.
 * To ensure that no snapshots are missed from the server, a timer that is synchronized is safer and should be used rather than a static timer.
 * This will help to prevent any gaps in the snapshot data caused by latency and/or other potential issues.
 * @param updateInterval The interval in milliseconds that the server updates.
 * @param timestamp The reference timestamp to which the timer should be synchronized.
 * @returns The calculated delay time for the server polls, in milliseconds.
 */
export const getSyncedDelayTimer = (updateInterval: number, timestamp: Date) => {
    const syncedTime = updateInterval - (Date.now() - new Date(timestamp).getTime());
    return (syncedTime <= 0 || syncedTime > updateInterval) ? 1500 : syncedTime;
}


/**
 * This function converts XML data to JSON format.
 * @param xmlData The Drone XML data to be converted to JSON.
 * @returns The JSON representation of the XML data.
 */
export const xmlToJson = async (xmlData: string) => {
    try {
        const dataInJSON = await xml2js.parseStringPromise(xmlData, { explicitArray: false });
        return dataInJSON;
    } catch (error) {
        throw new Error(`Error transforming xml to json: ${error}`);
    }
}