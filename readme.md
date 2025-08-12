Web Application Builder Backend
This project is the backend for a web application builder. It leverages the Groq API to analyze a user's project description, determine the appropriate technology stack (React or Node.js), and provide intelligent chat-based assistance throughout the development process.

Features
Project Type Analysis: Automatically determines if a project should be built with React or Node.js based on a user's prompt.

Template Generation: Returns initial project prompts and UI prompts tailored to the chosen technology.

Conversational AI: Provides a chat interface for real-time, context-aware assistance using a language model.

CORS Enabled: Configured for local development with the frontend running on http://localhost:3000.

Technologies Used
Node.js: The JavaScript runtime environment.

Express.js: A fast, unopinionated, minimalist web framework for Node.js.

Groq SDK: The official SDK for interacting with the Groq API.

dotenv: A zero-dependency module that loads environment variables from a .env file.

cors: A Node.js package for providing a Connect/Express middleware that can be used to enable Cross-Origin Resource Sharing.

Prerequisites
Before running this backend, you need to have the following installed:

Node.js (LTS version recommended)

A Groq API Key

Getting Started
Follow these steps to set up and run the project locally.

1. Clone the repository
git clone https://github.com/kashish00208/builderBackend
cd <your-project-directory>

2. Install dependencies
Use npm or yarn to install all the required packages:

npm install
# or
yarn install

3. Configure environment variables
Create a file named .env in the root of your project directory and add your Groq API key:

GROQ_API_KEY="your-groq-api-key-here"

4. Provide prompts and default content
The code references files in ./prompts.js and a defalut directory. You will need to create these files and populate them with your system prompts and base content for React and Node.js projects.

5. Run the server
Start the server using the following command:

npm start
# or
node index.js

The server will be running on port 8080.

Server is running on 8080

