// This file contains all the Swagger documentation for your API endpoints

// ============================================================
// AUTHENTICATION ENDPOINTS
// ============================================================

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     description: Authenticate user with email, password, and role. Returns a JWT token on success.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: Login successful
 *             data:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/definitions/User'
 *       400:
 *         description: Invalid request - missing required fields
 *       401:
 *         description: Unauthorized - invalid credentials or account not approved/deactivated
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/forgot-password-validate:
 *   post:
 *     tags: [Authentication]
 *     summary: Validate forgot password request
 *     description: Validate user identity before allowing password reset. Verifies email, mobile number, and date of birth.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Validation successful - user identity confirmed
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: User verified successfully
 *             data:
 *               type: object
 *               properties:
 *                 regId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Validation failed - user not found or details do not match
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags: [Authentication]
 *     summary: Reset user password
 *     description: Reset the password for a verified user using their registration ID.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successful
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: Password reset successfully
 *       400:
 *         description: Invalid request - missing regId or newPassword
 *       500:
 *         description: Internal server error
 */

// ============================================================
// REGISTRATION ENDPOINTS
// ============================================================

/**
 * @swagger
 * /api/registration/dropdown-data:
 *   get:
 *     tags: [Registration]
 *     summary: Get dropdown master data
 *     description: Retrieve all dropdown master data (states, departments, qualifications) used in registration forms.
 *     responses:
 *       200:
 *         description: Successfully fetched dropdown data
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             data:
 *               type: object
 *               properties:
 *                 states:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Karnataka
 *                 departments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Cardiology
 *                 qualifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: MBBS
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/registration/cities/{stateId}:
 *   get:
 *     tags: [Registration]
 *     summary: Get cities by state
 *     description: Get list of cities for a given state ID.
 *     parameters:
 *       - in: path
 *         name: stateId
 *         required: true
 *         type: integer
 *         minimum: 1
 *         description: ID of the state to get cities for
 *         example: 1
 *     responses:
 *       200:
 *         description: Cities retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: Cities fetched successfully
 *             data:
 *               type: object
 *               properties:
 *                 cities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Bangalore
 *                 count:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Invalid state ID
 *       404:
 *         description: State not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/registration/check-email:
 *   post:
 *     tags: [Registration]
 *     summary: Check email availability
 *     description: Check if an email address is already registered in the system.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: john.doe@example.com
 *     responses:
 *       200:
 *         description: Email check successful
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: Email is available
 *             data:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Invalid email format
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/registration/register:
 *   post:
 *     tags: [Registration]
 *     summary: Register new user
 *     description: Create a new user account with profile details. Supports multipart form data for file uploads (profile picture and certificate).
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: firstName
 *         type: string
 *         required: true
 *         description: User's first name
 *         example: John
 *       - in: formData
 *         name: lastName
 *         type: string
 *         required: true
 *         description: User's last name
 *         example: Doe
 *       - in: formData
 *         name: email
 *         type: string
 *         required: true
 *         description: User's email address
 *         example: john.doe@example.com
 *       - in: formData
 *         name: password
 *         type: string
 *         required: true
 *         description: User's password (min 8 characters)
 *         example: Password123!
 *       - in: formData
 *         name: mobileNumber
 *         type: string
 *         required: true
 *         description: 10-digit mobile number
 *         example: "9876543210"
 *       - in: formData
 *         name: role
 *         type: string
 *         required: true
 *         enum: [user, admin, medical_staff]
 *         description: User role
 *         example: medical_staff
 *       - in: formData
 *         name: gender
 *         type: string
 *         enum: [Male, Female, Other]
 *         description: User's gender
 *       - in: formData
 *         name: dateOfBirth
 *         type: string
 *         format: date
 *         description: Date of birth (YYYY-MM-DD)
 *       - in: formData
 *         name: stateId
 *         type: integer
 *         description: State ID
 *       - in: formData
 *         name: cityId
 *         type: integer
 *         description: City ID
 *       - in: formData
 *         name: address
 *         type: string
 *         description: User's address (max 200 chars)
 *       - in: formData
 *         name: pincode
 *         type: string
 *         description: 6-digit pincode
 *       - in: formData
 *         name: specialization
 *         type: string
 *         description: Medical specialization (for medical staff)
 *       - in: formData
 *         name: experience
 *         type: integer
 *         description: Years of experience
 *       - in: formData
 *         name: profilePic
 *         type: file
 *         description: Profile picture (image file)
 *       - in: formData
 *         name: certificate
 *         type: file
 *         description: Certificate document (image/PDF)
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/registration/upload-profile:
 *   post:
 *     tags: [Registration]
 *     summary: Upload profile image
 *     description: Upload a profile image separately. Returns the file path of the uploaded image.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: profileImage
 *         type: file
 *         required: true
 *         description: Profile image file to upload
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: Profile image uploaded successfully
 *             filePath:
 *               type: string
 *               example: /uploads/profile/image_12345.jpg
 *       400:
 *         description: No profile image uploaded
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/registration/upload-certificate:
 *   post:
 *     tags: [Registration]
 *     summary: Upload certificate document
 *     description: Upload a certificate document separately. Returns the file path of the uploaded certificate.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: certificate
 *         type: file
 *         required: true
 *         description: Certificate file to upload
 *     responses:
 *       200:
 *         description: Certificate uploaded successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: Certificate uploaded successfully
 *             filePath:
 *               type: string
 *               example: /uploads/certificates/cert_12345.pdf
 *       400:
 *         description: No certificate uploaded
 *       500:
 *         description: Internal server error
 */

// ============================================================
// DASHBOARD ENDPOINTS
// ============================================================

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard statistics
 *     description: Retrieve dashboard statistics for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             data:
 *               type: object
 *       401:
 *         description: Unauthorized - no token or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/dashboard/profile:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get user profile
 *     description: Retrieve the profile of the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             data:
 *               $ref: '#/definitions/User'
 *       401:
 *         description: Unauthorized - no token or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       500:
 *         description: Internal server error
 *   put:
 *     tags: [Dashboard]
 *     summary: Update user profile
 *     description: Update the profile of the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *               example: John
 *             lastName:
 *               type: string
 *               example: Doe
 *             mobileNumber:
 *               type: string
 *               example: "9876543210"
 *             address:
 *               type: string
 *               example: 123 Main Street
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         schema:
 *           $ref: '#/definitions/SuccessResponse'
 *       401:
 *         description: Unauthorized - no token or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get admin summary (Admin only)
 *     description: Retrieve admin dashboard summary with aggregated stats. Requires admin role.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin summary retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             data:
 *               type: object
 *       401:
 *         description: Unauthorized - no token or invalid token
 *       403:
 *         description: Forbidden - admin role required
 *       500:
 *         description: Internal server error
 */

// ============================================================
// SEARCH ENDPOINTS
// ============================================================

/**
 * @swagger
 * /api/search/master:
 *   post:
 *     tags: [Search]
 *     summary: Master search
 *     description: Perform a master search with filters and pagination. Returns paginated user data matching the search criteria.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/MasterSearchRequest'
 *     responses:
 *       200:
 *         description: Search completed successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: Found 25 record(s)
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *             pagination:
 *               type: object
 *               properties:
 *                 current:
 *                   type: integer
 *                   example: 1
 *                 total:
 *                   type: integer
 *                   example: 3
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 totalRecords:
 *                   type: integer
 *                   example: 25
 *       401:
 *         description: Unauthorized - no token or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/search/export:
 *   post:
 *     tags: [Search]
 *     summary: Export search results to Excel
 *     description: Export master search results as an Excel (.xlsx) file. Uses the same filters as master search but fetches all matching records.
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/MasterSearchRequest'
 *     responses:
 *       200:
 *         description: Excel file downloaded successfully (binary stream) or empty JSON if no data
 *       401:
 *         description: Unauthorized - no token or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       500:
 *         description: Export failed
 */

/**
 * @swagger
 * /api/search/approve/{regId}:
 *   post:
 *     tags: [Search]
 *     summary: Approve a user
 *     description: Approve a user registration by their registration ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: regId
 *         required: true
 *         type: integer
 *         description: Registration ID of the user to approve
 *         example: 1
 *     responses:
 *       200:
 *         description: User approved successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: User approved successfully
 *       401:
 *         description: Unauthorized - no token or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       500:
 *         description: Approval failed
 */

/**
 * @swagger
 * /api/search/update:
 *   put:
 *     tags: [Search]
 *     summary: Bulk update selected users
 *     description: Update multiple users at once. Provide an array of user objects with their fields to update.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/BulkUpdateRequest'
 *     responses:
 *       200:
 *         description: Users updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: Users updated successfully
 *       400:
 *         description: No users provided or invalid data
 *       401:
 *         description: Unauthorized - no token or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       500:
 *         description: Update failed
 */

// ============================================================
// USER MANAGEMENT ENDPOINTS
// ============================================================

/**
 * @swagger
 * /api/user/update-role:
 *   put:
 *     tags: [User Management]
 *     summary: Update user role (Admin only)
 *     description: Update a user's role and permissions. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/UpdateRoleRequest'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/update-profile/{regId}:
 *   get:
 *     tags: [User Management]
 *     summary: Get user profile by registration ID
 *     description: Retrieve a user's full profile by their registration ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: regId
 *         required: true
 *         type: integer
 *         description: Registration ID of the user
 *         example: 1
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         schema:
 *           $ref: '#/definitions/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *   put:
 *     tags: [User Management]
 *     summary: Update user profile by registration ID
 *     description: Update a user's profile with optional file uploads (profile picture and certificate).
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: regId
 *         required: true
 *         type: integer
 *         description: Registration ID of the user
 *         example: 1
 *       - in: formData
 *         name: firstName
 *         type: string
 *         description: User's first name
 *       - in: formData
 *         name: lastName
 *         type: string
 *         description: User's last name
 *       - in: formData
 *         name: mobileNumber
 *         type: string
 *         description: 10-digit mobile number
 *       - in: formData
 *         name: address
 *         type: string
 *         description: User's address
 *       - in: formData
 *         name: profilePic
 *         type: file
 *         description: Profile picture (image file)
 *       - in: formData
 *         name: certificate
 *         type: file
 *         description: Certificate document (image/PDF)
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/normalize-paths:
 *   post:
 *     tags: [Admin - Maintenance]
 *     summary: Normalize all file paths in database (Admin only)
 *     description: Convert all absolute file paths in the database to relative paths. Use this for maintenance/migration purposes.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Paths normalized successfully
 *         schema:
 *           $ref: '#/definitions/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to normalize paths
 */

/**
 * @swagger
 * /api/user/normalize-paths/{regIds}:
 *   post:
 *     tags: [Admin - Maintenance]
 *     summary: Normalize file paths for specific users (Admin only)
 *     description: Convert absolute file paths to relative paths for specific users identified by comma-separated registration IDs.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: regIds
 *         required: true
 *         type: string
 *         description: Comma-separated registration IDs (e.g., "1,2,3")
 *         example: "1,2,3"
 *     responses:
 *       200:
 *         description: Paths normalized successfully
 *         schema:
 *           $ref: '#/definitions/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to normalize paths
 */

// ============================================================
// DUTYCHART ENDPOINTS
// ============================================================

/**
 * @swagger
 * /api/dutychart/filter:
 *   get:
 *     tags: [DutyChart]
 *     summary: Filter duty chart
 *     description: Filter the medical staff duty chart. (Implementation pending)
 *     responses:
 *       200:
 *         description: Duty chart data retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: Dutychart filter endpoint - implementation pending
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *             timestamp:
 *               type: string
 *               format: date-time
 *       500:
 *         description: Dutychart filter failed
 */

// ============================================================
// REPORTS ENDPOINTS
// ============================================================

/**
 * @swagger
 * /api/reports/daily:
 *   get:
 *     tags: [Reports]
 *     summary: Get daily reports
 *     description: Retrieve daily reports data. (Implementation pending)
 *     responses:
 *       200:
 *         description: Daily reports retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: Daily reports endpoint - implementation pending
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *             timestamp:
 *               type: string
 *               format: date-time
 *       500:
 *         description: Daily reports failed
 */

/**
 * @swagger
 * /api/reports/registration:
 *   get:
 *     tags: [Reports]
 *     summary: Get registration reports
 *     description: Retrieve registration reports data. (Implementation pending)
 *     responses:
 *       200:
 *         description: Registration reports retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: Registration reports endpoint - implementation pending
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *             timestamp:
 *               type: string
 *               format: date-time
 *       500:
 *         description: Registration reports failed
 */

/**
 * @swagger
 * /api/reports/master:
 *   get:
 *     tags: [Reports]
 *     summary: Get master reports
 *     description: Retrieve master reports data. (Implementation pending)
 *     responses:
 *       200:
 *         description: Master reports retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: Master reports endpoint - implementation pending
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *             timestamp:
 *               type: string
 *               format: date-time
 *       500:
 *         description: Master reports failed
 */