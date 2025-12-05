import { useEffect, useState } from "react";
import { api, fetchRoomsById } from "../../../api/api.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Container, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import { encodeBookingParams } from '../../../utils/encrypt.js';

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLogin, setIsLogin] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const user = localStorage.getItem('user');
        setIsLogin(!!user);
    }, []);

    useEffect(() => {
        const fetchMyBookings = async () => {
            try {
                setLoading(true);
                const response = await api.get("/bookings/my-bookings");
                setBookings(response.data);
                setError(null);
            } catch (err) {
                setError("Failed to fetch your bookings. Please make sure you are logged in.");
                console.error("Error fetching bookings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyBookings();
    }, []);

    const ViewRoomHandle = async (bookings) => {
        const roomInfo = await fetchRoomsById(bookings.room_Id);

        navigate(`/houses/${roomInfo.house_Id}/rooms/${bookings.room_Id}`);
    }


    const BookingHandle = async (booking) => {
        if (!isLogin) {
            navigate('/login', { state: { from: location }, replace: true });
            return;
        }
        const roomInfo = await fetchRoomsById(booking.room_Id);
        const token = encodeBookingParams(roomInfo.house_Id, booking.room_Id);
        navigate(`/booking/${token}`);
    }


    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading your bookings...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h2 className="text-center mb-5 fw-bold text-primary">
                Phòng đã đặt của tôi
            </h2>

            {bookings.length === 0 ? (
                <div className="text-center text-muted">
                    Bạn chưa đặt phòng nào.
                </div>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-2">
                    {bookings.map((booking) => (
                        <Col key={booking.booking_Id}>
                            <Card className="h-100 shadow-sm border-0 rounded-3">
                                <Card.Img
                                    variant="top"
                                    src={booking.roomImages?.[0] || "https://via.placeholder.com/300x200"}
                                    alt={booking.roomTitle}
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                                <Card.Body>
                                    <Card.Title className="fw-bold">{booking.roomTitle}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{booking.houseName}</Card.Subtitle>
                                    <p className="small mb-1"><strong>Address:</strong> {booking.houseAddress}</p>
                                    <p className="small mb-1"><strong>Check-in:</strong> {booking.check_In_Date}</p>
                                    <p className="small mb-1"><strong>Check-out:</strong> {booking.check_Out_Date}</p>
                                    <p className="small"><strong>Status:</strong> <span className={`fw-semibold text-${booking.status === 'Pending' ? 'warning' : 'success'}`}>{booking.status}</span></p>
                                </Card.Body>
                                <Card.Footer className="bg-white border-0 text-end">
                                    {booking.status === 'Pending' ? (<Button onClick={() => BookingHandle(booking)} className="btn btn-outline-primary btn-sm me-2">
                                        Thanh toán
                                    </Button>) : null}
                                    <Button onClick={() => ViewRoomHandle(booking)} className="btn btn-outline-primary btn-sm">
                                        Xem phòng
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )
            }
        </Container >
    );
};

export default MyBookingsPage;
