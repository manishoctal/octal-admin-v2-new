# 🚀 Admin Panel Skeleton  

A lightweight and modular **Admin Panel Skeleton** built with **React + Vite**.  
It provides a clean project structure, reusable components, and essential utilities to speed up dashboard and back-office application development.  

---

## 📂 Features  

- ⚡ **Blazing fast** setup with [Vite](https://vitejs.dev/)  
- 🎨 **Modern UI** with [Tailwind CSS](https://tailwindcss.com/)  
- 🧩 **Reusable components** (Buttons, Cards, Tables, Forms, Modals)  
- 🔄 **React Router** setup with protected and dynamic routes  
- 🔐 **Authentication-ready skeleton** (JWT/local storage placeholders)  
- 📊 Example **dashboard widgets** (charts, stats)  
- 🌗 Dark/Light theme support (optional)  
- 🛠️ Easy to extend and customize  

---

## 🏗️ Project Structure  

```bash
admin-panel-skeleton/
│── public/                # Static assets
│── src/
│   ├── assets/            # Images, icons, etc.
│   ├── components/        # Reusable UI components
│   ├── layouts/           # Admin layouts (Sidebar + Navbar)
│   ├── pages/             # Pages (Dashboard, Login, Users, etc.)
│   ├── routes/            # Route definitions & guards
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Helpers (auth, constants, fetch API)
│   ├── App.jsx            # Main app entry
│   ├── main.jsx           # Vite entry file
│── .env.example           # Example environment variables
│── index.html             # HTML template
│── tailwind.config.js     # Tailwind CSS configuration
│── vite.config.js         # Vite configuration
│── package.json           # Dependencies & scripts
│── README.md              # Project documentation
