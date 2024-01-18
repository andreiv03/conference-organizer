const cors = require("cors");
const express = require("express");
const mysql = require("mysql");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "conference_organizer"
});

const queryPromise = (query, params) => {
	return new Promise((resolve, reject) => {
		db.query(query, params, (error, result) => {
			if (error) reject(error);
			resolve(result);
		});
	});
};

const createTableIfNotExists = (table, keys) => {
	const query = `CREATE TABLE IF NOT EXISTS ${table} (${keys})`;
	queryPromise(query, []);
};

app.post("/api/create-user", async (req, res) => {
	try {
		const usersTableKeys =
			"id INT AUTO_INCREMENT PRIMARY KEY, type VARCHAR(255), name VARCHAR(255)";
		createTableIfNotExists("users", usersTableKeys);

		const type = req.body.type;
		const name = req.body.name;

		const checkIfUserExistsQuery = "SELECT * FROM users WHERE name = ?";
		const users = await queryPromise(checkIfUserExistsQuery, [name]);
		if (users.length > 0) return res.send("User already exists!");

		const createNewUserQuery = "INSERT INTO users (type, name) VALUES (?, ?)";
		await queryPromise(createNewUserQuery, [type, name]);

		res.send("User successfully created!");
	} catch (error) {
		console.error(error);
	}
});

app.post("/api/create-conference", async (req, res) => {
	try {
		const conferencesTableKeys =
			"id INT AUTO_INCREMENT PRIMARY KEY, organizerId INT, name VARCHAR(255)";
		createTableIfNotExists("conferences", conferencesTableKeys);

		const conferenceReviewersTableKeys =
			"conferenceId INT, reviewerId INT, FOREIGN KEY (conferenceId) REFERENCES conferences(id), FOREIGN KEY (reviewerId) REFERENCES users(id)";
		createTableIfNotExists("conference_reviewers", conferenceReviewersTableKeys);

		const conferenceName = req.body.conferenceName;
		const organizerId = req.body.organizerId;
		const reviewers = req.body.reviewers;

		const checkIfConferenceExistsQuery = "SELECT * FROM conferences WHERE name = ?";
		const conferences = await queryPromise(checkIfConferenceExistsQuery, [conferenceName]);
		if (conferences.length > 0) return res.send("Conference already exists!");

		const createNewConferenceQuery = "INSERT INTO conferences (organizerId, name) VALUES (?, ?)";
		const conference = await queryPromise(createNewConferenceQuery, [organizerId, conferenceName]);

		const conferenceId = conference.insertId;
		const reviewersValues = reviewers.map((reviewerId) => [conferenceId, reviewerId]);

		const createNewConferenceReviewersQuery =
			"INSERT INTO conference_reviewers (conferenceId, reviewerId) VALUES ?";
		await queryPromise(createNewConferenceReviewersQuery, [reviewersValues]);

		res.send("Conference successfully created!");
	} catch (error) {
		console.error(error);
	}
});

app.post("/api/create-article", async (req, res) => {
	try {
		const articlesTableKeys =
			"id INT AUTO_INCREMENT PRIMARY KEY, authorId INT, conferenceId INT, articleName VARCHAR(255), status VARCHAR(255), reviewerOne INT, reviewerTwo INT, FOREIGN KEY (authorId) REFERENCES users(id), FOREIGN KEY (conferenceId) REFERENCES conferences(id), FOREIGN KEY (reviewerOne) REFERENCES users(id), FOREIGN KEY (reviewerTwo) REFERENCES users(id)";
		createTableIfNotExists("articles", articlesTableKeys);

		const authorId = req.body.authorId;
		const conferenceId = req.body.conferenceId;
		const articleName = req.body.articleName;
		const status = req.body.status;

		const checkIfArticleExistsQuery = "SELECT * FROM articles WHERE articleName = ?";
		const articles = await queryPromise(checkIfArticleExistsQuery, [articleName]);
		if (articles.length > 0) return res.send("Article already exists!");

		const getConferenceReviewersQuery = "SELECT * FROM conference_reviewers WHERE conferenceId = ?";
		const conferenceReviewers = await queryPromise(getConferenceReviewersQuery, [conferenceId]);
		const reviewers = conferenceReviewers.map((reviewer) => reviewer.reviewerId);
		const reviewerOne = reviewers[Math.floor(Math.random() * reviewers.length)];
		const reviewerTwo = reviewers.filter((reviewer) => reviewer !== reviewerOne)[
			Math.floor(Math.random() * (reviewers.length - 1))
		];

		const createNewArticleQuery =
			"INSERT INTO articles (authorId, conferenceId, articleName, status, reviewerOne, reviewerTwo) VALUES (?, ?, ?, ?, ?, ?)";
		await queryPromise(createNewArticleQuery, [
			authorId,
			conferenceId,
			articleName,
			status,
			reviewerOne,
			reviewerTwo
		]);

		res.send("Article successfully created!");
	} catch (error) {
		console.error(error);
	}
});

app.put("/api/approve-article", async (req, res) => {
	try {
		const articleId = req.body.id;

		const updateArticleQuery = "UPDATE articles SET status = 'APPROVED' WHERE id = ?";
		await queryPromise(updateArticleQuery, [articleId]);

		res.send("Article successfully approved!");
	} catch (error) {
		console.error(error);
	}
});

app.post("/api/submit-feedback", async (req, res) => {
	try {
		const articleFeedbacksTableKeys =
			"id INT AUTO_INCREMENT PRIMARY KEY, articleId INT, authorId INT, feedback VARCHAR(255), FOREIGN KEY (articleId) REFERENCES articles(id), FOREIGN KEY (authorId) REFERENCES users(id)";
		createTableIfNotExists("article_feedbacks", articleFeedbacksTableKeys);

		const articleId = req.body.articleId;
		const authorId = req.body.authorId;
		const feedback = req.body.feedback;

		const createNewArticleFeedbackQuery =
			"INSERT INTO article_feedbacks (articleId, authorId, feedback) VALUES (?, ?, ?)";
		await queryPromise(createNewArticleFeedbackQuery, [articleId, authorId, feedback]);

		res.send("Feedback successfully submitted!");
	} catch (error) {
		console.error(error);
	}
});

app.put("/api/update-article", async (req, res) => {
	try {
		const articleId = req.body.id;
		const articleName = req.body.articleName;

		const updateArticleQuery = "UPDATE articles SET articleName = ? WHERE id = ?";
		await queryPromise(updateArticleQuery, [articleName, articleId]);

		res.send("Article successfully updated!");
	} catch (error) {
		console.error(error);
	}
});

app.delete("/api/delete-feedback", async (req, res) => {
	try {
		const feedbackId = req.body.id;

		const deleteFeedbackQuery = "DELETE FROM article_feedbacks WHERE id = ?";
		await queryPromise(deleteFeedbackQuery, [feedbackId]);

		res.send("Feedback successfully deleted!");
	} catch (error) {
		console.error(error);
	}
});

app.get("/api/get-authors", async (req, res) => {
	try {
		const usersTableKeys =
			"id INT AUTO_INCREMENT PRIMARY KEY, type VARCHAR(255), name VARCHAR(255)";
		createTableIfNotExists("users", usersTableKeys);

		const getAuthorsQuery = "SELECT * FROM users WHERE type = 'author'";
		const authors = await queryPromise(getAuthorsQuery, []);
		res.send(authors);
	} catch (error) {
		console.error(error);
	}
});

app.get("/api/get-organizers", async (req, res) => {
	try {
		const usersTableKeys =
			"id INT AUTO_INCREMENT PRIMARY KEY, type VARCHAR(255), name VARCHAR(255)";
		createTableIfNotExists("users", usersTableKeys);

		const getOrganizersQuery = "SELECT * FROM users WHERE type = 'organizer'";
		const organizers = await queryPromise(getOrganizersQuery, []);
		res.send(organizers);
	} catch (error) {
		console.error(error);
	}
});

app.get("/api/get-reviewers", async (req, res) => {
	try {
		const usersTableKeys =
			"id INT AUTO_INCREMENT PRIMARY KEY, type VARCHAR(255), name VARCHAR(255)";
		createTableIfNotExists("users", usersTableKeys);

		const getReviewersQuery = "SELECT * FROM users WHERE type = 'reviewer'";
		const reviewers = await queryPromise(getReviewersQuery, []);
		res.send(reviewers);
	} catch (error) {
		console.error(error);
	}
});

app.get("/api/get-conferences", async (req, res) => {
	try {
		const conferencesTableKeys =
			"id INT AUTO_INCREMENT PRIMARY KEY, organizerId INT, name VARCHAR(255)";
		createTableIfNotExists("conferences", conferencesTableKeys);

		const getConferencesQuery = "SELECT * FROM conferences";
		const conferences = await queryPromise(getConferencesQuery, []);
		res.send(conferences);
	} catch (error) {
		console.error(error);
	}
});

app.get("/api/get-articles", async (req, res) => {
	try {
		const articlesTableKeys =
			"id INT AUTO_INCREMENT PRIMARY KEY, authorId INT, conferenceId INT, articleName VARCHAR(255), status VARCHAR(255), reviewerOne INT, reviewerTwo INT, FOREIGN KEY (authorId) REFERENCES users(id), FOREIGN KEY (conferenceId) REFERENCES conferences(id), FOREIGN KEY (reviewerOne) REFERENCES users(id), FOREIGN KEY (reviewerTwo) REFERENCES users(id)";
		createTableIfNotExists("articles", articlesTableKeys);

		const getArticlesQuery = "SELECT * FROM articles";
		const articles = await queryPromise(getArticlesQuery, []);
		res.send(articles);
	} catch (error) {
		console.error(error);
	}
});

app.get("/api/get-article-feedbacks", async (req, res) => {
	try {
		const articleFeedbacksTableKeys =
			"id INT AUTO_INCREMENT PRIMARY KEY, articleId INT, authorId INT, feedback VARCHAR(255), FOREIGN KEY (articleId) REFERENCES articles(id), FOREIGN KEY (authorId) REFERENCES users(id)";
		createTableIfNotExists("article_feedbacks", articleFeedbacksTableKeys);

		const getArticleFeedbacksQuery = "SELECT * FROM article_feedbacks";
		const articleFeedbacks = await queryPromise(getArticleFeedbacksQuery, []);
		res.send(articleFeedbacks);
	} catch (error) {
		console.error(error);
	}
});

app.listen(8000, () => {
	console.log("Server is running on port 8000.");
});
