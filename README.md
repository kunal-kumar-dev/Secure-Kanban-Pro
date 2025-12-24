# 🔒 Secure Kanban Pro

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Secure Kanban Pro** is a fast, clean, and modern Kanban-style task management board built using **Vanilla JavaScript**.  
It runs fully in the browser with local data persistence and kiosk-style protections designed to discourage casual inspection and misuse.

---

## 👨‍💻 Author

**Developed & Designed by:**  
### **Kunal Kumar**  
*Web Developer*

> Building practical tools with a strong focus on user experience, performance, and clean architecture.

---

## ✨ Key Features

### 🛡️ Kiosk-Style Protection (Client-Side)
- Disables right-click, common DevTools shortcuts (F12, Ctrl+Shift+I).
- Blocks global text selection except where editing is required.
- Designed to **discourage casual inspection** in demo or kiosk environments.

> Note: As this is a client-side application, these measures are deterrents, not absolute security.

### 🎨 Modern UI / UX
- Glassmorphism-inspired layout for columns and headers.
- Custom animated cursor with interactive scaling.
- Ripple animation feedback on clicks.
- One-click **Dark / Light mode** toggle (Dark mode default).

### ⚙️ Core Functionality
- Smooth drag-and-drop task movement.
- Local data persistence using `localStorage`.
- JSON-based board **Export & Import** for easy backups.
- Real-time task search and filtering.
- Priority tags (Low, Medium, High) for better task visibility.

---

## 📂 File Structure

```text
KanbanPro/
│
├── index.html      # App structure & layout
├── style.css       # Styling, themes, animations
├── script.js       # App logic, protections, import/export
└── README.md       # Project documentation
```

---

## 🚀 How to Run

1. Download or clone the repository.
2. Keep `index.html`, `style.css`, and `script.js` in the same folder.
3. Open `index.html` directly in your browser.
4. No server, Node.js, or database setup required.

---

## 🛠️ Usage Guide

| Action        | How to Use |
|--------------|------------|
| Add Column   | Click the **+ Column** button |
| Add Task     | Click **+ Add Task** inside a column |
| Edit Task    | Click on a task card |
| Move Task    | Drag and drop between columns |
| Delete Item  | Click the ✕ icon |
| Backup Data  | Click **Export** |
| Restore Data | Click **Import** |

---

## 📝 Customization

### Change Author Name in Footer

Open `index.html` and locate the footer section:

```html
<footer>
  System Secured | Dev: <strong style="color:var(--primary)">Kunal Kumar</strong>
</footer>
```

Replace the name if you fork or reuse the project.

---

## 📄 License

This project is licensed under the **MIT License**.

Copyright © 2025 **Kunal Kumar**

You are free to use, modify, and distribute this software with proper attribution.
