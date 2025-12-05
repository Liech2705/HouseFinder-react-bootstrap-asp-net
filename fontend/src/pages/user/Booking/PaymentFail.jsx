import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentFail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Lấy mã lỗi từ URL
    const errorParams = searchParams.get('code');

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Icon X đỏ */}
                <div style={{ color: '#F44336', marginBottom: '20px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                    </svg>
                </div>

                <h1 style={styles.title}>Thanh toán thất bại</h1>
                <p style={styles.text}>Giao dịch của bạn không thể thực hiện.</p>
                
                {errorParams && (
                    <p style={styles.errorInfo}>
                        Mã lỗi: <strong>{errorParams}</strong>
                    </p>
                )}

                <div style={styles.buttonGroup}>
                    <button style={styles.retryBtn} onClick={() => navigate(-1)}>
                        Thử lại
                    </button>
                    <button style={styles.homeBtn} onClick={() => navigate('/')}>
                        Về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

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
        color: '#D32F2F',
        fontSize: '24px',
        margin: '10px 0',
    },
    text: {
        color: '#666',
        marginBottom: '20px',
    },
    errorInfo: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '20px',
        fontSize: '14px',
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
    },
    retryBtn: {
        backgroundColor: '#D32F2F',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    homeBtn: {
        backgroundColor: '#9E9E9E',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    }
};

export default PaymentFail;