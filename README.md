# FixIt - Home Services Platform (Backend)

FixIt is a full-stack home services platform connecting consumers with professional technicians. This repository contains the robust, scalable REST API built with NestJS, powering authentication, booking coordination, service catalogs, and payment processing.

## 🚀 Key Highlights

- **JWT Role-Based Auth:** Secure authentication separating Consumer and Technician privileges.
- **Robust Database Schema:** Managed via TypeORM and PostgreSQL, tracking complex relationships between users, services, and live bookings.
- **Stripe Integration:** Server-side Stripe API interaction to securely issue Payment Intents and verify webhook transactions.
- **Scalable Architecture:** Built on NestJS utilizing modular design, strict ValidationPipes, and a scalable data-access layer.

## 💻 Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT (JSON Web Tokens), Passport.js, bcrypt
- **Payments:** Stripe Node.js SDK
- **Environment:** Docker, Docker Compose
- **Deployment:** Railway

## 🛠️ How to Run the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/abdulhadi-js/Fixit-Backend.git
   cd Fixit-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3001
   DATABASE_URL=postgresql://user:password@localhost:5432/fixit
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

4. **Start the Database (Docker)**
   If you have Docker installed, you can spin up the required PostgreSQL database using:
   ```bash
   docker-compose up -d
   ```

5. **Run Database Migrations / Sync**
   By default, TypeORM is set to synchronize the database schema in development mode.

6. **Seed the Database**
   To populate the database with test users and service categories, run the provided python seed scripts:
   ```bash
   python seed_services.py
   python create_test_users.py
   ```

7. **Run the Server**
   ```bash
   npm run start:dev
   ```

8. **Test the API**
   The API will be running on `http://localhost:3001/api/v1`.

## 📂 Project Structure Highlights

- `src/auth/`: Login, Registration, JWT issuing, and role guards.
- `src/users/`: User entity and management logic.
- `src/services/`: Service catalog and categorization logic.
- `src/bookings/`: Core booking logic, technician claiming, and agenda generation.
- `src/payments/`: Stripe intent creation and webhook verification.

---

*Part of the FixIt ecosystem. Designed and built with ❤️*
