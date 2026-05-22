<?php
ini_set('display_errors', 0);
error_reporting(E_ERROR);

$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

session_start();

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}



$host = 'db';
$db_name = 'cinephile_db';
$username = 'cinephile_user';
$password = 'secretpassword';

date_default_timezone_set('Europe/Kyiv');

try {
    $db = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $db->exec("set names utf8");
    $db->exec("SET time_zone = '+03:00'");
    
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
} catch(PDOException $exception) {
    echo json_encode(["message" => "Помилка з'єднання з БД: " . $exception->getMessage()]);
    exit();
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($uri === '/api/auth') {
    require_once __DIR__ . '/../controllers/auth.php';
} 
else if ($uri === '/api/movies') {
    require_once __DIR__ . '/../controllers/movie.php';
} 
else if ($uri === '/api/sessions') {
    require_once __DIR__ . '/../controllers/session.php';
}
else if ($uri === '/api/city') {
    require_once __DIR__ . '/../controllers/city.php';
}
else if ($uri === '/api/halls') {
    require_once __DIR__ . '/../controllers/hall.php';
}
else if ($uri === '/api/cinema') {
    require_once __DIR__ . '/../controllers/cinema.php';
}
else if ($uri === '/api/seats') {
    require_once __DIR__ . '/../controllers/seat.php';
}
else if ($uri === '/api/cart_locks') {
    require_once __DIR__ . '/../controllers/cart_locks.php';
}
else if ($uri === '/api/orders') {
    require_once __DIR__ . '/../controllers/order.php';
}
else if ($uri === '/api/upload') {
    require_once __DIR__ . '/../controllers/upload.php';
}
else if ($uri === '/api/statistics') {
    require_once __DIR__ . '/../controllers/statistics.php';
}

else if (strpos($uri, '/api/uploads/') === 0) {
    $relativePath = str_replace('/api/', '', $uri);
    $filePath = __DIR__ . '/' . $relativePath; 
    
    if (file_exists($filePath)) {
        $mimeType = mime_content_type($filePath);
        header('Content-Type: ' . $mimeType);
        readfile($filePath);
        exit();
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Файл картинки не знайдено на сервері.", "path" => $filePath]);
        exit();
    }
}

else {
    http_response_code(404);
    echo json_encode(["message" => "API Ендпоінт не знайдено."]);
}