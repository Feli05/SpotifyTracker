to install packages: npm install --legacy-peer-deps

# **Spotify Tracker**

**Spotify Tracker** is a web app that focuses on **music recommendations** using machine learning and reinforcement learning techniques. The app provides personalized music suggestions, monthly recaps of listening habits, and detailed insights about top artists and tracks. Users can get AI-powered recommendations based on their preferences and discover new music that matches their taste.

### **Features:**
- **AI-powered music recommendations** using ML/RL
- Personalized **monthly reports** (top artists, tracks, genres)
- Visual **charts** and **graphs** of listening trends
- **Historical data storage** to track music preferences
- **Spotify integration** via OAuth
- **Interactive recommendation questionnaire**

### **Tech Stack:**
*(Current stack - subject to change)*

- **Frontend**:  
  - **Next.js** (React framework)  
  - **Tailwind CSS** (for responsive UI)
  - **HeroUI** (UI component library)

- **Backend**:  
  - **Supabase** (Database, Authentication, Real-time features)  
  - **Spotify API** (to fetch user music data)

- **Deployment**:  
  - **Vercel** (for frontend deployment)

  

### **How It Works:**
1. **User logs in** via Spotify OAuth
2. App **fetches** data from Spotify and stores it in **Supabase**
3. **Monthly reports** are generated and displayed
4. Users can get personalized recommendations through an interactive questionnaire
5. ML/RL models analyze user preferences to generate music suggestions

### **Development Roadmap:**

#### Phase 1: UI/UX Updates
~~ - Update sidebar menu structure: ~~
~~ - New Recommendations ~~
~~ - Monthly Recap ~~
~~ - Top Artists ~~
~~ - Top Tracks ~~
~~ - Account ~~
- Implement Account page UI
- Create Top Artists page with grid layout
- Design Top Tracks page with table layout

#### Phase 2: Recommendation System
- Create interactive questionnaire UI
- Implement recommendation flow:
  - User answers 3-4 questions
  - System generates personalized recommendations
  - Display recommendations in dashboard
  - Create playlist functionality

#### Phase 3: ML/RL Integration
- Develop recommendation engine
- Implement user preference analysis
- Create feedback loop for recommendation improvement

#### Phase 4: Monthly Recap Implementation
- Create Monthly Recap Page
- Persist previous month's data in DB.

#### Phase 5/Final Phase: Last Revisions
- Make sure there are no vulnerabilities.
- Run Lighthouse Test for Web App performance.
- Deploy Web App. 
