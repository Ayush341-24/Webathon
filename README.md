# 🏠 QUICKHELP The Smart Helper Auto-Assignment System

An intelligent real-time booking and allocation platform that automatically assigns the **nearest available and suitable house helper** to users — ensuring assistance within **15 minutes**.

---

## 🎯 Objective

To design and develop a smart automated system where:

- Users can book house help services instantly
- Helpers are assigned automatically within seconds
- The 15-minute assistance promise is maintained
- No manual intervention is required for assignment

---

## 📌 Problem Statement

To meet the **15-minute service guarantee**, the system must:

• Detect helper **live GPS location**  
• Match helper **skills** with requested service  
• Filter only **available helpers**  
• Assign the **nearest & best-rated helper**  
• Update helper **status (Available / Busy)**  
• Automatically **reassign** if rejected or timed out  
• Notify user if **no helper is available**

All decisions must occur **in real-time within seconds**.

---

## ✨ Features

✔ 📍 Live helper tracking via GPS  
✔ 🛠 Skill-based matching engine  
✔ ✅ Availability filtering  
✔ 📏 Distance-based nearest helper selection  
✔ ⭐ Rating-based prioritization  
✔ 🔄 Automatic reassignment system  
✔ 🔁 Real-time status updates  
✔ 🚫 No-helper availability detection  
✔ ⚡ Instant response architecture  

---

## ⚙️ How It Works

### 1️⃣ User Booking
User selects:

- Service type (cleaning, plumbing, etc.)
- Location
- Time slot

---

### 2️⃣ Helper Discovery
System fetches:

- Live GPS locations
- Helper availability
- Skill profiles

---

### 3️⃣ Smart Filtering
Helpers filtered by:

- Matching skill set
- Status = **Available**

---

### 4️⃣ Intelligent Ranking
Helpers ranked using:

- 📏 Distance (Nearest first)
- ⭐ Rating (Highest preferred)

---

### 5️⃣ Auto Assignment
Best helper receives request →

- Status updated → **Busy**
- Booking confirmed

---

### 6️⃣ Reassignment Engine
Triggered when:

- Helper rejects request
- Helper does not respond (timeout)
- Helper goes offline

Next best helper assigned automatically.

---

## 🛠 Technology Stack

### **Frontend**
- React / Vite / TypeScript
- HTML / CSS / Tailwind *(if used)*

### **Backend**
- Node.js
- Express.js

### **Database**
- MongoDB 

### **Real-Time Communication**
- WebSockets / Socket.io

### **Location Services**
- Geolocation API / GPS Tracking

---

👨‍💻 Author                                  

Developed by Ayush Ranjan, Lakshya Pandey
