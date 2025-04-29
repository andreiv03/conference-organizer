import express from "express";
import { query } from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const conferences = await query("SELECT * FROM conferences");
		res.json(conferences);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

router.post("/create", async (req, res) => {
	try {
		const { organizerId, conferenceName, reviewers } = req.body;

		const conferences = await query("SELECT * FROM conferences WHERE name = ?", [conferenceName]);
		if (conferences.length > 0) {
			return res.status(400).json({ message: "Conference already exists." });
		}

		const conference = await query("INSERT INTO conferences (organizerId, name) VALUES (?, ?)", [
			organizerId,
			conferenceName,
		]);

		const values = reviewers.map(() => "(?, ?)").join(", ");
		const conferenceId = conference.insertId;

		await query(
			`INSERT INTO conference_reviewers (conferenceId, reviewerId) VALUES ${values}`,
			reviewers.flatMap((reviewer) => [conferenceId, reviewer]),
		);

		res.json({ message: "Conference successfully created." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

export default router;
