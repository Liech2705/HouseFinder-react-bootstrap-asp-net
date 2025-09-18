import RoomCard from './RoomCard.jsx';
import { rooms } from '../api/room.js';

function RoomsGrid({ roomsOverride }) {
    const list = roomsOverride ?? rooms;
    var count = list.length;
    return (
        <section className="container my-4">
            <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                <h2 className="fs-5 fw-semibold text-dark">Phòng trọ nổi bật ({count} kết quả)</h2>
                <button className="btn filter-btn d-flex align-items-center gap-1">
                    <i className="fas fa-filter"></i> Lọc
                </button>
            </div>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-3 g-2">
                {list.map((room) => (
                    <div key={room.id} className="col">
                        <RoomCard room={room} />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default RoomsGrid;
