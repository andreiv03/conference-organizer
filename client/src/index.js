import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import "./styles/index.css";
import Home from "./components/Home.jsx";
import Author from "./components/Author.jsx";
import Organizer from "./components/Organizer.jsx";
import Reviewer from "./components/Reviewer.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<div className="header">
				<Link to="/">Home</Link>
				<Link to="/author">Author</Link>
				<Link to="/organizer">Organizer</Link>
				<Link to="/reviewer">Reviewer</Link>
			</div>

			<Routes>
				<Route path="/" element={<Home />} />

				<Route path="/author" element={<Author />} />

				<Route path="/organizer" element={<Organizer />} />

				<Route path="/reviewer" element={<Reviewer />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
);
