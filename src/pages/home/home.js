import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home () {
    const navigate = useNavigate();
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>welcome</h1>
            <button
                onClick={() => navigate('/auth')}
                style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
            >
                Register
            </button>
        </div>
    );
};

export default Home;