<?php
require_once __DIR__ . '/../models/City.php';
$data = json_decode(file_get_contents("php://input"));
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    if (!empty($data->name)) {
        $city = new City($db);
        $city->name = $data->name;
        if ($city->create()) {
            http_response_code(201);
            echo json_encode(["message" => "Місто успішно додано."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Помилка при створенні міста."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Введіть назву міста."]);
    }
}
?>
