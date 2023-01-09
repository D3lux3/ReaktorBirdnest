import { useEffect, useState } from "react";
import { DroneType } from "../types";


const useDrones = () => {
    const [drones, setDrones] = useState<DroneType[]>([]);

    const updateDrones = (event: MessageEvent) => {
        if (event.type === "message") {
            const parsedData = JSON.parse(event.data);
            setDrones(parsedData);
        }
    };

    useEffect(() => {
        const eventSource = new EventSource(`/drone/stream`);
        eventSource.onmessage = (e) => updateDrones(e);
        return () => eventSource.close();
    }, []);

    return drones;
}

export default useDrones;