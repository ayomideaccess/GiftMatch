# 🎁 GiftMatch

GiftMatch is a Secret Santa / gift-exchange API. Admins create events, add participants, and share a link. Participants identify themselves, get randomly matched with someone to gift, and can view results once everyone has picked. There's also a special-requests flow so participants can tell the organizer what they'd like to receive.

## Features

- **Admin authentication** — register, email OTP verification, login, logout, forgotten/reset password, resend OTP
- **Event management** — create, list, view, update, and delete gift-exchange events (with `upcoming` / `ongoing` / `completed` status based on start date and deadline)
- **Secret Santa picking** — participants identify themselves by name, then pick a recipient; each participant can only pick once, and no one can pick themselves or someone already picked
- **Results** — view pick summary (total participants, total picked, remaining) plus any special requests for an event
- **Special requests** — participants can send the organizer a note about what they'd like to receive
- **Email notifications** — OTP emails, login alerts, password reset, special request alerts, and an event-completion email once everyone has picked
- **API docs** — interactive Swagger UI at `/api-docs`

## Tech Stack

- Node.js / Express 5
- MongoDB with Mongoose
- JWT authentication (`jsonwebtoken`)
- Password hashing with `bcrypt`
- Request validation with `zod`
- Email via `nodemailer` (Gmail)
- API documentation with `swagger-jsdoc` + `swagger-ui-express`

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB connection string (Atlas or local)
- A Gmail account with an [app password](https://support.google.com/accounts/answer/185833) for sending emails

### Installation

```bash
git clone <repo-url>
cd GiftMatch-main
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GMAIL_USER=your_gmail_address
GMAIL_PASS=your_gmail_app_password
```

### Running the app

```bash
# development (with nodemon)
npm run dev

# production
npm start
```

The server starts on `http://localhost:5000` (or your configured `PORT`), and API docs are available at `http://localhost:5000/api-docs`.

## API Overview

All routes are prefixed with `/api`.

### Auth — `/api/auth`
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/register` | Register a new admin, sends OTP for verification |
| POST | `/verify-otp` | Verify OTP and activate account |
| POST | `/login` | Log in and receive a JWT |
| POST | `/logout` | Log out |
| POST | `/forgotpassword` | Send a password reset OTP |
| POST | `/reset` | Reset password with OTP |
| POST | `/resend` | Resend verification OTP |

### Events — `/api/event` (🔒 = requires `Authorization: Bearer <token>`)
| Method | Route | Description |
|--------|-------|-------------|
| POST 🔒 | `/create` | Create a new event |
| GET 🔒 | `/` | Get all events for the logged-in admin |
| GET | `/:id` | Get a single event by ID |
| PUT 🔒 | `/:id` | Update an event |
| DELETE 🔒 | `/:id` | Delete an event |

### Picks — `/api/pick`
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/:eventId/identify` | Confirm a participant's name is on the event list |
| POST | `/:eventId/pick` | Make a Secret Santa pick |
| GET 🔒 | `/:eventId/results` | View results and summary for an event |

### Special Requests — `/api/special-requests`
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/:eventId/request` | Submit a gift request for an event |

Full request/response schemas are documented in Swagger at `/api-docs`.

## Project Structure

```
GiftMatch-main/
├── app.js                      # Entry point — Express app, middleware, route mounting
├── config/
│   ├── db.js                   # MongoDB connection
│   └── swagger.js              # Swagger/OpenAPI setup
├── controller/                 # Route handler logic
│   ├── auth.controller.js
│   ├── event.controller.js
│   ├── pick.controller.js
│   └── specialRequest.controller.js
├── middleware/
│   ├── auth.middleware.js      # JWT protect middleware
│   ├── errorHandler.js         # Central error handler
│   ├── routeHandler.js         # 404 handler
│   └── validate.js             # Zod validation middleware
├── models/                     # Mongoose schemas
│   ├── adminModel.js
│   ├── eventModel.js
│   ├── pickModel.js
│   └── specialRequestModel.js
├── routes/                     # Express routers
├── services/
│   ├── email.service.js        # Nodemailer email templates/sending
│   └── otp.service.js          # OTP generation
├── utils/
│   ├── AppError.js             # Custom error class
│   └── generateToken.js        # JWT signing helper
└── validators/                 # Zod schemas per resource
```

## Error Handling

The API uses a custom `AppError` class and a central `errorHandler` middleware. Errors thrown in controllers (e.g. `throw new AppError("Event not found", 404)`) are caught and returned as consistent JSON error responses.

## License

ISC
