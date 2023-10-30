import getURL from "../getURL";
import picdata from "../../interface/picdata";

const rides = async (): Promise<picdata[]> => {
    const response = await fetch(getURL());
    const data = await response.json();
    return data;
};

export default rides;
