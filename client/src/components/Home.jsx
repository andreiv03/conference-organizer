import { useState } from "react";

import "../styles/index.css";
import "../styles/components/home.css";

const Home = () => {
	const [authorName, setAuthorName] = useState("");
	const [organizerName, setOrganizerName] = useState("");
	const [reviewerName, setReviewerName] = useState("");

	const createUser = async (event, type, name) => {
		event.preventDefault();

		try {
			if (!name) return alert("Enter a name!");

			const response = await fetch("http://localhost:8000/api/create-user", {
				body: JSON.stringify({ type, name }),
				headers: { "Content-Type": "application/json" },
				method: "POST"
			});

			if (type === "author") setAuthorName("");
			if (type === "organizer") setOrganizerName("");
			if (type === "reviewer") setReviewerName("");

			alert(await response.text());
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="home_content">
			<h1>Home</h1>

			<div className="fields">
				<div className="field">
					<label htmlFor="authorName">Author name</label>
					<input
						id="authorName"
						onChange={(event) => setAuthorName(event.target.value)}
						type="text"
						value={authorName}
					/>
					<button onClick={(event) => createUser(event, "author", authorName)}>
						Create author
					</button>
				</div>

				<div className="field">
					<label htmlFor="organizerName">Organizer name</label>
					<input
						id="organizerName"
						onChange={(event) => setOrganizerName(event.target.value)}
						type="text"
						value={organizerName}
					/>
					<button onClick={(event) => createUser(event, "organizer", organizerName)}>
						Create organizer
					</button>
				</div>

				<div className="field">
					<label htmlFor="reviewerName">Reviewer name</label>
					<input
						id="reviewerName"
						onChange={(event) => setReviewerName(event.target.value)}
						type="text"
						value={reviewerName}
					/>
					<button onClick={(event) => createUser(event, "reviewer", reviewerName)}>
						Create reviewer
					</button>
				</div>
			</div>
		</div>
	);
};

export default Home;
