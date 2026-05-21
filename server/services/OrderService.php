<?php
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../models/Ticket.php';

class OrderService {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function createOrder(int $user_id, int $session_id, array $seat_ids, float $total_amount): array {
        try {
            $this->db->beginTransaction();

            $this->db->exec("DELETE FROM cart_locks WHERE expires_at <= NOW()");


            foreach ($seat_ids as $seat_id) {
                $checkLockQuery = "
                    SELECT id 
                    FROM cart_locks 
                    WHERE session_id = :session_id 
                      AND seat_id = :seat_id 
                      AND user_id = :user_id
                ";
                $checkLockStmt = $this->db->prepare($checkLockQuery);
                $checkLockStmt->execute([':session_id' => $session_id, ':seat_id' => $seat_id, ':user_id' => $user_id]);
                
                if (!$checkLockStmt->fetch()) {
                    throw new Exception("Термін бронювання місць минув або місця не були заброньовані.");
                }
             
            }


            $order = new Order($this->db);
            $order->user_id = $user_id;
            $order->total_amount = $total_amount;
            $order->status = 'paid';

            
            if (!$order->create()) {
                throw new Exception("Не вдалося створити замовлення");
            }
            $order_id = $order->id;
            $sessionQuery = "
                SELECT base_price 
                FROM sessions 
                WHERE id = :session_id
            ";
         

            $sessionStmt = $this->db->prepare($sessionQuery);
            $sessionStmt->execute([':session_id' => $session_id]);
            $session_data = $sessionStmt->fetch(PDO::FETCH_ASSOC);
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

            $deleteLockQuery = "
                DELETE FROM cart_locks 
                WHERE session_id = :session_id AND user_id = :user_id
            ";
      
            $deleteLockStmt = $this->db->prepare($deleteLockQuery);
            $deleteLockStmt->execute([':session_id' => $session_id, ':user_id' => $user_id]);

            $this->db->commit();
            return ["success" => true, "message" => "Замовлення успішно створено.", "order_id" => $order_id];

        } catch (Exception $e) {
            $this->db->rollBack();
            return ["success" => false, "message" => $e->getMessage()];
        }
    }

    public function cancelOrder(int $order_id, int $user_id): array {
        try {
            $this->db->beginTransaction();

            $orderQuery = "
                SELECT id 
                FROM orders 
                WHERE id = :order_id AND user_id = :user_id
            ";
            $orderStmt = $this->db->prepare($orderQuery);
            $orderStmt->execute([':order_id' => $order_id, ':user_id' => $user_id]);
            
            if (!$orderStmt->fetch()) {
                throw new Exception("Замовлення не знайдено або у вас немає прав на його скасування.");
            }

            $deleteTicketsQuery = "
                DELETE FROM tickets 
                WHERE order_id = :order_id
            ";
            $deleteTicketsStmt = $this->db->prepare($deleteTicketsQuery);
            $deleteTicketsStmt->execute([':order_id' => $order_id]);

            $deleteOrderQuery = "
                DELETE FROM orders 
                WHERE id = :order_id
            ";
            $deleteOrderStmt = $this->db->prepare($deleteOrderQuery);
            $deleteOrderStmt->execute([':order_id' => $order_id]);

            $this->db->commit();
            return ["success" => true, "message" => "Бронювання успішно скасовано."];
        } catch (Exception $e) {
            $this->db->rollBack();
            return ["success" => false, "message" => $e->getMessage()];
        }
    }
    
    public function getOrdersWithTickets(int $user_id): array {
        $orderModel = new Order($this->db);
        $orderModel->user_id = $user_id;
        $orders = $orderModel->getOrdersByUser();

        $ticketModel = new Ticket($this->db);
        
        $result = [];
        foreach ($orders as $order) {
            $ticketModel->order_id = $order['id'];
            $order['tickets'] = $ticketModel->getTicketsByOrderId();
            $result[] = $order;
        }

        return $result;
    }
}
?>
