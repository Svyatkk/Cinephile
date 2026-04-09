<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}


$host = 'db';
$db_name = 'cinephile_db';
$username = 'cinephile_user';
$password = 'secretpassword';

try {
    $db = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $db->exec("set names utf8");
    
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
    require_once __DIR__ . '/../controllers/movies.php';
} 
else {
    http_response_code(404);
    echo json_encode(["message" => "API Ендпоінт не знайдено."]);
}