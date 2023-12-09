# not a Blog 💻

not a BLog is an anonymous blogging platform that allows users to share their thoughts, stories, and ideas without revealing their identity.

## Live Demo

### Explore the live version of not a Blog on [Render](https://notablog-pcd5.onrender.com/)

**Note:** The free hosting plan on Render might take a moment to launch initially.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Installation](#installation)
- [Technologies Used](#technologies-used)

## Features

- **User Dashboard:** Manage posts, comments, and settings.
- **User Authentication:** Secure account creation and login.
- **Responsive Design:** Seamless browsing on all devices.

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/AKKSHAAT/not-a-blog.git
```

```bash
# Change directory
cd not-a-blog
```

```bash
# Install dependencies
npm i
```

```bash
# Run the project
npm start
```

## connecting to the Database

You can change the Database URL in the `.env` file.

**Note:** The default URL is for a local mongoDB server [you will need mongoDB installed](https://www.mongodb.com/try/download/community) to use this

`.env`

```bash
DB_URL_ENV="mongodb://0.0.0.0:27017/"
```

## Technologies Used

- **Node.js:** A JavaScript runtime for server-side development.
- **Express:** A web application framework for Node.js used to build the backend of the application.
- **MongoDB:** A NoSQL database used to store and manage data.
- **EJS (Embedded JavaScript):** A simple templating language that generates HTML markup with plain JavaScript.
