# Somacan Refactor — Full-Stack React + Node.js

A complete refactor of **shop.somacan.ma** with the scroll-storytelling animation style of **sidiharazem.ma**.

## Tech Stack

### Backend
- **Node.js** + **Express**
- **MySQL** + **Sequelize** (ORM)
- **Stripe** (payments)
- **Cloudinary** (image uploads)
- **JWT** authentication

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS**
- **GSAP** + **ScrollTrigger** (Sidi Harazem-style animations)
- **Lenis** (smooth scroll)
- **React Router**
- **Lucide React** (icons)

## Project Structure

```
somacan-refactor/
├── backend/
│   ├── models/         # Product, Order, Testimonial, Blog
│   ├── routes/         # API endpoints
│   ├── server.js       # Entry point
│   └── .env.example    # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI (Navbar, Footer, ScrollReveal, etc.)
│   │   ├── sections/   # Page sections (Hero, Products, etc.)
│   │   ├── pages/      # Route pages (Home, Shop, Cart, ProductDetail)
│   │   ├── context/    # CartContext
│   │   └── App.jsx     # Main app
│   └── index.html
└── README.md
```

## Setup

### Quick start (from repo root)
```bash
cd /Applications/XAMPP/xamppfiles/htdocs/somacan-refactor
cp backend/.env.example backend/.env
npm install
npm run install:all
npm run dev
```

### 1. Backend
```bash
cd backend
npm install
# Create .env file (see .env.example)
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and proxies API calls to `http://localhost:5001`.

## Key Animation Features (Sidi Harazem Style)

| Feature | Implementation |
|---------|---------------|
| Smooth Scroll | Lenis synced with GSAP ScrollTrigger |
| Parallax Layers | Cloud/gradient layers with different scroll speeds |
| Text Reveals | `overflow-hidden` + `y` transform with stagger |
| Scroll-Triggered Sections | GSAP ScrollTrigger `start: 'top 80%'` |
| Gradient Text | `bg-clip-text` with `bg-gradient-to-r` |
| Floating Elements | CSS `animate-float` keyframes |
| Pin & Fade Hero | Content fades + moves up on scroll |
| Staggered Cards | `stagger: 0.15` on product grids |

## Pages

- **/** — Home (Hero, Story, Products, Expertise, Offer, Testimonials, Blog, Features)
- **/shop** — Product listing with filters & sorting
- **/shop/:slug** — Product detail with image gallery, quantity selector
- **/cart** — Shopping cart with add/remove/update quantity

## Notes

- Replace placeholder images with real Somacan product photos
- Add your logo SVG as `/frontend/public/logo-somacan.svg`
- Connect frontend to backend API by uncommenting axios calls in components
- Add Stripe integration for payments in production
