# Expense Tracking Platform

A full-stack expense tracking application built with Node.js, Express, MongoDB, and React.

## Features

- 🔐 **User Authentication** - Secure JWT-based authentication
- 💰 **Budget Management** - Set monthly budgets for different categories
- 💸 **Expense Tracking** - Record and categorize expenses
- 📊 **Visual Analytics** - Beautiful charts showing spending patterns
- 🚨 **Smart Alerts** - Get notified when you exceed budget limits
- 🎨 **Modern UI** - Glassmorphism design with smooth animations

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-secret-key-change-this-in-production-12345
JWT_EXPIRE=7d
```

### Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### Start MongoDB

Make sure MongoDB is running on your system:
```bash
mongod
```

### Start Backend Server

```bash
cd backend
npm start
```

The API will be available at `http://localhost:5000`

### Start Frontend Server

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

1. **Register** - Create a new account
2. **Create Categories** - Set up expense categories (Food, Transport, etc.)
3. **Set Budgets** - Define monthly spending limits for each category
4. **Track Expenses** - Add your daily expenses
5. **Monitor** - View dashboard for insights and alerts

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Budgets
- `POST /api/budgets` - Set budget
- `GET /api/budgets?month=YYYY-MM` - Get budgets
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Expenses
- `POST /api/expenses` - Add expense
- `GET /api/expenses?month=YYYY-MM&categoryId=xxx` - Get expenses
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/summary?month=YYYY-MM` - Get analytics
- `GET /api/expenses/categories` - Get categories
- `POST /api/expenses/categories` - Create category

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18
- Vite
- React Router
- Chart.js
- Axios

## Project Structure

```
expenceTracking/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Screenshots

(Add screenshots of your application here)

## License

MIT

## Author

Your Name
