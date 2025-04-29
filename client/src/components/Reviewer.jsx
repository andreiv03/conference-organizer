import { useEffect, useState } from "react";

import "../styles/index.css";
import "../styles/components/reviewer.css";

const Reviewer = () => {
	const [reviewers, setReviewers] = useState([]);
	const [selectedReviewer, setSelectedReviewer] = useState("");
	const [reviewerArticles, setReviewerArticles] = useState([]);
	const [selectedReviewerArticle, setSelectedReviewerArticle] = useState("");
	const [feedback, setFeedback] = useState("");

	useEffect(() => {
		const getReviewers = async () => {
			try {
				const response = await fetch("http://localhost:8000/api/users/reviewer");
				const reviewers = await response.json();
				setReviewers(reviewers);
			} catch (error) {
				console.error(error);
			}
		};

		getReviewers();
	}, []);

	useEffect(() => {
		if (!selectedReviewer) return setReviewerArticles([]);

		const getReviewerArticles = async () => {
			try {
				const response = await fetch("http://localhost:8000/api/articles");
				const articles = await response.json();
				setReviewerArticles(
					articles.filter(
						(article) =>
							(article.reviewerOne == selectedReviewer ||
								article.reviewerTwo == selectedReviewer) &&
							article.status === "PENDING",
					),
				);
			} catch (error) {
				console.error(error);
			}
		};

		getReviewerArticles();
	}, [selectedReviewer]);

	const approveArticle = async (id) => {
		try {
			const response = await fetch("http://localhost:8000/api/articles/approve", {
				body: JSON.stringify({ id }),
				headers: { "Content-Type": "application/json" },
				method: "PUT",
			});

			alert(await response.text());
		} catch (error) {
			console.error(error);
		}
	};

	const submitFeedback = async () => {
		try {
			if (!feedback) return alert("Enter feedback!");

			const response = await fetch("http://localhost:8000/api/feedback/submit", {
				body: JSON.stringify({
					articleId: selectedReviewerArticle,
					authorId: reviewerArticles.find((article) => article.id == selectedReviewerArticle)
						.authorId,
					feedback,
				}),
				headers: { "Content-Type": "application/json" },
				method: "POST",
			});

			setSelectedReviewer("");
			setSelectedReviewerArticle("");
			setFeedback("");

			alert(await response.text());
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

				{reviewerArticles.length > 0 ? (
					<>
						<div className="field">
							<select
								id="reviewerArticle"
								onChange={(event) => setSelectedReviewerArticle(event.target.value)}
								value={selectedReviewerArticle}
							>
								<option value="">Select an article</option>
								{reviewerArticles.map((article) => (
									<option key={article.id} value={article.id}>
										{article.articleName}
									</option>
								))}
							</select>
						</div>

						{selectedReviewerArticle ? (
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
				{reviewerArticles.length > 0 ? <h2>Articles</h2> : null}

				{reviewerArticles.map((article) => (
					<div className="article" key={article.id}>
						<h3 className="name">{article.articleName}</h3>
						<button onClick={() => approveArticle(article.id)}>Approve</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default Reviewer;
