# CV Upload Functionality

## Overview
This document describes the CV upload functionality that has been added to the Candidate system.

## Features Added

### 1. File Storage Service (`FileStorageService.java`)
- Handles file upload, download, and deletion
- Validates file types (only PDF files allowed)
- Generates unique filenames to prevent conflicts
- Manages file storage in `./uploads/cv/` directory

### 2. Candidate Service Updates (`CandidateService.java`)
- `uploadCV(Long candidateId, MultipartFile file)` - Upload CV for a candidate
- `downloadCV(Long candidateId)` - Download CV file
- `deleteCV(Long candidateId)` - Delete CV file
- `hasCV(Long candidateId)` - Check if candidate has CV

### 3. Candidate Controller Endpoints (`CandidateController.java`)
- `POST /api/Candidate/{candidateId}/cv/upload` - Upload CV
- `GET /api/Candidate/{candidateId}/cv/download` - Download CV (as attachment)
- `GET /api/Candidate/{candidateId}/cv/view` - View CV (inline in browser)
- `DELETE /api/Candidate/{candidateId}/cv` - Delete CV
- `GET /api/Candidate/{candidateId}/cv/exists` - Check if CV exists

### 4. Configuration Updates
- Added file upload configuration in `application.properties`
- Maximum file size: 10MB
- File storage directory: `./uploads/cv/`

## API Usage Examples

### Upload CV
```bash
POST /api/Candidate/1/cv/upload
Content-Type: multipart/form-data

Form data:
- file: [PDF file]
```

### Download CV
```bash
GET /api/Candidate/1/cv/download
```

### View CV in Browser
```bash
GET /api/Candidate/1/cv/view
```

### Delete CV
```bash
DELETE /api/Candidate/1/cv
```

### Check if CV Exists
```bash
GET /api/Candidate/1/cv/exists
```

## Database Changes
- The `Candidate` model already has a `cv` field (String) that stores the filename
- No database schema changes were needed

## File Storage
- Files are stored in `./uploads/cv/` directory
- Filename format: `cv_{candidateId}_{uuid}.pdf`
- Old CV files are automatically deleted when a new one is uploaded

## Security Considerations
- Only PDF files are accepted
- File size limit: 10MB
- Unique filenames prevent conflicts
- Files are validated before storage

## Error Handling
- Returns appropriate error messages for invalid files
- Handles missing candidates gracefully
- Provides clear feedback for all operations
