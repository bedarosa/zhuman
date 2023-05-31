import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Get /messages");
});

export default router;
