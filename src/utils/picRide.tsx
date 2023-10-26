import type { ImageSourcePropType } from "react-native";

const picRide = (Name: string): ImageSourcePropType => {
    switch (Name) {
        case "Sky Coaster - สกายโคสเตอร์":
            return require("../../assets/RidesFastpass/SkyCoaster.png");
        case "Tornado - ทอร์นาโด":
            return require("../../assets/RidesFastpass/Tornado.png");
        case "Super Splash - ซูเปอร์สแปลช":
            return require("../../assets/RidesFastpass/SuperSplash.png");
        case "Bump Car - รถบั๊มมหาสนุก":
            return require("../../assets/RidesFastpass/BumpCar.png");
        case "Grand Canyon - แกรนด์แคนยอน":
            return require("../../assets/RidesFastpass/GrandCanyon.png");
        case "Black Hole - แบล็กโฮล":
            return require("../../assets/RidesFastpass/BlackHoleCoaster.png");
        default:
            return require("../../assets/icon.png");
    }
};

export default picRide;
