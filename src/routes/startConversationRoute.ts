import express from "express";
import dotenv from "dotenv";
import twilio from "twilio";
import { TwilioService } from "../services/twilioService";
import { MessageService } from "../services/messageService";
import { Message } from "../../types";
import { CustomerService } from "../services/customerService";
dotenv.config();
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
const customerService = new CustomerService();
const messageService = new MessageService();
const twilioService = new TwilioService(messageService);

const router = express.Router();

router.post("/shipments", async (req, res) => {
  console.log(req.body);
  const telefones = req.body;
  const messageText = "Olá, seja bem-vindo a conecta!";
  const from = "whatsapp:+555181749911";
  for (let i = 0; i < telefones.length; i++) {
    const options = { weekday: "long" };
    const telefone = telefones[i];
    const to = `whatsapp:+${telefone.telefone}`;
    const customer = await customerService.getCustomerTrilhaByPhone(
      telefone.telefone.slice(2)
    );
    const lostDate = customer?.lost_date;
    const date = new Date(String(lostDate));
    const dataLigacao = new Intl.DateTimeFormat("pt-BR", options).format(date);
    const message: Message = {
      body: messageText,
      from: from,
      to: to,
    };
    await twilioService.sendWhatsApp(message);
  }

  res.sendStatus(200);
});

router.post("/shipments/teste", async (req, res) => {
  // Upload a file to s3 function
});

export default router;
