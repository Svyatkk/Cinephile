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
} else if ($method === 'GET') {
    $id = $data->id ?? null;

    if ($id !== null) {
        $city = new City($db);
        $city_data = $city->getById($id);

        if ($city_data) {
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "data" => $city_data
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Місто не знайдено."
            ]);
        }
    } else {
        $city = new City($db);
        $cities = $city->readAll();
        http_response_code(200);
        echo json_encode($cities);
    }
}
?>
