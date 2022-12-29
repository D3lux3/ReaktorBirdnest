import { DroneRowProps } from '../types';



const DroneRow = ({ drone }: DroneRowProps) => {
    const { pilot, ...rest } = drone;

    return (
        <tr>
            <td>
                {pilot.pilotId}
            </td>
            <td>
                {pilot.firstName + " " + pilot.lastName}
            </td>
            <td>
                {pilot.phoneNumber}
            </td>
            <td>
                {pilot.email}
            </td>
            <td>
                {rest.serialNumber}
            </td>
            <td>
                {`${rest.positionX},${rest.positionY}`}
            </td>
            <td>
                {new Date(Number.parseInt(rest.timestamp)).toLocaleString('fi-FI', { timeZone: 'Europe/Helsinki' })}
            </td>
            <td>
                {rest.distanceFromNest + " meters"}
            </td>
        </tr>
    );
};



export default DroneRow;