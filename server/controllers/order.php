<?php
require_once __DIR__ . '/../services/OrderService.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));
$orderService = new OrderService($db);

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["message" => "Не авторизовано. Будь ласка, увійдіть."]);
    exit();
}



$user_id = $_SESSION['user_id']; 

if ($method === 'POST') {
    if (!empty($data->session_id) && !empty($data->seat_ids) && is_array($data->seat_ids) && !empty($data->total_amount)) {
        $result = $orderService->createOrder($user_id, $data->session_id, $data->seat_ids, $data->total_amount);
        if ($result['success']) {
            http_response_code(201);
            echo json_encode(["message" => $result['message'], "order_id" => $result['order_id']]);
        } else {
            http_response_code(400);
            echo json_encode(["message" => $result['message']]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Вкажіть session_id, seat_ids та total_amount"]);
    }
} else if ($method === 'GET') {

    if (isset($user_id)) {
        $result = $orderService->getOrdersWithTickets($user_id);
        http_response_code(200);
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Помилка при отриманні замовлень"]);
    }
} else if ($method === 'DELETE') {
    if (!empty($data->order_id)) {
        $result = $orderService->cancelOrder($data->order_id, $user_id);
        if ($result['success']) {
            http_response_code(200);
            echo json_encode(["message" => $result['message']]);
        } else {
            http_response_code(400);
            echo json_encode(["message" => $result['message']]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Вкажіть order_id"]);
    }
} else {
    http_response_code(405); 
    echo json_encode(["message" => "Цей метод не підтримується."]);
}
?>
