import express from "express";
import { query } from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const feedbacks = await query("SELECT * FROM article_feedbacks");
		res.json(feedbacks);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

router.post("/submit", async (req, res) => {
	try {
		const { articleId, authorId, feedback } = req.body;

		await query("INSERT INTO article_feedbacks (articleId, authorId, feedback) VALUES (?, ?, ?)", [
			articleId,
			authorId,
			feedback,
		]);

		res.json({ message: "Feedback successfully submitted." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

router.delete("/delete", async (req, res) => {
	try {
		const { feedbackId } = req.body;
		await query("DELETE FROM article_feedbacks WHERE id = ?", [feedbackId]);
		res.json({ message: "Feedback successfully deleted." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

export default router;
