import { useMemo, useState, useEffect } from 'react';
// Giả định component HouseCard nằm cùng cấp với HouseList trong thư mục component/
import HouseCard from '../../../component/HouseCard.jsx';
// Giả định API nằm ở ../api/room.jsx (Đường dẫn có thể cần điều chỉnh lại nếu cấu trúc thư mục khác)
import { rooms as fetchHouses } from '../../../api/room.jsx';

// ✅ Khắc phục lỗi import CSS và components
// Giả định CSS file nằm trong thư mục styles cùng cấp với component
import '../../styles/RoomsList.css';
// Sử dụng thư viện icon Font Awesome (thay vì bootstrap-icons)
// Nếu muốn dùng bootstrap-icons, cần đảm bảo thư viện đó đã được cài đặt và cấu hình đúng trong dự án.

import Pagination from '../../../component/Pagination.jsx';
import Breadcrumbs from '../../../component/Breadcrumbs.jsx';

export default function HouseList() {
    // State để lưu dữ liệu và trạng thái tải
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter/Sort States
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

    // Ánh xạ tên tiện ích từ state (wifi, ac,...) sang key trong roomProperty (snake_case)
    const amenityMap = {
        wifi: 'has_Wifi',
        ac: 'has_AirConditioner',
        mezzanine: 'has_Mezzanine',
        fridge: 'has_Fridge',
        closet: 'has_Closet',
        hotWater: 'has_Hot_Water',
        window: 'has_Window',
        pet: 'has_Pet',
    };

    const toggleAmenity = (key) => {
        setAmenities(prev => prev.includes(key) ? prev.filter(a => a !== key) : [...prev, key]);
        setPage(1);
    };

    // useEffect để gọi API khi component mount
    useEffect(() => {
        const loadHouses = async () => {
            try {
                // Gọi hàm API (fetchHouses) để lấy dữ liệu
                const data = await fetchHouses();
                setHouses(data);
            } catch (error) {
                console.error("Error loading house list:", error);
            } finally {
                setLoading(false);
            }
        };

        loadHouses();
    }, []);

    const filteredHouses = useMemo(() => {
        // Sử dụng state houses đã được load
        let hs = houses.filter((h) => {
            // 1. Dữ liệu tìm kiếm (query)
            const hay = (h.house_Name + ' ' + h.province + ' ' + h.commune + ' ' + (h.street || '')).toLowerCase();
            const q = query.trim().toLowerCase();
            const matchesQuery = q ? hay.includes(q) : true;

            // 2. Dữ liệu giá (Cần tìm giá thấp nhất trong nhà trọ)
            const prices = h.rooms?.map(r => r.price).filter(p => typeof p === 'number') || [];
            const minPrice = prices.length > 0 ? Math.min(...prices) : null;

            const matchesMin = priceMin ? minPrice !== null && minPrice >= Number(priceMin) : true;
            const matchesMax = priceMax ? minPrice !== null && minPrice <= Number(priceMax) : true;

            // 3. Dữ liệu khả dụng (Còn phòng trống - status = 1)
            const availableRoomsCount = h.rooms?.filter(r => r.status === 1).length || 0;
            const matchesAvailable = onlyAvailable ? availableRoomsCount > 0 : true;

            // 4. Lọc theo tiện ích
            const matchesAmenities = amenities.length
                ? amenities.every(requiredAmenityKey => {
                    const propKey = amenityMap[requiredAmenityKey];
                    // Kiểm tra xem có phòng nào trong nhà trọ có tiện ích này không
                    return h.rooms?.some(room => room.roomProperty?.[propKey] === true);
                })
                : true;

            return matchesQuery && matchesMin && matchesMax && matchesAvailable && matchesAmenities;
        });

        // 5. Sắp xếp (Sắp xếp theo giá thấp nhất)
        if (sort === 'priceAsc') {
            hs = hs.sort((a, b) => {
                const aPrice = Math.min(...(a.rooms?.map(r => r.price) || []));
                const bPrice = Math.min(...(b.rooms?.map(r => r.price) || []));
                return (aPrice || Infinity) - (bPrice || Infinity);
            });
        }
        if (sort === 'priceDesc') {
            hs = hs.sort((a, b) => {
                const aPrice = Math.min(...(a.rooms?.map(r => r.price) || []));
                const bPrice = Math.min(...(b.rooms?.map(r => r.price) || []));
                return (bPrice || 0) - (aPrice || 0);
            });
        }
        return hs;
    }, [houses, query, priceMin, priceMax, onlyAvailable, sort, amenities]);

    const totalPages = Math.max(1, Math.ceil(filteredHouses.length / perPage));
    const paginated = filteredHouses.slice((page - 1) * perPage, page * perPage);

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
            <Breadcrumbs items={[{ label: 'Trang chủ', to: '/' }, { label: 'Tìm nhà trọ', active: true }]} />

            <div className="d-flex flex-column gap-2 mb-3 ms-2">
                <h1 className="h4 fw-semibold mb-0">Danh sách nhà trọ</h1>
                <div className="text-muted small">Tìm và lọc nhà trọ theo nhu cầu của bạn</div>
            </div>

            <div className="row">
                <aside className="col-12 col-lg-4">
                    <div className="card filter-card shadow-sm sticky-top">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h5 className="card-title mb-0 locc">Bộ lọc & Tìm kiếm</h5>
                                <button className="btn btn-sm btn-link text-muted" onClick={resetFilters}>Xóa</button>
                            </div>

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
                                <label className="form-label small mb-2">Tiện nghi (Chung của nhà trọ)</label>
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
                                            <i className="fas fa-archive me-1" /> Tủ lạnh
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
                                <label className="form-check-label small" htmlFor="onlyAvailable">Chỉ hiện nhà trọ còn phòng trống</label>
                            </div>
                        </div>
                    </div>
                </aside>

                <section className="col-12 col-lg-8">
                    <div className="mb-3 d-flex align-items-center justify-content-between">
                        <div className="text-muted small">
                            {loading ? "Đang tải..." : `Hiển thị ${filteredHouses.length} kết quả`}
                        </div>
                        <div className="d-none d-md-block">
                            <small className="text-muted">Trang {page} / {totalPages}</small>
                        </div>
                    </div>

                    {loading ? (
                        <div className="card p-4 text-center text-muted">Đang tải dữ liệu nhà trọ...</div>
                    ) : view === 'map' ? (
                        <div className="card shadow-sm mb-4">
                            <div className="ratio ratio-16x9">
                                <iframe
                                    title="Bản đồ"
                                    src={`https://www.google.com/maps/embed/v1/search?key=YOUR_KEY&q=${encodeURIComponent('Nhà trọ gần đây')}`}
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            {filteredHouses.length === 0 ? (
                                <div className="card p-4 text-center text-muted">Không tìm thấy nhà trọ phù hợp với tiêu chí lọc.</div>
                            ) : (
                                <>
                                    <div className={view === 'grid' ? 'row row-cols-1 row-cols-md-2 row-cols-lg-3 g-2 mb-4' : 'list-view'}>
                                        {paginated.map((house) => (
                                            <div key={house.house_Id} className={view === 'grid' ? 'col' : 'col-12'}>
                                                {/* Truyền view xuống HouseCard để nó tự xử lý layout list/grid */}
                                                <HouseCard house={house} view={view} />
                                            </div>
                                        ))}
                                    </div>

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