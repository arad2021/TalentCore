# CV API Examples

## Frontend Integration Examples

### 1. Upload CV (React/JavaScript)
```javascript
const uploadCV = async (candidateId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch(`/api/Candidate/${candidateId}/cv/upload`, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.text();
    console.log(result); // "CV uploaded successfully"
  } catch (error) {
    console.error('Error uploading CV:', error);
  }
};
```

### 2. Download CV
```javascript
const downloadCV = async (candidateId) => {
  try {
    const response = await fetch(`/api/Candidate/${candidateId}/cv/download`);
    
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cv.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  } catch (error) {
    console.error('Error downloading CV:', error);
  }
};
```

### 3. View CV in Browser
```javascript
const viewCV = (candidateId) => {
  window.open(`/api/Candidate/${candidateId}/cv/view`, '_blank');
};
```

### 4. Check if CV Exists
```javascript
const checkCVExists = async (candidateId) => {
  try {
    const response = await fetch(`/api/Candidate/${candidateId}/cv/exists`);
    const exists = await response.json();
    return exists;
  } catch (error) {
    console.error('Error checking CV:', error);
    return false;
  }
};
```

### 5. Delete CV
```javascript
const deleteCV = async (candidateId) => {
  try {
    const response = await fetch(`/api/Candidate/${candidateId}/cv`, {
      method: 'DELETE'
    });
    
    const result = await response.text();
    console.log(result); // "CV deleted successfully"
  } catch (error) {
    console.error('Error deleting CV:', error);
  }
};
```

## HTML Form Example
```html
<form id="cvUploadForm" enctype="multipart/form-data">
  <input type="file" id="cvFile" accept=".pdf" required>
  <button type="submit">Upload CV</button>
</form>

<script>
document.getElementById('cvUploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const fileInput = document.getElementById('cvFile');
  const file = fileInput.files[0];
  
  if (file && file.type === 'application/pdf') {
    await uploadCV(candidateId, file);
  } else {
    alert('Please select a PDF file');
  }
});
</script>
```

## React Component Example
```jsx
import React, { useState } from 'react';

const CVUpload = ({ candidateId }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    try {
      await uploadCV(candidateId, file);
      alert('CV uploaded successfully!');
    } catch (error) {
      alert('Error uploading CV');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept=".pdf" 
        onChange={handleFileChange}
      />
      <button 
        onClick={handleUpload} 
        disabled={!file || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload CV'}
      </button>
    </div>
  );
};
```
