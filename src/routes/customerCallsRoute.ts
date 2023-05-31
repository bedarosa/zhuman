import express from "express";
import { ConversationBotController } from "../controllers/ConversationBotController";
import { DialogflowService } from "../services/dialogflowService";
import { DownloadMedia } from "../services/downloadMediaService";
import { TwilioService } from "../services/twilioService";

//Injetando dependecias, pode ser refatorado para usar alguma lib de injeção.
const twilioService = new TwilioService();
const dialogflowService = new DialogflowService();
const downloadMedia = new DownloadMedia();
const conversationBotController = new ConversationBotController(
  twilioService,
  dialogflowService,
  downloadMedia
);

const router = express.Router();

router.get("/", async (req, res) => {
  res.send("Get /customerCallsRoute");
});

router.post("/", async (req, res) => {
  await conversationBotController.conversation(req, res);
});

export default router;
