import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { joinQuizByTestId } from '../services/api';
import Navbar from '../components/Navbar';

export default function JoinQuiz() {
  const { testId: urlTestId } = useParams();
  const [testId,  setTestId]  = useState(urlTestId || '');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!testId) return setError('Please enter a Test ID');
    setLoading(true);
    setError('');
    try {
      const { data } = await joinQuizByTestId(testId.toUpperCase().trim());
      navigate(`/quiz/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid Test ID');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', padding: '24px' }}>
      <Navbar />
      <div style={{
        maxWidth:       '420px',
        margin:         '40px auto',
        textAlign:      'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔑</div>
        <h2 style={{
          fontFamily:   'Syne, sans-serif',
          fontSize:     '28px',
          fontWeight:   '800',
          marginBottom: '8px',
        }}>Join a quiz</h2>
        <p style={{
          color:        'rgba(255,255,255,0.4)',
          fontSize:     '14px',
          marginBottom: '32px',
        }}>Enter the Test ID given by your teacher</p>

        {error && (
          <div style={{
            background:   'rgba(239,68,68,0.1)',
            border:       '1px solid rgba(239,68,68,0.2)',
            borderRadius: '10px',
            padding:      '10px 14px',
            fontSize:     '13px',
            color:        '#f87171',
            marginBottom: '20px',
          }}>{error}</div>
        )}

        <input
          value={testId}
          onChange={e => setTestId(e.target.value.toUpperCase())}
          placeholder="TEST-XXXXX"
          maxLength={10}
          style={{
            width:         '100%',
            background:    'rgba(255,255,255,0.05)',
            border:        '2px solid rgba(124,58,237,0.3)',
            borderRadius:  '16px',
            padding:       '18px',
            color:         '#fff',
            fontSize:      '28px',
            fontFamily:    'Syne, sans-serif',
            fontWeight:    '700',
            letterSpacing: '0.15em',
            textAlign:     'center',
            outline:       'none',
            marginBottom:  '16px',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.7)'}
          onBlur={e  => e.target.style.borderColor = 'rgba(124,58,237,0.3)'}
        />

        <button
          onClick={handleJoin}
          disabled={loading}
          style={{
            width:        '100%',
            padding:      '14px',
            borderRadius: '12px',
            border:       'none',
            background:   'linear-gradient(135deg, #7c3aed, #2563eb)',
            color:        '#fff',
            fontSize:     '15px',
            fontWeight:   '600',
            fontFamily:   'Syne, sans-serif',
            cursor:       loading ? 'not-allowed' : 'pointer',
            marginBottom: '10px',
            opacity:      loading ? 0.7 : 1,
          }}>
          {loading ? 'Finding quiz...' : 'Join quiz →'}
        </button>
      </div>
    </div>
  );
}