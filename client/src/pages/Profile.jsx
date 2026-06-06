import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, getHistory } from '../services/api';
import Navbar from '../components/Navbar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getProfile().then(r => setProfile(r.data));
    getHistory().then(r => setHistory(r.data));
  }, []);

  if (!profile) return (
    <div style={{
      minHeight:      '100vh',
      background:     '#0a0a0f',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width:        '40px',
          height:       '40px',
          borderRadius: '50%',
          border:       '3px solid rgba(124,58,237,0.3)',
          borderTop:    '3px solid #7c3aed',
          margin:       '0 auto 16px',
          animation:    'spin 1s linear infinite',
        }} />
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
          Loading profile...
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const avgScore = history.length > 0
    ? (history.reduce((a, r) => a + (r.score / r.totalQ) * 100, 0) / history.length).toFixed(1)
    : 0;

  const chartData = history.slice(0, 7).reverse().map((r, i) => ({
    name:  `Q${i + 1}`,
    score: parseFloat(((r.score / r.totalQ) * 100).toFixed(0)),
    topic: r.topic,
  }));

  const card = {
    background:   'rgba(255,255,255,0.03)',
    border:       '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
    padding:      '20px',
  };

  const label = {
    fontSize:      '11px',
    color:         'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom:  '12px',
    fontFamily:    'Syne, sans-serif',
    fontWeight:    '600',
  };

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', padding: '24px' }}>
      <Navbar />

      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* Profile card */}
        <div style={{
          ...card,
          display:      'flex',
          alignItems:   'center',
          gap:          '20px',
          marginBottom: '20px',
          background:   'rgba(124,58,237,0.06)',
          border:       '1px solid rgba(124,58,237,0.2)',
        }}>
          <div style={{
            width:          '64px',
            height:         '64px',
            borderRadius:   '50%',
            background:     'linear-gradient(135deg, #7c3aed, #2563eb)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            fontSize:       '24px',
            fontWeight:     '800',
            fontFamily:     'Syne, sans-serif',
            flexShrink:     0,
          }}>
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize:   '22px',
              fontWeight: '700',
              marginBottom:'2px',
            }}>{profile.name}</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
              {profile.email}
            </p>
            <span style={{
              display:      'inline-block',
              marginTop:    '6px',
              padding:      '2px 10px',
              borderRadius: '20px',
              fontSize:     '10px',
              fontWeight:   '600',
              background:   profile.role === 'admin'
                ? 'rgba(251,191,36,0.15)' : 'rgba(167,139,250,0.15)',
              color:        profile.role === 'admin' ? '#fbbf24' : '#a78bfa',
            }}>
              {profile.role?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap:                 '12px',
          marginBottom:        '20px',
        }}>
          {[
            { label: 'Total points',  value: profile.score || 0, color: '#a78bfa' },
            { label: 'Quizzes taken', value: history.length,      color: '#60a5fa' },
            { label: 'Average score', value: `${avgScore}%`,      color: '#34d399' },
          ].map((s, i) => (
            <div key={i} style={card}>
              <div style={{
                fontFamily:   'Syne, sans-serif',
                fontSize:     '28px',
                fontWeight:   '700',
                color:        s.color,
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

        {/* Bar chart */}
        {chartData.length > 0 && (
          <div style={{ ...card, marginBottom: '20px' }}>
            <p style={label}>📊 Recent performance</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} domain={[0, 100]}
                  tickFormatter={v => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    background:   '#1a1a2e',
                    border:       '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color:        '#fff',
                    fontSize:     '12px',
                  }}
                  formatter={(value, name, props) => [`${value}%`, props.payload.topic]}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i}
                      fill={entry.score >= 70 ? '#7c3aed' :
                            entry.score >= 40 ? '#d97706' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{
              display:        'flex',
              gap:            '16px',
              justifyContent: 'center',
              marginTop:      '12px',
            }}>
              {[
                { color: '#7c3aed', label: 'Above 70%' },
                { color: '#d97706', label: '40–70%'    },
                { color: '#ef4444', label: 'Below 40%' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%', background: l.color
                  }} />
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
                    {l.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weak topics */}
        {profile.weakTopics?.length > 0 && (
          <div style={{ ...card, marginBottom: '20px' }}>
            <p style={label}>📚 Topics to improve</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[...new Set(profile.weakTopics)].map((topic, i) => (
                <span key={i} style={{
                  padding:      '5px 14px',
                  borderRadius: '20px',
                  fontSize:     '12px',
                  fontWeight:   '500',
                  background:   'rgba(248,113,113,0.1)',
                  border:       '1px solid rgba(248,113,113,0.2)',
                  color:        '#f87171',
                }}>{topic}</span>
              ))}
            </div>
          </div>
        )}

        {/* History */}
        <div style={card}>
          <p style={label}>📋 Quiz history</p>
          {history.length === 0 && (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
              No quizzes taken yet.
            </p>
          )}
          {history.map((r, i) => {
            const pct = ((r.score / r.totalQ) * 100).toFixed(0);
            return (
              <div key={i} style={{
                display:       'flex',
                alignItems:    'center',
                justifyContent:'space-between',
                padding:       '12px 0',
                borderBottom:  i < history.length - 1
                  ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '500', marginBottom: '2px' }}>
                    {r.quizTitle || r.topic}
                  </p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                    {r.score}/{r.totalQ} correct
                  </p>
                </div>
                <span style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize:   '18px',
                  fontWeight: '700',
                  color:      pct >= 70 ? '#34d399' :
                              pct >= 40 ? '#fbbf24' : '#f87171',
                }}>{pct}%</span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}