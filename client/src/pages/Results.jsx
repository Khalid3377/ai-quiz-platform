import { useLocation, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Results() {
  const { state }  = useLocation();
  const navigate   = useNavigate();

  if (!state) { navigate('/'); return null; }

  const { score, total, percentage } = state;
  const wrong = total - score;

  const pieData = [
    { name: 'Correct', value: score },
    { name: 'Wrong',   value: wrong },
  ];

  const color   = percentage >= 70 ? '#34d399' : percentage >= 40 ? '#fbbf24' : '#f87171';
  const message = percentage >= 70 ? '🎉 Excellent work!' : percentage >= 40 ? '👍 Good effort!' : '📚 Keep practicing!';

  return (
    <div style={{
      minHeight:      '100vh',
      background:     '#0a0a0f',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '24px',
    }}>
      <div style={{
        width:        '100%',
        maxWidth:     '440px',
        background:   'rgba(255,255,255,0.03)',
        border:       '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        padding:      '40px',
        textAlign:    'center',
      }}>
        <h2 style={{
          fontFamily:   'Syne, sans-serif',
          fontSize:     '24px',
          marginBottom: '4px',
        }}>Quiz complete!</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '28px' }}>
          {message}
        </p>

        {/* Score */}
        <div style={{
          fontFamily:   'Syne, sans-serif',
          fontSize:     '72px',
          fontWeight:   '800',
          color,
          lineHeight:   1,
          marginBottom: '8px',
        }}>{percentage}%</div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '24px' }}>
          {score} out of {total} correct
        </p>

        {/* Pie chart */}
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%"
              innerRadius={55} outerRadius={80}
              paddingAngle={4} dataKey="value">
              <Cell fill="#7c3aed" />
              <Cell fill="#374151" />
            </Pie>
            <Tooltip
              contentStyle={{
                background:   '#1a1a2e',
                border:       '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color:        '#fff',
              }}
            />
            <Legend formatter={v => (
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{v}</span>
            )} />
          </PieChart>
        </ResponsiveContainer>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
          <div style={{
            background:   'rgba(52,211,153,0.08)',
            border:       '1px solid rgba(52,211,153,0.2)',
            borderRadius: '12px',
            padding:      '16px',
          }}>
            <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: '700', color: '#34d399' }}>
              {score}
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Correct</p>
          </div>
          <div style={{
            background:   'rgba(248,113,113,0.08)',
            border:       '1px solid rgba(248,113,113,0.2)',
            borderRadius: '12px',
            padding:      '16px',
          }}>
            <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: '700', color: '#f87171' }}>
              {wrong}
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Wrong</p>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { label: 'Generate new quiz', path: '/generate', primary: true  },
            { label: 'View my profile',   path: '/profile',  primary: false },
            { label: 'Back to dashboard', path: '/',         primary: false },
          ].map(btn => (
            <button key={btn.path} onClick={() => navigate(btn.path)} style={{
              padding:      '13px',
              borderRadius: '12px',
              border:       btn.primary ? 'none' : '1px solid rgba(255,255,255,0.1)',
              background:   btn.primary
                ? 'linear-gradient(135deg, #7c3aed, #2563eb)'
                : 'rgba(255,255,255,0.03)',
              color:        '#fff',
              fontSize:     '14px',
              fontWeight:   btn.primary ? '600' : '400',
              fontFamily:   btn.primary ? 'Syne, sans-serif' : 'DM Sans, sans-serif',
              cursor:       'pointer',
            }}>{btn.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}