import { useEffect, useState } from "react";
import "../styles/components/organizer.css";

export default function Organizer() {
	const [organizers, setOrganizers] = useState([]);
	const [reviewers, setReviewers] = useState([]);
	const [articles, setArticles] = useState([]);
	const [selectedOrganizer, setSelectedOrganizer] = useState("");
	const [conferenceName, setConferenceName] = useState("");
	const [selectedReviewers, setSelectedReviewers] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [organizersResponse, reviewersResponse, articlesResponse] = await Promise.all([
					fetch("http://localhost:8000/api/users/organizer"),
					fetch("http://localhost:8000/api/users/reviewer"),
					fetch("http://localhost:8000/api/articles"),
				]);

				setOrganizers(await organizersResponse.json());
				setReviewers(await reviewersResponse.json());
				setArticles(await articlesResponse.json());
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, []);

	const toggleReviewerSelection = (id) => {
		setSelectedReviewers((prev) =>
			prev.includes(id) ? prev.filter((reviewer) => reviewer !== id) : [...prev, id],
		);
	};

	const createConference = async () => {
		if (!selectedOrganizer) {
			return alert("Select an organizer.");
		}

		if (!conferenceName) {
			return alert("Enter a conference name.");
		}

		if (selectedReviewers.length < 2) {
			return alert("Select at least two reviewers.");
		}

		try {
			const response = await fetch("http://localhost:8000/api/conferences/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					organizerId: selectedOrganizer,
					conferenceName: conferenceName,
					reviewers: selectedReviewers,
				}),
			});
			const data = await response.json();

			setSelectedOrganizer("");
			setConferenceName("");
			setSelectedReviewers([]);

			alert(data.message);
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
								onClick={() => toggleReviewerSelection(reviewer.id)}
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
}
