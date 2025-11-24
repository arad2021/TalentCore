# דף Jobs - תכונות ופונקציונליות

## סקירה כללית
דף ה-Jobs הוא חלק מהפרויקט React המבוסס על `user-jobs.html` המקורי. הדף מספק חיפוש וסינון מתקדם של עבודות עם המלצות מותאמות אישית.

## תכונות עיקריות

### 🔍 חיפוש וסינון
- **חיפוש לפי שם חברה** - חיפוש מיידי בזמן הקלדה
- **סינון לפי מיקום** - 29 ערים בישראל
- **סינון לפי ניסיון** - 5 רמות ניסיון שונות
- **סינון לפי עבודה מרחוק** - Yes/No/Hybrid
- **סינון לפי סוג עבודה** - Full-time, Part-time, Contract, Internship, Freelance
- **סינון לפי תחום** - 29 תחומים שונים

### 🎯 המלצות מותאמות אישית
- **התאמה לפי פרופיל** - שימוש בנתונים מ-Candidate Ticket
- **סינון אוטומטי** - החלת העדפות המשתמש
- **אינדיקטור מותאם** - הצגת הודעה על המלצות מותאמות

### 💼 תצוגת עבודות
- **כרטיסי עבודה מתקדמים** - עיצוב מודרני עם אנימציות
- **פרטים מלאים** - כותרת, חברה, מיקום, דרישות
- **כפתור הגשה** - הגשה מיידית לעבודה
- **אנימציות** - אפקטי hover וטרנזישנים

## קומפוננטים

### JobsHeader
```jsx
<JobsHeader 
  onGoToProfile={handleGoToProfile}
  onLogout={handleLogout}
/>
```
- ניווט בין דפים
- כפתור חזרה לפרופיל
- כפתור Logout

### FilterSection
```jsx
<FilterSection 
  onApplyFilters={handleApplyFilters}
  onClearFilters={handleClearFilters}
  isPersonalized={isPersonalized}
/>
```
- חיפוש וסינון מתקדם
- ניקוי מסננים
- תמיכה בהמלצות מותאמות

### JobCard
```jsx
<JobCard 
  job={job}
  onApplyToJob={handleApplyToJob}
  index={index}
/>
```
- תצוגת פרטי עבודה
- כפתור הגשה
- אנימציות

### JobsList
```jsx
<JobsList 
  jobs={filteredJobs}
  onApplyToJob={handleApplyToJob}
  isLoading={isLoading}
/>
```
- רשימת עבודות
- מצב טעינה
- הודעת "לא נמצאו עבודות"

## נתוני עבודות לדוגמה

הפרויקט כולל 6 עבודות לדוגמה:

1. **Frontend Developer** - Tech Corp, Tel Aviv
2. **Backend Developer** - Data Systems, Haifa  
3. **UI/UX Designer** - Creative Agency, Jerusalem
4. **DevOps Engineer** - Cloud Solutions, Remote
5. **Data Scientist** - Analytics Pro, Tel Aviv
6. **Mobile Developer** - App Studio, Herzliya

## ניווט

### מ-Profile ל-Jobs
```jsx
// ב-UserPortal
const handleOpenJobs = () => {
  onOpenJobs(); // מעבר לדף Jobs
};
```

### מ-Jobs ל-Profile
```jsx
// ב-UserJobs
const handleGoToProfile = () => {
  onGoToProfile(); // חזרה לפרופיל
};
```

## עיצוב

### CSS Classes עיקריות
- `.job-card` - כרטיס עבודה
- `.filter-section` - אזור סינון
- `.search-input` - שדה חיפוש
- `.btn-primary` - כפתור הגשה
- `.jobs-grid` - רשת עבודות

### אנימציות
- `fade-in-up` - הופעה מלמטה
- `slide-in-left` - החלקה משמאל
- `pulse` - פעימה
- `spin` - סיבוב (טעינה)

## שימוש

### הפעלת הפרויקט
```bash
cd react
npm install
npm start
```

### ניווט לדף Jobs
1. פתח את הפרויקט
2. לחץ על כפתור "Jobs" ב-Header
3. השתמש בסינון וחיפוש
4. הגש לעבודות שמעניינות אותך

### החזרה לפרופיל
1. לחץ על "Profile" ב-Header
2. או לחץ על הלוגו "Welcome Yossi"

## תכונות מתקדמות

### Auto-save
- שמירה אוטומטית של העדפות
- אינדיקטור שמירה

### Responsive Design
- עיצוב רספונסיבי מלא
- תמיכה במובייל וטאבלט

### Accessibility
- תמיכה מלאה ב-ARIA
- ניווט במקלדת
- Screen reader support

### Performance
- Lazy loading
- Optimized rendering
- Efficient state management
