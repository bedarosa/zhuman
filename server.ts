import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import customerCallsRoute from "./src/routes/customerCallsRoute";

dotenv.config();

const app = express();
//app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Rota para quando o cliente chamar
app.use("/customer", customerCallsRoute);

// Implementar rota para quando o consultor der perdido

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.post("/", async (req, res) => {
  //res.sendStatus(200);
});

app.post("/teste", async (req, res) => {});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
