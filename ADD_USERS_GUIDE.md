# Adding New Users to ERP System

## Why Users Must Be Created in Backend

All users share the same database. When a user logs in, they access the same Indoor module data (autoclave cycles, media batches, etc.). Therefore, users must be created in the PostgreSQL database with proper authentication.

## How to Add New Users

### Method 1: Using SQL (Recommended)

1. Connect to PostgreSQL:
```bash
psql -U postgres -d erp_db
```

2. Insert new user:
```sql
INSERT INTO users (email, password, name, role) 
VALUES (
  'user@example.com', 
  '$2b$10$YourHashedPasswordHere',
  'User Name',
  'indoor-operator'
);
```

**Available Roles:**
- `owner` - Full access to all modules
- `indoor-operator` - Access to Indoor module only
- `outdoor-operator` - Access to Outdoor module only
- `sales-analyst` - Access to Sales, Inventory, and Reports modules

### Method 2: Hash Password First

Since passwords are hashed with bcrypt, you need to hash them first:

1. Create a simple Node.js script `hash-password.js`:
```javascript
const bcrypt = require('bcrypt');

const password = 'your-password-here';
bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});
```

2. Run it:
```bash
node hash-password.js
```

3. Use the hashed password in the SQL INSERT statement above.

### Method 3: Create Backend API Endpoint (Future Enhancement)

You can add a `/api/auth/register` endpoint in the backend that:
- Only accessible by admin/owner role
- Hashes password automatically
- Creates user in database

## Current Test Users

### Admin Account (Already in Database)
- **Email:** admin@seemabiotech.com
- **Password:** password123
- **Role:** owner
- **Access:** All modules

## Important Notes

1. **All users see the same data** - The Indoor module data is shared across all users
2. **Role-based access** - Users can only access modules based on their role
3. **JWT Authentication** - Users must have valid backend credentials to access API
4. **No local signup** - The signup feature was removed because locally created users cannot access the backend database

## Security Best Practices

- Use strong passwords (minimum 8 characters)
- Never share admin credentials
- Regularly update passwords
- Use different roles for different team members
- Keep database credentials secure in `.env` file
