const express = require('express');
const path = require('path');
const cors = require('cors'); // Додаємо cors для серверу Express

const app = express();
const port = 8000;

// Дозволити CORS для всіх запитів
app.use(cors());

// Вказуємо, що папка з файлами для фронтенду - це 'frontend'
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
