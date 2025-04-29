import { useEffect, useState } from "react";

import "../styles/index.css";
import "../styles/components/organizer.css";

const Organizer = () => {
	const [organizers, setOrganizers] = useState([]);
	const [reviewers, setReviewers] = useState([]);
	const [articles, setArticles] = useState([]);
	const [selectedOrganizer, setSelectedOrganizer] = useState("");
	const [conferenceName, setConferenceName] = useState("");
	const [selectedReviewers, setSelectedReviewers] = useState([]);

	useEffect(() => {
		const getOrganizers = async () => {
			try {
				const response = await fetch("http://localhost:8000/api/users/organizer");
				const organizers = await response.json();
				setOrganizers(organizers);
			} catch (error) {
				console.error(error);
			}
		};

		const getReviewers = async () => {
			try {
				const response = await fetch("http://localhost:8000/api/users/reviewer");
				const reviewers = await response.json();
				setReviewers(reviewers);
			} catch (error) {
				console.error(error);
			}
		};

		const getArticles = async () => {
			try {
				const response = await fetch("http://localhost:8000/api/articles");
				const articles = await response.json();
				setArticles(articles);
			} catch (error) {
				console.error(error);
			}
		};

		getOrganizers();
		getReviewers();
		getArticles();
	}, []);

	const selectReviewer = (id) => {
		const index = selectedReviewers.indexOf(id);
		if (index === -1) return setSelectedReviewers([...selectedReviewers, id]);

		const newSelectedReviewers = [...selectedReviewers];
		newSelectedReviewers.splice(index, 1);
		setSelectedReviewers(newSelectedReviewers);
	};

	const createConference = async () => {
		try {
			if (!selectedOrganizer) return alert("Select an organizer!");
			if (!conferenceName) return alert("Enter a conference name!");
			if (selectedReviewers.length < 2) return alert("Select at least two reviewers!");

			const response = await fetch("http://localhost:8000/api/conferences/create", {
				body: JSON.stringify({
					organizerId: selectedOrganizer,
					conferenceName: conferenceName,
					reviewers: selectedReviewers,
				}),
				headers: { "Content-Type": "application/json" },
				method: "POST",
			});

			setSelectedOrganizer("");
			setConferenceName("");
			setSelectedReviewers([]);

			alert(await response.text());
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="organizer_content">
			<h1>Organizer</h1>

			<div className="fields">
				<div className="field">
					<select
						id="organizer"
						onChange={(event) => setSelectedOrganizer(event.target.value)}
						value={selectedOrganizer}
					>
						<option value="">Select an organizer</option>
						{organizers.map((organizer) => (
							<option key={organizer.id} value={organizer.id}>
								{organizer.name}
							</option>
						))}
					</select>
				</div>

				<div className="field">
					<label htmlFor="conferenceName">Conference name</label>
					<input
						id="conferenceName"
						onChange={(event) => setConferenceName(event.target.value)}
						type="text"
						value={conferenceName}
					/>
				</div>

				<div className="field">
					<label>Reviewers</label>
					<div className="reviewers">
						{reviewers.map((reviewer) => (
							<div
								key={reviewer.id}
								className={`reviewer ${selectedReviewers.includes(reviewer.id) ? "selected" : ""}`}
								onClick={() => selectReviewer(reviewer.id)}
							>
								{reviewer.name}
							</div>
						))}
					</div>
				</div>

				<button onClick={createConference}>Create conference</button>
			</div>

			<div className="articles">
				{articles.length > 0 ? <h2>Articles</h2> : null}

				{articles.map((article) => (
					<div className="article" key={article.id}>
						<h3 className="name">{article.articleName}</h3>
						<div className="status">Status: {article.status}</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Organizer;
