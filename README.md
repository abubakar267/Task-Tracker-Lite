# Task-Tracker-Lite
A MERN Stack web application that allows users to sign up, log in, and manage their personal tasks.
This project was built as part of the MERN Internship Assessment and includes authentication, task management and overdue task rules.


Features
Backend (Express + MongoDB)
1)User Authentication with JWT.
2)Password hashing using bcrypt.
3)Task Management API:
    Add, view, update, and fetch overdue tasks.

*Rule: Tasks cannot be marked as completed if their due date is in the future.(implemented)

Endpoints:

POST /tasks – Add task (only for logged-in users)
GET /tasks – Fetch logged-in user's tasks
PATCH /tasks/:id – Update task status or description
GET /tasks/overdue – Fetch overdue tasks


Frontend (React.js)

Authentication Pages: 
Signup & Login.

Dashboard:
Displays user's tasks with:
"Due in X days"
"Overdue by Y days"
Highlights overdue tasks (5+ days) in red.

Task Actions:
Add new tasks.
Update task status,title and description aswell as due date if user makes a mistake.


Tech Stack
Frontend: React.js, CSS
Backend: Node.js, Express.js
Database: MongoDB
Authentication: JWT, bcrypt


Installation & Setup
Clone the repository
git clone https://github.com/your-username/task-tracker-lite.git
cd task-tracker-lite

Backend Setup
cd backend
npm install
npm run dev



Frontend Setup
cd frontend
npm install
npm start

Environment Variables
Create a .env file in /backend with the following variables:

contents of .env file example:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000


Note : 
1)Logout feature has also been implemented.
2)Overdue Button shows only those tasks that are overdue.
3)The app is not responsive for mobile phones as I needed more time for that.



THANKYOU. :)