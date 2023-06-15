import express from "express";
import { ConversationBotController } from "../controllers/ConversationBotController";
import { ConversationService } from "../services/conversaService";
import { CustomerService } from "../services/customerService";
import { DialogflowService } from "../services/dialogflowService";
import { DownloadMediaService } from "../services/downloadMediaService";
import { MessageService } from "../services/messageService";
import { TwilioService } from "../services/twilioService";

//Injetando dependecias, pode ser refatorado para usar alguma lib de injeção.
const dialogflowService = new DialogflowService();
const downloadMedia = new DownloadMediaService();
const conversationService = new ConversationService();
const messageService = new MessageService();
const customerService = new CustomerService();
const twilioService = new TwilioService(messageService);
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
  console.log(req.body);
  /* try {
  } catch (error) {
    throw new Error("Controller BotController");
  } */
  await conversationBotController.conversation(req, res);
  //res.send({ Body: "Teste" });
});

router.post("/info", async (req, res) => {
  console.log(req.body);
  const { SmsStatus } = req.body;
  if (SmsStatus === "read") {
    //
  }
  //await conversationBotController.conversation(req, res);
  res.sendStatus(200);
});

router.post("/shipments", async (req, res) => {
  console.log(req.body);
  const { SmsStatus } = req.body;
  if (SmsStatus === "read") {
    //
  }
  //await conversationBotController.conversation(req, res);
  res.sendStatus(200);
});

export default router;
