import { DroneContainerProps } from '../types';
import DroneRow from './DroneRow';



const DroneContainer = ({ drones }: DroneContainerProps) => {

    return (
        <table>
            <tbody>
                <tr>
                    <th>Pilot ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Drone Serial no.</th>
                    <th>Last location (X,Y)</th>
                    <th>Last seen</th>
                    <th>Closest distance to the nest</th>
                </tr>
                {drones && drones.map((drone) => (<DroneRow key={drone.serialNumber} drone={drone} />))}
            </tbody>
        </table>
    );
};


export default DroneContainer;