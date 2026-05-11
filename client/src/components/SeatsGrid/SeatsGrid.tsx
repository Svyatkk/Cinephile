import styles from './style.module.css';
import Seat from '../Seat/Seat';
import { ISeat } from '@/api/seat.service';

interface SeatsGridProps {
    seats: ISeat[];
    selectedSeatIds: number[];
    onSeatClick: (seat: ISeat) => void;
}

export default function SeatsGrid({ seats, selectedSeatIds, onSeatClick }: SeatsGridProps) {
    const rows = seats.reduce((acc, seat) => {
        if (!acc[seat.row_num]) acc[seat.row_num] = [];
        acc[seat.row_num].push(seat);
        return acc;
    }, {} as Record<number, ISeat[]>);


        
    return (
        <div className={styles.seatGrid}>
            {Object.keys(rows).map(rowNumStr => {
                const rowNum = Number(rowNumStr);
                return (
                    <div key={rowNum} className={styles.seatRow}>
                        <div className={styles.rowLabel}>{rowNum}</div>
                        {rows[rowNum].map(seat => (
                            <Seat
                                key={seat.id}
                                id={seat.id}
                                seatNum={seat.seat_num}
                                isSelected={selectedSeatIds.includes(seat.id)}
                                isOccupied={seat.is_purchased === 1 || seat.is_locked === 1}
                                onClick={() => onSeatClick(seat)}
                            />
                        ))}
                        <div className={styles.rowLabelRight}>{rowNum}</div>
                    </div>
                );
            })}
        </div>
    );
}
