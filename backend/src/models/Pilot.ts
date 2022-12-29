import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../util/database";
import Drone from "./Drone";

class Pilot extends Model<InferAttributes<Pilot>, InferCreationAttributes<Pilot>> {
    declare pilotId: string;
    declare firstName: string;
    declare lastName: string;
    declare phoneNumber: string;
    declare email: string;
    declare droneSerial: ForeignKey<Drone['serialNumber']>;
}

Pilot.init({
    pilotId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    underscored: true,
    tableName: 'pilots',
    modelName: 'pilot',
    timestamps: false,
});

export default Pilot;