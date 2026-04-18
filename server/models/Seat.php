<?php
class Seat {
    private $conn;
    private $table_name = "seats";
    public $hall_id;
    public $row_num;
    public $seat_num;
    public $seat_type;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " (hall_id, row_num, seat_num, seat_type) VALUES (:hall_id, :row_num, :seat_num, :seat_type)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':hall_id', $this->hall_id);
        $stmt->bindParam(':row_num', $this->row_num);
        $stmt->bindParam(':seat_num', $this->seat_num);
        $stmt->bindParam(':seat_type', $this->seat_type);
        
        return $stmt->execute();
    }
}
?>
