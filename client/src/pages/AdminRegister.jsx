import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminRegister() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', secretCode: ''
  });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !form.secretCode) {
      return setError('Please fill all fields');
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(
        'https://ai-quiz-backend-dbhw.onrender.com/api/auth/register-admin', form
      );
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(data.user));
      setSuccess('✅ Admin account created! Redirecting...');
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create admin');
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
        background:   'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)',
        pointerEvents:'none',
      }} />

      <div style={{
        width:        '100%',
        maxWidth:     '420px',
        background:   'rgba(255,255,255,0.03)',
        border:       '1px solid rgba(251,191,36,0.15)',
        borderRadius: '24px',
        padding:      '40px',
        position:     'relative',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🛡️</div>
          <h2 style={{
            fontFamily:   'Syne, sans-serif',
            fontSize:     '24px',
            fontWeight:   '800',
            marginBottom: '6px',
          }}>Admin registration</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>
            Requires secret code — admins only
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

        {success && (
          <div style={{
            background:   'rgba(52,211,153,0.1)',
            border:       '1px solid rgba(52,211,153,0.2)',
            borderRadius: '10px',
            padding:      '10px 14px',
            fontSize:     '13px',
            color:        '#34d399',
            marginBottom: '20px',
          }}>{success}</div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { label: 'Name',        type: 'text',     key: 'name',       placeholder: 'Admin name'           },
            { label: 'Email',       type: 'email',    key: 'email',      placeholder: 'admin@example.com'    },
            { label: 'Password',    type: 'password', key: 'password',   placeholder: 'Min 6 characters'     },
            { label: 'Secret code', type: 'password', key: 'secretCode', placeholder: 'Enter secret code'    },
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
                value={form[field.key]}
                style={inputStyle}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                onFocus={e => e.target.style.borderColor = 'rgba(251,191,36,0.5)'}
                onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          ))}

          <button onClick={handleSubmit} disabled={loading} style={{
            width:        '100%',
            padding:      '13px',
            borderRadius: '12px',
            border:       'none',
            background:   loading
              ? 'rgba(180,120,0,0.4)'
              : 'linear-gradient(135deg, #d97706, #b45309)',
            color:        '#fff',
            fontSize:     '14px',
            fontWeight:   '600',
            fontFamily:   'Syne, sans-serif',
            cursor:       loading ? 'not-allowed' : 'pointer',
            marginTop:    '4px',
          }}>
            {loading ? 'Creating admin...' : '🛡️ Create admin account'}
          </button>

          <button onClick={() => navigate('/login')} style={{
            width:        '100%',
            padding:      '13px',
            borderRadius: '12px',
            border:       '1px solid rgba(255,255,255,0.1)',
            background:   'transparent',
            color:        'rgba(255,255,255,0.4)',
            fontSize:     '14px',
            cursor:       'pointer',
            fontFamily:   'DM Sans, sans-serif',
          }}>Back to login</button>
        </div>
      </div>
    </div>
  );
}