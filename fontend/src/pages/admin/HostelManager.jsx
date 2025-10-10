import { useState } from "react";

const initialHostels = [
    {
        id: 1,
        name: "Nhà trọ Minh Tuấn",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        rooms: [
            {
                id: 101,
                name: "Phòng 101",
                price: 2200000,
                area: "25m²",
                reviews: [
                    { id: 1, user: "Lan", rating: 5, comment: "Phòng sạch sẽ, chủ thân thiện." },
                    { id: 2, user: "Minh", rating: 4, comment: "Gần trường, giá hợp lý." }
                ]
            },
            {
                id: 102,
                name: "Phòng 102",
                price: 2000000,
                area: "22m²",
                reviews: [
                    { id: 3, user: "Tuấn", rating: 4, comment: "Yên tĩnh, an ninh tốt." }
                ]
            }
        ]
    },
    {
        id: 2,
        name: "Nhà trọ Cô Hương",
        address: "456 Đường XYZ, Quận 3, TP.HCM",
        rooms: [
            {
                id: 201,
                name: "Phòng 201",
                price: 2500000,
                area: "28m²",
                reviews: [
                    { id: 4, user: "Hải", rating: 5, comment: "Phòng rộng rãi, có cửa sổ." }
                ]
            }
        ]
    }
];

export default function HostelManager() {
    const [hostels, setHostels] = useState(initialHostels);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [newHostel, setNewHostel] = useState({ name: "", address: "" });

    // Thêm nhà trọ
    const handleAdd = (e) => {
        e.preventDefault();
        if (!newHostel.name || !newHostel.address) return;
        setHostels([
            ...hostels,
            {
                id: Date.now(),
                name: newHostel.name,
                address: newHostel.address,
                rooms: []
            }
        ]);
        setNewHostel({ name: "", address: "" });
    };

    // Xóa nhà trọ
    const handleDelete = (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa nhà trọ này?")) {
            setHostels(hostels.filter(h => h.id !== id));
        }
    };

    // Sửa nhà trọ
    const handleEdit = (id) => {
        setEditingId(id);
    };
    const handleSave = (id, name, address) => {
        setHostels(hostels.map(h => h.id === id ? { ...h, name, address } : h));
        setEditingId(null);
    };

    // Tìm kiếm
    const filteredHostels = hostels.filter(h =>
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.address.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container py-4">
            <div className="row justify-content-center mb-4">
                <div className="col-12 col-lg-10">
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 py-3 px-2 px-md-4 bg-white rounded-4 shadow-sm mb-3">
                        <div>
                            <h2 className="fw-bold text-primary d-flex align-items-center mb-1">
                                <i className="bi bi-house-door me-2 fs-2"></i>
                                Quản lý nhà trọ
                            </h2>
                            <p className="text-muted fs-5 mb-0">Thêm, sửa, xóa, tìm kiếm nhà trọ.</p>
                        </div>
                        <form className="d-flex gap-2" onSubmit={handleAdd}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tên nhà trọ mới"
                                value={newHostel.name}
                                onChange={e => setNewHostel({ ...newHostel, name: e.target.value })}
                                style={{ maxWidth: 180 }}
                            />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Địa chỉ mới"
                                value={newHostel.address}
                                onChange={e => setNewHostel({ ...newHostel, address: e.target.value })}
                                style={{ maxWidth: 220 }}
                            />
                            <button className="btn btn-success" type="submit">
                                <i className="bi bi-plus-circle"></i> Thêm
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center mb-3">
                <div className="col-12 col-lg-10">
                    <input
                        type="search"
                        className="form-control mb-2"
                        placeholder="Tìm kiếm nhà trọ theo tên hoặc địa chỉ..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <div className="table-responsive">
                        <table className="table table-hover align-middle bg-white rounded shadow-sm">
                            <thead className="table-primary">
                                <tr>
                                    <th style={{ width: 60 }}>#</th>
                                    <th>Tên nhà trọ</th>
                                    <th>Địa chỉ</th>
                                    <th>Số phòng</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHostels.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center text-muted py-4">
                                            Không tìm thấy nhà trọ nào.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredHostels.map((hostel, idx) => (
                                        <tr key={hostel.id}>
                                            <td>{idx + 1}</td>
                                            <td>
                                                {editingId === hostel.id ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        defaultValue={hostel.name}
                                                        onBlur={e => handleSave(hostel.id, e.target.value, hostel.address)}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    hostel.name
                                                )}
                                            </td>
                                            <td>
                                                {editingId === hostel.id ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        defaultValue={hostel.address}
                                                        onBlur={e => handleSave(hostel.id, hostel.name, e.target.value)}
                                                    />
                                                ) : (
                                                    hostel.address
                                                )}
                                            </td>
                                            <td>
                                                <span className="badge bg-info text-dark">{hostel.rooms.length}</span>
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(hostel.id)}>
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(hostel.id)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Custom CSS */}
            <style>{`
                .table {
                    border-radius: 1rem;
                    overflow: hidden;
                }
                .table thead th {
                    vertical-align: middle;
                }
                .table td, .table th {
                    background: #fff;
                }
                .table-responsive {
                    border-radius: 1rem;
                }
            `}</style>
        </div>
    );
}