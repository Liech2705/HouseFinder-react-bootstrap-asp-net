function StarRating({ rating }) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
        <>
            {[...Array(fullStars)].map((_, i) => (
                <i key={"full" + i} className="fas fa-star star-yellow"></i>
            ))}
            {halfStar && <i className="fas fa-star-half-alt star-yellow"></i>}
            {[...Array(emptyStars)].map((_, i) => (
                <i key={"empty" + i} className="far fa-star star-yellow"></i>
            ))}
        </>
    );
}

export default StarRating;
