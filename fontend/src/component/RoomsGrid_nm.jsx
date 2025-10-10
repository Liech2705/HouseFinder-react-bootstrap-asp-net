import HouseCard from './HouseCard.jsx';
import { rooms } from '../api/room.jsx';

function HouseGrid_nm({ roomsOverride }) {
    const list = roomsOverride ?? rooms;
    var count = list.length;
    return (
        <section className="container my-5">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-3 g-2">
                {list.map((room) => (
                    <div key={room.id} className="col">
                        <HouseCard room={room} />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default HouseGrid_nm;