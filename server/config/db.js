import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;

const pool = mysql.createPool({
	host: DB_HOST,
	port: DB_PORT,
	user: DB_USER,
	password: DB_PASS,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

export const initializeDatabase = async () => {
	try {
		const connection = await pool.getConnection();
		await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
		connection.release();

		const tableQueries = [
			`CREATE TABLE IF NOT EXISTS users (
				id INT AUTO_INCREMENT PRIMARY KEY,
				type VARCHAR(255) NOT NULL,
				name VARCHAR(255) NOT NULL UNIQUE
			)`,
			`CREATE TABLE IF NOT EXISTS conferences (
				id INT AUTO_INCREMENT PRIMARY KEY,
				organizerId INT NOT NULL,
				name VARCHAR(255) NOT NULL UNIQUE,
				FOREIGN KEY (organizerId) REFERENCES users(id) ON DELETE CASCADE
			)`,
			`CREATE TABLE IF NOT EXISTS conference_reviewers (
				conferenceId INT NOT NULL,
				reviewerId INT NOT NULL,
				PRIMARY KEY (conferenceId, reviewerId),
				FOREIGN KEY (conferenceId) REFERENCES conferences(id) ON DELETE CASCADE,
				FOREIGN KEY (reviewerId) REFERENCES users(id) ON DELETE CASCADE
			)`,
			`CREATE TABLE IF NOT EXISTS articles (
				id INT AUTO_INCREMENT PRIMARY KEY,
				authorId INT NOT NULL,
				conferenceId INT NOT NULL,
				articleName VARCHAR(255) NOT NULL UNIQUE,
				status VARCHAR(255) NOT NULL DEFAULT 'Pending',
				reviewerOne INT NOT NULL,
				reviewerTwo INT NOT NULL,
				FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (conferenceId) REFERENCES conferences(id) ON DELETE CASCADE,
				FOREIGN KEY (reviewerOne) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (reviewerTwo) REFERENCES users(id) ON DELETE CASCADE
			)`,
			`CREATE TABLE IF NOT EXISTS article_feedbacks (
				id INT AUTO_INCREMENT PRIMARY KEY,
				articleId INT NOT NULL,
				authorId INT NOT NULL,
				feedback TEXT NOT NULL,
				FOREIGN KEY (articleId) REFERENCES articles(id) ON DELETE CASCADE,
				FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
			)`,
		];

		await pool.query(`USE \`${DB_NAME}\`;`);
		for (const query of tableQueries) {
			await pool.query(query);
		}

		console.log("Database initialized successfully.");
	} catch (error) {
		console.error(error);
	}
};

export const query = async (sql, params) => {
	try {
		await pool.query(`USE \`${DB_NAME}\`;`);
		const [rows] = await pool.execute(sql, params);
		return rows;
	} catch (error) {
		console.error(error);
	}
};

export default pool;
