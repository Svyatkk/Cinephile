<?php
require_once __DIR__ . '/../services/HallService.php';

$data = json_decode(file_get_contents("php://input"));
$method = $_SERVER['REQUEST_METHOD'];


if ($method === 'POST') {
    if (!empty($data->cinema_id) && !empty($data->name) && !empty($data->rows_count) && !empty($data->seats_per_row)) {
        $hallService = new HallService($db);
        $result = $hallService->createHallWithSeats(
            $data->cinema_id,
            $data->name,
            $data->technologies ?? '',
            $data->rows_count,
            $data->seats_per_row
        );

        if ($result['success']) {
            http_response_code(201);
            echo json_encode(["message" => $result['message']]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => $result['message']]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Заповніть всі обов'язкові поля: кінотеатр, назва, кількість рядів та місць."]);
    }
} else if ($method === 'GET') {
    $hall = new Hall($db);
    $halls = $hall->readAll();
    http_response_code(200);
    echo json_encode($halls);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Метод не підтримується"]);
}
?>
