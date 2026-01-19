# TaletCore - AI-Powered Job Recruitment Platform

A full-stack job recruitment platform that intelligently matches candidates with job opportunities using Google's Gemini AI. The platform provides separate portals for candidates and recruiters, featuring automated CV analysis, intelligent candidate-job matching, and comprehensive job management capabilities.

## 🚀 Features

### For Candidates
- **Profile Management**: Complete profile with personal information, education, qualifications, and projects
- **CV Upload & AI Analysis**: Upload CV (PDF/DOCX) and get automatic field extraction and experience estimation
- **GitHub Project Integration**: Link GitHub projects with technical skills
- **Job Search & Filtering**: Advanced search with filters for location, experience, remote work, and job type
- **Personalized Job Recommendations**: AI-powered job recommendations based on candidate profile and preferences
- **Job Applications Tracking**: Track application status and manage job offers
- **Profile Pictures**: Upload and manage profile and cover pictures

### For Recruiters
- **Job Management**: Create, edit, and manage job postings
- **AI-Powered Candidate Matching**: Find the best candidates for each job using Gemini AI
- **Candidate Analysis**: View detailed candidate profiles with compatibility scores
- **Application Management**: Review and manage job applications
- **Job Offers**: Send and track job offers to candidates
- **Candidate CV Access**: Download and view candidate CVs

## 🏗️ Architecture

### Tech Stack

**Backend:**
- **Spring Boot 3.5.4** - Java 17
- **PostgreSQL** - Primary database for entities
- **MongoDB** - Session storage
- **Spring Data JPA** - Database abstraction
- **Apache PDFBox** - PDF document processing
- **Apache POI** - Word document (DOC/DOCX) processing
- **SpringDoc OpenAPI** - API documentation

**Frontend:**
- **React 18** - Modern UI framework
- **React Hooks** - State management
- **CSS3** - Styling with custom properties
- **Font Awesome 6** - Icons

**AI Integration:**
- **Google Gemini 2.5 Flash API** - AI-powered analysis and matching

## 🤖 Gemini AI Integration

### Overview

The platform leverages Google's Gemini AI API to provide intelligent analysis and matching capabilities. The integration is implemented in the `GeminiService` class and provides two main functionalities:

1. **CV Analysis** - Automatic extraction of professional fields and experience
2. **Candidate-Job Matching** - Deep analysis of candidate projects against job requirements

### 1. CV Analysis (`analyzeCV`)

**Purpose**: Automatically extract professional fields and years of experience from uploaded CVs.

**How it works**:
1. Candidate uploads a CV (PDF or DOCX format)
2. The system extracts text from the document using Apache PDFBox/POI
3. The extracted text is sent to Gemini AI with a specialized prompt
4. Gemini analyzes the CV and extracts:
   - Professional fields (e.g., Software Development, Cloud Computing, DevOps)
   - Estimated years of experience for each field
5. The response is parsed and stored in the candidate's profile

**Prompt Engineering**:
- Uses structured instructions to ensure consistent output format
- Limits output to predefined professional fields (30+ categories)
- Requires integer values for years of experience
- Enforces CSV format: `field,years,field,years,...`

**Example Output**:
```
Software Development,3,Cloud Computing,2,DevOps,1
```

**Error Handling**:
- Implements retry logic with exponential backoff (3 retries)
- Handles API rate limits (429) and service unavailable (503) errors
- Graceful fallback if analysis fails

### 2. Candidate-Job Matching (`getCandidatesWithScore`)

**Purpose**: Analyze candidate compatibility with job requirements by examining their GitHub projects.

**How it works**:

1. **Project Filtering**:
   - System filters candidate projects based on technical skills overlap
   - Only projects with relevant technologies are analyzed

2. **Prompt Construction**:
   - Creates a detailed prompt with:
     - List of candidate's GitHub projects (with links)
     - Job requirements (technical skills)
     - Detailed analysis instructions

3. **AI Analysis**:
   - Gemini AI is instructed to:
     - Visit and analyze each GitHub repository
     - Extract actual technologies used (not just README)
     - Identify expertise level indicators
     - Match technologies to job requirements
     - Calculate compatibility score (0-100%)
     - Identify matched and missing skills
     - Generate summary explanation

4. **Response Processing**:
   - Extracts JSON from Gemini's response (handles various formats)
   - Parses compatibility score, matched skills, missing skills, and summary
   - Returns structured data for frontend display

**Prompt Structure**:
```
You are an expert AI system for analyzing technical compatibility...

Task:
1. Deep project analysis:
   - Visit and read each GitHub link
   - Extract technologies actually used in code
   - Identify expertise level indicators

2. Skill matching logic:
   - Match extracted technologies to job requirements
   - Weight matches by depth and relevance

3. Score calculation:
   - Produce compatibility_score (0-100%)

4. Summary reasoning:
   - Explain strengths and weaknesses
```

**Output Format**:
```json
{
  "compatibility_score": 85,
  "matched_skills": ["Java", "Spring Boot", "PostgreSQL"],
  "missing_skills": ["Docker", "Kubernetes"],
  "summary": "Strong backend development experience with Java and Spring Boot..."
}
```

**Advanced Features**:
- **Retry Logic**: 3 attempts with exponential backoff (1s, 2s, 4s)
- **JSON Extraction**: Robust parsing that handles:
  - JSON wrapped in code blocks (```json ... ```)
  - Plain JSON objects
  - Nested Gemini API response structure
- **Error Handling**: Graceful degradation if API fails
- **Batch Processing**: Analyzes multiple candidates efficiently

### API Configuration

The Gemini API is configured via `application.properties`:

```properties
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
gemini.api.key=YOUR_GEMINI_API_KEY_HERE
```

**Model Used**: `gemini-2.5-flash` - Optimized for speed and efficiency

**Generation Parameters**:
- `temperature: 0.1` - Low temperature for consistent, factual responses
- `topP: 0.8` - Balanced creativity and focus

### Implementation Details

**Service Class**: `GeminiService.java`

**Key Methods**:
- `generateResponse(String prompt)` - Core API communication
- `analyzeCV(String cv)` - CV analysis
- `getCandidatesWithScore(ArrayList<Candidate>, Job)` - Candidate matching
- `getCandidateScore(Candidate, Job)` - Individual candidate analysis
- `createPrompt(ArrayList<Project>, String)` - Prompt engineering
- `extractJsonFromGeminiResponse(String)` - Response parsing
- `extractBalancedBraces(String)` - JSON extraction utility

**Error Handling Strategy**:
1. API call with retry mechanism
2. Response validation
3. JSON extraction with multiple fallback methods
4. Graceful error messages for frontend

## 📁 Project Structure

```
Parna/
├── TaletCore/                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/Temp/
│   │   │   │   ├── Controller/    # REST Controllers
│   │   │   │   ├── Service/       # Business Logic (including GeminiService)
│   │   │   │   ├── Model/         # JPA Entities
│   │   │   │   ├── Repository/    # Data Access Layer
│   │   │   │   ├── DTOs/          # Data Transfer Objects
│   │   │   │   └── Config/        # Configuration
│   │   │   └── resources/
│   │   │       ├── application.properties.example
│   │   │       └── application.properties (not in git)
│   │   └── test/
│   └── pom.xml
│
└── app/                          # React Frontend
    ├── src/
    │   ├── components/           # React Components
    │   ├── services/             # API Service Layer
    │   ├── constants/            # Constants and Data
    │   └── utils/                # Utility Functions
    └── package.json
```

## 🛠️ Setup & Installation

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 14+
- PostgreSQL
- MongoDB
- Google Gemini API Key

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Parna/TaletCore
   ```

2. **Configure database**
   - Create PostgreSQL database
   - Update `application.properties`:
     ```properties
     spring.datasource.url=jdbc:postgresql://localhost:5432/your_database
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     ```

3. **Configure Gemini API**
   - Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Update `application.properties`:
     ```properties
     gemini.api.key=YOUR_GEMINI_API_KEY_HERE
     ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```
   Server runs on `http://localhost:8081`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd app
   npm install
   ```

2. **Run the application**
   ```bash
   npm start
   ```
   App runs on `http://localhost:3000`

## 🔐 Security

- **Sensitive files excluded**: `application.properties` is in `.gitignore`
- **API keys**: Stored in environment variables or `application.properties` (not in git)
- **File uploads**: Stored in `uploads/` directory (excluded from git)
- **CORS**: Configured for specific origins

## 📊 Database Schema

### Main Entities
- **Candidate**: User profile, CV, projects, ticket (preferences)
- **Recruiter**: Recruiter profile and company information
- **Job**: Job postings with requirements and details
- **JobApplication**: Applications from candidates to jobs
- **JobOffer**: Offers from recruiters to candidates
- **Project**: GitHub projects linked to candidates
- **Ticket**: Candidate job preferences (location, experience, etc.)

## 🎯 Key Features Explained

### Intelligent Job Matching

The system uses a two-stage matching process:

1. **Initial Filtering**: Matches candidates based on job preferences (location, experience level, remote work)
2. **AI Analysis**: Uses Gemini AI to analyze GitHub projects and calculate compatibility scores

### CV Processing Pipeline

1. **Upload**: Candidate uploads CV (PDF/DOCX)
2. **Text Extraction**: Apache PDFBox/POI extracts text
3. **AI Analysis**: Gemini extracts fields and experience
4. **Storage**: Results stored in candidate profile
5. **Recommendations**: Used for personalized job matching

## 🚦 API Endpoints

### Candidate Endpoints
- `POST /api/Candidate/signup` - Register new candidate
- `GET /api/Candidate/signin/{email}` - Sign in
- `GET /api/Candidate/details/{id}` - Get candidate details
- `PUT /api/Candidate/{id}/ticket` - Update job preferences
- `POST /api/Candidate/{id}/cv/upload` - Upload CV
- `POST /api/Candidate/apply` - Apply to job

### Recruiter Endpoints
- `POST /api/Recruiter/signup` - Register new recruiter
- `GET /api/Recruiter/signin/{email}` - Sign in
- `POST /api/Recruiter/createjob` - Create job posting
- `GET /api/Recruiter/gemini/getcandidates/{jobId}` - Get AI-matched candidates
- `POST /api/Recruiter/createjoboffer` - Send job offer

## 🧪 Testing

Run backend tests:
```bash
cd TaletCore
mvn test
```

**Built with ❤️ using Spring Boot, React, and Google Gemini AI**

  
