# SNM Medical Service Management System – Setup Guide

---

## Prerequisites

- **Node.js** (v14+ recommended)
- **npm** (v6+)
- **MySQL** (v5.7+ or MariaDB)
- **git**
- Text Editor (VSCode/Sublime/etc.)

---

## 1. Clone the Project


---

## 2. Configure Environment

Create a `.env` file in the backend root (if not present):


---

## 3. Install Dependencies


---

## 4. Setup MySQL Database

- Start MySQL.
- **Create Database:**

    ```
    CREATE DATABASE IF NOT EXISTS snm_dispensary CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    USE snm_dispensary;
    ```

---

## 5. Import Tables & Stored Procedures

### Tables

Make sure you have table create scripts for:
- `registration_tbl`
- `department_tbl`
- `state_tbl`
- `city_tbl`
- `qualification_tbl`
- ...and any others needed.

### Stored Procedures

Run SQL to create all required stored procedures.  
Refer to your list (these must exist):

- `sp_get_state_details`
- `sp_get_department_by_id`
- `sp_get_qualification_by_id`
- `sp_get_city_details`
- `sp_get_admin_summary`
- `sp_get_dashboard_stats`
- `sp_get_user_profile_complete`
- `sp_get_users_filtered`
- `sp_get_users_count_filtered`
- `sp_update_user_profile`
- `sp_save_user_profile`
- `sp_get_dutychart_filtered`
- `sp_get_dutychart_count`
- `sp_get_dutychart_stats`
- `sp_update_staff_presence`
- ...etc

---

## 6. Start the Backend Server


The server should show something like:


---

## 7. API Endpoints

### Registration & Login
- `POST   /api/registration/register`
- `POST   /api/auth/login`
- `POST   /api/registration/check-email`
- `POST   /api/auth/forgot-password`

### Master Data & Profile
- `GET    /api/registration/dropdown-data`
- `GET    /api/registration/cities/:stateId`
- `GET    /api/dashboard/profile`
- `PUT    /api/dashboard/profile`

### Dashboard & Reports
- `GET    /api/dashboard/stats`
- `GET    /api/dashboard/users`
- `GET    /api/dashboard/summary`
- `GET    /api/dutychart/filter`
- `GET    /api/dutychart/stats`
- `PUT    /api/dutychart/presence/:userId`
- ...

---

## 8. Frontend Setup

If you have a frontend (e.g. React/Next.js):

- Set the API base URL to `http://localhost:5000/api`
- Use the API endpoints listed above (with JWT authentication for protected routes).

---

## 9. Security & Caching

- API routes set HTTP Caching headers for performance.
- **All database reads/writes use stored procedures only** (no direct SQL).
- Sensitive endpoints require JWT authentication middleware.

---

## 10. Troubleshooting

- **MySQL errors:** Confirm all stored procedures exist and work (`SHOW PROCEDURE STATUS WHERE Db = 'snm_dispensary';`)
- **Ports in use:** Ensure nothing else uses port 5000 or 3306.
- **CORS:** Set up CORS if your frontend and backend are on different origins.
- **Login fails:** Ensure at least one user exists and passwords are hashed.

---

## 11. Maintenance Tips

- Back up your database (including stored procedures) regularly.
- Add new features by creating a new stored procedure and calling it from Node.js.
- Manage secrets and environment variables securely (never commit `.env` to Git).

---

## 12. Final Checklist

- [ ] Tables created and populated
- [ ] All stored procedures in database
- [ ] `.env` configured
- [ ] Dependencies installed via `npm install`
- [ ] Server starts successfully (`npm start`)
- [ ] API requests work from frontend/postman

---

**Your SNM Medical Service Management System is ready!
Need more help? Ask your developer or lead! 🚀**
