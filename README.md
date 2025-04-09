# **Spotify Tracker**

**Spotify Tracker** is a web app that focuses on **music recommendations** using machine learning and reinforcement learning techniques. The app provides personalized music suggestions, monthly recaps of listening habits, and detailed insights about top artists and tracks. Users can get AI-powered recommendations based on their preferences and discover new music that matches their taste.

## **Getting Started**

### **Prerequisites**

- Node.js 18.x or later
- npm or yarn
- MongoDB Atlas account
- Supabase account (required for user authentication)
- Spotify Developer account and app

### **Installation**

1. **Clone the repository**

```bash
git clone <repository-url>
cd spotify-tracker
```

2. **Install dependencies**

```bash
npm install --legacy-peer-deps
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/login/callback

# MongoDB Configuration
MONGODB_URI=your_mongodb_uri
```

4. **Set up Supabase tables**

Create a `spotify_tokens` table in Supabase PostgreSQL with the following structure:

```sql
CREATE TABLE spotify_tokens (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies to secure the table
ALTER TABLE spotify_tokens ENABLE ROW LEVEL SECURITY;

-- Only allow users to read their own tokens
CREATE POLICY "Users can read own tokens" ON spotify_tokens
  FOR SELECT USING (auth.uid() = id);

-- Only allow users to update their own tokens
CREATE POLICY "Users can update own tokens" ON spotify_tokens
  FOR UPDATE USING (auth.uid() = id);

-- Only allow users to insert their own tokens
CREATE POLICY "Users can insert own tokens" ON spotify_tokens
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Only allow users to delete their own tokens
CREATE POLICY "Users can delete own tokens" ON spotify_tokens
  FOR DELETE USING (auth.uid() = id);
```

This table stores the Spotify API tokens for each user and includes Row Level Security (RLS) policies to ensure users can only access their own data.

5. **Import songs for recommendation system**

To populate the database with songs from various genres (required for the recommendation system):

```bash
npm run import-songs
```

This script imports the top 500 songs from 30 major Spotify genres into your MongoDB database.

6. **Run the development server**

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

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
- ✅ **Create and schema the songs collection in MongoDB**
  - Define document structure with fields for song details, audio features, and metadata
  - Create indexes for efficient querying by name, artist, and audio characteristics
- ✅ **Develop script to import song data from Spotify API**
  - Batch import top tracks from major Spotify genres (500 songs per genre)
  - Store audio features and analysis data for ML processing
  - Create API endpoint to search the local song database
- 🔄 Create song preview functionality with audio snippets
- 🔄 Build batch processing system for preference analysis

### 🔄 Phase 4: ML/RL Integration
- Develop machine learning model for music recommendations
- Create feature extraction from song audio characteristics
- Implement user preference weighting system
- Set up model training pipeline using user feedback
- **Build external Python-based ML service**
  - Implement Flask RESTless API for machine learning operations
  - Design hybrid approach combining supervised and unsupervised learning
  - Create containerized deployment for scalable ML processing
  - Develop feature importance analysis for explainable recommendations

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

### 🔜 Phase 7: Final Polishing
- Conduct extensive user testing
- Optimize for mobile experience
- Run Lighthouse tests for performance optimization
- Final security audit
- Production deployment with monitoring

