# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application. You’ll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

### Technologies and Techniques

- Node.js
  - Built and configured the server environment
  - Handled requests/responses via core modules
  - Managed server startup on a dedicated port
- Express.js
  - Implemented routing for different endpoints
  - Used middleware for request parsing, error handling, and logging
  - Created modular route handlers for cleaner architecture
- Mongoose + MongoDB
  - CDesigned schemas and models to define data structure
  - Connected Node.js to MongoDB using Mongoose for seamless data operations
  - Leveraged built-in validation and schema methods for data integrity
- Error Handling
  - Implemented centralized error-handling middleware to standardize server responses
  - Used custom error classes to return meaningful HTTP status codes (e.g., 400 for bad requests, 404 for not found, 500 for server errors)
  - Ensured error messages were user-friendly for the client while keeping detailed logs for developers

**Final Project**

- [Link to live project](https://jraebowen.github.io/se_project_react/)
- Recorded overview of project: (To Be Updated)
