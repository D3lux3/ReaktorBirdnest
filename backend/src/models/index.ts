import Pilot from './Pilot';
import Drone from './Drone';

Drone.hasOne(Pilot , { foreignKey: 'droneSerial', sourceKey: 'serialNumber', onDelete: 'CASCADE' });

void Pilot.sync({ alter: true });
void Drone.sync({ alter: true });

export { Pilot, Drone }
