to install packages: npm install --legacy-peer-deps

# **Spotify Tracker**

**Spotify Tracker** is a web app that focuses on **music recommendations** using machine learning and reinforcement learning techniques. The app provides personalized music suggestions, monthly recaps of listening habits, and detailed insights about top artists and tracks. Users can get AI-powered recommendations based on their preferences and discover new music that matches their taste.

## **Features**

- **AI-powered music recommendations** using ML/RL
- **Interactive song preference system** with swipe interface
- **Personalized recommendation questionnaire** based on mood and activity
- **Progressive unlocking system** to encourage user engagement
- Personalized **monthly reports** (top artists, tracks, genres)
- Visual **charts** and **graphs** of listening trends
- **Historical data storage** to track music preferences
- **Spotify integration** via OAuth

## **Tech Stack**

- **Frontend**:  
  - **Next.js** with App Router
  - **TypeScript** for type-safe code
  - **Tailwind CSS** for responsive UI
  - **Framer Motion** for smooth animations
  - **Custom component system** with modular design

- **Backend**:  
  - **Supabase** for user authentication and PostgreSQL database
  - **MongoDB** for music preferences and recommendations storage
  - **Next.js API Routes** for serverless functionality
  - **Spotify API** for music data and integration

- **Architecture**:
  - **Supabase Auth** for user management and authentication
  - **PostgreSQL tables**: users, spotify_tokens
  - **MongoDB Collections**: preferences, recommendations, songs
  - **Component-based UI** with reusable elements
  - **Modular design** with separation of concerns

- **Deployment**:  
  - **Vercel** for frontend and serverless backend (not final)
  - **Supabase** for authentication and relational data
  - **MongoDB Atlas** for document-based data

## **How It Works**

1. **User signs up/logs in** via Supabase authentication
2. **Spotify connection** established and tokens stored in PostgreSQL
3. Users **rate songs** by swiping left (dislike) or right (like)
4. After rating enough songs, **recommendation questionnaire unlocks**
5. User answers questions about their **current mood and activity**
6. **ML model** analyzes preferences and questionnaire responses
7. **Personalized recommendations** are generated and displayed
8. User can **save recommendations** to their Spotify account

## **Key Components**

- **Song Card**: Interactive card with album art, song info, and audio preview
- **Recommendation Cards**: Visual representation of recommendation categories
- **Progress Tracker**: Shows user progress toward unlocking features
- **Questionnaire Interface**: Intuitive UI for capturing user mood and preferences

## **Development Roadmap**

### ✅ Phase 1: UI/UX Implementation
- Create responsive dashboard layout
- Design reusable icon system
- Implement recommendation card components
- Build song preference interface with swipe functionality

### ✅ Phase 2: Authentication & Database Integration
- Set up Supabase authentication and user management
- Create PostgreSQL tables for user data and Spotify tokens
- Implement MongoDB collections for music-related data
- Design API endpoints for data retrieval and storage

### 🔄 Phase 3: Recommendation System Enhancement
- **[HIGH PRIORITY]** Create and schema the songs collection in MongoDB
  - Define document structure with fields for song details, audio features, and metadata
  - Create indexes for efficient querying by name, artist, and audio characteristics
- **[HIGH PRIORITY]** Develop script to import song data from Spotify API
  - Batch import popular tracks and genre-specific songs
  - Store audio features and analysis data for ML processing
  - Create API endpoint to search the local song database
- Create song preview functionality with audio snippets
- Build batch processing system for preference analysis

### 🔄 Phase 4: ML/RL Integration
- Develop machine learning model for music recommendations
- Create feature extraction from song audio characteristics
- Implement user preference weighting system
- Set up model training pipeline using user feedback

### 🔜 Phase 5: Advanced Features
- Create personalized monthly recap
- Implement playlist generation and export
- Add social sharing capabilities
- Develop artist discovery features
- Integrate genre-based recommendations

### 🔜 Phase 6: Performance & Scaling
- Optimize database queries with proper indexing
- Implement caching for frequently accessed data
- Add rate limiting and quota management
- Enhance security measures for user data
- Set up analytics to track user engagement

### 🔜 Phase 7: Final Polishing
- Conduct extensive user testing
- Optimize for mobile experience
- Run Lighthouse tests for performance optimization
- Final security audit
- Production deployment with monitoring

## **Future Plans**

- **Real-time collaborative playlists** for shared listening experiences
- **Mood-based music therapy** features
- **Integration with wearable devices** to detect mood automatically
- **Advanced visualization** of music taste evolution over time
- **Cross-platform mobile app** development 
