# 🌐 Macroglide Globe

**Frontend playground** побудований на [Vite](https://vitejs.dev/) та [react-three-fiber](https://github.com/pmndrs/react-three-fiber) — для 3D-візуалізацій у браузері.
**Мета:** Візуалізація глобальних макроекономічних показників у інтерактивному форматі

## 🚀 Технології

- [x] Vite
- [x] React
- [x] TypeScript (опціонально)
- [x] TailwindCSS / Styled Components
- [x] Axios / Fetch API
- [x] D3.js або Chart.js (для графіків)

## 📦 Встановлення

```bash
git clone https://github.com/your-username/macroglide-globe.git
cd macroglide-globe
npm install
npm run dev
```

## 📁 Структура

```plaintext
macroglide-globe/
├── public/                  # Статичні файли (текстура глобуса, favicon тощо)
│   └── earth_texture.jpg    
├── src/
│ ├── data/
│   ├── exchanges.js         # Окремий файл з координатами бірж.
│   └── exchanges.ts         
│ ├── types/
│   └── Exchange.ts
│ ├── utils/
│   └── utils.js             # Утилітарні функції, зокрема latLongToVector3
│ ├── assets/                # Зображення, текстури, медіа
│ ├── components/            # React-компоненти (Globe, точки, панелі)
│     ├── ExchangeDot.jsx         
│     ├── ExchangeObj.tsx  
│     └── GlobeScene.jsx     # Логіка Three.js: глобус, лінії, світло, камера.
│ ├── styles/                # CSS або Tailwind-конфігурації
│ ├── App.jsx                # Головний компонент додатку
│ └── main.jsx               # Точка входу в додаток
├── .gitignore               # Файли, які не потрапляють у репозиторій
├── README.md                # Документація проєкту
├── index.html               # HTML-шаблон для Vite
├── package.json             # Залежності та скрипти
└──vite.config.js            # Налаштування Vite
```

## 🧠 Функціонал

- 🔍 Пошук країн та регіонів
- 📊 Відображення економічних даних у вигляді графіків
- 🌍 Інтерактивна карта світу
- 📁 Експорт даних у CSV

## 📌 TODO

- [ ] Анімації переходів між сценами
- [ ] Інтеграція з API для динамічних даних
- [ ] Збереження обраних країн
- [ ] Авторизація користувачів
- [ ] Збереження стану користувача
- [ ] Темна тема

## 📄 Ліцензія

MIT — вільне використання з зазначенням авторства.
