# הוראות התקנה והרצה מהירות

## שלב 1: התקנת Node.js
אם עדיין לא מותקן, הורד והתקן Node.js מ-https://nodejs.org

## שלב 2: התקנת dependencies
```bash
cd react
npm install
```

## שלב 3: הרצת הפרויקט
```bash
npm start
```

## שלב 4: פתיחת הדפדפן
הפרויקט יפתח אוטומטית ב-http://localhost:3000

## פתרון בעיות נפוצות

### שגיאת "npm not found"
- וודא ש-Node.js מותקן
- הפעל מחדש את הטרמינל

### שגיאת "port 3000 already in use"
```bash
# עצור את הפרויקט הנוכחי (Ctrl+C)
# או השתמש בפורט אחר:
set PORT=3001 && npm start
```

### שגיאות dependencies
```bash
# מחק node_modules והתקן מחדש
rm -rf node_modules
rm package-lock.json
npm install
```

## תכונות הפרויקט
✅ עיצוב זהה למקור  
✅ פונקציונליות מלאה  
✅ React Hooks מודרניים  
✅ State Management  
✅ Event Handling  
✅ File Upload  
✅ Auto-save  
✅ Responsive Design  
✅ Accessibility  

## מבנה הפרויקט
- `src/components/` - כל הקומפוננטים
- `src/App.js` - הקומפוננט הראשי
- `src/index.css` - כל הסגנונות המקוריים
- `public/index.html` - קובץ HTML בסיסי
