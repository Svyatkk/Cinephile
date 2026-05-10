<?php
class CartLock {
    private $conn;
    private $table_name = "cart_locks";

    public $id;
    public $user_id;
    public $session_id;
    public $seat_id;
    public $expires_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " (user_id, session_id, seat_id, expires_at) VALUES (:user_id, :session_id, :seat_id, :expires_at)";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->bindParam(':session_id', $this->session_id);
        $stmt->bindParam(':seat_id', $this->seat_id);
        $stmt->bindParam(':expires_at', $this->expires_at);

        return $stmt->execute();
    }
}
?>
