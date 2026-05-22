<?php
class Ticket {
    private $conn;
    private $table_name = "tickets";

    public $id;
    public $order_id;
    public $session_id;
    public $seat_id;
    public $price;
    public $barcode;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " (order_id, session_id, seat_id, price, barcode) VALUES (:order_id, :session_id, :seat_id, :price, :barcode)";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':order_id', $this->order_id);
        $stmt->bindParam(':session_id', $this->session_id);
        $stmt->bindParam(':seat_id', $this->seat_id);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':barcode', $this->barcode);

        return $stmt->execute();
    }

    
    public function getTicketsByOrderId() {
        $query = "SELECT t.*, s.row_num, s.seat_num, ses.start_time, ses.format, m.title as movie_title, c.name as cinema_name, h.name as hall_name
                  FROM " . $this->table_name . " t
                  JOIN seats s ON t.seat_id = s.id
                  JOIN sessions ses ON t.session_id = ses.id
                  JOIN movies m ON ses.movie_id = m.id
                  JOIN halls h ON ses.hall_id = h.id
                  JOIN cinemas c ON h.cinema_id = c.id
                  WHERE t.order_id = :order_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':order_id', $this->order_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
