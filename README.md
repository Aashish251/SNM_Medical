# 🏥 SNM Medical

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue)
![Express](https://img.shields.io/badge/Express.js-4.x-lightgrey)

<!-- ![License](https://img.shields.io/badge/License-MIT-yellow) -->

A comprehensive **SNM medical dispensary** built with modern web technologies. Features secure authentication, department management, duty chart tracking, and administrative reporting capabilities.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Database Setup](#️-database-setup)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based user authentication and authorization
- 👥 **User Management** - Registration, profile management, and role-based access
- 🏢 **Department Management** - Department, qualification, state, and city management
- 📊 **Admin Dashboard** - Comprehensive reporting and statistics
- 📋 **Duty Chart System** - Staff presence tracking and duty management
- 🔍 **Advanced Filtering** - Filter users, duty charts, and reports
- 🛡️ **Security First** - All database operations via stored procedures
- ⚡ **Performance Optimized** - HTTP caching and optimized queries
- 📱 **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

### Backend

- **Node.js** (v18+) - Runtime environment
- **Express.js** (v4.x) - Web framework
- **MySQL** (v8.0+) - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **Helmet** - Security middleware

### Frontend

- **React.js** / **Next.js** - UI framework
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation

### Development Tools

- **Visual Studio Code** - Code editor
- **MySQL Workbench** - Database management
- **Postman** - API testing
- **Git** - Version control
- **npm** - Package management

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v18+ LTS)
- [MySQL](https://dev.mysql.com/downloads/installer/) (v8.0+)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) (for database management)
- [Express.js](https://expressjs.com/) (v4.x)
- [Git](https://git-scm.com/downloads) (for version control)
- [GitHub Desktop](https://desktop.github.com/download/) — Free desktop client
- [Visual Studio Code](https://code.visualstudio.com/download) (recommended)
- [Postman](https://www.postman.com/downloads/) (for API testing)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Aashish251/SNM_Medical/tree/main
cd snm-medical-system
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration (see Configuration section)
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local with your API URL
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=snm_dispensary
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# API Configuration
API_BASE_URL=http://localhost:5000/api

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
REACT_APP_APP_NAME=SNM Medical System
```

## 🗄️ Database Setup

### 1. Create Database

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE IF NOT EXISTS snm_dispensary
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE snm_dispensary;
```

### 2. Import Tables and Stored Procedures

```bash
# Import the SQL file containing tables and stored procedures
mysql -u root -p snm_dispensary < database/procedures.sql
```

### 3. Verify Installation

```sql
-- Check tables
SHOW TABLES;

-- Check stored procedures
SHOW PROCEDURE STATUS WHERE Db = 'snm_dispensary';
```

## 🔗 API Endpoints

### Authentication

| Endpoint                    | Method | Description     | Auth Required |
| --------------------------- | ------ | --------------- | ------------- |
| `/api/auth/login`           | POST   | User login      | No            |
| `/api/auth/forgot-password` | POST   | Forgot password | No            |
| `/api/auth/reset-password`  | POST   | Reset password  | No            |

### Registration

| Endpoint                            | Method | Description                   | Auth Required |
| ----------------------------------- | ------ | ----------------------------- | ------------- |
| `/api/registration/register`        | POST   | Register new user             | No            |
| `/api/registration/check-email`     | POST   | Check if email exists         | No            |
| `/api/registration/dropdown-data`   | GET    | Get master data for dropdowns | No            |
| `/api/registration/cities/:stateId` | GET    | Get cities by state ID        | No            |

### Dashboard

| Endpoint                 | Method | Description              | Auth Required |
| ------------------------ | ------ | ------------------------ | ------------- |
| `/api/dashboard/profile` | GET    | Get user profile         | Yes           |
| `/api/dashboard/profile` | PUT    | Update user profile      | Yes           |
| `/api/dashboard/stats`   | GET    | Get dashboard statistics | Yes           |
| `/api/dashboard/summary` | GET    | Get admin summary        | Yes           |
| `/api/dashboard/users`   | GET    | Get filtered users       | Yes           |

### Duty Chart

| Endpoint                          | Method | Description               | Auth Required |
| --------------------------------- | ------ | ------------------------- | ------------- |
| `/api/dutychart/filter`           | GET    | Get filtered duty chart   | Yes           |
| `/api/dutychart/stats`            | GET    | Get duty chart statistics | Yes           |
| `/api/dutychart/presence/:userId` | PUT    | Update staff presence     | Yes           |

<!-- ## 📁 Project Structure

```
snm-medical-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── registrationController.js
│   │   ├── dashboardController.js
│   │   └── dutychartController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── rateLimiter.js
│   │   └── errorHandler.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── registration.js
│   │   ├── dashboard.js
│   │   └── dutychart.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── helpers.js
│   ├── database/
│   │   └── procedures.sql
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   └── .env.local.example
├── docs/
│   ├── API.md
│   └── DEPLOYMENT.md
├── README.md
└── LICENSE -->

````

## 🎯 Usage

### Development Mode

1. **Start MySQL Service**
   ```bash
   # Windows
   net start mysql80

   # macOS/Linux
   sudo systemctl start mysql
````

2. **Start Backend Server**

   ```bash
   cd backend
   npm run dev
   ```

   Server will start on `http://localhost:5000`

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   Application will open on `http://localhost:3000`

### Production Mode

```bash
# Build frontend
cd frontend
npm run build

# Start backend in production mode(new Terminal)
cd backend
npm start
```

### API Testing with Postman

Import the Postman collection from `docs/postman_collection.json` to test all API endpoints.

## 🔐 Security

- **Authentication**: JWT tokens with configurable expiration
- **Password Security**: bcrypt hashing with salt rounds
- **SQL Injection Prevention**: All database operations via stored procedures
- **Rate Limiting**: Configurable request rate limiting
- **CORS Protection**: Configured for specific origins
- **Helmet**: Security headers for Express.js
- **Environment Variables**: Sensitive data stored securely

## 🚨 Troubleshooting

### Common Issues

**1. MySQL Connection Error**

```bash
# Check if MySQL is running
# Windows: services.msc -> MySQL80
# Linux/Mac: sudo systemctl status mysql

# Verify connection details in .env file
# Test connection: mysql -u root -p
```

**2. Port Already in Use**

```bash
# Windows - Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env file
```

**3. Missing Stored Procedures**

```sql
-- Check if procedures exist
SHOW PROCEDURE STATUS WHERE Db = 'snm_dispensary';

-- Re-import if missing
mysql -u root -p snm_dispensary < database/procedures.sql
```

**4. JWT Token Issues**

```bash
# Ensure JWT_SECRET is at least 32 characters
# Clear browser storage/cookies
# Check token expiration time
```

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in `.env`:

```bash
# Backend logs will show detailed information
npm run dev
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Add tests for new functionality**
5. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**

### Development Guidelines

- Use stored procedures for all database operations
- Follow RESTful API conventions
- Add comprehensive error handling
- Include JSDoc comments for functions
- Write unit tests for new features
- Update documentation for API changes

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by healthcare management needs
- Designed for scalability and security

<!-- ## 📞 Support

For support and questions:

- 📧 **Email**: support@snm-medical.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/snm-medical-system/issues)
- 📖 **Documentation**: [Wiki](https://github.com/yourusername/snm-medical-system/wiki)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/snm-medical-system/discussions) -->

---

**Made with ❤️ by the SNM Medical Development Team**

---

<!-- _Last updated: October 4, 2025_ -->
