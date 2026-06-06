import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, submitResult } from '../services/api';

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz,            setQuiz]            = useState(null);
  const [current,         setCurrent]         = useState(0);
  const [answers,         setAnswers]         = useState([]);
  const [selected,        setSelected]        = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft,        setTimeLeft]        = useState(30);
  const timerRef = useRef(null);

  useEffect(() => { getQuiz(id).then(r => setQuiz(r.data)); }, [id]);

  useEffect(() => {
    if (!quiz) return;
    setTimeLeft(30);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, quiz]);

  useEffect(() => {
    if (timeLeft === 0 && selected === null) handleNext(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    clearInterval(timerRef.current);
    setSelected(idx);
    setShowExplanation(true);
  };

  const handleNext = (chosenIdx) => {
    const newAnswers = [...answers, chosenIdx ?? selected ?? -1];
    setAnswers(newAnswers);
    setSelected(null);
    setShowExplanation(false);
    if (current + 1 >= quiz.questions.length) {
      finishQuiz(newAnswers);
    } else {
      setCurrent(c => c + 1);
    }
  };

  const finishQuiz = async (finalAnswers) => {
    try {
      const { data } = await submitResult({
        quizId: id, answers: finalAnswers, timeTaken: 0, quiz
      });
      navigate('/results', { state: data });
    } catch { navigate('/'); }
  };

  if (!quiz) return (
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
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Loading quiz...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const q        = quiz.questions[current];
  const progress = ((current + 1) / quiz.questions.length) * 100;
  const timerPct = (timeLeft / 30) * 100;

  return (
    <div style={{
      minHeight:      '100vh',
      background:     '#0a0a0f',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      padding:        '24px',
    }}>
      {/* Header */}
      <div style={{ width: '100%', maxWidth: '640px', marginBottom: '20px' }}>
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          marginBottom:   '10px',
        }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            Question <span style={{ color: '#fff', fontWeight: '600' }}>{current + 1}</span>
            {' '}of {quiz.questions.length}
          </span>

          {/* Timer circle */}
          <div style={{ position: 'relative', width: '52px', height: '52px' }}>
            <svg width="52" height="52" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3"/>
              <circle cx="26" cy="26" r="22" fill="none"
                stroke={timeLeft <= 5 ? '#f87171' : timeLeft <= 10 ? '#fbbf24' : '#a78bfa'}
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 * (1 - timerPct / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
              />
            </svg>
            <span style={{
              position:   'absolute',
              top:        '50%',
              left:       '50%',
              transform:  'translate(-50%, -50%)',
              fontFamily: 'Syne, sans-serif',
              fontSize:   '14px',
              fontWeight: '700',
              color:      timeLeft <= 5 ? '#f87171' : '#fff',
            }}>{timeLeft}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          height:       '4px',
          background:   'rgba(255,255,255,0.08)',
          borderRadius: '2px',
          overflow:     'hidden',
        }}>
          <div style={{
            height:     '100%',
            width:      `${progress}%`,
            background: 'linear-gradient(90deg, #7c3aed, #2563eb)',
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Question card */}
      <div style={{
        width:        '100%',
        maxWidth:     '640px',
        background:   'rgba(255,255,255,0.03)',
        border:       '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding:      '28px',
        marginBottom: '16px',
      }}>
        <p style={{
          fontFamily:   'Syne, sans-serif',
          fontSize:     '18px',
          fontWeight:   '600',
          lineHeight:   '1.5',
          marginBottom: '24px',
        }}>{q.question}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {q.options.map((opt, i) => {
            let bg      = 'rgba(255,255,255,0.04)';
            let border  = 'rgba(255,255,255,0.08)';
            let color   = '#fff';
            let opacity = 1;

            if (selected !== null) {
              if (i === q.correctAnswer) {
                bg = 'rgba(52,211,153,0.1)'; border = 'rgba(52,211,153,0.4)'; color = '#34d399';
              } else if (i === selected) {
                bg = 'rgba(248,113,113,0.1)'; border = 'rgba(248,113,113,0.4)'; color = '#f87171';
              } else {
                opacity = 0.35;
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                style={{
                  width:        '100%',
                  textAlign:    'left',
                  padding:      '14px 18px',
                  borderRadius: '12px',
                  border:       `1px solid ${border}`,
                  background:   bg,
                  color,
                  opacity,
                  fontSize:     '14px',
                  cursor:       selected !== null ? 'default' : 'pointer',
                  fontFamily:   'DM Sans, sans-serif',
                  transition:   'all 0.2s',
                  display:      'flex',
                  alignItems:   'center',
                  gap:          '12px',
                }}>
                <span style={{
                  width:          '28px',
                  height:         '28px',
                  borderRadius:   '8px',
                  background:     selected !== null && i === q.correctAnswer
                    ? 'rgba(52,211,153,0.2)'
                    : selected !== null && i === selected
                    ? 'rgba(248,113,113,0.2)'
                    : 'rgba(255,255,255,0.08)',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontSize:       '12px',
                  fontWeight:     '700',
                  flexShrink:     0,
                  color:          selected !== null && i === q.correctAnswer ? '#34d399'
                    : selected !== null && i === selected ? '#f87171' : 'rgba(255,255,255,0.5)',
                }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div style={{
          width:        '100%',
          maxWidth:     '640px',
          background:   'rgba(96,165,250,0.08)',
          border:       '1px solid rgba(96,165,250,0.2)',
          borderRadius: '14px',
          padding:      '16px 18px',
          marginBottom: '16px',
          fontSize:     '13px',
          color:        'rgba(255,255,255,0.75)',
          lineHeight:   '1.6',
        }}>
          <span style={{ color: '#60a5fa', fontWeight: '600' }}>💡 Explanation: </span>
          {q.explanation}
        </div>
      )}

      {/* Next button */}
      {selected !== null && (
        <button
          onClick={() => handleNext(selected)}
          style={{
            padding:      '13px 40px',
            borderRadius: '12px',
            border:       'none',
            background:   'linear-gradient(135deg, #7c3aed, #2563eb)',
            color:        '#fff',
            fontSize:     '14px',
            fontWeight:   '600',
            fontFamily:   'Syne, sans-serif',
            cursor:       'pointer',
            letterSpacing:'0.02em',
          }}>
          {current + 1 < quiz.questions.length ? 'Next question →' : 'Finish quiz ✓'}
        </button>
      )}
    </div>
  );
}