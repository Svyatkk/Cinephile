<?php
require_once __DIR__ . '/../api/index.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stats = [];

        $stmt = $db->query("SELECT SUM(total_amount) as total_revenue FROM orders");
        $stats['total_revenue'] = $stmt->fetch(PDO::FETCH_ASSOC)['total_revenue'] ?? 0;

        $stmt = $db->query("SELECT COUNT(id) as total_tickets FROM tickets");
        $stats['total_tickets'] = $stmt->fetch(PDO::FETCH_ASSOC)['total_tickets'] ?? 0;

        $stmt = $db->query("SELECT COUNT(id) as total_users FROM users");
        $stats['total_users'] = $stmt->fetch(PDO::FETCH_ASSOC)['total_users'] ?? 0;

        $query = "
            SELECT m.title, COUNT(t.id) as tickets_sold, SUM(t.price) as revenue
            FROM tickets t
            JOIN sessions s ON t.session_id = s.id
            JOIN movies m ON s.movie_id = m.id
            GROUP BY m.id
            ORDER BY tickets_sold DESC
            LIMIT 5
        ";
        $stmt = $db->query($query);
        $stats['top_movies'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode(["success" => true, "data" => $stats]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Помилка при отриманні статистики: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Цей метод не підтримується."]);
}
?>
