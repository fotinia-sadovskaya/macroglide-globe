const fs = require('fs');
const path = require('path');

const BASE = '/macroglide-globe/';
const filePath = path.join(__dirname, 'index.html');

let html = fs.readFileSync(filePath, 'utf8');

// Функція для додавання BASE до шляху
const fixPath = (match, p1, p2) => {
    if (p2.startsWith('/')) {
        return `${p1}="${BASE}${p2.slice(1)}"`;
    }
    return match;
};

// Оновлюємо src, href, content
html = html.replace(/(src|href|content)="([^"]+)"/g, fixPath);

// Зберігаємо оновлений файл
fs.writeFileSync(filePath, html, 'utf8');

console.log('✅ Шляхи оновлено!');
