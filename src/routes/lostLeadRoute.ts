import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Get /lostLead");
});

router.post("/", (req, res) => {
  const { dados } = req.body;

  // Chama controller
  res.sendStatus(200);
});

export default router;
