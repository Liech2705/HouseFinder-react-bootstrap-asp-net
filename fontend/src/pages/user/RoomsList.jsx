import React, { useMemo, useState } from 'react';
import RoomsGrid from '../../component/RoomsGrid_nm.jsx';
import { rooms as roomsData } from '../../api/room.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Pagination from '../../component/Pagination.jsx';
import Breadcrumbs from '../../component/Breadcrumbs.jsx';
import '../styles/RoomsList.css'; // custom styles for this page
export default function RoomsList() {
    const [query, setQuery] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [view, setView] = useState('grid');
    const [sort, setSort] = useState('relevance');
    const [page, setPage] = useState(1);
    const [amenities, setAmenities] = useState([]);
    const perPage = 9;

    const sortLabelMap = {
        relevance: 'Mặc định',
        priceAsc: 'Giá: thấp → cao',
        priceDesc: 'Giá: cao → thấp'
    };

    const amenityMap = {
        wifi: 'HasWifi',
        ac: 'HasAirConditioner',
        mezzanine: 'HasMezzanine',
        fridge: 'HasFridge',
        closet: 'HasCloset',
        hotWater: 'HasHotWater',
        window: 'HasWindow',
        pet: 'HasPet',
    };

    const toggleAmenity = (key) => {
        setAmenities(prev => prev.includes(key) ? prev.filter(a => a !== key) : [...prev, key]);
        setPage(1);
    };

    const filteredRooms = useMemo(() => {
        let rs = roomsData.filter((r) => {
            const hay = (r.title + ' ' + r.location + ' ' + (r.address || '')).toLowerCase();
            const q = query.trim().toLowerCase();
            const matchesQuery = q ? hay.includes(q) : true;
            const matchesMin = priceMin ? r.price >= Number(priceMin) : true;
            const matchesMax = priceMax ? r.price <= Number(priceMax) : true;
            const matchesAvailable = onlyAvailable ? r.status === 'Còn trống' : true;

            const matchesAmenities = amenities.length
                ? amenities.every(a => !!r.properties?.[amenityMap[a]])
                : true;

            return matchesQuery && matchesMin && matchesMax && matchesAvailable && matchesAmenities;
        });

        if (sort === 'priceAsc') rs = rs.sort((a, b) => a.price - b.price);
        if (sort === 'priceDesc') rs = rs.sort((a, b) => b.price - a.price);
        return rs;
    }, [query, priceMin, priceMax, onlyAvailable, sort, amenities]);

    const totalPages = Math.max(1, Math.ceil(filteredRooms.length / perPage));
    const paginated = filteredRooms.slice((page - 1) * perPage, page * perPage);

    const resetFilters = () => {
        setQuery('');
        setPriceMin('');
        setPriceMax('');
        setOnlyAvailable(false);
        setSort('relevance');
        setAmenities([]);
        setPage(1);
    };

    return (
        <div className="container py-4">
            <Breadcrumbs items={[{ label: 'Trang chủ', to: '/' }, { label: 'Tìm phòng', active: true }]} />

            <div className="d-flex flex-column gap-2 mb-3 ms-2">
                <h1 className="h4 fw-semibold mb-0">Danh sách phòng trọ</h1>
                <div className="text-muted small">Tìm và lọc phòng theo nhu cầu của bạn</div>
            </div>

            <div className="row">
                <aside className="col-12 col-lg-4">
                    <div className="card filter-card shadow-sm sticky-top">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h5 className="card-title mb-0">Bộ lọc & Tìm kiếm</h5>
                                <button className="btn btn-sm btn-link text-muted" onClick={resetFilters}>Xóa</button>
                            </div>

                            {/* search + view toggle moved into left column */}
                            <div className="mb-3">
                                <div className="input-group shadow-sm rounded overflow-hidden">
                                    <input
                                        type="search"
                                        className="form-control border-0"
                                        placeholder="Từ khoá, địa điểm..."
                                        value={query}
                                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                                        aria-label="Tìm kiếm"
                                    />
                                    <button className="btn btn-primary" onClick={() => setPage(1)}>
                                        <i className="bi bi-search" /> Tìm
                                    </button>
                                </div>
                            </div>

                            <div className="mb-3 d-flex align-items-center gap-2 flex-wrap">
                                <div className="btn-group w-100" role="group" aria-label="View toggle">
                                    <button type="button" className={`btn btn-sm ${view === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setView('grid')} title="Lưới">
                                        <i className="bi bi-grid-3x3-gap-fill" /> <span className="ms-1 d-none d-md-inline">Lưới</span>
                                    </button>
                                    <button type="button" className={`btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setView('list')} title="Danh sách">
                                        <i className="bi bi-list-ul" /> <span className="ms-1 d-none d-md-inline">Danh sách</span>
                                    </button>
                                    <button type="button" className={`btn btn-sm ${view === 'map' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setView('map')} title="Bản đồ">
                                        <i className="bi bi-map" /> <span className="ms-1 d-none d-md-inline">Bản đồ</span>
                                    </button>
                                </div>

                                {/* prettier sort dropdown - prevent shrinking */}
                                <div className="sort-dropdown ms-2 flex-shrink-0">
                                    <div className="btn-group">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-sm dropdown-toggle d-flex align-items-center gap-2"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <i className="bi bi-funnel-fill" aria-hidden="true"></i>
                                            <span className="d-none d-md-inline">Sắp xếp:</span>
                                            <strong className="ms-1">{sortLabelMap[sort]}</strong>
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <li><button className={`dropdown-item ${sort === 'relevance' ? 'active' : ''}`} onClick={() => setSort('relevance')}>Mặc định</button></li>
                                            <li><button className={`dropdown-item ${sort === 'priceAsc' ? 'active' : ''}`} onClick={() => setSort('priceAsc')}>Giá: thấp → cao</button></li>
                                            <li><button className={`dropdown-item ${sort === 'priceDesc' ? 'active' : ''}`} onClick={() => setSort('priceDesc')}>Giá: cao → thấp</button></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <hr />
                            <div className="mb-3">
                                <label className="form-label small">Khoảng giá (₫)</label>
                                <div className="d-flex gap-2 align-items-center">
                                    <input type="number" className="form-control form-control-sm" placeholder="Min" value={priceMin} onChange={(e) => { setPriceMin(e.target.value); setPage(1); }} />
                                    <span className="text-muted">—</span>
                                    <input type="number" className="form-control form-control-sm" placeholder="Max" value={priceMax} onChange={(e) => { setPriceMax(e.target.value); setPage(1); }} />
                                </div>
                                <div className="small text-muted mt-1">Gõ số hoặc bỏ trống để không giới hạn</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label small mb-2">Tiện nghi</label>
                                <div className="row g-2">
                                    <div className="col-6 col-md-4">
                                        <button type="button" onClick={() => toggleAmenity('wifi')}
                                            className={`amenity-chip btn btn-sm w-100 btn-outline-secondary ${amenities.includes('wifi') ? 'active' : ''}`}>
                                            <i className="fas fa-wifi me-1" /> WiFi
                                        </button>
                                    </div>
                                    <div className="col-6 col-md-4">
                                        <button type="button" onClick={() => toggleAmenity('ac')}
                                            className={`amenity-chip btn btn-sm w-100 btn-outline-secondary ${amenities.includes('ac') ? 'active' : ''}`}>
                                            <i className="fas fa-snowflake me-1" /> Điều hoà
                                        </button>
                                    </div>
                                    <div className="col-6 col-md-4">
                                        <button type="button" onClick={() => toggleAmenity('mezzanine')}
                                            className={`amenity-chip btn btn-sm w-100 btn-outline-secondary ${amenities.includes('mezzanine') ? 'active' : ''}`}>
                                            <i className="fas fa-layer-group me-1" /> Gác xép
                                        </button>
                                    </div>
                                    <div className="col-6 col-md-4">
                                        <button type="button" onClick={() => toggleAmenity('fridge')}
                                            className={`amenity-chip btn btn-sm w-100 btn-outline-secondary ${amenities.includes('fridge') ? 'active' : ''}`}>
                                            <i className="fas fa-snowflake me-1" /> Tủ lạnh
                                        </button>
                                    </div>
                                    <div className="col-6 col-md-4">
                                        <button type="button" onClick={() => toggleAmenity('closet')}
                                            className={`amenity-chip btn btn-sm w-100 btn-outline-secondary ${amenities.includes('closet') ? 'active' : ''}`}>
                                            <i className="fas fa-archive me-1" /> Tủ quần áo
                                        </button>
                                    </div>
                                    <div className="col-6 col-md-4">
                                        <button type="button" onClick={() => toggleAmenity('hotWater')}
                                            className={`amenity-chip btn btn-sm w-100 btn-outline-secondary ${amenities.includes('hotWater') ? 'active' : ''}`}>
                                            <i className="fas fa-hot-tub me-1" /> Nước nóng
                                        </button>
                                    </div>
                                    <div className="col-6 col-md-4">
                                        <button type="button" onClick={() => toggleAmenity('window')}
                                            className={`amenity-chip btn btn-sm w-100 btn-outline-secondary ${amenities.includes('window') ? 'active' : ''}`}>
                                            <i className="fas fa-window-maximize me-1" /> Cửa sổ
                                        </button>
                                    </div>
                                    <div className="col-6 col-md-4">
                                        <button type="button" onClick={() => toggleAmenity('pet')}
                                            className={`amenity-chip btn btn-sm w-100 btn-outline-secondary ${amenities.includes('pet') ? 'active' : ''}`}>
                                            <i className="fas fa-dog me-1" /> Thú cưng
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" id="onlyAvailable" checked={onlyAvailable} onChange={(e) => { setOnlyAvailable(e.target.checked); setPage(1); }} />
                                <label className="form-check-label small" htmlFor="onlyAvailable">Chỉ hiện phòng còn trống</label>
                            </div>
                        </div>
                    </div>
                </aside>

                <section className="col-12 col-lg-8">
                    <div className="mb-3 d-flex align-items-center justify-content-between">
                        <div className="text-muted small">Hiển thị {filteredRooms.length} kết quả</div>
                        <div className="d-none d-md-block">
                            <small className="text-muted">Trang {page} / {totalPages}</small>
                        </div>
                    </div>

                    {view === 'map' ? (
                        <div className="card shadow-sm mb-4">
                            <div className="ratio ratio-16x9">
                                <iframe
                                    title="Bản đồ"
                                    src={`https://www.google.com/maps/embed/v1/search?key=YOUR_KEY&q=${encodeURIComponent('Phòng trọ gần đây')}`}
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            {filteredRooms.length === 0 ? (
                                <div className="card p-4 text-center text-muted">Không tìm thấy phòng phù hợp.</div>
                            ) : (
                                <>
                                    {view === 'grid' ? (
                                        <RoomsGrid roomsOverride={paginated} />
                                    ) : (
                                        <div className="list-view">
                                            {paginated.map((r) => (
                                                <div key={r.id} className="card mb-3 room-list-item shadow-sm">
                                                    <div className="row g-0">
                                                        <div className="col-4 col-md-3">
                                                            <img src={(r.images && r.images[0]) || 'https://via.placeholder.com/320x200'} alt={r.title} className="img-fluid rounded-start" style={{ height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                        <div className="col-8 col-md-9">
                                                            <div className="card-body d-flex flex-column h-100">
                                                                <div className="d-flex justify-content-between">
                                                                    <h5 className="card-title mb-1">{r.title}</h5>
                                                                    <div className="text-primary fw-bold">{new Intl.NumberFormat('vi-VN').format(r.price)}₫</div>
                                                                </div>
                                                                <p className="text-secondary small mb-2">{r.location || r.address}</p>

                                                                {/* tiện nghi hiển thị trong list view */}
                                                                <div className="room-amenities mb-2">
                                                                    {r.properties?.hasWifi && (
                                                                        <span className="badge bg-light text-muted me-1">
                                                                            <i className="fas fa-wifi me-1" /> WiFi
                                                                        </span>
                                                                    )}
                                                                    {r.properties?.hasAirConditioner && (
                                                                        <span className="badge bg-light text-muted me-1">
                                                                            <i className="fas fa-snowflake me-1" /> Điều hoà
                                                                        </span>
                                                                    )}
                                                                    {r.properties?.hasMezzanine && (
                                                                        <span className="badge bg-light text-muted me-1">
                                                                            <i className="fas fa-layer-group me-1" /> Gác xép
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <div className="mt-auto d-flex justify-content-between align-items-center">
                                                                    <div className="text-muted small">{r.properties?.bedCount || 1} giường • {r.area ? `${r.area} m²` : ''}</div>
                                                                    <a href={`/rooms/${r.id}`} className="btn btn-outline-primary btn-sm">Xem chi tiết</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* replace inline pagination with reusable component */}
                                    <Pagination page={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} maxButtons={7} showIfSinglePage={true} />
                                </>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}


