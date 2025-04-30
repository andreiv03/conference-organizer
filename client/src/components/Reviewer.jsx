import { useEffect, useState } from "react";
import "../styles/components/reviewer.css";

export default function Reviewer() {
	const [reviewers, setReviewers] = useState([]);
	const [selectedReviewer, setSelectedReviewer] = useState("");
	const [articles, setArticles] = useState([]);
	const [selectedArticleId, setSelectedArticleId] = useState("");
	const [feedback, setFeedback] = useState("");

	useEffect(() => {
		const fetchReviewers = async () => {
			try {
				const response = await fetch("http://localhost:8000/api/users/reviewer");
				const data = await response.json();
				setReviewers(data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchReviewers();
	}, []);

	useEffect(() => {
		if (!selectedReviewer) {
			return setArticles([]);
		}

		const fetchArticles = async () => {
			try {
				const response = await fetch("http://localhost:8000/api/articles");
				const data = await response.json();

				const filtered = data.filter(
					(article) =>
						(article.reviewerOne == selectedReviewer || article.reviewerTwo == selectedReviewer) &&
						article.status === "PENDING",
				);

				setArticles(filtered);
			} catch (error) {
				console.error(error);
			}
		};

		fetchArticles();
	}, [selectedReviewer]);

	const approveArticle = async (articleId) => {
		try {
			const response = await fetch("http://localhost:8000/api/articles/approve", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ articleId }),
			});
			const data = await response.json();

			setArticles((prev) => prev.filter((article) => article.id !== articleId));
			alert(data.message);
		} catch (error) {
			console.error(error);
		}
	};

	const submitFeedback = async () => {
		if (!feedback) {
			return alert("Enter feedback.");
		}

		const article = articles.find((article) => article.id == selectedArticleId);
		if (!article) {
			return alert("Invalid article selected.");
		}

		try {
			const response = await fetch("http://localhost:8000/api/feedback/submit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					articleId: article.id,
					authorId: article.authorId,
					feedback,
				}),
			});
			const data = await response.json();

			setSelectedReviewer("");
			setSelectedArticleId("");
			setFeedback("");

			alert(data.message);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="reviewer_content">
			<h1>Reviewer</h1>

			<div className="fields">
				<div className="field">
					<select
						id="reviewer"
						onChange={(event) => setSelectedReviewer(event.target.value)}
						value={selectedReviewer}
					>
						<option value="">Select a reviewer</option>
						{reviewers.map((reviewer) => (
							<option key={reviewer.id} value={reviewer.id}>
								{reviewer.name}
							</option>
						))}
					</select>
				</div>

				{articles.length > 0 ? (
					<>
						<div className="field">
							<select
								id="reviewerArticle"
								onChange={(event) => setSelectedArticleId(event.target.value)}
								value={selectedArticleId}
							>
								<option value="">Select an article</option>
								{articles.map((article) => (
									<option key={article.id} value={article.id}>
										{article.articleName}
									</option>
								))}
							</select>
						</div>

						{selectedArticleId ? (
							<>
								<div className="field">
									<label htmlFor="feedback">Feedback</label>
									<input
										id="feedback"
										onChange={(event) => setFeedback(event.target.value)}
										type="text"
										value={feedback}
									/>
								</div>
								<button onClick={submitFeedback}>Submit feedback</button>
							</>
						) : null}
					</>
				) : null}
			</div>

			<div className="articles">
				{articles.length > 0 ? <h2>Articles</h2> : null}

				{articles.map((article) => (
					<div className="article" key={article.id}>
						<h3 className="name">{article.articleName}</h3>
						<button onClick={() => approveArticle(article.id)}>Approve</button>
					</div>
				))}
			</div>
		</div>
	);
}
