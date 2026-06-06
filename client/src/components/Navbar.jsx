import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const links = [
    { label: '+ Generate',  path: '/generate', primary: true  },
    { label: '📄 PDF Quiz', path: '/pdf-quiz',  primary: false },
    { label: '📋 My Tests', path: '/my-tests',  primary: false },
    { label: '👤 Profile',  path: '/profile',   primary: false },
    { label: '🏠 Home',     path: '/',          primary: false },
    ...(user.role === 'admin'
      ? [{ label: '⚙️ Admin', path: '/admin', primary: false }]
      : []),
  ];

  return (
    <nav style={{
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      padding:        '12px 20px',
      background:     'rgba(255,255,255,0.03)',
      border:         '1px solid rgba(255,255,255,0.08)',
      borderRadius:   '16px',
      marginBottom:   '28px',
      backdropFilter: 'blur(10px)',
      flexWrap:       'wrap',
      gap:            '10px',
    }}>

      {/* Logo */}
      <div onClick={() => navigate('/')} style={{
        fontFamily:           'Syne, sans-serif',
        fontWeight:           800,
        fontSize:             '20px',
        background:           'linear-gradient(135deg, #a78bfa, #60a5fa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor:  'transparent',
        cursor:               'pointer',
      }}>
        QuizAI ⚡
      </div>

      {/* Nav links */}
      <div style={{
        display:    'flex',
        gap:        '8px',
        alignItems: 'center',
        flexWrap:   'wrap',
      }}>
        {links.map(link => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              padding:      '7px 14px',
              borderRadius: '10px',
              fontSize:     '12px',
              fontWeight:   '500',
              border:       link.primary ? 'none' : '1px solid rgba(255,255,255,0.1)',
              cursor:       'pointer',
              fontFamily:   'DM Sans, sans-serif',
              background:   link.primary
                ? 'linear-gradient(135deg, #7c3aed, #2563eb)'
                : location.pathname === link.path
                ? 'rgba(167,139,250,0.15)'
                : 'rgba(255,255,255,0.05)',
              color:        link.primary ? '#fff'
                : location.pathname === link.path
                ? '#a78bfa'
                : 'rgba(255,255,255,0.65)',
              transition:   'all 0.2s',
            }}>
            {link.label}
          </button>
        ))}

        {/* Divider */}
        <div style={{
          width:      '1px',
          height:     '24px',
          background: 'rgba(255,255,255,0.1)',
        }} />

        {/* Avatar */}
        <div style={{
          width:          '28px',
          height:         '28px',
          borderRadius:   '50%',
          background:     'linear-gradient(135deg, #7c3aed, #2563eb)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontSize:       '12px',
          fontWeight:     '700',
          color:          '#fff',
        }}>
          {user.name?.charAt(0).toUpperCase()}
        </div>

        {/* Logout */}
        <button onClick={logout} style={{
          padding:      '7px 14px',
          borderRadius: '10px',
          fontSize:     '12px',
          border:       '1px solid rgba(239,68,68,0.3)',
          cursor:       'pointer',
          background:   'rgba(239,68,68,0.08)',
          color:        '#f87171',
          fontFamily:   'DM Sans, sans-serif',
        }}>
          Logout
        </button>
      </div>
    </nav>
  );
}