import { useEffect, useState } from "react";
import "../styles/components/author.css";

export default function Author() {
	const [authors, setAuthors] = useState([]);
	const [conferences, setConferences] = useState([]);
	const [selectedAuthor, setSelectedAuthor] = useState("");
	const [selectedConference, setSelectedConference] = useState("");
	const [articleName, setArticleName] = useState("");
	const [feedbacks, setFeedbacks] = useState([]);
	const [selectedArticleId, setSelectedArticleId] = useState("");
	const [newArticleName, setNewArticleName] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [authorsResponse, conferencesResponse] = await Promise.all([
					fetch("http://localhost:8000/api/users/author"),
					fetch("http://localhost:8000/api/conferences"),
				]);

				setAuthors(await authorsResponse.json());
				setConferences(await conferencesResponse.json());
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (!selectedAuthor) {
			return setFeedbacks([]);
		}

		const fetchFeedbacks = async () => {
			try {
				const response = await fetch("http://localhost:8000/api/feedback");
				const data = await response.json();
				setFeedbacks(data.filter((feedback) => feedback.authorId == selectedAuthor));
			} catch (error) {
				console.error(error);
			}
		};

		fetchFeedbacks();
	}, [selectedAuthor]);

	const createArticle = async () => {
		if (!selectedAuthor || !selectedConference || !articleName) {
			return alert("Fill in all fields to create an article.");
		}

		try {
			const response = await fetch("http://localhost:8000/api/articles/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					authorId: selectedAuthor,
					conferenceId: selectedConference,
					articleName: articleName,
					status: "PENDING",
				}),
			});
			const data = await response.json();

			setSelectedAuthor("");
			setSelectedConference("");
			setArticleName("");

			alert(data.message);
		} catch (error) {
			console.error(error);
		}
	};

	const updateArticle = async () => {
		if (!selectedArticleId) {
			return alert("Select an article.");
		}

		if (!newArticleName) {
			return alert("Enter the new article name.");
		}

		try {
			const response = await fetch("http://localhost:8000/api/articles/update", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					articleId: selectedArticleId,
					articleName: newArticleName,
				}),
			});
			const data = await response.json();

			await fetch("http://localhost:8000/api/feedback/delete", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					feedbackId: selectedArticleId,
				}),
			});

			setSelectedAuthor("");
			setSelectedConference("");
			setArticleName("");
			setFeedbacks([]);
			setSelectedArticleId("");
			setNewArticleName("");

			alert(data.message);
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

				{feedbacks.length > 0 ? (
					<>
						<h2>Feedbacks</h2>

						<div className="field">
							<select
								id="articleFeedback"
								onChange={(event) => setSelectedArticleId(event.target.value)}
								value={selectedArticleId}
							>
								<option value="">Select a feedback</option>
								{feedbacks.map((article) => (
									<option key={article.id} value={article.id}>
										{article.feedback}
									</option>
								))}
							</select>
						</div>

						{selectedArticleId ? (
							<>
								<div className="field">
									<label htmlFor="articleNewName">Article new name</label>
									<input
										id="articleNewName"
										onChange={(event) => setNewArticleName(event.target.value)}
										type="text"
										value={newArticleName}
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
}
