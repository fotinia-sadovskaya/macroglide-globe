# 🌐 Macroglide Globe

Інтерактивна 3D-візуалізація глобуса з позначенням ключових фондових бірж світу. Кожна біржа представлена з логотипом, коротким описом та актуальними торговими даними.

**Frontend playground** побудований на [Vite](https://vitejs.dev/) та [react-three-fiber](https://github.com/pmndrs/react-three-fiber) — для 3D-візуалізацій у браузері.

**Мета:** Візуалізація глобальних макроекономічних показників у інтерактивному форматі

---

## 🚀🛠️ Технології

- [x] `Three.js` або `CesiumJS` — для 3D-глобуса
- [x] `Vite`
- [x] `React` / `Vue` — для UI
- [x] `TypeScript` (опціонально)
- [x] `TailwindCSS` / `Styled Components`
- [x] `Axios` / `Fetch API` — для отримання біржових даних
- [x] `D3.js` або `Chart.js` (для графіків)
- [x] `GeoJSON` — для географічного розташування точок

---

## 📦 Встановлення

```bash
git clone https://github.com/your-username/macroglide-globe.git
cd macroglide-globe
npm install
npm run dev
```

---

## 📁 Структура

```plaintext
macroglide-globe/
├── public/                  # Статичні файли (текстура глобуса, favicon тощо)
│   ├── logos/  
│      └── earth.glb
│   ├── models/  
│      └── earth.glb
│   └── earth_texture.jpg    
├── src/
│ ├── data/
│   ├── exchanges.js         # Окремий файл з координатами бірж.
│   └── exchanges.ts         
│ ├── types/
│     └── Exchange.ts
│ ├── utils/
│     └── utils.js           # Утилітарні функції, зокрема latLongToVector3
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

---

## 🧠 Функціонал

- 🌍 Інтерактивна карта світу
- 🔍 Пошук країн та регіонів
- 📍 Відображення бірж на глобусі (магентові точки)
- 🏢 Інформаційні поп-апи з логотипом, описом та цінами
- 📊 Відображення економічних даних у вигляді графіків (опціонально)
- 📁 Експорт даних у CSV
- 🧩 Центрування на регіон (наприклад, Азія)
- 🔄 Оновлення даних у реальному часі (опціонально)

---

## 📌 TODO

- [ ] Анімації переходів між сценами
- [ ] Інтеграція з API для динамічних даних
- [ ] Збереження обраних країн
- [ ] Авторизація користувачів
- [ ] Збереження стану користувача
- [ ] Темна тема

---

## 📑 Ліцензія та авторські права

MIT — вільне використання з зазначенням авторства.

Цей проєкт використовує [NASA Earth Textures](https://blenderartists.org/t/8k-earth-texture-download-free/1193918) та інші публічні ресурси - [James Hastings-Trew](https://planetpixelemporium.com/earth.html) згідно з ліцензією [CC BY 4.0](https://blenderartists.org/t/8k-earth-texture-download-free/1193918).

---

### 🇨🇳 Приклад: Shanghai Stock Exchange

> **Shanghai SE** — найбільша біржа материкового Китаю, що відіграє ключову роль у розвитку економіки країни.

**Торгові дані:**

- 🔹 Остання ціна: `27420`
- 🟢 Купівля: `27370`
- 🔴 Продаж: `27420`

## 🌍🖼️ Візуалізація глобуса з біржами

[![Глобус з біржами](./screenshots/globe.png)](./screenshots/globe.png)

---

## 🌐 Онлайн версія

[👉 Відкрити MACROGLIDE Globe](https://fotinia-sadovskaya.github.io/macroglide-globe/)
