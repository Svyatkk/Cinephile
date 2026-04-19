<?php
require_once __DIR__ . '/../services/UserService.php';

$data = json_decode(file_get_contents("php://input"));
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    if (!is_null($data) && !empty($data->email) && !empty($data->password)) {
        
        $name = !empty($data->name) ? $data->name : explode('@', $data->email)[0];
        $userService = new UserService($db); 
        $result = $userService->auth($name, $data->email, $data->password);
        
        if ($result['success']) {
            http_response_code(200); 
            echo json_encode(["message" => $result['message'], "user" => $result['user'] ?? null]);
        } else {
            http_response_code(400); 
            echo json_encode(["message" => $result['message']]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Неповні дані. Заповніть email та пароль."]);
    }
} else {
    http_response_code(405); 
    echo json_encode(["message" => "Дозволено тільки POST запити."]);
}