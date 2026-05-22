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
            $_SESSION['user_id'] = $result['user']['id'];
            $_SESSION['email'] = $result['user']['email'];
            $_SESSION['name'] = $result['user']['name'];
            
            http_response_code(200); 
            echo json_encode(["message" => $result['message'], "user" => $result['user']]);
        } else {
            http_response_code(400); 
            echo json_encode(["message" => $result['message']]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Неповні дані. Заповніть email та пароль."]);
    }
} else if ($method === 'GET') {
    if (isset($_SESSION['user_id'])) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "user" => [
                "id" => $_SESSION['user_id'],
                "email" => $_SESSION['email'],
                "name" => $_SESSION['name']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Не авторизовано"]);
    }
} else if ($method === 'DELETE') {
    session_destroy();
    http_response_code(200);
    echo json_encode(["message" => "Вихід успішний"]);
} else {
    http_response_code(405); 
    echo json_encode(["message" => "Дозволено тільки POST запити."]);
}