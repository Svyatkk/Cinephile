<?php
require_once __DIR__ . '/../models/Hall.php';
require_once __DIR__ . '/../models/Seat.php';

class HallService {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function createHallWithSeats($cinema_id, $name, $technologies, $rows_count, $seats_per_row) {
        try {
            $this->db->beginTransaction();

            $hall = new Hall($this->db);
            $hall->cinema_id = $cinema_id;
            $hall->name = $name;
            $hall->technologies = $technologies;

            if (!$hall->create()) {
                throw new Exception("Не вдалося створити залу.");
            }

            $seat = new Seat($this->db);
            $seat->hall_id = $hall->id;
            $seat->seat_type = 'good'; 

            for ($r = 1; $r <= $rows_count; $r++) {
                for ($s = 1; $s <= $seats_per_row; $s++) {
                    $seat->row_num = $r;
                    $seat->seat_num = $s;
                    if (!$seat->create()) {
                        throw new Exception("Не вдалося створити місце $r-$s.");
                    }
                }
            }

            $this->db->commit();
            return ["success" => true, "message" => "Залу та $rows_count рядів по $seats_per_row місць успішно створено."];

        } catch (Exception $e) {
            $this->db->rollBack();
            return ["success" => false, "message" => $e->getMessage()];
        }
    }
}
?>
