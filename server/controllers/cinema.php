<?php
require_once __DIR__ . '/../models/Cinema.php';

$data = json_decode(file_get_contents("php://input"));
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    if (!empty($data->name) && !empty($data->city_id) && !empty($data->address)) {
        $cinema = new Cinema($db);
        $cinema->name = $data->name;
        $cinema->city_id = $data->city_id;
        $cinema->address = $data->address;

            
        if ($cinema->create()) {
            http_response_code(201);
            echo json_encode(["message" => "Кінотеатр успішно додано."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Помилка при створенні кінотеатру."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Заповніть всі обов'язкові поля."]);
    }
} else if ($method === 'GET') {
    $cinema = new Cinema($db);
    $cinemas = $cinema->readAll();
    http_response_code(200);
    echo json_encode($cinemas);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Метод не підтримується"]);
}
?>
