# PROJECT OVERVIEW

Ce document décrit l’état actuel du projet tel qu’il existe dans le dépôt `/Applications/XAMPP/xamppfiles/htdocs/somacan-refactor`, en se basant uniquement sur les fichiers présents.

## Vue d’ensemble

- Frontend : application React + Vite dans `frontend/`
- Backend : API Express + Sequelize + MySQL dans `backend/`
- Communication front/back : le frontend appelle l’API via `frontend/src/lib/api.js` avec une base `'/api'`
- Auth : JWT côté backend, session stockée côté frontend dans `localStorage`
- Données client locales : panier et wishlist stockés en `localStorage`
- Base de données : MySQL via Sequelize

## Arborescence du projet

```text
/Applications/XAMPP/xamppfiles/htdocs/somacan-refactor
├── PROJECT_OVERVIEW.md
├── backend
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── config
│   │   └── database.js
│   ├── middleware
│   │   ├── admin.js
│   │   └── auth.js
│   ├── models
│   │   ├── Blog.js
│   │   ├── Category.js
│   │   ├── ContactSubmission.js
│   │   ├── Coupon.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── SiteContent.js
│   │   ├── StoreSetting.js
│   │   ├── Testimonial.js
│   │   ├── User.js
│   │   └── index.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── blogs.js
│   │   ├── checkout.js
│   │   ├── contact.js
│   │   ├── orders.js
│   │   ├── products.js
│   │   └── testimonials.js
│   ├── scripts
│   │   └── importSomacanCatalog.js
│   ├── server.js
│   └── services
│       ├── checkout.js
│       └── mailer.js
└── frontend
    ├── .gitignore
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── src
    │   ├── App.jsx
    │   ├── components
    │   │   ├── AdminAccessRoute.jsx
    │   │   ├── Footer.jsx
    │   │   ├── GradientText.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Noise.jsx
    │   │   ├── ParallaxImage.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── ScrollReveal.jsx
    │   │   └── SplitTextReveal.jsx
    │   ├── context
    │   │   ├── AuthContext.jsx
    │   │   ├── CartContext.jsx
    │   │   └── WishlistContext.jsx
    │   ├── data
    │   │   └── articles.js
    │   ├── hooks
    │   │   └── useProducts.js
    │   ├── index.css
    │   ├── lib
    │   │   └── api.js
    │   ├── main.jsx
    │   ├── pages
    │   │   ├── About.jsx
    │   │   ├── AdminLogin.jsx
    │   │   ├── Blog.jsx
    │   │   ├── BlogArticle.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── ClaimOrderAccount.jsx
    │   │   ├── Contact.jsx
    │   │   ├── GuestOrderAccess.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Register.jsx
    │   │   ├── Shop.jsx
    │   │   ├── Wishlist.jsx
    │   │   ├── account
    │   │   │   ├── AccountOrders.jsx
    │   │   │   ├── AccountOverview.jsx
    │   │   │   ├── AccountProfile.jsx
    │   │   │   ├── AccountSecurity.jsx
    │   │   │   ├── AccountSupport.jsx
    │   │   │   └── AccountWishlist.jsx
    │   │   └── admin
    │   │       ├── AdminContent.jsx
    │   │       ├── AdminCoupons.jsx
    │   │       ├── AdminForms.jsx
    │   │       ├── AdminOrders.jsx
    │   │       ├── AdminOverview.jsx
    │   │       ├── AdminProducts.jsx
    │   │       ├── AdminShipping.jsx
    │   │       └── AdminCategories.jsx
    │   └── sections
    │       ├── BlogPreview.jsx
    │       ├── BrandMarquee.jsx
    │       ├── CategorySection.jsx
    │       ├── ExpertiseSection.jsx
    │       ├── FaqSection.jsx
    │       ├── FeaturesBar.jsx
    │       ├── Hero.jsx
    │       ├── NewsletterSection.jsx
    │       ├── OfferSection.jsx
    │       ├── ProductsShowcase.jsx
    │       ├── SplitHeroSection.jsx
    │       ├── StatsSection.jsx
    │       ├── StorySection.jsx
    │       ├── TestimonialsSection.jsx
    │       └── WheelHero.jsx
    ├── tailwind.config.js
    └── vite.config.js
```

## Frontend

### Structure générale

- `frontend/src/main.jsx`
  - Point d’entrée React
  - Monte l’application dans `BrowserRouter`
  - Charge `frontend/src/index.css`
  - Charge aussi la CSS de Leaflet

- `frontend/src/App.jsx`
  - Compose l’application globale
  - Enveloppe l’app avec :
    - `AuthProvider`
    - `CartProvider`
    - `WishlistProvider`
  - Monte des éléments globaux :
    - `Noise`
    - `Navbar`
    - `Footer`
  - Initialise Lenis pour le smooth scroll
  - Initialise GSAP `ScrollTrigger`
  - Gère le scroll vers les ancres avec le hash
  - Déclare toutes les routes React Router

### Routes frontend

Routes déclarées dans `frontend/src/App.jsx` :

- `/` → `frontend/src/pages/Home.jsx`
- `/about` → `frontend/src/pages/About.jsx`
- `/shop` → `frontend/src/pages/Shop.jsx`
- `/shop/:slug` → `frontend/src/pages/ProductDetail.jsx`
- `/blog` → `frontend/src/pages/Blog.jsx`
- `/blog/:slug` → `frontend/src/pages/BlogArticle.jsx`
- `/cart` → `frontend/src/pages/Cart.jsx`
- `/checkout` → `frontend/src/pages/Checkout.jsx`
- `/contact` → `frontend/src/pages/Contact.jsx`
- `/login` → `frontend/src/pages/Login.jsx`
- `/register` → `frontend/src/pages/Register.jsx`
- `/wishlist` → `frontend/src/pages/Wishlist.jsx`
- `/guest/orders/:id` → `frontend/src/pages/GuestOrderAccess.jsx`
- `/claim-account` → `frontend/src/pages/ClaimOrderAccount.jsx`
- `/admin/login` → `frontend/src/pages/AdminLogin.jsx`
- `/admin` → route protégée via `frontend/src/components/AdminAccessRoute.jsx`
- `/account` → route protégée via `frontend/src/components/ProtectedRoute.jsx`

Sous-routes `/account` :

- `/account` → `frontend/src/pages/account/AccountOverview.jsx`
- `/account/orders` → `frontend/src/pages/account/AccountOrders.jsx`
- `/account/wishlist` → `frontend/src/pages/account/AccountWishlist.jsx`
- `/account/profile` → `frontend/src/pages/account/AccountProfile.jsx`
- `/account/security` → `frontend/src/pages/account/AccountSecurity.jsx`
- `/account/support` → `frontend/src/pages/account/AccountSupport.jsx`

Sous-routes `/admin` :

- `/admin` → `frontend/src/pages/admin/AdminOverview.jsx`
- `/admin/content` → `frontend/src/pages/admin/AdminContent.jsx`
- `/admin/categories` → `frontend/src/pages/admin/AdminCategories.jsx`
- `/admin/products` → `frontend/src/pages/admin/AdminProducts.jsx`
- `/admin/forms` → `frontend/src/pages/admin/AdminForms.jsx`
- `/admin/shipping` → `frontend/src/pages/admin/AdminShipping.jsx`
- `/admin/coupons` → `frontend/src/pages/admin/AdminCoupons.jsx`
- `/admin/orders` → `frontend/src/pages/admin/AdminOrders.jsx`

### Composants React importants

#### Layout et navigation

- `frontend/src/components/Navbar.jsx`
  - Header principal
  - Affiche la navigation, le panier, la wishlist et les actions auth
  - Tient compte de l’état de connexion
  - Gère un menu mobile

- `frontend/src/components/Footer.jsx`
  - Footer global

- `frontend/src/components/ProtectedRoute.jsx`
  - Autorise l’accès seulement si l’utilisateur est connecté
  - Redirige sinon vers `/login`

- `frontend/src/components/AdminAccessRoute.jsx`
  - Autorise l’accès admin si :
    - l’utilisateur connecté a `role === 'admin'`
    - ou une clé admin est stockée côté navigateur
  - Redirige sinon vers `/admin/login`

#### Effets visuels et animations

- `frontend/src/components/Noise.jsx`
  - Couche visuelle de texture/grain

- `frontend/src/components/ScrollReveal.jsx`
  - Wrapper d’apparition au scroll

- `frontend/src/components/SplitTextReveal.jsx`
  - Animation de texte découpé

- `frontend/src/components/ParallaxImage.jsx`
  - Effet de parallaxe sur image

- `frontend/src/components/GradientText.jsx`
  - Texte avec effet de gradient

### Sections de la home page

La page `frontend/src/pages/Home.jsx` compose ces sections :

- `frontend/src/sections/WheelHero.jsx`
- `frontend/src/sections/BrandMarquee.jsx`
- `frontend/src/sections/CategorySection.jsx`
- `frontend/src/sections/ProductsShowcase.jsx`
- `frontend/src/sections/StatsSection.jsx`
- `frontend/src/sections/SplitHeroSection.jsx`
- `frontend/src/sections/ExpertiseSection.jsx`
- `frontend/src/sections/OfferSection.jsx`
- `frontend/src/sections/TestimonialsSection.jsx`
- `frontend/src/sections/BlogPreview.jsx`
- `frontend/src/sections/FaqSection.jsx`
- `frontend/src/sections/NewsletterSection.jsx`
- `frontend/src/sections/FeaturesBar.jsx`

`frontend/src/pages/Home.jsx` utilise aussi GSAP `ScrollTrigger` pour modifier les couleurs de fond et de texte selon les sections marquées par `data-theme`.

### Pages frontend importantes

- `frontend/src/pages/Home.jsx`
  - Page d’accueil
  - Assemble les sections marketing et produit

- `frontend/src/pages/Shop.jsx`
  - Page catalogue/boutique

- `frontend/src/pages/ProductDetail.jsx`
  - Page produit par slug
  - Utilise `useProduct(slug)`
  - Gère quantité et ajout au panier

- `frontend/src/pages/Cart.jsx`
  - Vue panier

- `frontend/src/pages/Checkout.jsx`
  - Checkout connecté au backend
  - Gère :
    - mode invité ou connecté
    - devis serveur
    - coupon
    - coût de livraison
    - création de commande

- `frontend/src/pages/Wishlist.jsx`
  - Vue wishlist

- `frontend/src/pages/Login.jsx`
  - Connexion client

- `frontend/src/pages/Register.jsx`
  - Inscription client

- `frontend/src/pages/Contact.jsx`
  - Formulaire de contact
  - Appelle `submitContactForm(form)` vers le backend

- `frontend/src/pages/GuestOrderAccess.jsx`
  - Consultation d’une commande invitée via token

- `frontend/src/pages/ClaimOrderAccount.jsx`
  - Création/rattachement d’un compte depuis une commande invitée

- `frontend/src/pages/AdminLogin.jsx`
  - Connexion admin

### Contexts, état global et stockage local

#### `frontend/src/context/AuthContext.jsx`

Rôle :

- Gère l’état d’authentification
- Persiste la session dans `localStorage`
- Restaure l’utilisateur courant via `/api/auth/me`

Expose :

- `token`
- `user`
- `loading`
- `isAuthenticated`
- `isAdmin`
- `login(payload)`
- `register(payload)`
- `logout()`
- `acceptAuthPayload(data)`
- `updateProfile(payload)`

Clé locale :

- `somacan-auth`

#### `frontend/src/context/CartContext.jsx`

Rôle :

- Gère le panier côté frontend
- Persiste les articles dans `localStorage`

Expose :

- `items`
- `addToCart(product, quantity)`
- `removeFromCart(productId)`
- `updateQuantity(productId, quantity)`
- `clearCart()`
- `totalItems`
- `totalPrice`

Clé locale :

- `somacan-cart`

#### `frontend/src/context/WishlistContext.jsx`

Rôle :

- Gère la wishlist côté frontend
- Persiste la wishlist dans `localStorage`

Expose :

- `items`
- `addToWishlist(product)`
- `removeFromWishlist(productId)`
- `toggleWishlist(product)`
- `isWishlisted(productId)`
- `totalItems`

Clé locale :

- `somacan-wishlist`

### Hooks

#### `frontend/src/hooks/useProducts.js`

Expose :

- `useProducts(query)`
- `useProduct(slug)`

Rôle :

- Charge les produits depuis le backend
- Normalise plusieurs champs numériques :
  - `price`
  - `oldPrice`
  - `originalPrice`
  - `stock`
  - `discount`
  - `rating`
  - `reviews`

### Services frontend

#### `frontend/src/lib/api.js`

Rôle :

- Point central des appels HTTP frontend
- Ajoute automatiquement :
  - le token JWT dans `Authorization`
  - la clé admin dans `x-admin-key` si nécessaire

Base API :

- `API_BASE_URL = '/api'`

Clés locales utilisées :

- `somacan-auth`
- `somacan-admin-key`

### Endpoints backend utilisés par le frontend

Depuis `frontend/src/lib/api.js`, le frontend utilise ces endpoints :

#### Produits

- `GET /api/products`
- `GET /api/products/:slug`

#### Contact

- `POST /api/contact`

#### Checkout

- `GET /api/checkout/config`
- `POST /api/checkout/quote`

#### Commandes

- `POST /api/orders`
- `GET /api/orders/mine`
- `GET /api/orders/guest/:id?token=...`

#### Auth client

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `PUT /api/auth/password`
- `POST /api/auth/forgot-password`
- `GET /api/auth/claim-order-account/:token`
- `POST /api/auth/claim-order-account`

#### Auth admin

- `POST /api/auth/admin/login`

#### Admin

- `GET /api/admin/settings/shipping`
- `PUT /api/admin/settings/shipping`
- `GET /api/admin/coupons`
- `POST /api/admin/coupons`
- `PUT /api/admin/coupons/:id`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id`
- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `PUT /api/admin/categories/:id`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PUT /api/admin/products/:id`
- `GET /api/admin/content`
- `POST /api/admin/content`
- `PUT /api/admin/content/:id`
- `GET /api/admin/forms/contact-submissions`
- `PATCH /api/admin/forms/contact-submissions/:id`

### Styles

- `frontend/src/index.css`
  - Charge les polices
  - Déclare des classes utilitaires et des styles globaux
  - Contient notamment :
    - styles de base `body`, titres, `.font-display`
    - `.luxury-gradient`
    - `.glass-card`
    - `.section-padding`
    - `.btn-luxury`
    - `.btn-luxury-primary`
    - `.btn-luxury-outline`
    - styles de marquee
    - `.scrollbar-hide`
    - styles Swiper pour testimonials

- `frontend/tailwind.config.js`
  - Configuration Tailwind du frontend

- `frontend/postcss.config.js`
  - Configuration PostCSS

- `frontend/vite.config.js`
  - Configuration Vite

## Backend

### Point d’entrée

#### `backend/server.js`

Rôle :

- Charge les variables d’environnement avec `dotenv`
- Initialise Express
- Active `cors()` et `express.json()`
- Monte les routes API
- Ouvre la connexion MySQL
- Lance `sequelize.sync({ alter: true })`
- Démarre le serveur sur `process.env.PORT || 5000`

Routes montées :

- `/api/auth`
- `/api/checkout`
- `/api/admin`
- `/api/contact`
- `/api/products`
- `/api/orders`
- `/api/testimonials`
- `/api/blogs`

### Configuration

#### `backend/config/database.js`

Rôle :

- Initialise Sequelize pour MySQL

Variables attendues :

- `DB_NAME`
- `DB_USER`
- `DB_PASS`
- `DB_HOST`
- `DB_PORT`

### Middlewares

#### `backend/middleware/auth.js`

Expose :

- `attachUserIfPresent`
- `requireAuth`
- `requireAdminUser`
- `signUserToken`
- `serializeUser`

Rôle :

- Lit le JWT depuis `Authorization: Bearer ...`
- Charge l’utilisateur courant
- Protège les routes privées
- Sérialise l’utilisateur vers le frontend

#### `backend/middleware/admin.js`

Expose :

- `requireAdmin`

Rôle :

- Autorise les routes admin si :
  - l’utilisateur connecté a le rôle `admin`
  - ou `x-admin-key` correspond à `process.env.ADMIN_API_KEY`

### Modèles Sequelize

#### `backend/models/User.js`

Rôle :

- Utilisateur client ou admin

Champs notables observés via le code :

- `firstName`
- `lastName`
- `email`
- `password`
- `phone`
- `role`
- `addressLine1`
- `addressLine2`
- `city`
- `postalCode`
- `country`
- `latitude`
- `longitude`
- `locationLabel`

#### `backend/models/Product.js`

Rôle :

- Produit catalogue

Utilisé par :

- `backend/routes/products.js`
- `backend/routes/admin.js`
- `backend/services/checkout.js`

#### `backend/models/Category.js`

Rôle :

- Catégorie produit

Association déclarée dans `backend/models/index.js` :

- `Category.hasMany(Product, { foreignKey: 'categoryId' })`
- `Product.belongsTo(Category, { foreignKey: 'categoryId' })`

#### `backend/models/Order.js`

Rôle :

- Commande client ou invitée

Champs observés dans le code :

- `userId`
- `customer`
- `items`
- `totalAmount`
- `subtotalAmount`
- `shippingCost`
- `discountAmount`
- `couponCode`
- `couponSnapshot`
- `shippingSnapshot`
- `status`
- `paymentStatus`
- `paymentMethod`
- `notes`
- `orderAccessToken`
- `guestAccountToken`
- `guestConvertedAt`

#### `backend/models/Coupon.js`

Rôle :

- Coupon promotionnel

Utilisé par :

- `backend/services/checkout.js`
- `backend/routes/admin.js`

#### `backend/models/StoreSetting.js`

Rôle :

- Paramètres de boutique, notamment pour le checkout/livraison

#### `backend/models/SiteContent.js`

Rôle :

- Stockage de contenu CMS adminisable

#### `backend/models/ContactSubmission.js`

Rôle :

- Message soumis depuis la page contact

#### `backend/models/Blog.js`

Rôle :

- Article de blog

#### `backend/models/Testimonial.js`

Rôle :

- Témoignage affichable côté frontend

#### `backend/models/index.js`

Rôle :

- Déclare les associations Sequelize actuellement présentes

### Services backend

#### `backend/services/checkout.js`

Rôle :

- Centralise le calcul du checkout

Fonctions exportées :

- `getStoreSettings()`
- `calculateSubtotal(items)`
- `calculateShipping({ subtotal, city, settings })`
- `resolveCoupon({ code, subtotal, shippingCost })`
- `buildCheckoutQuote({ items, city, couponCode })`
- `incrementCouponUsage(coupon)`

#### `backend/services/mailer.js`

Rôle :

- Envoi email des commandes invitées si SMTP est configuré

Fonction exportée :

- `sendGuestOrderEmail({ order, trackUrl, claimUrl, createAccountAfterOrder })`

### Routes backend

#### `backend/routes/products.js`

Endpoints :

- `GET /api/products`
  - Liste des produits
  - Supporte les query params :
    - `category`
    - `featured`
    - `search`
- `GET /api/products/:slug`
  - Produit par slug
- `POST /api/products`
  - Création produit
- `PUT /api/products/:id`
  - Mise à jour produit

Remarque :

- Les endpoints `POST /api/products` et `PUT /api/products/:id` existent ici, mais l’interface admin frontend utilise les routes `/api/admin/products...`

#### `backend/routes/contact.js`

Endpoints :

- `POST /api/contact`

Rôle :

- Enregistre un formulaire de contact dans `ContactSubmission`

#### `backend/routes/blogs.js`

Endpoints :

- `GET /api/blogs`
  - Retourne les blogs publiés
  - Limité à 3 entrées
- `GET /api/blogs/:slug`

#### `backend/routes/testimonials.js`

Endpoints :

- `GET /api/testimonials`
  - Retourne les témoignages actifs

#### `backend/routes/checkout.js`

Endpoints :

- `GET /api/checkout/config`
- `POST /api/checkout/quote`

Rôle :

- Expose la configuration checkout et les calculs de devis

#### `backend/routes/orders.js`

Endpoints :

- `POST /api/orders`
  - Création de commande
  - Supporte invité et utilisateur connecté
- `GET /api/orders/mine`
  - Historique des commandes de l’utilisateur connecté
- `GET /api/orders/guest/:id`
  - Accès commande invitée via token
- `GET /api/orders/:id`
  - Récupération commande par id

Fonctionnement observé :

- Le serveur recalcule le total via `buildCheckoutQuote()`
- Une commande invitée peut générer :
  - `guestPortalUrl`
  - `accountClaimUrl`
- Si SMTP est configuré, un email invité peut être envoyé

#### `backend/routes/auth.js`

Endpoints :

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/admin/login`
- `GET /api/auth/me`
- `POST /api/auth/admin/bootstrap`
- `GET /api/auth/admin/users`
- `PUT /api/auth/profile`
- `PUT /api/auth/password`
- `GET /api/auth/claim-order-account/:token`
- `POST /api/auth/claim-order-account`
- `POST /api/auth/forgot-password`

Rôle :

- Auth client
- Auth admin
- Bootstrap premier admin
- Mise à jour profil/mot de passe
- Conversion d’une commande invitée en compte

#### `backend/routes/admin.js`

Toutes ces routes sont protégées par `requireAdmin`.

Endpoints :

- `GET /api/admin/settings/shipping`
- `PUT /api/admin/settings/shipping`
- `GET /api/admin/coupons`
- `POST /api/admin/coupons`
- `PUT /api/admin/coupons/:id`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id`
- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `PUT /api/admin/categories/:id`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PUT /api/admin/products/:id`
- `GET /api/admin/content`
- `POST /api/admin/content`
- `PUT /api/admin/content/:id`
- `GET /api/admin/forms/contact-submissions`
- `PATCH /api/admin/forms/contact-submissions/:id`

### Scripts backend

#### `backend/scripts/importSomacanCatalog.js`

Rôle :

- Script d’import catalogue, lancé via `npm run import:somacan-products`

## Lien entre frontend et backend

Le couplage actuel passe principalement par `frontend/src/lib/api.js`.

Schéma général :

1. Le frontend appelle des endpoints relatifs `/api/...`
2. Le backend Express expose ces routes dans `backend/server.js`
3. L’auth est gérée par JWT :
   - backend : émission/validation via `backend/middleware/auth.js`
   - frontend : stockage dans `localStorage` via `frontend/src/context/AuthContext.jsx`
4. Le panier et la wishlist restent côté frontend
5. Le checkout et la commande sont recalculés côté backend

## Fonctionnement des modules métier

### Panier

Source principale :

- `frontend/src/context/CartContext.jsx`

Fonctionnement :

- Le panier vit côté frontend en `localStorage`
- Les produits sont normalisés avant stockage
- Le checkout transforme le panier en payload d’items pour le backend
- Le total final de commande n’est pas pris depuis le frontend seul : il est recalculé côté serveur

### Wishlist

Source principale :

- `frontend/src/context/WishlistContext.jsx`

Fonctionnement :

- La wishlist est stockée localement côté navigateur
- Elle n’est pas synchronisée avec le backend dans les fichiers analysés

### Produits

Sources principales :

- Frontend :
  - `frontend/src/hooks/useProducts.js`
  - `frontend/src/pages/Shop.jsx`
  - `frontend/src/pages/ProductDetail.jsx`
- Backend :
  - `backend/routes/products.js`
  - `backend/models/Product.js`
  - `backend/models/Category.js`

Fonctionnement :

- Liste produits via `GET /api/products`
- Détail produit via `GET /api/products/:slug`
- Association catégorie incluse côté backend

### Auth

Sources principales :

- Frontend :
  - `frontend/src/context/AuthContext.jsx`
  - `frontend/src/pages/Login.jsx`
  - `frontend/src/pages/Register.jsx`
  - `frontend/src/components/ProtectedRoute.jsx`
  - `frontend/src/components/AdminAccessRoute.jsx`
- Backend :
  - `backend/routes/auth.js`
  - `backend/middleware/auth.js`
  - `backend/middleware/admin.js`
  - `backend/models/User.js`

Fonctionnement :

- Login/register client via `/api/auth/login` et `/api/auth/register`
- Session restaurée via `/api/auth/me`
- Auth admin via `/api/auth/admin/login`
- Les routes admin acceptent aussi une clé `x-admin-key` si configurée

### Commandes et checkout

Sources principales :

- Frontend :
  - `frontend/src/pages/Checkout.jsx`
  - `frontend/src/pages/GuestOrderAccess.jsx`
  - `frontend/src/pages/ClaimOrderAccount.jsx`
- Backend :
  - `backend/routes/checkout.js`
  - `backend/routes/orders.js`
  - `backend/services/checkout.js`
  - `backend/services/mailer.js`
  - `backend/models/Order.js`
  - `backend/models/Coupon.js`
  - `backend/models/StoreSetting.js`

Fonctionnement :

- Le frontend demande une config via `GET /api/checkout/config`
- Le frontend demande un devis via `POST /api/checkout/quote`
- Le backend calcule :
  - sous-total
  - livraison
  - remise coupon
  - total
- Lors de `POST /api/orders`, le backend recalcule à nouveau avant persistance
- Le guest checkout peut produire :
  - un lien de suivi invité
  - un lien de création/rattachement de compte

### Contact

Sources principales :

- Frontend : `frontend/src/pages/Contact.jsx`
- Backend : `backend/routes/contact.js`

Fonctionnement :

- Le formulaire frontend envoie les données à `POST /api/contact`
- Le backend enregistre une entrée `ContactSubmission`
- L’admin peut les consulter via `/api/admin/forms/contact-submissions`

## Variables d’environnement nécessaires

Variables réellement utilisées dans le code analysé :

### Base de données

- `DB_NAME`
- `DB_USER`
- `DB_PASS`
- `DB_HOST`
- `DB_PORT`

### Serveur / auth

- `PORT`
- `JWT_SECRET`
- `ADMIN_API_KEY`
- `ADMIN_SETUP_KEY`

### URLs applicatives

- `FRONTEND_APP_URL`

### SMTP / email

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `MAIL_FROM`

### Remarque sur `backend/.env.example`

Le fichier `backend/.env.example` existe, mais il ne reflète pas complètement la configuration actuelle observée dans le code.

Exemple :

- il mentionne `MONGODB_URI`
- alors que le backend courant utilise MySQL via Sequelize avec `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_HOST`, `DB_PORT`

## Commandes de lancement

### Frontend

Depuis `/Applications/XAMPP/xamppfiles/htdocs/somacan-refactor/frontend` :

```bash
npm install
npm run dev
```

Autres scripts disponibles :

```bash
npm run build
npm run preview
```

### Backend

Depuis `/Applications/XAMPP/xamppfiles/htdocs/somacan-refactor/backend` :

```bash
npm install
npm run dev
```

Autres scripts disponibles :

```bash
npm start
npm run import:somacan-products
```

## Comment ajouter une nouvelle fonctionnalité

### Ajouter une fonctionnalité côté frontend

Approche conforme à la structure actuelle :

1. Créer ou modifier une page dans `frontend/src/pages/` si la fonctionnalité est liée à une route
2. Créer des composants réutilisables dans `frontend/src/components/` si nécessaire
3. Créer une section dans `frontend/src/sections/` si la fonctionnalité appartient à la home ou à une page marketing découpée en blocs
4. Ajouter un hook dans `frontend/src/hooks/` si la logique de chargement/normalisation doit être réutilisée
5. Ajouter les appels API dans `frontend/src/lib/api.js`
6. Déclarer la route dans `frontend/src/App.jsx`
7. Si un état global est requis, l’ajouter dans `frontend/src/context/`

Exemple de flux :

- UI : `frontend/src/pages/NewFeature.jsx`
- appel HTTP : `frontend/src/lib/api.js`
- route : `frontend/src/App.jsx`

### Ajouter une fonctionnalité côté backend

Approche conforme à la structure actuelle :

1. Ajouter ou étendre un modèle dans `backend/models/`
2. Ajouter une route dans `backend/routes/`
3. Si la logique métier est réutilisable, la placer dans `backend/services/`
4. Si la fonctionnalité nécessite auth/admin, utiliser :
   - `backend/middleware/auth.js`
   - `backend/middleware/admin.js`
5. Monter la route dans `backend/server.js`
6. Redémarrer le backend pour laisser `sequelize.sync({ alter: true })` synchroniser le schéma

Exemple de flux :

- modèle : `backend/models/NewEntity.js`
- route : `backend/routes/new-entity.js`
- montage : `backend/server.js`
- consommation frontend : `frontend/src/lib/api.js`

## Dépendances observées

### Frontend `frontend/package.json`

Librairies notables :

- `react`
- `react-dom`
- `react-router-dom`
- `axios`
- `framer-motion`
- `gsap`
- `@gsap/react`
- `lenis`
- `lucide-react`
- `swiper`
- `leaflet`
- `react-leaflet`
- `clsx`
- `tailwind-merge`

### Backend `backend/package.json`

Librairies notables :

- `express`
- `sequelize`
- `mysql2`
- `jsonwebtoken`
- `bcryptjs`
- `cors`
- `dotenv`
- `nodemailer`
- `stripe`
- `multer`
- `cloudinary`

## Résumé technique

- Le frontend est une SPA React/Vite structurée par pages, sections, composants, hooks, contexts et un service API central.
- Le backend est une API Express/Sequelize avec auth JWT, panel admin, checkout serveur, commandes invitées et contenu administrable.
- Le panier et la wishlist sont locaux côté frontend.
- Les calculs de commande, coupon et livraison sont faits côté backend.
- L’admin dispose d’APIs dédiées pour shipping, coupons, commandes, catégories, produits, contenu et formulaires.
