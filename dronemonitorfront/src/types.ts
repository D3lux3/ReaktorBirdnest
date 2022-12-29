export interface DroneType {
  serialNumber: string;
  positionY: number;
  positionX: number;
  timestamp: string;
  distanceFromNest: number;
  pilot: PilotType;
}

export interface PilotType {
  pilotId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  droneSerial: string;
}

export interface DroneContainerProps {
  drones: DroneType[];
}

export interface DroneRowProps {
  drone: DroneType;
}