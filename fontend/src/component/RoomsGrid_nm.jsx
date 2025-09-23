import RoomCard from './RoomCard.jsx';
import { rooms } from '../api/room.js';

function RoomsGrid_nm({ roomsOverride }) {
    const list = roomsOverride ?? rooms;
    var count = list.length;
    return (
        <section className="container my-5">
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

export default RoomsGrid_nm;