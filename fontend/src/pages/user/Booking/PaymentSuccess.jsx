import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Lấy thông tin từ URL (ví dụ: ?orderId=123456)
    const orderId = searchParams.get('orderId');

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Icon Check xanh */}
                <div style={{ color: '#4CAF50', marginBottom: '20px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                </div>
                
                <h1 style={styles.title}>Thanh toán thành công!</h1>
                <p style={styles.text}>Cảm ơn bạn đã sử dụng dịch vụ.</p>
                {orderId && <p style={styles.info}>Mã đơn hàng: <strong>{orderId}</strong></p>}

                <button style={styles.button} onClick={() => navigate('/')}>
                    Về trang chủ
                </button>
            </div>
        </div>
    );
};

// CSS inline đơn giản
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
        fontFamily: 'Arial, sans-serif',
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
    },
    title: {
        color: '#333',
        fontSize: '24px',
        margin: '10px 0',
    },
    text: {
        color: '#666',
        marginBottom: '20px',
    },
    info: {
        backgroundColor: '#e8f5e9',
        color: '#2e7d32',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '20px',
    },
    button: {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background 0.3s',
    }
};

export default PaymentSuccess;