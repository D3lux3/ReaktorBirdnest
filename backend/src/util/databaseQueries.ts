export const BULK_UPSERT_DRONES_QUERY = (`
INSERT INTO "drones" ("serial_number", "position_x", "position_y", "timestamp", "distance_from_nest")
VALUES (unnest(array[?]), unnest(array[?]), unnest(array[?]), unnest(array[?]), unnest(array[?]))
ON CONFLICT ("serial_number")
DO
    UPDATE SET
               position_x = excluded.position_x,
               position_y = excluded.position_y,
               timestamp = excluded.timestamp,
               distance_from_nest = LEAST(drones.distance_from_nest, excluded.distance_from_nest);
`);


export const ABSENT_SERIALS_IN_PILOT_TABLE_QUERY = (serials: string[] | undefined) => {
    if (!serials) {
        throw new Error(`Serials array is ${serials}`);

    }
    if (serials.length === 0) {
        throw new Error(`Serials array is empty`);
    }

    return (
        `
        SELECT incoming.drone_serial
        FROM (VALUES
            ${serials.map((_) => '(?)')}
            )
        AS incoming(drone_serial)
        WHERE NOT EXISTS (
            SELECT *
            FROM pilots
            WHERE pilots.drone_serial = incoming.drone_serial
        );
          `
    );
};

export const DELETE_EXPIRED_DRONES_QUERY = (`
DELETE FROM drones
WHERE ((CAST (EXTRACT (epoch from now()) AS bigint)) - (drones.timestamp / 1000)) > EXTRACT (epoch from interval '10 minute');
`);