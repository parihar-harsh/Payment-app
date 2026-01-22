# PayTM Clone - Digital Wallet Application

A full-stack digital wallet application similar to PayTM, built with the MERN stack (MongoDB, Express.js, React, Node.js). Users can create accounts, manage their balance, search for other users, and transfer money securely.

## Features

### User Features
- **User Authentication**: Secure signup and signin with JWT tokens
- **Account Management**: Each user gets a personal account with random initial balance (1-10,000 Rs)
- **Money Transfer**: Transfer funds between users with transaction safety
- **User Search**: Real-time search to find other users by first name or last name
- **Balance Display**: Check your current account balance on dashboard
- **Input Validation**: Zod schema validation for all backend inputs
- **Responsive UI**: Clean, modern interface built with Tailwind CSS

### Technical Features
- JWT-based authentication
- MongoDB transactions for atomic money transfers
- Real-time user search with debouncing
- Protected routes with authentication middleware
- CORS-enabled API
- RESTful API design

## Tech Stack

### Backend
- **Node.js** & **Express.js**: Server and API framework
- **MongoDB**: Database with Mongoose ODM
- **JWT (jsonwebtoken)**: Token-based authentication
- **Zod**: Schema validation for inputs
- **CORS**: Cross-origin resource sharing

### Frontend
- **React**: UI library with hooks
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client for API calls
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Build tool and development server (assumed)

## Project Structure
```
.
├── backend/
│   ├── routes/
│   │   ├── index.js       # Main router
│   │   ├── user.js        # User routes (signup, signin, update, search)
│   │   └── account.js     # Account routes (balance, transfer)
│   ├── config.js          # Configuration (JWT secret)
│   ├── db.js              # Database models and connection
│   ├── middleware.js      # Authentication middleware
│   ├── index.js           # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Signup.jsx     # Signup page
│   │   │   ├── Signin.jsx     # Signin page
│   │   │   ├── Dashboard.jsx  # Main dashboard
│   │   │   └── SendMoney.jsx  # Money transfer page
│   │   ├── components/
│   │   │   ├── Appbar.jsx        # Navigation bar
│   │   │   ├── Balance.jsx       # Balance display
│   │   │   ├── Users.jsx         # User list with search
│   │   │   ├── Button.jsx        # Reusable button
│   │   │   ├── Heading.jsx       # Heading component
│   │   │   ├── SubHeading.jsx    # Subheading component
│   │   │   ├── InputBox.jsx      # Input field component
│   │   │   └── BottomWarning.jsx # Link component
│   │   ├── App.jsx        # Main app with routes
│   │   └── main.jsx       # Entry point
│   └── package.json
├── README.md
└── LICENSE
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Backend Setup

1. **Navigate to the backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure the application:**

Update `backend/config.js`:
```javascript
module.exports = {
    JWT_SECRET: "your-super-secret-jwt-key-change-this"
}
```

Update MongoDB connection in `backend/db.js`:
```javascript
mongoose.connect("mongodb://localhost:27017/paytm")
// Or use MongoDB Atlas:
// mongoose.connect("mongodb+srv://username:password@cluster.mongodb.net/paytm")
```

4. **Start the backend server:**
```bash
node index.js
```

The backend server will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to the frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure API endpoint (if needed):**

The frontend is configured to connect to `http://localhost:3000`. If your backend runs on a different URL, update the axios calls in:
- `src/pages/Signup.jsx`
- `src/pages/SendMoney.jsx`
- `src/components/Users.jsx`

4. **Start the development server:**
```bash
npm run dev
```

The frontend will typically run on `http://localhost:5173` (Vite default) or `http://localhost:3000`

## Application Flow

### 1. User Registration
- Navigate to `/signup`
- Enter first name, last name, email, and password
- Account is created with random initial balance (1-10,000 Rs)
- JWT token is stored in localStorage
- Redirected to dashboard

### 2. User Login
- Navigate to `/signin`
- Enter email and password
- JWT token is stored in localStorage
- Redirected to dashboard

### 3. Dashboard
- View current balance
- Search for other users in real-time
- Click "Send Money" to initiate a transfer

### 4. Money Transfer
- Enter amount to transfer
- Click "Initiate Transfer"
- Transaction is processed atomically
- Balance updates automatically

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### User Routes

#### POST /user/signup
Create a new user account

**Request Body:**
```json
{
  "username": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /user/signin
Login to existing account

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### PUT /user/
Update user information (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "password": "newpassword123",
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Response:**
```json
{
  "message": "Updated successfully"
}
```

#### GET /user/bulk
Search users by name

**Query Parameters:**
- `filter`: Search term for first name or last name

**Example:**
```
GET /api/v1/user/bulk?filter=john
```

**Response:**
```json
{
  "user": [
    {
      "username": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "_id": "507f1f77bcf86cd799439011"
    }
  ]
}
```

### Account Routes

#### GET /account/balance
Get current account balance (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "balance": 5000
}
```

#### POST /account/transfer
Transfer money to another user (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 100,
  "to": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "message": "Transfer successful"
}
```

**Error Response:**
```json
{
  "message": "Insufficient balance"
}
```
or
```json
{
  "message": "Invalid account"
}
```

## Component Documentation

### Pages

#### Signup
- Form for user registration
- Validates and sends data to backend
- Stores JWT token in localStorage
- Redirects to dashboard on success

#### Signin
- Form for user login
- Authenticates user credentials
- Stores JWT token in localStorage
- Redirects to dashboard on success

#### Dashboard
- Displays user's balance
- Shows searchable list of all users
- Quick access to send money functionality

#### SendMoney
- Transfer interface with recipient details
- Amount input with validation
- Processes transfer via API
- Uses query parameters for recipient info

### Components

#### Appbar
- Navigation bar with app branding
- User initial display
- Greeting message

#### Balance
- Displays current account balance
- Formatted currency display

#### Users
- Real-time user search
- Debounced API calls on filter change
- List of users with "Send Money" action

#### InputBox
- Reusable input field component
- Label and placeholder support
- onChange event handling

#### Button
- Styled button component
- onClick event handling
- Consistent styling across app

#### Heading / SubHeading
- Typography components
- Consistent heading styles

#### BottomWarning
- Link component for page navigation
- Used for signin/signup redirects

## Security Features

### Implemented
- JWT token-based authentication
- Bearer token authorization
- MongoDB transactions for atomic transfers
- Input validation with Zod schemas
- Protected routes on backend

### Required for Production
⚠️ **Critical Security Issues:**

1. **Password Hashing**: Passwords are currently stored in plain text
   - Must implement bcrypt or argon2
   - Never store plain text passwords

2. **Environment Variables**: Sensitive data is hardcoded
   - Move JWT_SECRET to .env file
   - Use dotenv package
   - Never commit .env to version control

3. **HTTPS**: Use HTTPS in production
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Input Sanitization**: Add additional validation
6. **CORS Configuration**: Restrict CORS to specific origins in production

## Database Schema

### User Model
```javascript
{
  username: String,      // Email, unique, required
  password: String,      // Required, min 6 chars (NEEDS HASHING!)
  firstName: String,     // Required, max 50 chars
  lastName: String,      // Required, max 50 chars
}
```

### Account Model
```javascript
{
  userId: ObjectId,      // Reference to User
  balance: Number        // Required, decimal value
}
```

## Development

### Running in Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm install
node index.js
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Using Nodemon (Recommended for Backend)
```bash
npm install -g nodemon
cd backend
nodemon index.js
```

## Production Deployment

### Backend Deployment (Example: Heroku, Railway, Render)

1. Add environment variables
2. Configure production MongoDB
3. Enable HTTPS
4. Set NODE_ENV to production

### Frontend Deployment (Example: Vercel, Netlify)

1. Build the production bundle:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder
3. Update API URLs to production backend
4. Configure environment variables

## Known Issues & Limitations

1. **No Password Recovery**: Password reset not implemented
2. **No Email Verification**: Email verification not implemented
3. **No Transaction History**: Past transactions are not stored/displayed
4. **No Error Notifications**: Limited user feedback on errors
5. **Balance Not Real-time**: Dashboard balance requires refresh
6. **No Input Validation on Frontend**: Only backend validation exists
7. **Plain Text Passwords**: Critical security vulnerability

## Roadmap / Future Improvements

### High Priority (Security)
- [ ] Implement bcrypt password hashing
- [ ] Add environment variables (.env)
- [ ] Implement rate limiting
- [ ] Add HTTPS support
- [ ] Implement proper error handling

### Features
- [ ] Transaction history page
- [ ] Email verification system
- [ ] Password reset functionality
- [ ] User profile management
- [ ] Add money to account (deposit)
- [ ] Withdraw money functionality
- [ ] Transaction receipts/notifications
- [ ] 2FA authentication
- [ ] Real-time balance updates
- [ ] Transaction filters and search
- [ ] Export transaction history
- [ ] Dark mode support

### Technical Improvements
- [ ] Add frontend form validation
- [ ] Implement loading states
- [ ] Add error boundaries
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Implement logging system
- [ ] Add request/response interceptors
- [ ] Optimize bundle size
- [ ] Add PWA support
- [ ] Implement WebSocket for real-time updates

## Troubleshooting

### Common Issues

**Backend won't start:**
- Check if MongoDB is running
- Verify port 3000 is not in use
- Check MongoDB connection string

**Frontend can't connect to backend:**
- Verify backend is running on port 3000
- Check CORS configuration
- Verify API URLs in frontend code

**Authentication errors:**
- Check if token is stored in localStorage
- Verify JWT_SECRET matches between requests
- Check token expiration

**Transfer fails:**
- Verify sufficient balance
- Check recipient userId is valid
- Verify authentication token is valid

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Guidelines
- Follow existing code style
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting PR

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by PayTM and modern digital wallet applications
- Built as a learning project for full-stack MERN development
- Tailwind CSS for styling
- React Router for navigation
- MongoDB for database management

## Support

For questions, issues, or contributions:
- Open an issue in the GitHub repository
- Submit a pull request
- Contact the maintainers

## Disclaimer

⚠️ **This is an educational project and should NOT be used in production without implementing proper security measures, especially:**
- Password hashing
- Environment variable management
- Rate limiting
- Input validation and sanitization
- HTTPS enforcement
- Comprehensive error handling
- Security audits

---

**Built with ❤️ for learning purposes**
