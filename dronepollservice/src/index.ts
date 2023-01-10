import { DroneSchemaWithDataType } from "./types";
import { getDronesViolatingNdz, getSyncedDelayTimer, printDebugTimes, validateSnapshot, xmlToJson } from "./utils";
import dotenv from "dotenv";
dotenv.config();

const BACKEND_ENDPOINT = process.env.BACKEND_DRONE_ENDPOINT || "http://localhost:3001/drone";

/**
 * Function that sends a POST request to the backend server with the data of drones violating the no fly zone.
 * @param drones Drones that are violating the no fly zone.
 */
const postViolatingDronesToBackend = async (drones: DroneSchemaWithDataType[]) => {
    try {

        await fetch(BACKEND_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(drones),
        });
    } catch (error) {
        throw new Error(`Error posting data to backend: ${error}`);
    }
}

/**
 * Gets drone positions from the monitoring equipment.
 * @returns Drone snapshot in XML format.
 */
const getDroneSnapshot = async () => {
    try {

        const response = await fetch("https://assignments.reaktor.com/birdnest/drones");
        const responseAsXML = await response.text();
        return responseAsXML;
    } catch (error) {
        throw new Error(`Error getting drone positions: ${error}`);
    }
}

/**
 * Polls the drone positions from the monitoring equipment and forwards the drones violating the no fly zone to the backend.
 */
const pollDronePositions = async () => {
    try {

        const snapshotInXML = await getDroneSnapshot();
        const snapshotInJSON = await xmlToJson(snapshotInXML);
        const validatedSnapshot = await validateSnapshot(snapshotInJSON);

        const drones = getDronesViolatingNdz(validatedSnapshot);

        const timeToNextPoll = getSyncedDelayTimer(validatedSnapshot.report.deviceInformation.updateIntervalMs, validatedSnapshot?.report.capture.$.snapshotTimestamp);

        //Debugging
        printDebugTimes(validatedSnapshot?.report.capture.$.snapshotTimestamp, timeToNextPoll);

        if (drones.length > 0) {
            console.log(drones);
            await postViolatingDronesToBackend(drones);
        }

        setTimeout(pollDronePositions, timeToNextPoll);
    } catch (error) {
        console.log(error);
        setTimeout(pollDronePositions, 2000);
    }
}

pollDronePositions();