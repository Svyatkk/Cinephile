<?php
class Hall {
    private $conn;
    private $table_name = "halls";
    public $id;
    public $cinema_id;
    public $name;
    public $technologies;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " (cinema_id, name, technologies) VALUES (:cinema_id, :name, :technologies)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':cinema_id', $this->cinema_id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':technologies', $this->technologies);
        
        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }
}
?>
