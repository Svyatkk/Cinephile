<?php
require_once __DIR__ . '/../models/CartLock.php';

class CartLockService {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function lockSeats(int $user_id, int $session_id, array $seat_ids): array {
        try {
            $this->db->beginTransaction();
    
            $checkSessionQuery = "
                SELECT id, start_time 
                FROM sessions 
                WHERE id = :session_id AND start_time > NOW()
            ";
            $checkSessionStmt = $this->db->prepare($checkSessionQuery);
            $checkSessionStmt->execute([':session_id' => $session_id]);
            
            if (!$checkSessionStmt->fetch()) {
                throw new Exception("Сеанс уже розпочався або завершився. Бронювання неможливе.");
            }

            foreach ($seat_ids as $seat_id) {
                $checkTicketsQuery = "
                    SELECT id 
                    FROM tickets 
                    WHERE session_id = :session_id AND seat_id = :seat_id
                ";
                $checkTicketsStmt = $this->db->prepare($checkTicketsQuery);
                $checkTicketsStmt->execute([':session_id' => $session_id, ':seat_id' => $seat_id]);
                
                if ($checkTicketsStmt->fetch()) {
                    throw new Exception("Деякі місця вже придбані");
                }

                $checkLocksQuery = "
                    SELECT id 
                    FROM cart_locks 
                    WHERE session_id = :session_id 
                      AND seat_id = :seat_id 
                      AND expires_at > NOW() 
                      AND user_id != :user_id
                ";
                $checkLocksStmt = $this->db->prepare($checkLocksQuery);
                $checkLocksStmt->execute([':session_id' => $session_id, ':seat_id' => $seat_id, ':user_id' => $user_id]);
                
                if ($checkLocksStmt->fetch()) {
                    throw new Exception("Деякі місця вже заброньовані іншим користувачем");
                }
            }

            $deleteLocksQuery = "
                DELETE FROM cart_locks 
                WHERE session_id = :session_id AND user_id = :user_id
            ";
            $deleteLocksStmt = $this->db->prepare($deleteLocksQuery);

            $deleteLocksStmt->execute([':session_id' => $session_id, ':user_id' => $user_id]);

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

    public function unlockSeats(int $user_id, int $session_id): array {
        try {
            $deleteLocksQuery = "
                DELETE FROM cart_locks 
                WHERE session_id = :session_id AND user_id = :user_id
            ";
            $deleteLocksStmt = $this->db->prepare($deleteLocksQuery);
            $deleteLocksStmt->execute([':session_id' => $session_id, ':user_id' => $user_id]);
            
            return ["success" => true, "message" => "Бронювання успішно скасовано."];
        } catch (Exception $e) {
            return ["success" => false, "message" => $e->getMessage()];
        }
    }
}
?>
