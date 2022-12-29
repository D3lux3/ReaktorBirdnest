import React, { useEffect } from 'react';
import { DroneType } from './types';
import "./styles.css";
import DroneContainer from './components/DroneContainer';


const App = () => {
  const [drones, setDrones] = React.useState<DroneType[]>([]);

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


  return (
    <>
      <h1>Drone Status</h1>
      <DroneContainer drones={drones} />
    </>
  );

};

export default App;
