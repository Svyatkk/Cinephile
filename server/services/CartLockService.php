<?php
class CartLockService {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function lockSeats($user_id, $session_id, $seat_ids) {
        try {
            $this->db->beginTransaction();

            // Clear expired locks globally
            $this->db->exec("DELETE FROM cart_locks WHERE expires_at <= NOW()");

            // Check if seats are already locked or purchased
            foreach ($seat_ids as $seat_id) {
                // Check tickets
                $tQuery = "SELECT id FROM tickets WHERE session_id = :session_id AND seat_id = :seat_id";
                $tStmt = $this->db->prepare($tQuery);
                $tStmt->execute([':session_id' => $session_id, ':seat_id' => $seat_id]);
                if ($tStmt->fetch()) {
                    throw new Exception("Деякі місця вже придбані");
                }

                // Check active locks from OTHER users (or even this user, we just don't allow double lock)
                $lQuery = "SELECT id FROM cart_locks WHERE session_id = :session_id AND seat_id = :seat_id AND expires_at > NOW() AND user_id != :user_id";
                $lStmt = $this->db->prepare($lQuery);
                $lStmt->execute([':session_id' => $session_id, ':seat_id' => $seat_id, ':user_id' => $user_id]);
                if ($lStmt->fetch()) {
                    throw new Exception("Деякі місця вже заброньовані іншим користувачем");
                }
            }

            // Remove previous locks for this user for this session to reset
            $dQuery = "DELETE FROM cart_locks WHERE session_id = :session_id AND user_id = :user_id";
            $dStmt = $this->db->prepare($dQuery);
            $dStmt->execute([':session_id' => $session_id, ':user_id' => $user_id]);

            // Add new locks
            require_once __DIR__ . '/../models/CartLock.php';
            
            // Expires in 15 minutes
            $cartLock = new CartLock($this->db);
            $cartLock->user_id = $user_id;
            $cartLock->session_id = $session_id;
            $cartLock->expires_at = date('Y-m-d H:i:s', strtotime('+15 minutes'));
            
            foreach ($seat_ids as $seat_id) {
                $cartLock->seat_id = $seat_id;
                if (!$cartLock->create()) {
                    throw new Exception("Помилка при створенні броні");
                }
            }

            $this->db->commit();
            return ["success" => true, "message" => "Місця заброньовано на 15 хвилин."];

        } catch (Exception $e) {
            $this->db->rollBack();
            return ["success" => false, "message" => $e->getMessage()];
        }
    }
}
?>
