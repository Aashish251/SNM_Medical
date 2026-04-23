const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'SNM Medical API',
    description: 'API documentation for SNM Medical application',
    version: '1.0.0',
    contact: {
      name: 'SNM Medical Team',
      email: 'support@snmmedical.com'
    }
  },
  host: 'localhost:5000',
  basePath: '/api',
  schemes: ['http'],
  consumes: ['application/json', 'multipart/form-data'],
  produces: ['application/json'],
  tags: [
    { name: 'Authentication', description: 'User authentication operations' },
    { name: 'Registration', description: 'User registration and related operations' },
    { name: 'Dashboard', description: 'Dashboard related operations' },
    { name: 'User Management', description: 'User profile and role management' },
    { name: 'Search', description: 'Search and export functionality' },
    { name: 'DutyChart', description: 'Medical staff duty chart operations' },
    { name: 'Reports', description: 'Report generation and management' },
    { name: 'Admin - Maintenance', description: 'Admin maintenance operations' }
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Enter your bearer token in the format "Bearer {token}"'
    }
  },
  definitions: {
    User: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password123!',
      mobileNumber: '9876543210',
      gender: 'Male',
      dateOfBirth: '1990-01-01',
      stateId: 1,
      cityId: 1,
      address: '123 Main St',
      pincode: '560001',
      role: 'medical_staff',
      specialization: 'Cardiology',
      experience: 5
    },
    LoginRequest: {
      $email: 'john.doe@example.com',
      $password: 'Password123!',
      $role: 'admin'
    },
    ForgotPasswordRequest: {
      $email: 'john.doe@example.com',
      $mobileNumber: '9876543210',
      $dateOfBirth: '1990-01-01'
    },
    ResetPasswordRequest: {
      $regId: 1,
      $newPassword: 'NewPassword123!'
    },
    RegistrationRequest: {
      $firstName: 'John',
      $lastName: 'Doe',
      $email: 'john.doe@example.com',
      $password: 'Password123!',
      $mobileNumber: '9876543210',
      $role: 'medical_staff',
      gender: 'Male',
      dateOfBirth: '1990-01-01',
      stateId: 1,
      cityId: 1,
      address: '123 Main Street',
      pincode: '560001',
      specialization: 'Cardiology',
      experience: 5
    },
    SuccessResponse: {
      success: true,
      message: 'Operation completed successfully',
      data: {}
    },
    ErrorResponse: {
      success: false,
      message: 'Error message here'
    },
    MasterSearchRequest: {
      page: 1,
      limit: 10,
      search: '',
      filters: {}
    },
    UpdateRoleRequest: {
      $userId: 1,
      isPresent: true,
      passEntry: true,
      isDeleted: false,
      isAdmin: false,
      remark: 'Approved',
      sewaLocationId: 1,
      samagamHeldIn: 'Location'
    },
    BulkUpdateRequest: {
      $users: [
        {
          userId: 1,
          isPresent: true,
          passEntry: false
        }
      ]
    }
  }
};

const outputFile = './swagger-output.json';

const routes = [
  './src/routes/swagger.docs.js',  // Main API documentation
  './src/routes/registration.js',
  './src/routes/auth.js',
  './src/routes/dashboard.js',
  './src/routes/user.js',
  './src/routes/search.js',
  './src/routes/dutychart.js',
  './src/routes/reports.js'
];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

// Generate swagger documentation
swaggerAutogen(outputFile, routes, doc).then(() => {
    console.log('Swagger documentation generated successfully');
    // Optionally require and run your server here
    // require('./server.js');
});