import TestimonialCard from './TestimonialCard.jsx';
import { testimonials } from '../api/Testimonials.jsx';

function Testimonials() {
    return (
        <section className="testimonial-section py-5 px-2 py-5 px-sm-0">
            <div className="container">
                <div className="container">
                    <h2 className="text-center h4 fw-semibold text-dark mb-5">
                        Khách hàng nói gì về chúng tôi
                    </h2>
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-3 g-2">
                        {testimonials.map((t) => (
                            <div key={t.id} className="col">
                                <TestimonialCard testimonial={t} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
