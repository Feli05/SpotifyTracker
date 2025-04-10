# **Spotify Tracker**

**Spotify Tracker** is a web app that focuses on **music recommendations** using machine learning and reinforcement learning techniques. The app provides personalized music suggestions, monthly recaps of listening habits, and detailed insights about top artists and tracks. Users can get AI-powered recommendations based on their preferences and discover new music that matches their taste.

> **Note**: This project uses the [NextUI Dashboard Template](https://github.com/brandonhenness/nextui-dashboard-template) as a base for its UI components and layout, which is built on top of the [HeroUI](https://heroui.com/) React component library.

## **Getting Started**

### **Prerequisites**

- Docker and Docker Compose
- MongoDB Atlas account
- Supabase account (required for user authentication)
- Spotify Developer account and app

### **Installation**

1. **Set up environment variables**

Copy `.env.example` to `.env` and fill in your credentials. See the example file for detailed variable descriptions.

2. **Set up Supabase tables**

Create a `spotify_tokens` table in Supabase PostgreSQL with the following structure:

```sql
CREATE TABLE spotify_tokens (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE spotify_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own tokens" ON spotify_tokens
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own tokens" ON spotify_tokens
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own tokens" ON spotify_tokens
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own tokens" ON spotify_tokens
  FOR DELETE USING (auth.uid() = id);
```

3. **Build and start the services**

```bash
# Build the web service
docker compose build web

# Build the ML service
docker compose build ml-service

# Start all services
docker compose up -d
```

The application will be available at:
- Web app: http://localhost:{WEB_PORT}
- ML service: http://localhost:{ML_PORT}

4. **Import songs for recommendation system**

To populate the database with songs from various genres (required for the recommendation system):

```bash
docker-compose exec web npm run import-songs
```

This script imports the top 500 songs from 30 major Spotify genres into your MongoDB Atlas database.

## **Features**

- **AI-powered music recommendations** using ML/RL
- **Interactive song preference system** with swipe interface
- **Song previews** for immediate listening before deciding preferences
- **Personalized recommendation questionnaire** based on mood and activity
- **Progressive unlocking system** to encourage user engagement
- Personalized **monthly reports** (top artists, tracks, genres)
- **Historical data storage** to track music preferences
- **Spotify integration** via OAuth

## **Tech Stack**

- **Frontend**:  
  - **Next.js** with App Router
  - **TypeScript** for type-safe code
  - **Tailwind CSS** for responsive UI
  - **HeroUI** for UI components and layout
  - **Framer Motion** for smooth animations

- **Backend**:  
  - **Supabase** for user authentication and PostgreSQL database
  - **MongoDB** for music preferences and recommendations storage
  - **Next.js API Routes** for serverless functionality
  - **Spotify API** for music data and integration
  - **spotify-preview-finder** for accessing song preview URLs

- **Machine Learning**:
  - Python with Flask
  - scikit-learn for ML models
  - Pandas for data processing
  - Containerized with Docker

- **Infrastructure**:
  - Docker and Docker Compose
  - MongoDB Atlas for database
  - Supabase for auth and relational data

## **How It Works**

1. **User signs up/logs in** via Supabase authentication
2. **Spotify connection** established and tokens stored in PostgreSQL
3. Users **rate songs** by swiping left (dislike) or right (like)
4. After rating enough songs, **recommendation questionnaire unlocks**
5. User answers questions about their **current mood and activity**
6. **ML model** analyzes preferences and questionnaire responses
7. **Personalized recommendations** are generated and displayed

## **Development Roadmap**

### ✅ Phase 1: Core Features
- [x] Spotify authentication
- [x] Basic listening history tracking
- [x] MongoDB integration
- [x] User profile management

### ✅ Phase 2: UI/UX Implementation
- [x] Responsive design
- [x] Dark mode support
- [x] Interactive animations
- [x] Loading states and error handling

### ✅ Phase 3: Recommendation System
- [x] Song preference collection
- [x] Interactive questionnaire
- [x] Basic recommendation algorithm
- [x] Dynamic visual components
  - [x] Particle animation system
  - [x] Reusable animation components
  - [x] Performance optimizations

### 🔄 Phase 4: ML/RL Integration
- [x] User preference data collection
- [x] Questionnaire answer storage
- [x] Build external Python-based ML service
  - [x] Implement Flask RESTless API
  - [ ] Design hybrid approach (supervised + unsupervised)
  - [x] Create containerized deployment
  - [ ] Develop feature importance analysis
- [ ] Model training pipeline
- [ ] Real-time recommendation updates

### 🔜 Phase 5: Advanced Features
- [ ] Social features
- [ ] Playlist generation
- [ ] Advanced analytics
- [ ] Mobile app

## **Project Structure**

```
spotify-tracker/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Next.js pages
│   ├── styles/            # CSS styles
│   └── utils/             # Utility functions
├── ml-service/            # Machine learning service
│   ├── app.py            # Flask application
│   ├── models/           # ML models
│   └── requirements.txt  # Python dependencies
├── docker-compose.yml    # Docker Compose configuration
└── README.md            # Project documentation
```

