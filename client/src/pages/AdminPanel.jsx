import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAdminStats, getAdminUsers, getAdminQuizzes,
  deleteUser, deleteQuiz, makeAdmin
} from '../services/api';
import Navbar from '../components/Navbar';

export default function AdminPanel() {
  const [stats,   setStats]   = useState(null);
  const [users,   setUsers]   = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [tab,     setTab]     = useState('stats');
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const navigate = useNavigate();

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [s, u, q] = await Promise.all([
        getAdminStats(), getAdminUsers(), getAdminQuizzes()
      ]);
      setStats(s.data);
      setUsers(u.data);
      setQuizzes(q.data);
    } catch {
      setError('Access denied. You must be an admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
    } catch { alert('Failed to delete user'); }
  };

  const handleDeleteQuiz = async (id, title) => {
    if (!window.confirm(`Delete quiz "${title}"?`)) return;
    try {
      await deleteQuiz(id);
      setQuizzes(quizzes.filter(q => q._id !== id));
    } catch { alert('Failed to delete quiz'); }
  };

  const handleMakeAdmin = async (id, name) => {
    if (!window.confirm(`Make "${name}" an admin?`)) return;
    try {
      await makeAdmin(id);
      setUsers(users.map(u => u._id === id ? { ...u, role: 'admin' } : u));
    } catch { alert('Failed to update role'); }
  };

  const card = {
    background:   'rgba(255,255,255,0.03)',
    border:       '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
  };

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
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
          Loading admin panel...
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</p>
        <p style={{ color: '#f87171', fontSize: '18px', marginBottom: '16px' }}>{error}</p>
        <button onClick={() => navigate('/')} style={{
          padding: '10px 24px', borderRadius: '10px', border: 'none',
          background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
          color: '#fff', cursor: 'pointer', fontFamily: 'Syne, sans-serif',
        }}>Back to dashboard</button>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', padding: '24px' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontSize: '28px',
            fontWeight: '800', marginBottom: '4px',
          }}>Admin panel</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
            Manage users, quizzes and monitor platform stats
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[
            { key: 'stats',   label: '📊 Stats'   },
            { key: 'users',   label: '👥 Users'   },
            { key: 'quizzes', label: '📝 Quizzes' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding:      '8px 20px',
              borderRadius: '10px',
              border:       '1px solid',
              borderColor:  tab === t.key
                ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.08)',
              background:   tab === t.key
                ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
              color:        tab === t.key ? '#a78bfa' : 'rgba(255,255,255,0.4)',
              fontSize:     '13px',
              fontWeight:   '500',
              cursor:       'pointer',
              fontFamily:   'DM Sans, sans-serif',
              transition:   'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Stats tab */}
        {tab === 'stats' && stats && (
          <div>
            <div style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap:                 '12px',
              marginBottom:        '20px',
            }}>
              {[
                { label: 'Total users',   value: stats.totalUsers,         color: '#a78bfa' },
                { label: 'Total quizzes', value: stats.totalQuizzes,        color: '#60a5fa' },
                { label: 'Top user',      value: stats.topUser?.name || '—', color: '#fbbf24' },
              ].map((s, i) => (
                <div key={i} style={{
                  background:   'rgba(255,255,255,0.03)',
                  border:       '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '16px',
                  padding:      '20px',
                  textAlign:    'center',
                }}>
                  <div style={{
                    fontFamily:   'Syne, sans-serif',
                    fontSize:     i === 2 ? '20px' : '32px',
                    fontWeight:   '700',
                    color:        s.color,
                    marginBottom: '6px',
                  }}>{s.value}</div>
                  <div style={{
                    fontSize:      '11px',
                    color:         'rgba(255,255,255,0.35)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}>{s.label}</div>
                  {i === 2 && stats.topUser && (
                    <div style={{
                      fontSize:  '12px',
                      color:     '#fbbf24',
                      marginTop: '4px',
                    }}>{stats.topUser.score} pts</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users tab */}
        {tab === 'users' && (
          <div style={card}>
            <div style={{
              padding:      '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'space-between',
            }}>
              <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', fontSize: '14px' }}>
                All users
              </p>
              <span style={{
                background:   'rgba(167,139,250,0.1)',
                color:        '#a78bfa',
                padding:      '2px 10px',
                borderRadius: '20px',
                fontSize:     '12px',
              }}>{users.length} total</span>
            </div>
            {users.map((u, i) => (
              <div key={u._id} style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                padding:        '14px 20px',
                borderBottom:   i < users.length - 1
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
                  }}>{u.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '500', marginBottom: '2px' }}>
                      {u.name}
                    </p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                      {u.email}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize:   '13px',
                    color:      '#a78bfa',
                  }}>{u.score} pts</span>

                  <span style={{
                    padding:      '2px 10px',
                    borderRadius: '20px',
                    fontSize:     '10px',
                    fontWeight:   '600',
                    background:   u.role === 'admin'
                      ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.06)',
                    color:        u.role === 'admin' ? '#fbbf24' : 'rgba(255,255,255,0.4)',
                  }}>{u.role}</span>

                  {u.role !== 'admin' && (
                    <button onClick={() => handleMakeAdmin(u._id, u.name)} style={{
                      padding:      '4px 10px',
                      borderRadius: '8px',
                      border:       '1px solid rgba(251,191,36,0.3)',
                      background:   'rgba(251,191,36,0.08)',
                      color:        '#fbbf24',
                      fontSize:     '11px',
                      cursor:       'pointer',
                      fontFamily:   'DM Sans, sans-serif',
                    }}>Make admin</button>
                  )}

                  <button onClick={() => handleDeleteUser(u._id, u.name)} style={{
                    padding:      '4px 10px',
                    borderRadius: '8px',
                    border:       '1px solid rgba(248,113,113,0.3)',
                    background:   'rgba(248,113,113,0.08)',
                    color:        '#f87171',
                    fontSize:     '11px',
                    cursor:       'pointer',
                    fontFamily:   'DM Sans, sans-serif',
                  }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quizzes tab */}
        {tab === 'quizzes' && (
          <div style={card}>
            <div style={{
              padding:      '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'space-between',
            }}>
              <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', fontSize: '14px' }}>
                All quizzes
              </p>
              <span style={{
                background:   'rgba(96,165,250,0.1)',
                color:        '#60a5fa',
                padding:      '2px 10px',
                borderRadius: '20px',
                fontSize:     '12px',
              }}>{quizzes.length} total</span>
            </div>
            {quizzes.map((q, i) => (
              <div key={q._id} style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                padding:        '14px 20px',
                borderBottom:   i < quizzes.length - 1
                  ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '500', marginBottom: '2px' }}>
                    {q.title}
                  </p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                    {q.questions?.length} questions · {q.difficulty}
                    {q.testId && (
                      <span style={{ color: '#a78bfa', marginLeft: '8px' }}>
                        · {q.testId}
                      </span>
                    )}
                  </p>
                </div>
                <button onClick={() => handleDeleteQuiz(q._id, q.title)} style={{
                  padding:      '4px 12px',
                  borderRadius: '8px',
                  border:       '1px solid rgba(248,113,113,0.3)',
                  background:   'rgba(248,113,113,0.08)',
                  color:        '#f87171',
                  fontSize:     '11px',
                  cursor:       'pointer',
                  fontFamily:   'DM Sans, sans-serif',
                }}>Delete</button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}