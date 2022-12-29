import express from "express"
import { addPilotsAndDronesToDatabase, writeDronesAndPilotsToStream } from "../services/droneService";
const router = express.Router();

/**
 * Endpoint which streams an drone and pilot data to the client every 2 seconds.
 */
router.get("/stream", async (_req, res) => {
  res.writeHead(200, {
    "Connection": "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });
  setInterval(async () => {
    await writeDronesAndPilotsToStream(res);
  }, 2000);
  await writeDronesAndPilotsToStream(res);
});

router.post("/", async (req, res) => {
  try {
    await addPilotsAndDronesToDatabase(req.body);
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: 'Invalid data' });
  }
});


export default router;