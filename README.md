# 🏠 Real Estate Website (MERN Stack)

A **full-stack Real Estate Website** built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)** and **Tailwind CSS** for responsive design.  
This platform enables users to browse, filter, and view property listings, interact with real estate agents, and manage appointments — all in a secure, scalable environment.

---

## 🚀 Project Overview

The **Real Estate Website** allows users to explore various properties based on location, price, and property type.  
Agents can list and manage properties through their dashboards, while administrators oversee the entire system with advanced control features.  
The system integrates **maps, contact forms, email notifications**, and **role-based authentication** for an enhanced user experience.

---

## 🧠 Key Features

### 👤 User Functionalities
- **Property Listings:**  
  - Browse properties with detailed info — type, price, location, size, rooms, and images.  
  - Search and filter listings by location, property type, number of rooms, or price range.

- **Map Integration:**  
  - Interactive property maps showing real-time property locations.

- **Contact & Inquiry Forms:**  
  - Send inquiries directly to property agents.  
  - Schedule property viewings and request more information.

---

### 🏢 Real Estate Agent Functionalities
- **Agent Profiles:**  
  - Create and manage professional profiles with contact details and biography.  
  - Showcase properties managed by each agent.

- **Property Management:**  
  - Add, edit, or delete property listings through an agent dashboard.  
  - Manage uploaded property images, descriptions, and pricing details.

- **Client Interaction:**  
  - Manage client messages, schedule appointments, and handle inquiries effectively.

---

### 🧑‍💼 Admin Functionalities
- **Admin Dashboard:**  
  - Monitor and manage all users, agents, and property listings.  
  - Review and approve property listings before publishing.  
  - Generate analytical reports on listings and user activity.

---

### 🌐 Additional Features
- **Authentication & Authorization:**  
  - Secure login and registration for users, agents, and admins.  
  - Role-based access control (RBAC) using **JWT authentication**.

- **Responsive UI:**  
  - Fully responsive design built with **Tailwind CSS** for optimal experience across all devices.

- **Notifications:**  
  - Email alerts for property inquiries, booking confirmations, and appointment scheduling.

---

## 🛠️ Tech Stack

| Layer | Technology Used |
|-------|------------------|
| **Frontend** | React.js, Tailwind CSS, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ORM |
| **Authentication** | JWT Tokens with Cookies |
| **Maps Integration** | Google Maps API / Leaflet.js |
| **File Uploads** | Multer / Cloudinary |
| **Email Notifications** | Nodemailer / SendGrid |
| **Deployment** | Netlify (Frontend) + Render (Backend) |

---

## 🧩 Folder Structure


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repositories
```bash
# Frontend
git clone https://github.com/PRAKASH-VD/RED-1-F.git
2️⃣ Install dependencies
# Inside frontend folder
cd RED-1-F
npm install

# Inside backend folder
cd RED1_Backend
npm install

3️⃣ Environment Variables

Create a .env file in the backend with:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_password
CLOUDINARY_URL=your_cloudinary_key

4️⃣ Run the project
# Run backend
npm run dev

# Run frontend (in another terminal)
npm run dev


Frontend runs on http://localhost:5173
Backend runs on http://localhost:5000

🌍 Deployment

Frontend: Netlify

Backend: Render

Add .env configurations to respective hosting platforms.

📬 Contact

👨‍💻 Developed by: Prakash V

📧 Email: prakashdjp4@gmail.com
# Backend
git clone https://github.com/PRAKASH-VD/RED1_Backend.git
