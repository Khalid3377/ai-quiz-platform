import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

export default function Register() {
  const [form,    setForm]    = useState({ name: '', email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await register(form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
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
      <div style={{
        position:     'absolute',
        top:          '-200px',
        left:         '50%',
        transform:    'translateX(-50%)',
        width:        '600px',
        height:       '600px',
        background:   'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
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
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
            Create your account and start learning
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
          {[
            { label: 'Name',     type: 'text',     key: 'name',     placeholder: 'Your name'         },
            { label: 'Email',    type: 'email',    key: 'email',    placeholder: 'you@example.com'   },
            { label: 'Password', type: 'password', key: 'password', placeholder: 'Min 6 characters'  },
          ].map(field => (
            <div key={field.key}>
              <label style={{
                display:      'block',
                fontSize:     '12px',
                color:        'rgba(255,255,255,0.45)',
                marginBottom: '6px',
                fontWeight:   '500',
              }}>{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                style={inputStyle}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                onFocus={e => e.target.style.borderColor = 'rgba(167,139,250,0.5)'}
                onBlur={e => e.target.style.borderColor  = 'rgba(255,255,255,0.1)'}
              />
            </div>
          ))}

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
            }}>
            {loading ? 'Creating account...' : 'Create account →'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#a78bfa', textDecoration: 'none' }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}