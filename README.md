# Modern Blog Platform

A full-stack blog platform with a modern UI, AI-powered features, and seamless user experience.

## Features

### Core Functionality
- Create, read, update, and delete blog posts
- User authentication and authorization
- Markdown support for post content
- Responsive design for all devices

### Enhanced User Experience
- Modern, clean UI with consistent design language
- Real-time post preview while writing
- Character counting for title and content
- Smooth transitions and animations
- Mobile-first responsive design

### AI Integration
- Automatic post summary generation using BART model
- One-click summary regeneration
- Smart content truncation

### User Interface
#### Create Post Page
- Write/Preview toggle functionality
- Real-time markdown preview
- Character counting
- Form validation with error messages
- Loading states for better UX

#### Post Detail Page
- Clean, card-based layout
- AI-powered post summary generation
- Easy navigation with back button
- Author information and post metadata
- Responsive design for all screen sizes
- Quick edit/delete access for authors
- Smooth animations and transitions

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Axios for HTTP requests
- Modern CSS with responsive design
- Custom animations and transitions

### Backend
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- HuggingFace API integration (BART model)
- RESTful API architecture

### Authentication
- JWT-based authentication
- Protected routes
- User context management
- Secure token storage

## Getting Started

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables
Create `.env` files in both server and client directories:

Server `.env`:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
HUGGING_FACE_TOKEN=your_huggingface_token
PORT=5000
```

Client `.env`:
```
REACT_APP_API_URL=http://localhost:5000
```

4. Start the development servers
```bash
# Start backend server
cd server
npm run dev

# Start frontend server in a new terminal
cd client
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Summary
- `POST /api/summary/generate` - Generate post summary

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- HuggingFace for the BART model
- React team for the amazing frontend library
- MongoDB team for the powerful database
- Express.js team for the backend framework
