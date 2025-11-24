# סוגי משתמשים - הוראות מהירות

## סקירה כללית
הפרויקט כולל שני סוגי משתמשים:
1. **User** - סטודנט/מחפש עבודה
2. **Recruiter** - מגייס/מנהל משאבי אנוש

## מעבר בין סוגי משתמשים

### כפתורי החלפה
בפינה הימנית העליונה יש כפתורי החלפה:
- **User** - מעבר למצב משתמש
- **Recruiter** - מעבר למצב מגייס

### קוד דוגמה
```jsx
// ב-App.js
const [userType, setUserType] = useState('user');

const handleSwitchToRecruiter = () => {
  setUserType('recruiter');
  setCurrentPage('profile');
};

const handleSwitchToUser = () => {
  setUserType('user');
  setCurrentPage('profile');
};
```

## תכונות לפי סוג משתמש

### User Portal
- **Profile** - דף פרופיל סטודנט
- **Jobs** - חיפוש והגשה לעבודות
- **Resume** - העלאת קורות חיים
- **Education** - פרטי השכלה
- **Skills** - כישורים והתמחויות
- **Projects** - פרויקטים אישיים
- **Applications** - בקשות עבודה
- **Personal Info** - פרטים אישיים
- **Candidate Ticket** - העדפות עבודה

### Recruiter Portal
- **Profile** - דף פרופיל מגייס
- **Jobs Management** - ניהול עבודות
- **Personal Info** - פרטים אישיים
- **Job Posting** - פרסום עבודות
- **Candidate Viewing** - צפייה במועמדים

## ניווט

### User Navigation
```
Profile → Jobs → Profile
```

### Recruiter Navigation
```
Profile → Jobs → Profile
```

### Shared Navigation
- **Jobs** - דף משותף לחיפוש עבודות
- **Logout** - יציאה מהמערכת

## עיצוב

### User Portal
- עיצוב בהיר ונעים
- צבעים כחולים וירוקים
- התמקדות בחיפוש עבודות

### Recruiter Portal
- עיצוב מקצועי
- צבעים כהים ואפורים
- התמקדות בניהול עבודות

## תכונות משותפות

### Header
- לוגו עם שם המשתמש
- ניווט לעבודות
- כפתור Logout

### Jobs Page
- חיפוש עבודות
- סינון מתקדם
- הגשה לעבודות

### Auto-save
- שמירה אוטומטית
- אינדיקטור שמירה
- LocalStorage

## קוד דוגמה

### App.js Structure
```jsx
const renderCurrentPage = () => {
  if (userType === 'recruiter') {
    if (currentPage === 'profile') {
      return <RecruiterPortal />;
    } else if (currentPage === 'jobs') {
      return <UserJobs />;
    }
  } else {
    if (currentPage === 'profile') {
      return <UserPortal />;
    } else if (currentPage === 'jobs') {
      return <UserJobs />;
    }
  }
};
```

### User Type Switcher
```jsx
<div className="user-type-switcher">
  <button 
    onClick={handleSwitchToUser}
    className={userType === 'user' ? 'active' : ''}
  >
    User
  </button>
  <button 
    onClick={handleSwitchToRecruiter}
    className={userType === 'recruiter' ? 'active' : ''}
  >
    Recruiter
  </button>
</div>
```

## פתרון בעיות

### המעבר לא עובד
1. בדוק שה-state מתעדכן
2. בדוק את ה-console לראות שגיאות
3. וודא שהפונקציות מועברות נכון

### העיצוב לא נכון
1. בדוק שה-CSS הנכון נטען
2. וודא שה-class names נכונים
3. בדוק את ה-media queries

### הנתונים לא נשמרים
1. בדוק את ה-LocalStorage
2. וודא שה-auto-save עובד
3. בדוק את ה-console לראות שגיאות

## טיפים

### פיתוח
- השתמש ב-conditional rendering
- שמור על state נפרד לכל סוג משתמש
- השתמש ב-props drilling מינימלי

### UX
- הוסף אינדיקטור לסוג המשתמש הנוכחי
- שמור על עקביות בעיצוב
- הוסף transitions חלקים

### Performance
- השתמש ב-React.memo
- הימנע מ-re-renders מיותרים
- השתמש ב-useCallback לפונקציות

## תכונות עתידיות

### אפשרויות נוספות
- **Admin Portal** - ניהול מערכת
- **Company Portal** - פורטל חברה
- **Analytics Dashboard** - לוח בקרה

### אינטגרציות
- **Authentication** - מערכת אימות
- **Database** - בסיס נתונים
- **API** - ממשקי תכנות

### תכונות מתקדמות
- **Real-time Updates** - עדכונים בזמן אמת
- **Notifications** - התראות
- **Chat System** - מערכת צ'אט
