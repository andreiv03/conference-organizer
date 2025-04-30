import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import Home from "./components/home.jsx";
import Author from "./components/author.jsx";
import Organizer from "./components/organizer.jsx";
import Reviewer from "./components/reviewer.jsx";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
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
