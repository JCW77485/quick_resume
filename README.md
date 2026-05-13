# QuickResume - Vue 3 SaaS Resume Builder

A professional resume builder migrated to Vue 3 using the **Options API**. Features include a custom PHP/MySQL backend, Stripe Checkout integration, 10 templates, and an Admin Dashboard.

## 🚀 Deployment (InfinityFree / Shared Hosting)

This project is optimized for deployment on services like InfinityFree.

### 1. Database Setup
1. Log into your control panel (cPanel/vPanel).
2. Create a new MySQL database named `quick_resume` (or any name provided by your host).
3. Open **phpMyAdmin** and import the `sql/schema.sql` file provided in this repository.

### 2. Configuration
Before uploading, you **must** update your credentials in `api/config.php`:

```php
// api/config.php
define('DB_HOST', 'sqlxxx.infinityfree.com'); // Your MySQL Hostname
define('DB_NAME', 'if0_xxxx_quick_resume');    // Your Database Name
define('DB_USER', 'if0_xxxx');                 // Your Database Username
define('DB_PASS', 'your_password');           // Your Database Password

define('STRIPE_SECRET_KEY', 'sk_test_...');    // Your Stripe Secret Key
define('APP_URL', 'https://your-site.com');    // Your live site URL
```

### 3. Uploading Files
1. Copy the contents of the `dist/` folder to your website's root directory (usually `htdocs/` or `public_html/`) via FTP.
2. Ensure the `api/` folder is present inside your root directory.

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## 🔒 Security
- **Sessions:** The app uses secure PHP sessions for authentication.
- **SQL Injection:** All database queries use PDO prepared statements.
- **Access Control:** Endpoints are protected by a `require_auth()` and `require_admin()` check.
