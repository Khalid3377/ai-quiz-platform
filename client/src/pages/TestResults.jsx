import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTestResults } from '../services/api';
import Navbar from '../components/Navbar';

export default function TestResults() {
  const { testId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getTestResults(testId)
      .then(r => setResults(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [testId]);

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
          Loading responses...
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const avg    = results.length > 0
    ? (results.reduce((a, r) => a + (r.score / r.totalQ) * 100, 0) / results.length).toFixed(1)
    : 0;
  const passed = results.filter(r => (r.score / r.totalQ) * 100 >= 50).length;

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', padding: '24px' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontSize: '28px',
            fontWeight: '800', marginBottom: '6px',
          }}>Test results</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
            Test ID:{' '}
            <span style={{
              color: '#a78bfa', fontFamily: 'Syne, sans-serif',
              fontWeight: '700', letterSpacing: '0.05em',
            }}>{testId}</span>
          </p>
        </div>

        {/* Summary */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px', marginBottom: '24px',
        }}>
          {[
            { label: 'Students attempted', value: results.length, color: '#a78bfa' },
            { label: 'Average score',       value: `${avg}%`,     color: '#60a5fa' },
            { label: 'Passed (50%+)',        value: passed,        color: '#34d399' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px', padding: '20px', textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'Syne, sans-serif', fontSize: '28px',
                fontWeight: '700', color: s.color, marginBottom: '4px',
              }}>{s.value}</div>
              <div style={{
                fontSize: '11px', color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Results list */}
        <div style={{
          background:   'rgba(255,255,255,0.03)',
          border:       '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px',
          overflow:     'hidden',
        }}>
          <div style={{
            padding:      '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p style={{
              fontFamily: 'Syne, sans-serif', fontWeight: '600', fontSize: '14px'
            }}>Student responses</p>
          </div>

          {results.length === 0 && (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: '40px', marginBottom: '12px' }}>👥</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '4px' }}>
                No students have attempted this quiz yet
              </p>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>
                Share Test ID{' '}
                <span style={{ color: '#a78bfa', fontWeight: '600' }}>{testId}</span>
                {' '}with your students
              </p>
            </div>
          )}

          {results.map((r, i) => {
            const pct    = ((r.score / r.totalQ) * 100).toFixed(0);
            const passed = pct >= 50;
            return (
              <div key={i} style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                padding:        '14px 20px',
                borderBottom:   i < results.length - 1
                  ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width:          '36px',
                    height:         '36px',
                    borderRadius:   '50%',
                    background:     'linear-gradient(135deg, #7c3aed, #2563eb)',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    fontSize:       '13px',
                    fontWeight:     '700',
                    flexShrink:     0,
                  }}>{r.userName?.charAt(0).toUpperCase()}</div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '500', marginBottom: '2px' }}>
                      {r.userName}
                    </p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                      {r.userEmail}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                      {r.score}/{r.totalQ} correct
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontFamily: 'Syne, sans-serif',
                      fontSize:   '20px',
                      fontWeight: '700',
                      color:      pct >= 70 ? '#34d399' :
                                  pct >= 50 ? '#fbbf24' : '#f87171',
                    }}>{pct}%</p>
                    <span style={{
                      fontSize:     '10px',
                      padding:      '2px 8px',
                      borderRadius: '20px',
                      fontWeight:   '600',
                      background:   passed
                        ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)',
                      color:        passed ? '#34d399' : '#f87171',
                    }}>{passed ? 'Passed' : 'Failed'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}