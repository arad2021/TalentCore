# Recruiter Portal - תכונות ופונקציונליות

## סקירה כללית
דף ה-Recruiter Portal הוא חלק מהפרויקט React המבוסס על `recruiter-portal.html` המקורי. הדף מספק כלים מתקדמים לניהול עבודות ומועמדים.

## תכונות עיקריות

### 👤 ניהול פרופיל
- **כרטיס פרופיל מתקדם** - עיצוב מודרני עם אנימציות
- **העלאת תמונות** - Avatar ו-Cover photo
- **סטטיסטיקות** - מספר עבודות פעילות ומועמדים
- **פרטים אישיים** - עריכה ושמירה אוטומטית

### 💼 ניהול עבודות
- **הוספת עבודות חדשות** - טופס מתקדם עם ולידציה
- **עריכת עבודות קיימות** - שינוי פרטים וסטטוס
- **שינוי סטטוס** - Active/Closed עם אינדיקטורים ויזואליים
- **צפייה במועמדים** - מספר מועמדים לכל עבודה

### 🔄 Auto-save
- **שמירה אוטומטית** - כל שינוי נשמר אוטומטית
- **אינדיקטור שמירה** - הצגת סטטוס שמירה
- **LocalStorage** - שמירה מקומית של נתונים

## קומפוננטים

### RecruiterHeader
```jsx
<RecruiterHeader 
  onRefreshProfile={handleRefreshProfile}
  onOpenJobs={handleOpenJobs}
  onLogout={handleLogout}
  recruiterName={profileData.name}
/>
```
- Header מיוחד ל-Recruiter
- הצגת שם ה-Recruiter
- ניווט לעבודות

### RecruiterProfileCard
```jsx
<RecruiterProfileCard 
  profileData={profileData}
  onAvatarUpload={handleAvatarUpload}
  onCoverUpload={handleCoverUpload}
  onRefreshProfile={handleRefreshProfile}
/>
```
- כרטיס פרופיל מתקדם
- העלאת תמונות
- סטטיסטיקות עבודות

### JobsManagementSection
```jsx
<JobsManagementSection 
  jobs={profileData.jobs}
  onAddJob={handleAddJob}
  onEditJob={handleEditJob}
  onToggleJobStatus={handleToggleJobStatus}
  onViewCandidates={handleViewCandidates}
/>
```
- ניהול עבודות מלא
- הוספה ועריכה
- שינוי סטטוס

### RecruiterPersonalInfoSection
```jsx
<RecruiterPersonalInfoSection 
  personalInfo={profileData}
  onSavePersonalInfo={handleSavePersonalInfo}
/>
```
- עריכת פרטים אישיים
- טופס מתקדם
- שמירה אוטומטית

## נתוני עבודות לדוגמה

הפרויקט כולל 3 עבודות לדוגמה:

1. **Senior Frontend Developer** - TechCorp Inc., Tel Aviv (Active, 12 מועמדים)
2. **Full Stack Developer** - StartupXYZ, Remote (Active, 8 מועמדים)  
3. **DevOps Engineer** - BigTech Corp, Herzliya (Closed, 15 מועמדים)

## ניווט

### מעבר בין סוגי משתמשים
```jsx
// ב-App.js
const handleSwitchToRecruiter = () => {
  setUserType('recruiter');
  setCurrentPage('profile');
};

const handleSwitchToUser = () => {
  setUserType('user');
  setCurrentPage('profile');
};
```

### ניווט בתוך Recruiter Portal
- **Profile** - דף הפרופיל הראשי
- **Jobs** - דף חיפוש עבודות (משותף עם User)

## עיצוב

### CSS Classes עיקריות
- `.recruiter-portal` - הקונטיינר הראשי
- `.profile-card` - כרטיס פרופיל
- `.jobs-management` - ניהול עבודות
- `.job-status` - סטטוס עבודה
- `.auto-save-indicator` - אינדיקטור שמירה

### אנימציות
- `fadeInUp` - הופעה מלמטה
- `hover` effects - אפקטי hover
- `loading` states - מצבי טעינה
- `transition` effects - טרנזישנים חלקים

## שימוש

### הפעלת הפרויקט
```bash
cd react
npm install
npm start
```

### מעבר ל-Recruiter Portal
1. פתח את הפרויקט
2. לחץ על כפתור "Recruiter" בפינה הימנית העליונה
3. השתמש בכלי ניהול העבודות

### הוספת עבודה חדשה
1. לחץ על "Post New Job"
2. מלא את פרטי העבודה
3. לחץ על "Post Job"

### עריכת עבודה קיימת
1. לחץ על כפתור העריכה ליד העבודה
2. שנה את הפרטים הרצויים
3. שמור את השינויים

## תכונות מתקדמות

### Auto-save
- שמירה אוטומטית של כל שינוי
- אינדיקטור שמירה ויזואלי
- שמירה ב-LocalStorage

### File Upload
- העלאת תמונות Avatar
- העלאת תמונות Cover
- ולידציה של סוג וגודל קובץ

### Job Management
- הוספת עבודות חדשות
- עריכת עבודות קיימות
- שינוי סטטוס עבודות
- צפייה במספר מועמדים

### Responsive Design
- עיצוב רספונסיבי מלא
- תמיכה במובייל וטאבלט
- Grid layout מתקדם

### Accessibility
- תמיכה מלאה ב-ARIA
- ניווט במקלדת
- Screen reader support
- Skip links

## אינטגרציה

### עם User Portal
- שיתוף דף Jobs
- ניווט משותף
- עיצוב עקבי

### עם Jobs Portal
- חיפוש עבודות
- סינון מתקדם
- הגשה לעבודות

## Performance

### Optimizations
- Lazy loading
- Debounced auto-save
- Efficient state management
- CSS containment

### Memory Management
- Cleanup של event listeners
- Optimized re-renders
- Efficient file handling

## פתרון בעיות

### העלאת קבצים לא עובדת
1. בדוק את סוג הקובץ (רק תמונות)
2. בדוק את גודל הקובץ (מקסימום 2-3MB)
3. בדוק את ה-console לראות שגיאות

### Auto-save לא עובד
1. בדוק את ה-LocalStorage
2. בדוק את ה-console לראות שגיאות
3. וודא שהפונקציה נקראת

### עיצוב לא נכון
1. וודא שה-CSS נטען
2. בדוק את ה-class names
3. וודא שה-media queries עובדים

## טיפים

### ביצועים
- השתמש ב-React.memo לקומפוננטים
- הימנע מ-re-renders מיותרים
- השתמש ב-useCallback לפונקציות

### UX
- הוסף loading states
- השתמש ב-transitions חלקים
- הוסף feedback למשתמש

### Accessibility
- וודא ניווט במקלדת
- הוסף ARIA labels
- תמיכה ב-screen readers
