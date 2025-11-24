# Student & Recruiter Portal - React Version

זהו פרויקט React מודרני המבוסס על קבצי ה-HTML המקוריים `user-portal.html` ו-`recruiter-portal.html`. הפרויקט שומר על העיצוב המקורי בדיוק ומשתמש בטכנולוגיות React מודרניות.

## תכונות

- **React 18** עם Hooks מודרניים
- **JSX** לקומפוננטים
- **State Management** עם useState ו-useEffect
- **Event Handling** מלא
- **Responsive Design** זהה למקור
- **Accessibility** מלא עם ARIA labels
- **Auto-save** אינדיקטור
- **File Upload** פונקציונליות
- **Form Validation** ו-Error Handling
- **Navigation** בין דפי Profile ו-Jobs
- **Job Search & Filtering** מתקדם
- **Personalized Job Recommendations**
- **Dual User Types** - User ו-Recruiter
- **Recruiter Portal** עם ניהול עבודות
- **Job Management** - הוספה, עריכה, סגירה
- **Candidate Management** - צפייה במועמדים

## התקנה והרצה

1. **התקנת dependencies:**
   ```bash
   cd react
   npm install
   ```

2. **הרצת הפרויקט:**
   ```bash
   npm start
   ```

3. **פתיחת הדפדפן:**
   הפרויקט יפתח אוטומטית ב-http://localhost:3000

## מבנה הפרויקט

```
react/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── ProfileCard.js
│   │   ├── ResumeSection.js
│   │   ├── EducationSection.js
│   │   ├── QualificationsSection.js
│   │   ├── ProjectsSection.js
│   │   ├── ApplicationsSection.js
│   │   ├── PersonalInfoSection.js
│   │   ├── CandidateTicketSection.js
│   │   ├── UserPortal.js
│   │   ├── JobsHeader.js
│   │   ├── FilterSection.js
│   │   ├── JobCard.js
│   │   ├── JobsList.js
│   │   ├── UserJobs.js
│   │   ├── RecruiterHeader.js
│   │   ├── RecruiterProfileCard.js
│   │   ├── JobsManagementSection.js
│   │   ├── RecruiterPersonalInfoSection.js
│   │   └── RecruiterPortal.js
│   ├── App.js
│   ├── index.js
│   ├── index.css
│   ├── jobs.css
│   └── recruiter.css
├── package.json
└── README.md
```

## קומפוננטים

### Header
- ניווט ראשי
- כפתור Jobs
- כפתור Logout
- לוגו אינטראקטיבי

### ProfileCard
- תצוגת פרופיל משתמש
- העלאת תמונות (Avatar & Cover)
- AI Score עם אנימציה
- סטטוס זמינות
- סטטיסטיקות (פרויקטים ומועמדויות)

### ResumeSection
- העלאת קובץ CV
- Drag & Drop פונקציונליות
- תצוגת קובץ נוכחי

### EducationSection
- עריכת פרטי השכלה
- שמירה אוטומטית
- Validation

### QualificationsSection
- עריכת כישורים טכניים
- שפות
- הסמכות

### ProjectsSection
- הוספת פרויקטים
- קישורים ל-GitHub ו-Demo
- תצוגת רשימת פרויקטים

### ApplicationsSection
- תצוגת מועמדויות לעבודה
- סטטוסים שונים
- פעולות (צפייה, ביטול, הכנה לראיון)

### PersonalInfoSection
- עריכת פרטים אישיים
- שמירה אוטומטית

### CandidateTicketSection
- הגדרת העדפות עבודה
- מיקום, ניסיון, עבודה מרחוק
- קבלת המלצות עבודה

### JobsHeader
- ניווט לדף Jobs
- כפתור חזרה לפרופיל
- כפתור Logout

### FilterSection
- חיפוש לפי שם חברה
- סינון לפי מיקום, ניסיון, עבודה מרחוק
- סינון לפי סוג עבודה ותחום
- ניקוי מסננים

### JobCard
- תצוגת פרטי עבודה
- כפתור הגשה לעבודה
- אנימציות וטרנזישנים

### JobsList
- רשימת עבודות מסוננות
- מצב טעינה
- הודעת "לא נמצאו עבודות"

### UserJobs
- הקומפוננט הראשי לדף Jobs
- ניהול מצב וסינון
- המלצות מותאמות אישית

### RecruiterHeader
- Header מיוחד ל-Recruiter Portal
- ניווט לעבודות
- כפתור Logout

### RecruiterProfileCard
- כרטיס פרופיל ל-Recruiter
- העלאת תמונות (Avatar ו-Cover)
- סטטיסטיקות עבודות ומועמדים

### JobsManagementSection
- ניהול עבודות ל-Recruiter
- הוספת עבודות חדשות
- עריכת עבודות קיימות
- שינוי סטטוס עבודות

### RecruiterPersonalInfoSection
- עריכת פרטים אישיים ל-Recruiter
- שמירה אוטומטית
- טופס עריכה מתקדם

### RecruiterPortal
- הקומפוננט הראשי ל-Recruiter Portal
- ניהול מצב כולל
- אינטגרציה עם כל הקומפוננטים

## טכנולוגיות

- **React 18.2.0**
- **React DOM 18.2.0**
- **React Scripts 5.0.1**
- **Font Awesome 6.0.0** (CDN)
- **CSS Variables** ו-Custom Properties
- **Modern JavaScript (ES6+)**

## תכונות מיוחדות

1. **State Management**: שימוש ב-useState ו-useEffect לניהול מצב
2. **Event Handling**: טיפול מלא באירועי משתמש
3. **Form Management**: ניהול טפסים עם validation
4. **File Upload**: העלאת קבצים עם drag & drop
5. **Auto-save**: אינדיקטור שמירה אוטומטית
6. **Responsive**: עיצוב רספונסיבי זהה למקור
7. **Accessibility**: תמיכה מלאה ב-ARIA ו-keyboard navigation

## הבדלים מהמקור

- **React Components**: חלוקה לקומפוננטים נפרדים
- **State Management**: ניהול מצב עם React hooks
- **Event Handling**: טיפול באירועים עם React
- **No JavaScript Files**: כל הלוגיקה ב-React components
- **Modern Structure**: מבנה מודרני וניתן לתחזוקה

הפרויקט שומר על העיצוב המקורי בדיוק ומספק חוויית משתמש זהה עם טכנולוגיות React מודרניות.
