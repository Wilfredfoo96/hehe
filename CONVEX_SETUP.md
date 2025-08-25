# Convex Setup Documentation

## Overview
This project uses Convex as the backend database and API layer for user management.

## Project Structure
```
convex/
├── schema.ts          # Database schema definition
├── users.ts           # User management functions
└── convex.json        # Convex configuration
```

## Environment Variables
Make sure you have these environment variables set in `.env.local`:
```
NEXT_PUBLIC_CONVEX_URL=https://nautical-malamute-592.convex.cloud
CONVEX_DEPLOYMENT=nautical-malamute-592
```

## Database Schema

### Users Table
- `display_name`: User's display name (required)
- `username`: Unique username (required)
- `bio`: User's biography (optional)
- `profile_img`: Profile image URL (optional)
- `company_name`: Company name (optional)
- `company_type`: Type of company (optional)
- `address`: Street address (optional)
- `city`: City (optional)
- `state`: State/province (optional)
- `postal`: Postal/ZIP code (optional)
- `country`: Country (optional)
- `company_number`: Company registration number (optional)
- `createdAt`, `updatedAt`: Timestamps

## Available Functions

### User Management
- `getUserByUsername(username)`: Get user by username
- `getAllUsers()`: Get all users
- `getUsersByCompany(companyName)`: Get users by company name
- `getUsersByCompanyType(companyType)`: Get users by company type
- `upsertUser(userData)`: Create or update user

## Usage in React Components

### Using Hooks
```typescript
import { useUserByUsername, useAllUsers } from "@/hooks/useConvex";

function MyComponent({ username }: { username: string }) {
  const user = useUserByUsername(username);
  const allUsers = useAllUsers();
  
  // ... component logic
}
```

### Using Mutations
```typescript
import { useUpsertUser } from "@/hooks/useConvex";

function UserForm() {
  const upsertUser = useUpsertUser();
  
  const handleSubmit = async (userData) => {
    await upsertUser(userData);
  };
}
```

## Development Commands

### Start Convex Development Server
```bash
npx convex dev
```

### Generate Types (one-time)
```bash
npx convex dev --once
```

### Deploy to Production
```bash
npx convex deploy
```

## Example User Data Structure
```typescript
{
  display_name: "John Doe",
  username: "johndoe",
  bio: "Software developer with 5 years of experience",
  profile_img: "https://example.com/profile.jpg",
  company_name: "Tech Solutions Inc",
  company_type: "Technology",
  address: "123 Main Street",
  city: "San Francisco",
  state: "CA",
  postal: "94102",
  country: "USA",
  company_number: "CA123456789"
}
```

## Security Notes
- All functions are server-side and secure by default
- Username must be unique
- All fields except display_name and username are optional
