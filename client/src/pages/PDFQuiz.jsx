import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateFromPDF } from '../services/api';
import Navbar from '../components/Navbar';

const copyToClipboard = (text) => {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export default function PDFQuiz() {
  const [file,        setFile]        = useState(null);
  const [difficulty,  setDifficulty]  = useState('Medium');
  const [numQ,        setNumQ]        = useState(10);
  const [forStudents, setForStudents] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [dragOver,    setDragOver]    = useState(false);
  const [testInfo,    setTestInfo]    = useState(null);
  const navigate = useNavigate();

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') { setFile(f); setError(''); }
    else setError('Please select a PDF file only');
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleGenerate = async () => {
    if (!file) return setError('Please upload a PDF file first');
    setLoading(true); setError('');
    try {
      const formData = new FormData();
      formData.append('pdf',              file);
      formData.append('difficulty',       difficulty);
      formData.append('numQuestions',     numQ);
      formData.append('assignToStudents', forStudents);
      const { data } = await generateFromPDF(formData);
      if (forStudents && data.testId) setTestInfo(data);
      else navigate(`/quiz/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to generate quiz from PDF');
    } finally { setLoading(false); }
  };

  if (testInfo) return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', padding: '24px' }}>
      <Navbar />
      <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontSize: '24px',
          color: '#fff', marginBottom: '8px',
        }}>PDF quiz created!</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '28px' }}>
          Share this Test ID with your students
        </p>

        <div style={{
          background: 'rgba(124,58,237,0.1)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: '16px', padding: '24px', marginBottom: '16px',
        }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
            TEST ID
          </p>
          <p style={{
            fontFamily: 'Syne, sans-serif', fontSize: '36px',
            fontWeight: '800', letterSpacing: '0.1em', color: '#a78bfa',
          }}>{testInfo.testId}</p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px', padding: '14px', marginBottom: '24px',
        }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '6px' }}>
            SHAREABLE LINK
          </p>
          <p style={{ fontSize: '12px', color: '#60a5fa', wordBreak: 'break-all' }}>
            {window.location.origin}/join/{testInfo.testId}
          </p>
          <button onClick={() => {
            copyToClipboard(`${window.location.origin}/join/${testInfo.testId}`);
            alert('Link copied!');
          }} style={{
            marginTop: '10px', padding: '6px 16px', borderRadius: '8px',
            border: '1px solid rgba(96,165,250,0.3)',
            background: 'rgba(96,165,250,0.1)', color: '#60a5fa',
            fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
          }}>Copy link</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { label: 'View student responses', action: () => navigate(`/test-results/${testInfo.testId}`), primary: true  },
            { label: 'Preview quiz',            action: () => navigate(`/quiz/${testInfo._id}`),           primary: false },
            { label: 'Generate another',        action: () => { setTestInfo(null); setFile(null); },       primary: false },
          ].map((btn, i) => (
            <button key={i} onClick={btn.action} style={{
              padding: '13px', borderRadius: '12px',
              border: btn.primary ? 'none' : '1px solid rgba(255,255,255,0.1)',
              background: btn.primary
                ? 'linear-gradient(135deg, #7c3aed, #2563eb)'
                : 'rgba(255,255,255,0.03)',
              color: '#fff', fontSize: '14px',
              fontWeight: btn.primary ? '600' : '400',
              fontFamily: btn.primary ? 'Syne, sans-serif' : 'DM Sans, sans-serif',
              cursor: 'pointer',
            }}>{btn.label}</button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', padding: '24px' }}>
      <Navbar />
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontSize: '28px',
          fontWeight: '800', color: '#fff', marginBottom: '6px',
        }}>PDF quiz generation</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '28px' }}>
          Upload your notes — AI creates a quiz instantly
        </p>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '10px', padding: '10px 14px',
            fontSize: '13px', color: '#f87171', marginBottom: '20px',
          }}>{error}</div>
        )}

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => document.getElementById('pdf-input').click()}
          style={{
            border: `2px dashed ${dragOver ? '#7c3aed' : file ? '#34d399' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: '16px', padding: '40px 20px', textAlign: 'center',
            cursor: 'pointer', marginBottom: '20px',
            background: dragOver ? 'rgba(124,58,237,0.06)'
              : file ? 'rgba(52,211,153,0.04)' : 'rgba(255,255,255,0.02)',
            transition: 'all 0.2s',
          }}>
          <input id="pdf-input" type="file" accept=".pdf"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])} />
          {file ? (
            <>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>✅</div>
              <p style={{ color: '#34d399', fontWeight: '500', fontSize: '14px' }}>
                {file.name}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '4px' }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB · Click to change
              </p>
            </>
          ) : (
            <>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>📄</div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '500', fontSize: '14px' }}>
                Drop your PDF here
              </p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '4px' }}>
                or click to browse · Max 10MB
              </p>
            </>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Difficulty */}
          <div>
            <label style={{
              display: 'block', fontSize: '12px',
              color: 'rgba(255,255,255,0.45)', marginBottom: '8px',
            }}>Difficulty</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Easy', 'Medium', 'Hard'].map(d => (
                <button key={d} onClick={() => setDifficulty(d)} style={{
                  flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid',
                  borderColor: difficulty === d
                    ? d === 'Easy' ? 'rgba(52,211,153,0.5)'
                    : d === 'Hard' ? 'rgba(248,113,113,0.5)' : 'rgba(251,191,36,0.5)'
                    : 'rgba(255,255,255,0.1)',
                  background: difficulty === d
                    ? d === 'Easy' ? 'rgba(52,211,153,0.1)'
                    : d === 'Hard' ? 'rgba(248,113,113,0.1)' : 'rgba(251,191,36,0.1)'
                    : 'rgba(255,255,255,0.03)',
                  color: difficulty === d
                    ? d === 'Easy' ? '#34d399' : d === 'Hard' ? '#f87171' : '#fbbf24'
                    : 'rgba(255,255,255,0.4)',
                  fontSize: '13px', fontWeight: '500',
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                }}>{d}</button>
              ))}
            </div>
          </div>

          {/* Slider */}
          <div>
            <label style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '8px',
            }}>
              <span>Number of questions</span>
              <span style={{ color: '#a78bfa', fontWeight: '600' }}>{numQ}</span>
            </label>
            <input type="range" min="5" max="20" value={numQ}
              onChange={e => setNumQ(e.target.value)}
              style={{ width: '100%', accentColor: '#7c3aed' }} />
          </div>

          {/* Toggle */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${forStudents ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '12px', padding: '14px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>
                Assign to students
              </p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                Generates a Test ID to share
              </p>
            </div>
            <div onClick={() => setForStudents(!forStudents)} style={{
              width: '44px', height: '24px', borderRadius: '12px',
              background: forStudents ? '#7c3aed' : 'rgba(255,255,255,0.15)',
              cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
            }}>
              <div style={{
                position: 'absolute', top: '3px',
                left: forStudents ? '23px' : '3px',
                width: '18px', height: '18px', borderRadius: '50%',
                background: '#fff', transition: 'left 0.2s',
              }} />
            </div>
          </div>

          <button onClick={handleGenerate} disabled={loading || !file} style={{
            padding: '14px', borderRadius: '12px', border: 'none',
            background: loading || !file
              ? 'rgba(124,58,237,0.3)'
              : 'linear-gradient(135deg, #7c3aed, #2563eb)',
            color: '#fff', fontSize: '15px', fontWeight: '600',
            fontFamily: 'Syne, sans-serif',
            cursor: loading || !file ? 'not-allowed' : 'pointer',
          }}>
            {loading ? '⚡ Reading PDF...' : '📄 Generate quiz from PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}