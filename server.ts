import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { TwilioService } from "./src/services/twilioService";
import { Message } from "./types";
import customerCallsRoute from "./src/routes/customerCallsRoute";
import startConversationRoute from "./src/routes/startConversationRoute";
import testRoute from "./src/routes/testRoute";

dotenv.config();

const app = express();
//app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Rota para quando o cliente chamar
app.use("/customer", customerCallsRoute);

app.use("/start", startConversationRoute);

app.use("/teste", testRoute);

// Implementar rota para quando o consultor der perdido

// const twilioService = new TwilioService();

const port = process.env.PORT;

app.get("/", async (req, res) => {
  console.log("Teste");
  res.sendStatus(200);
});

/* app.post("/", async (req, res) => {
  const { From, To, Body } = req.body;
  const telefoneFormatado = From.replace(/\D/g, "");

  console.log(Body);

  const message: Message = {
    body: Body,
    from: To,
    to: From,
  };
  await twilioService.sendWhatsApp(message);
  res.send("OK");
}); */

app.post("/teste", async (req, res) => {});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
