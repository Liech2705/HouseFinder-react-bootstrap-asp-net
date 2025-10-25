import StarRating from './StarRating.jsx';

function TestimonialCard({ testimonial }) {
    return (
        <article className="bg-white border border-secondary-subtle rounded-xl pt-5 pb-6 px-3 d-flex flex-column gap-2">
            <div className="d-flex align-items-center gap-2">
                <img
                    src={testimonial.avatar}
                    alt={`Avatar of ${testimonial.name}, ${testimonial.role}`}
                    className="rounded-circle"
                    width="32"
                    height="32" 
                    style={{ objectFit: "cover" }}
                    loading="lazy"
                />
                <div>
                    <p className="testimonial-name mb-0">{testimonial.name}</p>
                    <p className="testimonial-role mb-0">{testimonial.role}</p>
                </div>
            </div>
            <div className="text-yellow-400 fs-7">
                <StarRating rating={testimonial.rating} />
            </div>
            <p className="testimonial-text mb-0">{testimonial.text}</p>
        </article>
    );
}

export default TestimonialCard;
