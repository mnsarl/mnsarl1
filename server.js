const express = require('express');
const app = express();
const port = 3000;

// تمكين الوصول للملفات الثابتة
app.use(express.static('.'));

// تشغيل الخادم
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 