import styles from './style.module.css';

interface SeatProps {
    id: number;
    seatNum: number;
    isSelected: boolean;
    isOccupied: boolean;
    onClick: () => void;
}

export default function Seat({ id, seatNum, isSelected, isOccupied, onClick }: SeatProps) {
    let seatClass = styles.seatAvailable;
    if (isOccupied) seatClass = styles.seatOccupied;
    else if (isSelected) seatClass = styles.seatSelected;

    return (
        <div 
            className={`${styles.seat} ${seatClass}`}
            onClick={onClick}
        >
            {seatNum}
        </div>
    );
}
