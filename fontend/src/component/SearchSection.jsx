function SearchSection() {
    return (
        <section className="bg-search bg-[#f0f8f9] p-4 mx-auto w-100">
            <div className="container">
            <h1 className="text-center fw-semibold fs-4 mb-1 text-dark">
                Tìm phòng trọ lý tưởng của bạn
            </h1>
            <p className="text-center text-secondary fs-7 mb-4">
                Hàng nghìn phòng trọ chất lượng, giá cả phải chăng tại Hà Nội
            </p>
            <form className="d-flex flex-column flex-sm-row gap-2 justify-content-center" role="search">
                <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Tìm kiếm theo địa chỉ..."
                    aria-label="Tìm kiếm theo địa chỉ"
                />
                <select className="form-select form-select-sm" aria-label="Chọn quận/huyện">
                    <option>Chọn quận/huyện</option>
                </select>
                <select className="form-select form-select-sm" aria-label="Loại phòng">
                    <option>Loại phòng</option>
                </select>
                <button type="submit" className="btn btn-dark btn-sm fw-semibold">
                    Tìm kiếm
                </button>
            </form>
            </div>
        </section>
    );
}

export default SearchSection;
