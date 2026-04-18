<?php
require_once __DIR__ . '/../services/SessionService.php';

$data = json_decode(file_get_contents("php://input"));
$method = $_SERVER['REQUEST_METHOD'];

$sessionService = new SessionService($db);

if ($method === 'POST') {
    if (
        !empty($data->movie_id) && 
        !empty($data->hall_id) && 
        !empty($data->start_time) && 
        !empty($data->end_time) && 
        !empty($data->base_price)
    ) {
        $result = $sessionService->createSession(
            $data->movie_id,
            $data->hall_id,
            $data->start_time,
            $data->end_time,
            $data->base_price,
            $data->format ?? '2D',
            $data->language_tag ?? 'UA'
        );
    
        if ($result['success']) {
            http_response_code(201); 
            echo json_encode(["message" => $result['message']]);
        } else {
            http_response_code(409); 
            echo json_encode(["message" => $result['message']]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Неповні дані. Заповніть всі обов'язкові поля."]);
    }
} 
else {
    http_response_code(405); 
    echo json_encode(["message" => "Цей метод не підтримується."]);
}
?>
