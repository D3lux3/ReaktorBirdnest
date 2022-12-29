import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../util/database";

class Drone extends Model<InferAttributes<Drone>, InferCreationAttributes<Drone>> {
    declare serialNumber: string;
    declare positionX: number;
    declare positionY: number;
    declare timestamp: number;
    declare distanceFromNest: number;
}
Drone.init({
    serialNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    positionX: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    positionY: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    distanceFromNest: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    underscored: true,
    tableName: 'drones',
    modelName: 'drone',
    timestamps: false,
});


export default Drone;