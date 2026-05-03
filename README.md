# 🌍 Wanderlust

A full-stack travel listing platform — built with scalable architecture, secure authentication, and real-world deployment practices.

---

## ✨ Overview

Wanderlust is a complete full-stack web application where users can explore travel destinations, create listings, and interact through reviews.

Unlike basic CRUD apps, this project focuses on real-world backend design, authentication flows, and deployment-ready practices.

---

## 🧠 Key Highlights

- 🔐 Hybrid Authentication System  
  - Username & Password login  
  - Google OAuth login  
  - Seamless account handling & password setup for OAuth users  

- 🗺️ Geolocation Integration  
  - Address → Coordinates conversion using Geoapify  
  - Interactive maps with dynamic markers  

- 🔎 Advanced Search & Filtering  
  - Multi-field search (title, location, country)  
  - Category-based filtering  
  - Case-insensitive matching  

- ☁️ Cloud Media Storage  
  - Image uploads handled via Cloudinary  
  - Optimized image delivery  

- 🔄 Persistent Sessions  
  - MongoDB-backed session store (connect-mongo)  
  - Scalable and production-ready  

- 🛡️ Authorization & Security  
  - Ownership-based access control  
  - Protected routes using middleware  

- ⚙️ Deployment Ready  
  - Environment-based configuration  
  - MongoDB Atlas integration  
  - Node engine configuration  

---

## 🏗️ Architecture

Client (EJS + Bootstrap)  
↓  
Express Server (Routing Layer)  
↓  
Controllers (Business Logic)  
↓  
Mongoose Models (Data Layer)  
↓  
MongoDB Atlas (Database)  

External Services:  
- Cloudinary (Images)  
- Geoapify (Maps & Geocoding)  
- Google OAuth (Authentication)  

---

## 🚀 Features

### 🏡 Listings
- Create, edit, and delete listings  
- Upload images with cloud storage  
- Automatic geocoding of location  
- Category-based classification  

### 🔍 Search & Filter
- Search by title, location, or country  
- Category filters (Beach, Mountains, Castles, etc.)  
- Handles case sensitivity and partial matches  

### ⭐ Reviews
- Add and delete reviews  
- Linked with user accounts  
- Safe handling of deleted users (no crashes)  

### 🔐 Authentication Flow
- Google login → forced password setup  
- Traditional login supported  
- Prevents duplicate accounts  
- Handles edge cases properly  

### 💰 Pricing UX
- Toggle between base price and price including taxes (18% GST)  

---

## 🛠️ Tech Stack

Frontend: EJS, Bootstrap, JavaScript  
Backend: Node.js, Express  
Database: MongoDB Atlas, Mongoose  
Auth: Passport.js, Google OAuth  
Storage: Cloudinary  
Maps: Geoapify  
Sessions: connect-mongo  

---

## 📂 Project Structure

Wanderlust/  
│── models/  
│── routes/  
│── controllers/  
│── views/  
│── public/  
│── utils/  
│── config/  
│── app.js  
│── package.json  

---

## ⚙️ Setup & Installation

### 1. Clone the repository
git clone https://github.com/Digvijay-djcodes/wanderlust.git  
cd wanderlust  

### 2. Install dependencies
npm install  

### 3. Configure environment variables (.env)

ATLASDB_URL=your_mongodb_atlas_url  
SESSION_SECRET=your_session_secret  
CLOUD_NAME=your_cloud_name  
CLOUD_API_KEY=your_key  
CLOUD_API_SECRET=your_secret  
MAP_TOKEN=your_geoapify_key  
GOOGLE_CLIENT_ID=your_client_id  
GOOGLE_CLIENT_SECRET=your_client_secret  

### Demo / Seed User

A default user can be created using the seed script.

Run:
node init/index.js

You can modify the credentials inside the seed file before running it.


### 4. Run the application
npm start  

### 5. Open in browser
http://localhost:8080  

---

## 📈 What Makes This Project Strong

- Real-world authentication flow (OAuth + Local)  
- Clean MVC architecture  
- Handles edge cases (deleted users, auth conflicts)  
- Uses production tools (Cloudinary, Atlas, Sessions)  
- Deployment-ready structure  

---

## 🔮 Future Improvements

- Booking system with calendar  
- Payment gateway integration  
- Wishlist feature  
- Advanced filters (price range, ratings)  

---