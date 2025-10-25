# RoomXQR Backend

Hotel management system backend API built with Node.js, Express, TypeScript, and Prisma.

## Features

- 🏨 Hotel management system
- 🛏️ Room management with QR codes
- 👥 Guest management
- 🍽️ Menu and order management
- 🔔 Real-time notifications with Socket.IO
- 🗄️ PostgreSQL database with Prisma ORM
- 🔒 Security middleware (Helmet, CORS, Rate limiting)
- 📊 Health monitoring

## Tech Stack

- **Runtime**: Node.js 20.x
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Real-time**: Socket.IO
- **Security**: Helmet, CORS, Rate limiting

## Quick Start

### Prerequisites

- Node.js 20.x
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/XezMetITSolutions/roomxqr-backend.git
cd roomxqr-backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp env.example .env
# Edit .env with your database credentials and other settings
```

4. Set up the database
```bash
npm run db:deploy
npm run db:seed  # Optional: seed with sample data
```

5. Start development server
```bash
npm run dev
```

## Deployment

### Render Deployment

This project is configured for easy deployment on Render.com:

1. Connect your GitHub repository to Render
2. The `render.yaml` file will automatically configure:
   - Web service with Node.js 20.x
   - PostgreSQL database
   - Environment variables
   - Build and start commands

3. Set the following environment variables in Render:
   - `DATABASE_URL` (automatically set by Render PostgreSQL)
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - Other optional variables from `env.example`

### Docker Deployment

Build and run with Docker:

```bash
# Build image
docker build -t roomxqr-backend .

# Run container
docker run -p 3001:3001 --env-file .env roomxqr-backend
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Menu
- `GET /api/menu` - Get all available menu items

### Rooms
- `GET /api/rooms` - Get all rooms with guest information

### Guests
- `GET /api/guests` - Get all active guests

### Orders
- `POST /api/orders` - Create new order

### Notifications
- `POST /api/notifications` - Send notification

## Real-time Features

The application uses Socket.IO for real-time communication:

- New order notifications
- Guest requests
- System notifications

## Database Schema

The application uses the following main entities:

- **Hotel**: Hotel information and settings
- **Room**: Room details with QR codes
- **Guest**: Guest information and check-in/out
- **MenuItem**: Menu items with pricing
- **Order**: Food orders and room service
- **Notification**: System notifications

## Environment Variables

See `env.example` for all available environment variables.

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:deploy` - Deploy database migrations
- `npm run db:seed` - Seed database with sample data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
