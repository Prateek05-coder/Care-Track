# **Care Track - Healthcare Patient Management System** 🏥

## **Introduction**
Healthcare providers face challenges in managing vast amounts of **semi-structured** patient data—ranging from personal details to medical history, prescriptions, and doctor notes. **Care Track** is designed as a **MongoDB-based Patient Management System** that simplifies storing, retrieving, and managing healthcare records efficiently.

This project leverages **MongoDB's NoSQL flexibility** to handle heterogeneous medical data and provides **optimized operations** for adding, updating, searching, and deleting patient records.

---

## **Tech Stack**
### **Backend**
- **Node.js** - JavaScript runtime for scalable backend development
- **Express.js** - Lightweight framework for API handling
- **MongoDB** - NoSQL database for dynamic medical records
- **Mongoose** - ODM for MongoDB schema handling
- **JWT Authentication** - Secure user authentication

### **Frontend**
- **React.js** - Dynamic UI for patient data visualization
- **Firebase Authentication** - Secure user login management
- **JS-based PDF Generator** - Export patient records in PDF format

---

## **Features**
✅ **Add, search, update, and delete patient records**  
✅ **Medical history management**  
✅ **Prescription tracking**  
✅ **Doctor notes & visit records**  
✅ **Data visualization & analytics**  
✅ **PDF export for patient reports**  

---

## **Project Structure**
```
Care-Track/
│── backend/
│   ├── config/
│   │   ├── db.js          # MongoDB connection setup
│   ├── controllers/
│   │   ├── patientController.js   # Handles patient data operations
│   ├── middleware/
│   │   ├── app.js         # Middleware configurations
│   ├── models/
│   │   ├── Patient.js     # MongoDB schema for patient records
│   ├── routes/
│   │   ├── patientRoutes.js # API routes for patient management
│   ├── server.js         # Express server setup
│
│── frontend/
│   ├── public/
│   │   ├── index.html    # Entry point of frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AccountSettings.js  # User profile settings
│   │   │   ├── PatientList.js      # Displays patient records
│   │   │   ├── MedicalHistoryModal.js  # Modal for patient history
│   │   │   ├── VisitModal.js       # Logs patient visits
│   │   │   ├── PrescriptionModal.js  # Handles prescriptions
│   │   ├── utils/
│   │   │   ├── pdfUtils.js  # Exports patient data as PDFs
│   │   ├── views/
│   │   │   ├── Dashboard.js  # Main dashboard interface
│   │   │   ├── Analytics.js  # Visualization of patient trends
│   ├── App.js             # Root frontend component
│   ├── index.js           # React entry file
│
│── .gitignore              # Git ignored files
│── README.md               # Project documentation
```

---

## **Installation & Setup**
### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/Care-Track.git
cd Care-Track
```

### **2️⃣ Backend Setup**
```bash
cd backend
npm install
npm start
```
✔ Ensure MongoDB is running locally or provide a **MongoDB Atlas** connection.

### **3️⃣ Frontend Setup**
```bash
cd frontend
npm install
npm start
```

🚀 **Frontend will start at:** `http://localhost:3000`  
📡 **Backend server will run at:** `http://localhost:5000`

---

## **API Endpoints**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/patients` | GET | Fetch all patients |
| `/api/patients/:id` | GET | Get single patient record |
| `/api/patients` | POST | Add new patient |
| `/api/patients/:id` | PUT | Update patient data |
| `/api/patients/:id` | DELETE | Remove patient |

---

## **Contributing**
💡 **Want to contribute?**  
- Fork the repository  
- Create a new feature branch  
- Submit a pull request!

---

## **License**
📝 This project is **MIT Licensed**.

---

## **Acknowledgments**
Big thanks to **MongoDB**, **React.js**, **Node.js**, and **Express.js** communities for their amazing open-source tools that made **Care Track** possible! 🎯

---


