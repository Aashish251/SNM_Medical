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
  basePath: '/',
  schemes: ['http'],
  consumes: ['application/json', 'multipart/form-data'],
  produces: ['application/json'],
  tags: [
    { name: 'Authentication', description: 'User authentication operations' },
    { name: 'Registration', description: 'User registration and related operations' },
    { name: 'Dashboard', description: 'Dashboard related operations' },
    { name: 'User Management', description: 'User profile and role management' },
    { name: 'Search', description: 'Search and export functionality' },
    { name: 'Community', description: 'Blood drive and health drive operations' },
    { name: 'Patients', description: 'Patient registration operations' },
    { name: 'Masters', description: 'Master data management operations' },
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
    },
    PatientRegistrationRequest: {
      $regnNo: 'OPD-2026-001',
      $date: '2026-04-25',
      $patientName: 'Anita Sharma',
      $mobileNumber: '9876543210',
      email: 'anita.sharma@example.com',
      $address: '12 Main Road, Delhi',
      guardianName: 'Raj Sharma',
      age: 42,
      $gender: 'Female',
      $disease: 'Fever and body ache'
    },
    BloodDriveRequest: {
      $organizerName: 'SNM Charitable Trust',
      $address: 'Community Hall, Sector 4',
      landmark: 'Near central park',
      $driveDate: '2026-04-25',
      $startTime: '09:00',
      $endTime: '14:00',
      phone: '9876543210',
      email: 'drive@example.com',
      $entryType: 'public'
    },
    HealthDriveRequest: {
      $organizerName: 'SNM Medical Camp',
      $address: 'Dispensary Campus',
      landmark: 'Gate 2',
      $campDate: '2026-04-25',
      $startTime: '10:00',
      $endTime: '16:00',
      services: 'General checkup, BP, sugar test',
      phone: '9876543210',
      email: 'camp@example.com',
      $registrationType: 'walk-in',
      notes: 'Bring previous medical records'
    },
    BloodDonationEligibilityRequest: {
      $age: 30,
      $weight: 65,
      $hemoglobin: 13.2,
      $illness: 'no',
      lastDonation: '2025-12-01',
      driveId: 1
    },
    MasterDataRequest: {
      $value: 'Cardiology',
      extraId: null,
      updatedBy: 1
    }
  }
};

const outputFile = './swagger-output.json';

const routes = [
  './src/server.js'
];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

// Generate swagger documentation
swaggerAutogen(outputFile, routes, doc).then(() => {
    console.log('Swagger documentation generated successfully');
    // Optionally require and run your server here
    // require('./server.js');
});
