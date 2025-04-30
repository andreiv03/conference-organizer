# Conference Organizer

A collaborative **conference management system** built with React, Node.js, and MySQL. Designed to streamline the workflow between **organizers, reviewers, and authors** — from conference creation to article submission and peer review.

## ✨ Features

- **User Role Management** – Create users as:

  - Authors
  - Reviewers
  - Organizers

- **Conference Creation** – Organizers can create conferences and assign multiple reviewers.
- **Article Submission** – Authors submit articles to selected conferences.
- **Reviewer Actions** – Reviewers can approve articles and submit feedback.
- **Feedback Loop** – Authors receive feedback and can update articles.
- **Responsive UI** – Works seamlessly across devices.

## ⚡ Technology Stack

- **React (JavaScript)** – Interactive frontend components.
- **Node.js + Express** – RESTful backend API.
- **MySQL + mysql2** – Robust relational data storage.
- **CSS Modules** – Scoped component styling.
- **dotenv** – Secure environment variable management.

## ⚙️ Build & Installation

### Prerequisites

Before installing the project, ensure you have the following installed:

- **Node.js (16+)** – Required to run React.
- **npm** or **yarn** – To install dependencies and run scripts.
- **MySQL Server** – Make sure MySQL is installed and running.

### Installation Instructions

Follow these steps to clone, build, and run the conference organizer app:
```sh
# Clone the repository
git clone https://github.com/andreiv03/conference-organizer.git
cd conference-organizer

# Install backend dependencies
cd server
npm install

# Run the development server
npm run dev

# Set up environment variables inside `.env` file
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=conference_organizer

# Install frontend dependencies
cd ../client
npm install

# Build for production
npm run build

# Preview production build
npm run start
```
The app will be accessible at [http://localhost:3000](http://localhost:3000).

## 🤝 Contributing

Contributions are welcome! If you'd like to enhance the project, follow these steps:

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature-branch`)
3. **Commit** your changes (`git commit -m "feat: add new feature"`)
4. **Push** your changes (`git push origin feature-branch`)
5. Open a **Pull Request** 🚀

For suggestions or bug reports, feel free to open an issue with the appropriate label.

⭐ **If you find this project useful, consider giving it a star!** ⭐

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.
