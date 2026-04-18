<?php
class City {
    private $conn;
    private $table_name = "cities";
    public $id;
    public $name;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " (name) VALUES (:name)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $this->name);
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
