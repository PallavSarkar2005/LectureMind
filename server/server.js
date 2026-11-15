
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pdfRoutes = require("./routes/pdf.routes");
const aiRoutes = require("./routes/ai.routes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use("/api/pdf", pdfRoutes);
app.use("/api/ai", aiRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LectureMind backend is running!"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
