<?php
require_once __DIR__ . '/../services/CartLockService.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));
$cartLockService = new CartLockService($db);

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["message" => "Не авторизовано. Будь ласка, увійдіть."]);
    exit();
}

$user_id = $_SESSION['user_id']; 


if ($method === 'POST') {
    if (!empty($data->session_id) && !empty($data->seat_ids) && is_array($data->seat_ids)) {
        $result = $cartLockService->lockSeats($user_id, $data->session_id, $data->seat_ids);
        if ($result['success']) {
            http_response_code(200);
            echo json_encode(["message" => $result['message']]);
        } else {
            http_response_code(409);
            echo json_encode(["message" => $result['message']]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Вкажіть session_id та масив seat_ids"]);
    }
} elseif ($method === 'DELETE') {
    if (!empty($data->session_id)) {
        $result = $cartLockService->unlockSeats($user_id, $data->session_id);
        if ($result['success']) {
            http_response_code(200);
            echo json_encode(["message" => $result['message']]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => $result['message']]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Вкажіть session_id"]);
    }
} else {
    http_response_code(405); 
    echo json_encode(["message" => "Цей метод не підтримується."]);
}
?>
