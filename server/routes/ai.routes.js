
const express = require("express");

const {
  createNotes,
  askQuestion
} = require("../controllers/ai.controller");

const router = express.Router();

router.post("/notes", createNotes);
router.post("/chat", askQuestion);

module.exports = router;
