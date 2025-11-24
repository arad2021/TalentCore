# ניווט בין דפים - הוראות מהירות

## סקירה כללית
הפרויקט כולל שני דפים עיקריים:
1. **Profile** - דף הפרופיל הראשי
2. **Jobs** - דף חיפוש עבודות

## ניווט

### מ-Profile ל-Jobs
1. לחץ על כפתור **"Jobs"** ב-Header העליון
2. הדף יעבור אוטומטית לדף Jobs

### מ-Jobs ל-Profile  
1. לחץ על כפתור **"Profile"** ב-Header העליון
2. או לחץ על הלוגו **"Welcome Yossi"**
3. הדף יעבור חזרה לפרופיל

## תכונות ניווט

### Header משותף
- שני הדפים משתמשים ב-Header דומה
- כפתורי ניווט זהים
- עיצוב זהה

### State Management
- הניווט מנוהל ב-App.js
- שימוש ב-useState לניהול הדף הנוכחי
- העברת פונקציות בין קומפוננטים

### URL Parameters
- תמיכה ב-URL parameters
- `?personalized=true` - להמלצות מותאמות
- שמירת מצב בסיס נתונים מקומי

## קוד דוגמה

### App.js
```jsx
const [currentPage, setCurrentPage] = useState('profile');

const handleGoToProfile = () => {
  setCurrentPage('profile');
};

const handleOpenJobs = () => {
  setCurrentPage('jobs');
};
```

### UserPortal.js
```jsx
const handleOpenJobs = () => {
  onOpenJobs(); // מעבר ל-Jobs
};
```

### UserJobs.js
```jsx
const handleGoToProfile = () => {
  onGoToProfile(); // חזרה ל-Profile
};
```

## תכונות מתקדמות

### Breadcrumbs
- הצגת מיקום נוכחי
- ניווט מהיר בין דפים

### Back Button
- כפתור חזרה בדפדפן
- שמירת היסטוריית ניווט

### Deep Linking
- קישורים ישירים לדפים
- שמירת מצב ב-URL

## פתרון בעיות

### הניווט לא עובד
1. וודא שהפונקציות מועברות נכון
2. בדוק את ה-console לראות שגיאות
3. וודא שה-state מתעדכן

### דף לא נטען
1. בדוק את ה-imports
2. וודא שהקומפוננטים קיימים
3. בדוק את ה-CSS

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
