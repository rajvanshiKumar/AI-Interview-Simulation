import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';
import { Mic, Video, MicOff, VideoOff, Send, SkipForward, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { submitAnswer } from '../services/api';
import Loader from '../components/Loader';

const InterviewSession = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcribedText, setTranscribedText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(120); // 120 seconds = 2 minutes
  const totalQuestions = 5;
  
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('currentSession');
    if (savedSession) {
      const sessionData = JSON.parse(savedSession);
      setSession(sessionData);
      setQuestions(sessionData.selected_questions || []);
    }
  }, []);
  // Camera Feed Logic
  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Speech Recognition Logic
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      let finalTranscript = '';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        // Update state with BOTH final and interim text for a smooth "live" feel
        setTranscribedText(finalTranscript + interimTranscript);
      };

      recognition.onstart = () => {
        finalTranscript = ''; // Reset for new recording
      };

      recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === 'no-speech') {
          // Keep it running if it just timed out on silence
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleNext(); // Auto-submit when time runs out
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording, timeLeft]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(120);
  }, [currentQuestion]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setTranscribedText("");
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleNext = async () => {
    if (!session) return;
    
    setIsSubmitting(true);
    try {
      await submitAnswer(session.id, {
        question: questions[currentQuestion - 1],
        answer: transcribedText
      });
      
      if (currentQuestion < totalQuestions) {
        setCurrentQuestion(currentQuestion + 1);
        setTranscribedText("");
        setIsRecording(false);
      } else {
        navigate('/result');
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to evaluate answer. Check backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <Container>
        <Row>
          {/* Question Section */}
          <Col lg={7}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="badge bg-primary px-3 py-2 rounded-pill">Question {currentQuestion} of {totalQuestions}</span>
              <div className="text-muted fw-medium d-flex align-items-center">
                <AlertCircle size={16} className="me-1" /> Finish this session to see results
              </div>
            </div>
            
            <Card className="border-0 shadow-sm p-4 mb-4">
              <h3 className="fw-bold mb-0">{questions[currentQuestion - 1]}</h3>
            </Card>

            <Card className="border-0 shadow-sm p-4 mb-4 bg-white" style={{ minHeight: '300px', maxHeight: '400px', overflowY: 'auto' }}>
              <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
                <span className="fw-bold text-muted small uppercase">Speech-to-Text Transcription</span>
                <div className="d-flex gap-3">
                  <div className={`fw-bold small ${timeLeft < 30 ? 'text-danger animate__animated animate__pulse animate__infinite' : 'text-primary'}`}>
                    ⏳ TIME LEFT: {formatTime(timeLeft)}
                  </div>
                  {isRecording && <div className="d-flex align-items-center text-danger small fw-bold">
                    <span className="recording-dot"></span> LIVE LISTENING
                  </div>}
                </div>
              </div>
              <p className={`fs-5 ${!transcribedText ? 'text-muted fst-italic' : ''}`} style={{ whiteSpace: 'pre-wrap' }}>
                {transcribedText || "Your answer will appear here as you speak..."}
              </p>
            </Card>

            <div className="d-flex gap-3">
              <Button 
                variant={isRecording ? "danger" : "primary"} 
                className="flex-grow-1 py-3 fw-bold d-flex align-items-center justify-content-center shadow-md"
                onClick={handleToggleRecording}
                disabled={isSubmitting}
              >
                {isRecording ? <><MicOff size={20} className="me-2" /> Stop Recording</> : <><Mic size={20} className="me-2" /> Start Answer</>}
              </Button>
              <Button 
                variant="success" 
                className="py-3 px-4 fw-bold shadow-md"
                disabled={!transcribedText || isRecording || isSubmitting}
                onClick={handleNext}
              >
                {isSubmitting ? <><Loader /> Submitting...</> : (
                  <>{currentQuestion === totalQuestions ? "Submit Interview" : "Next Question"} <Send size={18} className="ms-2" /></>
                )}
              </Button>
            </div>
          </Col>

          {/* Camera Feed Context */}
          <Col lg={5}>
            <Card className="border-0 shadow-sm bg-dark overflow-hidden position-relative" style={{ height: '400px' }}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-100 h-100" 
                style={{ objectFit: 'cover' }}
              />
              
              <div className="position-absolute bottom-0 start-0 w-100 p-3 d-flex justify-content-between align-items-end" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                <div className="d-flex gap-2">
                  <div className={`bg-white ${isRecording ? 'bg-opacity-50 text-danger' : 'bg-opacity-20 text-white'} p-2 rounded-circle`}><Mic size={16} /></div>
                  <div className="bg-white bg-opacity-20 text-white p-2 rounded-circle"><Video size={16} /></div>
                </div>
                <span className="badge bg-danger rounded-pill px-3">Live Analysis Active</span>
              </div>
            </Card>
            
            <Card className="border-0 shadow-sm mt-4 p-4">
              <h6 className="fw-bold mb-3">AI Instructions</h6>
              <ul className="small text-muted mb-0 ps-3">
                <li className="mb-2">Keep your back straight and maintain eye contact.</li>
                <li className="mb-2">Speak clearly and at a moderate pace.</li>
                <li>Try to answer within 1-2 minutes for each question.</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default InterviewSession;
