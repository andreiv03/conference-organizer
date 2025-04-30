import { useState } from "react";
import "../styles/components/home.css";

const userTypes = ["author", "organizer", "reviewer"];

export default function Home() {
	const [form, setForm] = useState({
		author: "",
		organizer: "",
		reviewer: "",
	});

	const handleChange = (event) => {
		const { id, value } = event.target;
		setForm((prev) => ({ ...prev, [id]: value }));
	};

	const createUser = async (event, type) => {
		event.preventDefault();
		const name = form[type];

		if (!name) {
			return alert("Enter a name.");
		}

		try {
			const response = await fetch("http://localhost:8000/api/users/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ type, name }),
			});
			const data = await response.json();

			setForm((prev) => ({ ...prev, [type]: "" }));
			alert(data.message);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="home_content">
			<h1>Home</h1>
			<div className="fields">
				{userTypes.map((type) => (
					<div className="field" key={type}>
						<label htmlFor={type}>{`${type[0].toUpperCase()}${type.slice(1)} name`}</label>
						<input id={type} onChange={handleChange} type="text" value={form[type]} />
						<button onClick={(event) => createUser(event, type)}>Create {type}</button>
					</div>
				))}
			</div>
		</div>
	);
}
