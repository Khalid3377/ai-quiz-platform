import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizzes, getLeaderboard, getHistory } from '../services/api';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [quizzes,     setQuizzes]     = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [history,     setHistory]     = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    getQuizzes().then(r => setQuizzes(r.data));
    getLeaderboard().then(r => setLeaderboard(r.data));
    getHistory().then(r => setHistory(r.data)).catch(() => {});
  }, []);

  const avgScore = history.length > 0
    ? (history.reduce((a, r) => a + (r.score / r.totalQ) * 100, 0) / history.length).toFixed(0)
    : 0;

  const card = {
    background:   'rgba(255,255,255,0.03)',
    border:       '1px solid rgba(255,255,255,0.07)',
    borderRadius: '14px',
    padding:      '16px',
  };

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', padding: '24px' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize:   '32px',
          fontWeight: '800',
          marginBottom: '4px',
        }}>
          Welcome back,{' '}
          <span style={{
            background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
          }}>
            {user.name}
          </span>{' '}👋
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
          Ready to challenge yourself today?
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap:                 '12px',
        marginBottom:        '28px',
      }}>
        {[
          { label: 'Total points',  value: user.score || 0,       color: '#a78bfa' },
          { label: 'Quizzes taken', value: history.length,         color: '#60a5fa' },
          { label: 'Average score', value: `${avgScore}%`,         color: '#34d399' },
        ].map((s, i) => (
          <div key={i} style={card}>
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontSize:   '28px',
              fontWeight: '700',
              color:      s.color,
              marginBottom: '4px',
            }}>{s.value}</div>
            <div style={{
              fontSize:      '11px',
              color:         'rgba(255,255,255,0.35)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Quizzes */}
        <div>
          <p style={{
            fontFamily:    'Syne, sans-serif',
            fontSize:      '11px',
            fontWeight:    '600',
            color:         'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom:  '12px',
          }}>Available quizzes</p>

          {quizzes.length === 0 && (
            <div style={{ ...card, textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                No quizzes yet — generate one!
              </p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {quizzes.map(q => (
              <div
                key={q._id}
                onClick={() => navigate(`/quiz/${q._id}`)}
                style={{
                  ...card,
                  display:    'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor:     'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background     = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor    = 'rgba(167,139,250,0.35)';
                  e.currentTarget.style.transform      = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background     = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor    = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.transform      = 'translateY(0)';
                }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '500', marginBottom: '2px' }}>
                    {q.title}
                  </p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                    {q.topic}
                  </p>
                </div>
                <span style={{
                  padding:      '3px 10px',
                  borderRadius: '20px',
                  fontSize:     '10px',
                  fontWeight:   '600',
                  background:   q.difficulty === 'Easy'   ? 'rgba(52,211,153,0.12)'  :
                                q.difficulty === 'Hard'   ? 'rgba(248,113,113,0.12)' :
                                                             'rgba(251,191,36,0.12)',
                  color:        q.difficulty === 'Easy'   ? '#34d399' :
                                q.difficulty === 'Hard'   ? '#f87171' : '#fbbf24',
                }}>
                  {q.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <p style={{
            fontFamily:    'Syne, sans-serif',
            fontSize:      '11px',
            fontWeight:    '600',
            color:         'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom:  '12px',
          }}>🏆 Leaderboard</p>

          <div style={{
            background:   'rgba(255,255,255,0.03)',
            border:       '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px',
            overflow:     'hidden',
          }}>
            {leaderboard.length === 0 && (
              <p style={{ padding: '20px', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
                No scores yet. Complete a quiz!
              </p>
            )}
            {leaderboard.map((u, i) => (
              <div key={u._id} style={{
                display:       'flex',
                alignItems:    'center',
                gap:           '12px',
                padding:       '12px 16px',
                borderBottom:  i < leaderboard.length - 1
                  ? '1px solid rgba(255,255,255,0.05)' : 'none',
                background:    i === 0 ? 'rgba(251,191,36,0.04)' : 'transparent',
              }}>
                <span style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize:   '14px',
                  fontWeight: '700',
                  width:      '20px',
                  textAlign:  'center',
                  color:      i === 0 ? '#fbbf24' :
                              i === 1 ? '#94a3b8' :
                              i === 2 ? '#cd7c2f' : 'rgba(255,255,255,0.2)',
                }}>{i + 1}</span>

                <div style={{
                  width:          '32px',
                  height:         '32px',
                  borderRadius:   '50%',
                  background:     'linear-gradient(135deg, #7c3aed, #2563eb)',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontSize:       '12px',
                  fontWeight:     '700',
                }}>
                  {u.name?.charAt(0).toUpperCase()}
                </div>

                <span style={{ flex: 1, fontSize: '13px' }}>{u.name}</span>

                <span style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize:   '13px',
                  fontWeight: '600',
                  color:      '#a78bfa',
                }}>{u.score} pts</span>
              </div>
            ))}
          </div>

          {/* Join quiz card */}
          <div
            onClick={() => navigate('/join')}
            style={{
              ...card,
              marginTop:  '12px',
              cursor:     'pointer',
              textAlign:  'center',
              transition: 'all 0.2s',
              background: 'rgba(124,58,237,0.08)',
              border:     '1px solid rgba(124,58,237,0.25)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,58,237,0.08)'}>
            <p style={{ fontSize: '13px', fontWeight: '500', color: '#a78bfa' }}>
              🔑 Join a quiz with Test ID
            </p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '3px' }}>
              Enter your teacher's Test ID
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}