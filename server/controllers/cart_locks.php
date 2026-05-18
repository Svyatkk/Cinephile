<?php
require_once __DIR__ . '/../services/CartLockService.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));
$cartLockService = new CartLockService($db);



if ($method === 'POST') {
    if (!empty($data->user_id) && !empty($data->session_id) && !empty($data->seat_ids) && is_array($data->seat_ids)) {
        $result = $cartLockService->lockSeats($data->user_id, $data->session_id, $data->seat_ids);
        if ($result['success']) {
            http_response_code(200);
            echo json_encode(["message" => $result['message']]);
        } else {
            http_response_code(409);
            echo json_encode(["message" => $result['message']]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Вкажіть user_id, session_id та масив seat_ids"]);
    }
} else {
    http_response_code(405); 
    echo json_encode(["message" => "Цей метод не підтримується."]);
}
?>
