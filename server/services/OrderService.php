<?php
class OrderService {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function createOrder($user_id, $session_id, $seat_ids, $total_amount) {
        try {
            $this->db->beginTransaction();

            $this->db->exec("DELETE FROM cart_locks WHERE expires_at <= NOW()");

            foreach ($seat_ids as $seat_id) {
                $lQuery = "SELECT id FROM cart_locks WHERE session_id = :session_id AND seat_id = :seat_id AND user_id = :user_id";
                $lStmt = $this->db->prepare($lQuery);
                $lStmt->execute([':session_id' => $session_id, ':seat_id' => $seat_id, ':user_id' => $user_id]);
                if (!$lStmt->fetch()) {
                    throw new Exception("Термін бронювання місць минув або місця не були заброньовані.");
                }
            }

            require_once __DIR__ . '/../models/Order.php';
            require_once __DIR__ . '/../models/Ticket.php';

            $order = new Order($this->db);
            $order->user_id = $user_id;
            $order->total_amount = $total_amount;
            $order->status = 'paid';
            
            if (!$order->create()) {
                throw new Exception("Не вдалося створити замовлення");
            }
            $order_id = $order->id;

            $sQuery = "SELECT base_price FROM sessions WHERE id = :session_id";
            $sStmt = $this->db->prepare($sQuery);
            $sStmt->execute([':session_id' => $session_id]);
            $session_data = $sStmt->fetch(PDO::FETCH_ASSOC);
            $price = $session_data['base_price'];

            $ticket = new Ticket($this->db);
            foreach ($seat_ids as $seat_id) {
                $barcode = uniqid("TKT-") . "-" . mt_rand(1000, 9999);
                $ticket->order_id = $order_id;
                $ticket->session_id = $session_id;
                $ticket->seat_id = $seat_id;
                $ticket->price = $price;
                $ticket->barcode = $barcode;
                
                if (!$ticket->create()) {
                    throw new Exception("Не вдалося створити квиток");
                }
            }

            $dQuery = "DELETE FROM cart_locks WHERE session_id = :session_id AND user_id = :user_id";
            $dStmt = $this->db->prepare($dQuery);
            $dStmt->execute([':session_id' => $session_id, ':user_id' => $user_id]);

            $this->db->commit();
            return ["success" => true, "message" => "Замовлення успішно створено.", "order_id" => $order_id];

        } catch (Exception $e) {
            $this->db->rollBack();
            return ["success" => false, "message" => $e->getMessage()];
        }
    }

    public function cancelOrder($order_id, $user_id) {
        try {
            $this->db->beginTransaction();

            $oQuery = "SELECT id FROM orders WHERE id = :order_id AND user_id = :user_id";
            $oStmt = $this->db->prepare($oQuery);
            $oStmt->execute([':order_id' => $order_id, ':user_id' => $user_id]);
            if (!$oStmt->fetch()) {
                throw new Exception("Замовлення не знайдено або у вас немає прав на його скасування.");
            }

            $tQuery = "DELETE FROM tickets WHERE order_id = :order_id";
            $tStmt = $this->db->prepare($tQuery);
            $tStmt->execute([':order_id' => $order_id]);

            $dQuery = "DELETE FROM orders WHERE id = :order_id";
            $dStmt = $this->db->prepare($dQuery);
            $dStmt->execute([':order_id' => $order_id]);

            $this->db->commit();
            return ["success" => true, "message" => "Бронювання успішно скасовано."];
        } catch (Exception $e) {
            $this->db->rollBack();
            return ["success" => false, "message" => $e->getMessage()];
        }
    }
}
?>
