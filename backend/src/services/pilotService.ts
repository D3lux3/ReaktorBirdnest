import { QueryTypes } from "sequelize";
import { Pilot } from "../models";
import { PilotSchema, PilotSerialSchema } from "../types";
import { sequelize } from "../util/database";
import { ABSENT_SERIALS_IN_PILOT_TABLE_QUERY } from "../util/databaseQueries";


/**
 * Adds single pilot to the database.
 * @param serial The serial of the drone.
 */
export const addPilotToDatabase = async (serial: string) => {
  try {
    const pilot = await getPilotContactInformationFromApi(serial);
    await Pilot.upsert({ ...pilot, droneSerial: serial });
  } catch (error) {
    throw new Error(`Error while adding pilot to database: ${error}`);
  }
}

/**
 * Adds contact information of pilots to the database.
 * Prevents unnecessary calls to the API by performing API calls only for drone's without pilot information attached to them.
 * @param droneSerials An array of drone serials.
 */
export const addAbsentPilotsToDatabase = async (droneSerials: string[]) => {
  try {
    const serialsAbsentInDatabase = await getAbsentSerials(droneSerials);
    await Promise.allSettled(serialsAbsentInDatabase.map((serial) => addPilotToDatabase(serial)));
  } catch (error) {
    console.log('Error while adding pilots to database: ', error);
  }
}

/**
 * Function that returns an array of serials that does not have pilot information.
 * @param serials An array of drone serials.
 * @returns Array of serials that are not present in the database.
 */
const getAbsentSerials = async (serials: string[]) => {
  try {
    const serialsNotInDatabase = await sequelize.query(
      ABSENT_SERIALS_IN_PILOT_TABLE_QUERY(serials)
      , {
        type: QueryTypes.SELECT,
        replacements: serials,
        fieldMap: { drone_serial: 'droneSerial' }
      });

    const validated = await PilotSerialSchema.validate(serialsNotInDatabase);
    return validated.map((serial) => serial.droneSerial);
  } catch (error) {
    throw new Error(`Error while getting absent serials: ${error}`);
  }
}

/**
 * Function that fetches a pilot's contact information from the API.
 * @param serial The serial of the pilot.
 * @returns The pilot's contact information.
 */
const getPilotContactInformationFromApi = async (serial: string) => {
  try {
    const response = await fetch(`https://assignments.reaktor.com/birdnest/pilots/${serial}`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (response.ok) {
      const validatedPilot = await PilotSchema.validate(await response.json());
      return validatedPilot;
    }
    throw new Error(`Fetch failed with status code ${response.status}`);
  } catch (error) {
    throw new Error(`Error while fetching pilot information from API: ${error}`);
  };
}