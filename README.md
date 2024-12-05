# 🎥 **Video Streaming Platform**
A YouTube-like video streaming platform where users can upload, view, like, comment, and subscribe to channels. Built with React.js for the frontend and Node.js with Express.js for the backend, this platform utilizes MongoDB for data storage, including dynamic storage management with GridFS for handling large video files.

---

## 📋 **Features**

### **Video Features**
- **Video Playback:** Stream videos with a custom-built player.
- **Upload and View Videos:** Users can upload videos with descriptions and thumbnails.
- **Likes and Comments:** Like videos and leave comments or replies.
- **Subscription System:** Subscribe and unsubscribe from content creators.
- **Infinite Scrolling:** Browse all video thumbnails with smooth infinite scrolling.
  
### **Dynamic Storage with GridFS**
- **Large File Storage:** Uses MongoDB's **GridFS** to efficiently store and retrieve large video files.
- **Streaming Support:** Stream videos directly from MongoDB without loading the entire file into memory.
- **Scalability:** Easily scalable to handle large volumes of video data with GridFS buckets.

### **User Features**
- **Authentication:** Secure user login and registration.
- **Profile Pages:** Detailed user profiles displaying uploaded videos, subscriber count, and more.
- **Dynamic Subscriptions:** Personalized subscription options based on logged-in user status.

### **Interactive UI**
- **Responsive Design:** Optimized for various devices using Bootstrap.
- **Modular Components:** Separate components for video player, comments, and profiles.
- **Real-Time Updates:** Like counts and comments update dynamically without refreshing the page.
---

## 🛠️ **Tech Stack**

### **Frontend**
- **React.js:** For building user interfaces.
- **Redux:** State management for user authentication and session tracking.
- **Axios:** Handling API requests.
- **React Icons:** For interactive icons (e.g., like buttons).
- **Bootstrap:** Responsive design and UI components.

### **Backend**
- **Node.js:** Server-side runtime environment.
- **Express.js:** Web framework for routing and API endpoints.
- **MongoDB:** NoSQL database for storing video, user, and comment data.
- **GridFS:** For managing large video and thumbnail files.
- **Mongoose:** Object Data Modeling (ODM) for MongoDB.
- **Multer:** File upload handling for videos and thumbnails.

### **Tools & Libraries**
- **JWT:** JSON Web Tokens for user authentication.
- **Postman:** API testing.
- **GitHub:** Version control and collaboration.

---

