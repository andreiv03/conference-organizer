import dotenv from "dotenv";
import fs from "fs/promises";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	multipleStatements: true,
});

export const initializeDatabase = async () => {
	try {
		const schemaPath = path.join(__dirname, "schema.sql");
		let sql = await fs.readFile(schemaPath, "utf8");
		sql = sql.replace(/your_db_name/g, process.env.DB_NAME);

		const connection = await pool.getConnection();
		await connection.query(sql);
		connection.release();

		console.log("Database initialized successfully.");
	} catch (error) {
		console.error(error);
	}
};

export const query = async (sql, params = []) => {
	try {
		await pool.query(`USE \`${process.env.DB_NAME}\`;`);
		const [rows] = await pool.execute(sql, params);
		return rows;
	} catch (error) {
		console.error(error);
	}
};

export default pool;
