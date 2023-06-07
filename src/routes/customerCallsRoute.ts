import express from "express";
import { ConversationBotController } from "../controllers/ConversationBotController";
import { ConversationService } from "../services/conversaService";
import { CustomerService } from "../services/customerService";
import { DialogflowService } from "../services/dialogflowService";
import { DownloadMediaService } from "../services/downloadMediaService";
import { MessageService } from "../services/messageService";
import { TwilioService } from "../services/twilioService";

//Injetando dependecias, pode ser refatorado para usar alguma lib de injeção.
const twilioService = new TwilioService();
const dialogflowService = new DialogflowService();
const downloadMedia = new DownloadMediaService();
const conversationService = new ConversationService();
const messageService = new MessageService();
const customerService = new CustomerService();
const conversationBotController = new ConversationBotController(
  twilioService,
  dialogflowService,
  downloadMedia,
  conversationService,
  messageService,
  customerService
);

const router = express.Router();

router.get("/", async (req, res) => {
  res.send("Get /customerCallsRoute");
});

router.post("/", async (req, res) => {
  await conversationBotController.conversation(req, res);
});

export default router;
