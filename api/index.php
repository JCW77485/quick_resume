<?php
/**
 * QuickResume Backend API
 *
 * Provides endpoints for:
 * - User Authentication (Login/Signup with Sessions)
 * - Resume synchronization (MySQL)
 * - Stripe Checkout integration
 * - Subscription verification
 * - Admin Analytics
 */

require_once 'config.php';

// Basic session configuration
session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'domain' => '',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    die();
}

// --- DATABASE CONNECTION ---
$charset = 'utf8mb4';
$dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (\PDOException $e) {
     http_response_code(500);
     echo json_encode(['error' => 'Database connection failed. Please check api/config.php.']);
     die();
}

// --- HELPER FUNCTIONS ---

function stripe_request($endpoint, $data, $api_key) {
    $ch = curl_init("https://api.stripe.com/v1/" . $endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_USERPWD, $api_key . ":");
    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

function require_auth() {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Unauthorized']);
        die();
    }
    return $_SESSION['user_id'];
}

function require_admin($pdo) {
    $userId = require_auth();
    $stmt = $pdo->prepare("SELECT is_admin FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    if (!$user || !$user['is_admin']) {
        echo json_encode(['error' => 'Forbidden']);
        die();
    }
    return $userId;
}

// --- ROUTER ---
$method = $_SERVER['REQUEST_METHOD'];
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);
$path = str_replace(['/api/index.php', '/api'], '', $path);

$input = json_decode(file_get_contents('php://input'), true);

/**
 * POST /auth/signup
 */
if ($path === '/auth/signup' && $method === 'POST') {
    $email = $input['email'];
    $password = password_hash($input['password'], PASSWORD_DEFAULT);
    try {
        $stmt = $pdo->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
        $stmt->execute([$email, $password]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'User already exists or database error']);
    }
}
/**
 * POST /auth/login
 */
elseif ($path === '/auth/login' && $method === 'POST') {
    $email = $input['email'];
    $password = $input['password'];
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['is_admin'] = $user['is_admin'];
        unset($user['password']);
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        echo json_encode(['error' => 'Invalid credentials']);
    }
}
/**
 * POST /auth/logout
 */
elseif ($path === '/auth/logout' && $method === 'POST') {
    session_destroy();
    echo json_encode(['success' => true]);
}
/**
 * GET /auth/user
 */
elseif ($path === '/auth/user' && $method === 'GET') {
    $userId = require_auth();
    $stmt = $pdo->prepare("SELECT id, email, is_pro, is_admin FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    echo json_encode($stmt->fetch());
}
/**
 * GET /resumes
 */
elseif ($path === '/resumes' && $method === 'GET') {
    $userId = require_auth();
    $stmt = $pdo->prepare("SELECT * FROM resumes WHERE user_id = ? ORDER BY updated_at DESC");
    $stmt->execute([$userId]);
    echo json_encode($stmt->fetchAll());
}
/**
 * POST /resumes (UPSERT)
 */
elseif ($path === '/resumes' && $method === 'POST') {
    $userId = require_auth();
    $stmt = $pdo->prepare("INSERT INTO resumes (id, user_id, name, data, created_at, updated_at)
                           VALUES (?, ?, ?, ?, ?, ?)
                           ON DUPLICATE KEY UPDATE name=VALUES(name), data=VALUES(data), updated_at=VALUES(updated_at)");
    $stmt->execute([
        $input['id'],
        $userId,
        $input['name'],
        json_encode($input['data']),
        $input['created_at'],
        $input['updated_at']
    ]);
    echo json_encode(['success' => true]);
}
/**
 * POST /create-checkout-session
 */
elseif ($path === '/create-checkout-session' && $method === 'POST') {
    $userId = require_auth();

    $data = [
        'payment_method_types' => ['card'],
        'line_items' => [[
            'price_data' => [
                'currency' => 'usd',
                'product_data' => [
                    'name' => 'QuickResume Pro',
                ],
                'unit_amount' => 1000,
            ],
            'quantity' => 1,
        ]],
        'mode' => 'payment',
        'success_url' => APP_URL . '/#/builder?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url' => APP_URL . '/#/pricing',
        'metadata' => [
            'user_id' => $userId
        ]
    ];

    $session = stripe_request('checkout/sessions', $data, STRIPE_SECRET_KEY);

    if (isset($session['id'])) {
        echo json_encode(['id' => $session['id'], 'url' => $session['url']]);
    } else {
        echo json_encode(['error' => 'Stripe error']);
    }
}
/**
 * POST /verify-payment
 */
elseif ($path === '/verify-payment' && $method === 'POST') {
    $userId = require_auth();
    $sessionId = $input['session_id'];

    $session = stripe_request("checkout/sessions/$sessionId", [], STRIPE_SECRET_KEY);

    if (isset($session['payment_status']) && $session['payment_status'] === 'paid') {
        if ($session['metadata']['user_id'] != $userId) {
            echo json_encode(['error' => 'Unauthorized payment session']);
            die();
        }

        $stmt = $pdo->prepare("UPDATE users SET is_pro = 1 WHERE id = ?");
        $stmt->execute([$userId]);

        $stmt = $pdo->prepare("INSERT INTO sales (user_id, amount) VALUES (?, ?)");
        $stmt->execute([$userId, 10.00]);

        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Payment not verified']);
    }
}
/**
 * GET /admin/stats
 */
elseif ($path === '/admin/stats' && $method === 'GET') {
    require_admin($pdo);

    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $totalUsers = $stmt->fetch()['count'];

    $stmt = $pdo->query("SELECT SUM(amount) as total FROM sales");
    $totalSales = $stmt->fetch()['total'] ?: 0;

    $stmt = $pdo->query("SELECT COUNT(*) as count FROM resumes");
    $totalResumes = $stmt->fetch()['count'];

    $stmt = $pdo->query("SELECT DATE(created_at) as date, SUM(amount) as amount FROM sales GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 7");
    $salesHistory = array_reverse($stmt->fetchAll());

    $stmt = $pdo->query("SELECT id, email, is_pro, created_at FROM users ORDER BY created_at DESC LIMIT 5");
    $recentUsers = $stmt->fetchAll();

    echo json_encode([
        'totalUsers' => $totalUsers,
        'totalSales' => $totalSales,
        'totalResumes' => $totalResumes,
        'salesHistory' => $salesHistory,
        'recentUsers' => $recentUsers
    ]);
}
else {
    http_response_code(404);
    echo json_encode(['error' => 'Not Found']);
}
?>
