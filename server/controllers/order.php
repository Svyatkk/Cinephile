<?php
require_once __DIR__ . '/../services/OrderService.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));
$orderService = new OrderService($db);

if ($method === 'POST') {
    if (!empty($data->user_id) && !empty($data->session_id) && !empty($data->seat_ids) && is_array($data->seat_ids) && !empty($data->total_amount)) {
        $result = $orderService->createOrder($data->user_id, $data->session_id, $data->seat_ids, $data->total_amount);
        if ($result['success']) {
            http_response_code(201);
            echo json_encode(["message" => $result['message'], "order_id" => $result['order_id']]);
        } else {
            http_response_code(400);
            echo json_encode(["message" => $result['message']]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Вкажіть user_id, session_id, seat_ids та total_amount"]);
    }
} else if ($method === 'GET') {
    if (!empty($_GET['user_id'])) {
        require_once __DIR__ . '/../models/Order.php';
        require_once __DIR__ . '/../models/Ticket.php';

        $orderModel = new Order($db);
        $orderModel->user_id = $_GET['user_id'];
        $orders = $orderModel->getOrdersByUser();

        $ticketModel = new Ticket($db);
        
        $result = [];
        foreach ($orders as $order) {
            $ticketModel->order_id = $order['id'];
            $order['tickets'] = $ticketModel->getTicketsByOrderId();
            $result[] = $order;
        }

        http_response_code(200);
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Вкажіть user_id"]);
    }
} else if ($method === 'DELETE') {
    if (!empty($data->order_id) && !empty($data->user_id)) {
        $result = $orderService->cancelOrder($data->order_id, $data->user_id);
        if ($result['success']) {
            http_response_code(200);
            echo json_encode(["message" => $result['message']]);
        } else {
            http_response_code(400);
            echo json_encode(["message" => $result['message']]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Вкажіть order_id та user_id"]);
    }
} else {
    http_response_code(405); 
    echo json_encode(["message" => "Цей метод не підтримується."]);
}
?>
