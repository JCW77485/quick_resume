<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    die();
}

// Configuration (for InfinityFree, these would be your MySQL details)
$host = 'localhost';
$db   = 'quick_resume';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
     die();
}

// Simple Router
$method = $_SERVER['REQUEST_METHOD'];
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);
// For subfolder hosting (like /api/index.php)
$path = str_replace('/api/index.php', '', $path);

$input = json_decode(file_get_contents('php://input'), true);

if ($path === '/auth/signup' && $method === 'POST') {
    $email = $input['email'];
    $password = password_hash($input['password'], PASSWORD_DEFAULT);
    try {
        $stmt = $pdo->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
        $stmt->execute([$email, $password]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}
elseif ($path === '/auth/login' && $method === 'POST') {
    $email = $input['email'];
    $password = $input['password'];
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    if ($user && password_verify($password, $user['password'])) {
        unset($user['password']);
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        echo json_encode(['error' => 'Invalid credentials']);
    }
}
elseif ($path === '/resumes' && $method === 'GET') {
    $userId = $_GET['user_id'];
    $stmt = $pdo->prepare("SELECT * FROM resumes WHERE user_id = ? ORDER BY updated_at DESC");
    $stmt->execute([$userId]);
    echo json_encode($stmt->fetchAll());
}
elseif ($path === '/resumes' && $method === 'POST') {
    $stmt = $pdo->prepare("INSERT INTO resumes (id, user_id, name, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$input['id'], $input['user_id'], $input['name'], json_encode($input['data']), $input['created_at'], $input['updated_at']]);
    echo json_encode(['success' => true]);
}
else {
    echo json_encode(['error' => 'Not Found', 'path' => $path]);
}
?>
