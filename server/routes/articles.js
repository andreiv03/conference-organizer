import express from "express";
import { query } from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const articles = await query("SELECT * FROM articles");
		res.json(articles);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

router.post("/create", async (req, res) => {
	try {
		const { authorId, conferenceId, articleName, status } = req.body;

		const articles = await query("SELECT * FROM articles WHERE articleName = ?", [articleName]);
		if (articles.length > 0) {
			return res.status(400).json({ message: "Article already exists." });
		}

		const reviewers = await query(
			"SELECT reviewerId FROM conference_reviewers WHERE conferenceId = ?",
			[conferenceId],
		);

		if (reviewers.length < 2) {
			return res.status(400).json({ message: "Not enough reviewers available." });
		}

		const shuffledReviewers = reviewers
			.map((reviewer) => reviewer.reviewerId)
			.sort(() => 0.5 - Math.random());
		const [reviewerOne, reviewerTwo] = shuffledReviewers.slice(0, 2);

		const article = await query(
			"INSERT INTO articles (authorId, conferenceId, articleName, status, reviewerOne, reviewerTwo) VALUES (?, ?, ?, ?, ?, ?)",
			[authorId, conferenceId, articleName, status, reviewerOne, reviewerTwo],
		);

		res.json({ message: "Article successfully created.", articleId: article.insertId });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

router.put("/update", async (req, res) => {
	try {
		const { articleId, articleName } = req.body;
		await query("UPDATE articles SET articleName = ? WHERE id = ?", [articleName, articleId]);
		res.json({ message: "Article successfully updated." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

router.put("/approve", async (req, res) => {
	try {
		const { articleId } = req.body;
		await query("UPDATE articles SET status = 'APPROVED' WHERE id = ?", [articleId]);
		res.json({ message: "Article successfully approved." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

export default router;
