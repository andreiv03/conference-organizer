import { useEffect, useState } from "react";

import "../styles/index.css";
import "../styles/components/author.css";

const Author = () => {
	const [authors, setAuthors] = useState([]);
	const [conferences, setConferences] = useState([]);
	const [selectedAuthor, setSelectedAuthor] = useState("");
	const [selectedConference, setSelectedConference] = useState("");
	const [articleName, setArticleName] = useState("");
	const [articleFeedbacks, setArticleFeedbacks] = useState([]);
	const [selectedArticle, setSelectedArticle] = useState("");
	const [articleNewName, setArticleNewName] = useState("");

	useEffect(() => {
		const getAuthors = async () => {
			try {
				const response = await fetch("http://localhost:8000/api/users/author");
				const authors = await response.json();
				setAuthors(authors);
			} catch (error) {
				console.error(error);
			}
		};

		const getConferences = async () => {
			try {
				const response = await fetch("http://localhost:8000/api/conferences");
				const conferences = await response.json();
				setConferences(conferences);
			} catch (error) {
				console.error(error);
			}
		};

		getAuthors();
		getConferences();
	}, []);

	useEffect(() => {
		if (!selectedAuthor) return setArticleFeedbacks([]);

		const getArticleFeedbacks = async () => {
			try {
				const response = await fetch("http://localhost:8000/api/articles");
				const articles = await response.json();
				setArticleFeedbacks(articles.filter((article) => article.authorId == selectedAuthor));
			} catch (error) {
				console.error(error);
			}
		};

		getArticleFeedbacks();
	}, [selectedAuthor]);

	const createArticle = async () => {
		try {
			if (!selectedAuthor) return alert("Select an author!");
			if (!selectedConference) return alert("Select a conference!");
			if (!articleName) return alert("Enter the article name!");

			const response = await fetch("http://localhost:8000/api/articles/create", {
				body: JSON.stringify({
					authorId: selectedAuthor,
					conferenceId: selectedConference,
					articleName: articleName,
					status: "PENDING",
				}),
				headers: { "Content-Type": "application/json" },
				method: "POST",
			});

			setSelectedAuthor("");
			setSelectedConference("");
			setArticleName("");

			alert(await response.text());
		} catch (error) {
			console.error(error);
		}
	};

	const updateArticle = async () => {
		try {
			if (!selectedArticle) return alert("Select an article!");
			if (!articleNewName) return alert("Enter the article new name!");

			const response = await fetch("http://localhost:8000/api/articles/update", {
				body: JSON.stringify({
					id: selectedArticle,
					articleName: articleNewName,
				}),
				headers: { "Content-Type": "application/json" },
				method: "PUT",
			});

			await fetch("http://localhost:8000/api/articles/delete", {
				body: JSON.stringify({
					id: selectedArticle,
				}),
				headers: { "Content-Type": "application/json" },
				method: "DELETE",
			});

			setSelectedAuthor("");
			setSelectedConference("");
			setArticleName("");
			setArticleFeedbacks([]);
			setSelectedArticle("");
			setArticleNewName("");

			alert(await response.text());
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="author_content">
			<h1>Author</h1>

			<div className="fields">
				<div className="field">
					<select
						id="author"
						onChange={(event) => setSelectedAuthor(event.target.value)}
						value={selectedAuthor}
					>
						<option value="">Select an author</option>
						{authors.map((author) => (
							<option key={author.id} value={author.id}>
								{author.name}
							</option>
						))}
					</select>
				</div>

				<div className="field">
					<select
						id="conference"
						onChange={(event) => setSelectedConference(event.target.value)}
						value={selectedConference}
					>
						<option value="">Select a conference</option>
						{conferences.map((conference) => (
							<option key={conference.id} value={conference.id}>
								{conference.name}
							</option>
						))}
					</select>
				</div>

				<div className="field">
					<label htmlFor="articleName">Article name</label>
					<input
						id="articleName"
						onChange={(event) => setArticleName(event.target.value)}
						type="text"
						value={articleName}
					/>
				</div>

				<button onClick={createArticle}>Create article</button>

				{articleFeedbacks.length > 0 ? (
					<>
						<h2>Feedbacks</h2>

						<div className="field">
							<select
								id="articleFeedback"
								onChange={(event) => setSelectedArticle(event.target.value)}
								value={selectedArticle}
							>
								<option value="">Select a feedback</option>
								{articleFeedbacks.map((article) => (
									<option key={article.id} value={article.id}>
										{article.feedback}
									</option>
								))}
							</select>
						</div>

						{selectedArticle ? (
							<>
								<div className="field">
									<label htmlFor="articleNewName">Article new name</label>
									<input
										id="articleNewName"
										onChange={(event) => setArticleNewName(event.target.value)}
										type="text"
										value={articleNewName}
									/>
								</div>
								<button onClick={updateArticle}>Update article</button>
							</>
						) : null}
					</>
				) : null}
			</div>
		</div>
	);
};

export default Author;
