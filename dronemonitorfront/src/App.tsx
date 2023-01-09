import "./styles.css";
import DroneContainer from './components/DroneContainer';
import useDrones from './hooks/useDrones';


const App = () => {
  const drones = useDrones();
  return (
    <>
      <h1>Drone Status</h1>
      <DroneContainer drones={drones} />
    </>
  );

};

export default App;
