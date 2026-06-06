import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

export default function Login() {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await login(form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width:        '100%',
    background:   'rgba(255,255,255,0.05)',
    border:       '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding:      '12px 16px',
    color:        '#fff',
    fontSize:     '14px',
    fontFamily:   'DM Sans, sans-serif',
    outline:      'none',
    transition:   'border-color 0.2s',
  };

  return (
    <div style={{
      minHeight:      '100vh',
      background:     '#0a0a0f',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '24px',
      position:       'relative',
      overflow:       'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position:     'absolute',
        top:          '-200px',
        left:         '50%',
        transform:    'translateX(-50%)',
        width:        '600px',
        height:       '600px',
        background:   'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
        pointerEvents:'none',
      }} />

      <div style={{
        width:        '100%',
        maxWidth:     '420px',
        background:   'rgba(255,255,255,0.03)',
        border:       '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        padding:      '40px',
        position:     'relative',
      }}>
        {/* Logo */}
        <div style={{
          textAlign:    'center',
          marginBottom: '32px',
        }}>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontSize:   '28px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            marginBottom: '8px',
          }}>QuizAI ⚡</div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>
            Welcome back — let's get quizzing
          </p>
        </div>

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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{
              display:      'block',
              fontSize:     '12px',
              color:        'rgba(255,255,255,0.45)',
              marginBottom: '6px',
              fontWeight:   '500',
            }}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              style={inputStyle}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onFocus={e => e.target.style.borderColor = 'rgba(167,139,250,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div>
            <label style={{
              display:      'block',
              fontSize:     '12px',
              color:        'rgba(255,255,255,0.45)',
              marginBottom: '6px',
              fontWeight:   '500',
            }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              style={inputStyle}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onFocus={e => e.target.style.borderColor = 'rgba(167,139,250,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width:        '100%',
              padding:      '13px',
              borderRadius: '12px',
              border:       'none',
              background:   loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #2563eb)',
              color:        '#fff',
              fontSize:     '14px',
              fontWeight:   '600',
              fontFamily:   'Syne, sans-serif',
              cursor:       loading ? 'not-allowed' : 'pointer',
              marginTop:    '6px',
              transition:   'opacity 0.2s',
            }}>
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>

          <p style={{
            textAlign: 'center',
            fontSize:  '13px',
            color:     'rgba(255,255,255,0.35)',
          }}>
            No account?{' '}
            <Link to="/register" style={{ color: '#a78bfa', textDecoration: 'none' }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}