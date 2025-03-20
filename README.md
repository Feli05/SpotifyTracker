# **Spotify Tracker**

**Spotify Tracker** is a web app that provides users with personalized **monthly music reports** based on their Spotify listening habits. Users can view their **top artists**, **top tracks**, **total listening time**, and **music trends** each month. The app allows for easy tracking of **historical data** and provides **music recommendations** based on listening behavior.

### **Features:**
- Personalized **monthly reports** (top artists, tracks, genres, etc.)
- Visual **charts** and **graphs** of listening trends
- **Historical data storage** to track music preferences over time
- **Spotify integration** to fetch user-specific data (via Spotify OAuth)
- **Music recommendations** based on user’s listening patterns

### **Tech Stack:**

- **Frontend**:  
  - **Next.js** (React framework)  
  - **Tailwind CSS** (for responsive UI)

- **Backend**:  
  - **Supabase** (Database, Authentication, Real-time features)  
  - **Spotify API** (to fetch user music data)

- **Deployment**:  
  - **Vercel** (for deployment and serverless functions)

### **How It Works:**
1. **User logs in** via Spotify OAuth.
2. App **fetches** data from Spotify and stores it in **Supabase**.
3. **Monthly reports** are generated and displayed to the user.
4. Data is updated monthly for ongoing tracking.
