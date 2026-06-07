import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuiz } from '../services/api';
import Navbar from '../components/Navbar';

const copyToClipboard = (text) => {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export default function GenerateQuiz() {
  const [topic,       setTopic]       = useState('');
  const [difficulty,  setDifficulty]  = useState('Medium');
  const [numQ,        setNumQ]        = useState(10);
  const [forStudents, setForStudents] = useState(false);
  const [timePerQ,    setTimePerQ]    = useState(30);
  const [customTime,  setCustomTime]  = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [testInfo,    setTestInfo]    = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!customTime) {
      setTimePerQ(
        difficulty === 'Easy' ? 20 :
        difficulty === 'Hard' ? 45 : 30
      );
    }
  }, [difficulty, customTime]);

  const handleGenerate = async () => {
    if (!topic) return setError('Please enter a topic');
    setLoading(true);
    setError('');
    try {
      const { data } = await generateQuiz({
        topic, difficulty,
        numQuestions:     numQ,
        assignToStudents: forStudents,
        timePerQuestion:  timePerQ,
      });
      if (forStudents && data.testId) setTestInfo(data);
      else navigate(`/quiz/${data._id}`);
    } catch {
      setError('Generation failed. Check your Groq API key.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
    padding: '12px 16px', color: '#fff', fontSize: '14px',
    fontFamily: 'DM Sans, sans-serif', outline: 'none',
  };

  if (testInfo) return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', padding: '24px' }}>
      <Navbar />
      <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontSize: '24px',
          color: '#fff', marginBottom: '8px',
        }}>Quiz created!</h2>
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
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>
            ⏱ {testInfo.timePerQuestion}s per question
          </p>
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
            { label: 'Generate another',        action: () => { setTestInfo(null); setTopic(''); },        primary: false },
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
        }}>Generate AI quiz</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '28px' }}>
          Powered by Groq AI ✨
        </p>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '10px', padding: '10px 14px',
            fontSize: '13px', color: '#f87171', marginBottom: '20px',
          }}>{error}</div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Topic */}
          <div>
            <label style={{
              display: 'block', fontSize: '12px',
              color: 'rgba(255,255,255,0.45)', marginBottom: '6px',
            }}>Topic</label>
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Operating Systems, Python, DBMS..."
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(167,139,250,0.5)'}
              onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

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

          {/* Time per question */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px', padding: '16px',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '14px',
            }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>
                  ⏱ Time per question
                </p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                  {customTime ? 'Custom time set' : `Auto: ${timePerQ}s (based on difficulty)`}
                </p>
              </div>
              <button onClick={() => setCustomTime(!customTime)} style={{
                padding: '5px 12px', borderRadius: '8px',
                border: `1px solid ${customTime ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.1)'}`,
                background: customTime ? 'rgba(167,139,250,0.1)' : 'rgba(255,255,255,0.05)',
                color: customTime ? '#a78bfa' : 'rgba(255,255,255,0.4)',
                fontSize: '11px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}>
                {customTime ? 'Using custom' : 'Customize'}
              </button>
            </div>

            {/* Presets */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {[
                { label: '15s', value: 15 },
                { label: '20s', value: 20 },
                { label: '30s', value: 30 },
                { label: '45s', value: 45 },
                { label: '60s', value: 60 },
                { label: '90s', value: 90 },
                { label: '120s', value: 120 },
              ].map(preset => (
                <button key={preset.value}
                  onClick={() => { setTimePerQ(preset.value); setCustomTime(true); }}
                  style={{
                    padding: '6px 12px', borderRadius: '8px', border: '1px solid',
                    borderColor: timePerQ === preset.value
                      ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.1)',
                    background: timePerQ === preset.value
                      ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.03)',
                    color: timePerQ === preset.value ? '#a78bfa' : 'rgba(255,255,255,0.4)',
                    fontSize: '12px', fontWeight: timePerQ === preset.value ? '600' : '400',
                    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                  }}>{preset.label}</button>
              ))}
            </div>

            {/* Custom input */}
            {customTime && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="number" min="5" max="300" value={timePerQ}
                  onChange={e => setTimePerQ(Number(e.target.value))}
                  style={{
                    ...inputStyle, width: '100px', textAlign: 'center',
                    fontSize: '18px', fontFamily: 'Syne, sans-serif',
                    fontWeight: '700', color: '#a78bfa',
                  }}
                />
                <div>
                  <p style={{ fontSize: '13px', color: '#fff' }}>seconds per question</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                    Total: ~{Math.ceil((timePerQ * numQ) / 60)} minutes
                  </p>
                </div>
              </div>
            )}

            {/* Auto preview */}
            {!customTime && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  border: `3px solid ${
                    difficulty === 'Easy' ? 'rgba(52,211,153,0.4)' :
                    difficulty === 'Hard' ? 'rgba(248,113,113,0.4)' : 'rgba(251,191,36,0.4)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: '700',
                  color: difficulty === 'Easy' ? '#34d399' :
                         difficulty === 'Hard' ? '#f87171' : '#fbbf24',
                }}>{timePerQ}s</div>
                <div>
                  <p style={{ fontSize: '12px', color: '#fff' }}>
                    Auto-selected for <strong>{difficulty}</strong>
                  </p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
                    Total: ~{Math.ceil((timePerQ * numQ) / 60)} min for {numQ} questions
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Number of questions */}
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
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '4px',
            }}>
              <span>5</span><span>20</span>
            </div>
          </div>

          {/* Assign toggle */}
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

          {/* Generate button */}
          <button onClick={handleGenerate} disabled={loading} style={{
            padding: '14px', borderRadius: '12px', border: 'none',
            background: loading
              ? 'rgba(124,58,237,0.5)'
              : 'linear-gradient(135deg, #7c3aed, #2563eb)',
            color: '#fff', fontSize: '15px', fontWeight: '600',
            fontFamily: 'Syne, sans-serif',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? '⚡ Generating...' : '✨ Generate quiz'}
          </button>

        </div>
      </div>
    </div>
  );
}