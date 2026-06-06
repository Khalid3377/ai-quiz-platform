import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function MyTests() {
  const [tests,   setTests]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { loadMyTests(); }, []);

  const loadMyTests = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        'http://localhost:5000/api/quizzes/my-tests',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          border: '3px solid rgba(124,58,237,0.3)',
          borderTop: '3px solid #7c3aed',
          margin: '0 auto 16px',
          animation: 'spin 1s linear infinite',
        }} />
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
          Loading your tests...
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', padding: '24px' }}>
      <Navbar />
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        <div style={{ marginBottom: '28px' }}>
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontSize: '28px',
            fontWeight: '800', marginBottom: '4px',
          }}>My assigned tests</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
            Tests you created for students
          </p>
        </div>

        {tests.length === 0 && (
          <div style={{
            background:   'rgba(255,255,255,0.03)',
            border:       '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px',
            padding:      '60px 20px',
            textAlign:    'center',
          }}>
            <p style={{ fontSize: '48px', marginBottom: '12px' }}>📋</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '4px' }}>
              No assigned tests yet
            </p>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', marginBottom: '20px' }}>
              Generate a quiz with "Assign to students" toggle ON
            </p>
            <button onClick={() => navigate('/generate')} style={{
              padding: '10px 24px', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              color: '#fff', cursor: 'pointer',
              fontFamily: 'Syne, sans-serif', fontWeight: '600',
            }}>Generate quiz</button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tests.map(test => (
            <div key={test._id} style={{
              background:   'rgba(255,255,255,0.03)',
              border:       '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px',
              padding:      '20px',
            }}>
              {/* Header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: '16px',
              }}>
                <div>
                  <h3 style={{
                    fontFamily: 'Syne, sans-serif', fontSize: '16px',
                    fontWeight: '600', marginBottom: '4px',
                  }}>{test.title}</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                    Created by {test.assignedBy} · {test.questions?.length} questions
                  </p>
                </div>
                <span style={{
                  padding: '3px 12px', borderRadius: '20px',
                  fontSize: '11px', fontWeight: '600',
                  background: test.difficulty === 'Easy'   ? 'rgba(52,211,153,0.12)'  :
                              test.difficulty === 'Hard'   ? 'rgba(248,113,113,0.12)' :
                                                             'rgba(251,191,36,0.12)',
                  color:      test.difficulty === 'Easy'   ? '#34d399' :
                              test.difficulty === 'Hard'   ? '#f87171' : '#fbbf24',
                }}>{test.difficulty}</span>
              </div>

              {/* Test ID */}
              <div style={{
                background:   'rgba(124,58,237,0.08)',
                border:       '1px solid rgba(124,58,237,0.2)',
                borderRadius: '12px',
                padding:      '14px 16px',
                marginBottom: '12px',
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <p style={{
                    fontSize: '10px', color: 'rgba(255,255,255,0.35)',
                    marginBottom: '4px', letterSpacing: '0.06em',
                  }}>TEST ID</p>
                  <p style={{
                    fontFamily:    'Syne, sans-serif',
                    fontSize:      '22px',
                    fontWeight:    '800',
                    color:         '#a78bfa',
                    letterSpacing: '0.1em',
                  }}>{test.testId}</p>
                </div>
                <button onClick={() => {
                  navigator.clipboard.writeText(test.testId);
                  alert('Test ID copied!');
                }} style={{
                  padding: '8px 14px', borderRadius: '8px',
                  border: '1px solid rgba(167,139,250,0.3)',
                  background: 'rgba(167,139,250,0.1)',
                  color: '#a78bfa', fontSize: '12px',
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                }}>📋 Copy ID</button>
              </div>

              {/* Link */}
              <div style={{
                background:   'rgba(255,255,255,0.02)',
                border:       '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
                padding:      '10px 14px',
                marginBottom: '14px',
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'space-between',
                gap:          '12px',
              }}>
                <p style={{
                  fontSize: '11px', color: '#60a5fa',
                  wordBreak: 'break-all', flex: 1,
                }}>
                  {window.location.origin}/join/{test.testId}
                </p>
                <button onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/join/${test.testId}`
                  );
                  alert('Link copied!');
                }} style={{
                  padding: '5px 10px', borderRadius: '6px',
                  border: '1px solid rgba(96,165,250,0.3)',
                  background: 'rgba(96,165,250,0.08)',
                  color: '#60a5fa', fontSize: '11px',
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                  whiteSpace: 'nowrap',
                }}>Copy link</button>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => navigate(`/test-results/${test.testId}`)} style={{
                  flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                  background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                  color: '#fff', fontSize: '13px', fontWeight: '600',
                  fontFamily: 'Syne, sans-serif', cursor: 'pointer',
                }}>👥 View responses</button>
                <button onClick={() => navigate(`/quiz/${test._id}`)} style={{
                  flex: 1, padding: '10px', borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'rgba(255,255,255,0.6)', fontSize: '13px',
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                }}>👁️ Preview quiz</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}