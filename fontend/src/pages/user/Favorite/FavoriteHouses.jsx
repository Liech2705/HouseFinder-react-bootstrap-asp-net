import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { HeartFill } from "react-bootstrap-icons"; // dùng icon từ bootstrap-icons
import { house } from "../../../api/house";

const FavoriteHouses = () => {
    const [favorites, setFavorites] = useState([]);
    const placeholder = 'https://surl.li/drynzt';
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;

                if (!userId) {
                    console.warn("Không tìm thấy userId");
                    return;
                }

                const res = await axios.get(
                    `https://localhost:7167/api/FavoriteHouse/user/${userId}`
                );
                setFavorites(res.data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách yêu thích:", error);
            }
        };

        fetchFavorites();
    }, []);

    return (
        <div className="container py-5">
            <h2 className="text-center mb-5 fw-bold text-primary">
                💖 Danh sách nhà trọ yêu thích
            </h2>

            {favorites.length === 0 ? (
                <div className="text-center text-muted">
                    Bạn chưa yêu thích nhà trọ nào.
                </div>
            ) : (
                <div className="row g-2">
                    {favorites.map((fav) => {
                        const house = fav.house;
                        if (!house) return null;
                        const firstImage = house.houseImages && house.houseImages.length > 0
                            ? house.houseImages[0].image_Url
                            : null;

                        const imageUrl = firstImage
                            ? import.meta.env.VITE_URL_ROOT + firstImage
                            : placeholder;

                        return (
                            <div
                                key={fav.favorite_Id}
                                className="col-12 col-sm-6 col-lg-4 d-flex align-items-stretch"
                            >
                                <div className="card shadow-sm border-0 rounded-4 overflow-hidden w-100 hover-shadow position-relative">
                                    {/* Ảnh nhà */}
                                    <Link to={`/houses/${house.house_Id}`}>
                                        <img
                                            src={imageUrl || placeholder}
                                            alt={house.house_Name}
                                            className="card-img-top"
                                            style={{ height: "220px", objectFit: "cover" }}
                                        />
                                    </Link>

                                    {/* Icon tim */}
                                    <div
                                        className="position-absolute top-0 end-0 m-3 bg-light rounded-circle p-2 shadow-sm"
                                        title="Đã yêu thích"
                                    >
                                        <HeartFill className="text-danger" size={22} />
                                    </div>

                                    {/* Nội dung */}
                                    <div className="card-body">
                                        <h5 className="card-title fw-semibold text-dark">
                                            {house.house_Name}
                                        </h5>
                                        <p className="card-text text-secondary small mb-2">
                                            {house.description?.length > 80
                                                ? house.description.slice(0, 80) + "..."
                                                : house.description}
                                        </p>
                                        <p className="fw-bold text-primary mb-0">
                                            📍 {house.commune}, {house.province}
                                        </p>
                                    </div>

                                    {/* Footer */}
                                    <div className="card-footer bg-white border-0 text-end">
                                        <Link
                                            to={`/houses/${house.house_Id}`}
                                            className="btn btn-outline-primary btn-sm rounded-pill"
                                        >
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FavoriteHouses;
