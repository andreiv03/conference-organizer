import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { initializeDatabase } from "./config/db.js";
import userRoutes from "./routes/users.js";
import conferenceRoutes from "./routes/conferences.js";
import articleRoutes from "./routes/articles.js";
import feedbackRoutes from "./routes/feedback.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/conferences", conferenceRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/feedback", feedbackRoutes);

/* eslint-disable no-unused-vars */
app.use((error, req, res, next) => {
	console.error(error);
	res.status(500).json({ message: "Internal Server Error" });
});
/* eslint-enable no-unused-vars */

initializeDatabase().then(() => {
	const PORT = process.env.PORT || 8000;
	app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
