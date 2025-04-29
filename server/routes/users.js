import express from "express";
import { query } from "../config/db.js";

const router = express.Router();

router.get("/:type", async (req, res) => {
	try {
		const { type } = req.params;
		const users = await query("SELECT * FROM users WHERE type = ?", [type]);
		res.json(users);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

router.post("/create", async (req, res) => {
	try {
		const { type, name } = req.body;

		const users = await query("SELECT * FROM users WHERE name = ?", [name]);
		if (users.length > 0) {
			return res.status(400).json({ message: "User already exists." });
		}

		await query("INSERT INTO users (type, name) VALUES (?, ?)", [type, name]);
		res.json({ message: "User successfully created." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

export default router;
