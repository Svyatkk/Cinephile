<?php
class SeatService {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getSeatsForSession(int $session_id): array {
        $sessionQuery = "SELECT hall_id FROM sessions WHERE id = :session_id";
        $stmt = $this->db->prepare($sessionQuery);
        $stmt->bindParam(':session_id', $session_id);
        $stmt->execute();
        $session = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$session) {
            return ["success" => false, "message" => "Session not found"];
        }

        $hall_id = $session['hall_id'];
        $query = "
            SELECT s.*, 
                IF(t.id IS NOT NULL, 1, 0) as is_purchased,
                IF(cl.id IS NOT NULL, 1, 0) as is_locked
            FROM seats s
            LEFT JOIN tickets t ON s.id = t.seat_id AND t.session_id = :session_id
            LEFT JOIN cart_locks cl ON s.id = cl.seat_id AND cl.session_id = :session_id AND cl.expires_at > NOW()
            WHERE s.hall_id = :hall_id
            ORDER BY s.row_num ASC, s.seat_num ASC
        ";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':session_id', $session_id);
        $stmt->bindParam(':hall_id', $hall_id);
        $stmt->execute();

        $seats = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return ["success" => true, "data" => $seats];
    }
}
?>
