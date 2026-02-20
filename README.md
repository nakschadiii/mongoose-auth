# mongo-auth 🔐

A flexible and modular authentication library for MongoDB with support for user registration, login, and OTP verification. Built with TypeScript and compatible with any runtime supporting ES modules.

## Features

- ✅ **User Registration** - Create new users with password hashing
- ✅ **User Login** - Authenticate users with email, phone, or username
- ✅ **OTP Verification** - Two-factor authentication support
- ✅ **JWT Integration** - Optional JWT token generation
- ✅ **Password Security** - Integrated cryptography support
- ✅ **Flexible Configuration** - Customizable models, fields, and options
- ✅ **TypeScript Support** - Full type safety and IntelliSense

## Installation

To install dependencies:

```bash
bun install
```

## Configuration

The `MongooseAuth` class requires the following configuration:

```typescript
interface MongoAuthConstructor {
    options: Options;      // Configuration options (JWT, OTP, etc.)
    models: Models;        // MongoDB models (User, OTP)
    fields: Fields;        // Field mapping for user data
    crypt: Crypt;          // Password hashing/comparison implementation
    jwt: JWT;              // JWT signing/verification implementation
}
```

### Configuration Options

```typescript
interface Options {
    jwt?: boolean;         // Enable JWT token generation
    otp?: boolean;         // Enable OTP verification
    // ... other options
}
```

### Field Mapping

```typescript
interface Fields {
    user: {
        name: string;      // User name field
        email: string;     // User email field
        phone: string;     // User phone field
        password: string;  // User password field
    }
}
```

## Usage

### Initialization

```typescript
import MongooseAuth from './index.ts';
import type { Options, Models, Fields, Crypt, JWT } from './types';

const mongoAuth = new MongooseAuth({
    options: { jwt: true, otp: false },
    models: { User, OTP },
    fields: {
        user: {
            name: 'username',
            email: 'email',
            phone: 'phone',
            password: 'password'
        }
    },
    crypt: cryptImplementation,
    jwt: jwtImplementation
});
```

### User Registration

```typescript
const result = await mongoAuth.register({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    password: 'securePassword123'
});

if (result.success) {
    console.log('User token:', result.data.user_token);
} else {
    console.error('Registration failed:', result.error);
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "user_token": "jwt_token_or_user_id"
    }
}
```

### User Login

```typescript
const result = await mongoAuth.login({
    identifier: 'john@example.com', // Can be email, phone, or username
    password: 'securePassword123'
});

if (result.success) {
    console.log('User login successful');
    // If OTP is enabled, use the OTP token
    // If JWT is enabled, use the JWT token
} else {
    console.error('Login failed:', result.error);
}
```

### OTP Verification

```typescript
const result = await mongoAuth.verifyOTP({
    token: 'otp_token_from_login',
    code: '123456' // 6-digit OTP code
});

if (result.success) {
    console.log('OTP verified, user token:', result.data.user_token);
} else {
    console.error('OTP verification failed:', result.error);
}
```

## Project Structure

```
mongo-auth/
├── index.ts              # Main MongooseAuth class
├── handlers/
│   ├── register.ts       # User registration logic
│   ├── login.ts          # User login logic
│   ├── verifyOTP.ts      # OTP verification logic
│   └── index.ts          # Export handlers
├── types/
│   ├── Crypt.ts          # Cryptography interface
│   ├── Fields.ts         # Field mapping types
│   ├── JWT.ts            # JWT interface
│   ├── Models.ts         # MongoDB models interface
│   ├── Options.ts        # Configuration options interface
│   └── index.ts          # Export all types
├── package.json
├── tsconfig.json
└── README.md
```

## Handlers

### `register(payload)`
Creates a new user account with the provided credentials.
- Checks for existing users (by email, phone, or username)
- Hashes the password securely
- Returns a user token (JWT or user ID)

### `login(payload)`
Authenticates a user with identifier and password.
- Accepts email, phone, or username as identifier
- Validates password against stored hash
- If OTP is enabled, generates and sends OTP code
- Returns user token or OTP token

### `verifyOTP(payload)`
Verifies OTP code for two-factor authentication.
- Validates the OTP token
- Checks the provided OTP code
- Deletes OTP record after verification
- Returns final user token

## Development

To run the project:

```bash
bun run index.ts
```

## Dependencies

- `@faker-js/faker` (dev) - For testing and data generation
- `@types/bun` (dev) - TypeScript definitions for Bun
- `typescript` (peer) - TypeScript compiler

## Architecture

The library follows a modular architecture:

1. **Main Class** (`MongooseAuth`) - Orchestrates all authentication flows
2. **Handlers** - Implement specific authentication logic
3. **Types** - Define interfaces for models, configuration, and cryptography
4. **Dependency Injection** - All dependencies are injected during initialization

This design allows for:
- Easy integration with any MongoDB driver
- Support for any cryptography or JWT implementation
- Flexible field mapping for different database schemas
- Testing and mocking of dependencies

## Error Handling

All methods return a consistent response format:

```typescript
{
    success: boolean;
    data?: any;        // Returned on success
    error?: string;    // Returned on failure
}
```

## License

MIT

---

This project was created using `bun init` in bun v1.2.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
