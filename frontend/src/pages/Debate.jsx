import { useEffect, useRef, useState } from 'react';  
import axios from 'axios';

  const Debate = () => {
  const [chatLog, setChatLog] = useState([]);
  const [debateStarted, setDebateStarted] = useState(false);
  const [topic, setTopic] = useState('');
  const [textMessage, setTextMessage] = useState('');
  const chatEndRef = useRef(null);
  const [count,setCount] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);


  useEffect(() => {
    const existingMessages = Object.keys(sessionStorage).filter(key => key.includes(" - "));
    const savedTopic = sessionStorage.getItem("DebateTopic");

    if (existingMessages.length > 0 && savedTopic) {
      setDebateStarted(true);
      setTopic(savedTopic);
    }

    fetchChatHistory();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    }, [chatLog]);
  
  const fetchChatHistory = () => {
    const allKeys = Object.keys(sessionStorage)
      .filter(key => key.includes(" - "))
      .map(key => {
        const [speaker, numStr] = key.split(" - ");
        const index = parseInt(numStr, 10);
        const message = sessionStorage.getItem(key);
        return { speaker, index, message };
      })
      .sort((a, b) => a.index - b.index);

    setChatLog(allKeys);
  };

  const handleStartDebate = () => {
    if (topic.trim() !== '') {
      sessionStorage.setItem("DebateTopic", topic);
      setDebateStarted(true);
    } else {
      alert("Please enter a debate topic.");
    }
    
  };

  const handleSend = async () => {
    try {
      if (textMessage.trim() === '') return;

      const userKey = `User - ${count}`;
      sessionStorage.setItem(userKey, textMessage);

      const updatedCount = count + 1;
      setCount(updatedCount);

      const currentMessages = [...chatLog, { speaker: 'User', message: textMessage }];
      setChatLog(currentMessages);
      setTextMessage(''); 


      const contextString = currentMessages.map(entry => `${entry.speaker}: ${entry.message}`).join(' ');
      setIsThinking(true);
      const response = await axios.post('http://127.0.0.1:8000/response', null, {
        params: {
          arg: textMessage,
          topic: topic,
          context: contextString
        }
      });
      if (response.data?.error) {
        console.error("Response error:", response.data.error);
        console.log(response.data.error);
        return; 
      }


      const finalSayMessage = response.data.response;
      if (!finalSayMessage) {
          console.error("FinalSay response missing");
          return;
        }

      const finalSayKey = `FinalSay - ${updatedCount}`;
      sessionStorage.setItem(finalSayKey, finalSayMessage);

      setChatLog(prev => [...prev, { speaker: 'FinalSay', message: finalSayMessage }]);
      setCount(prev => prev + 1);
      setIsThinking(false);
    } catch (error) {
      console.error("Error during send:", error.message, error.response);

    }
  };


  const handleClear = async (e) => {
    try{
      sessionStorage.clear();
      setChatLog([]);
      setCount(0); 
      setTextMessage('');
    } catch (error) {
      console.log(error);
    };
  };

  const handleFeedback = async (e) => {
    try{
      //API 
    } catch (error) {
      console.log(error);
    };
  };

  const handleRecord = async () => {
    try {
      if (!isRecording) {
        // Start recording
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStream.current = stream;

        mediaRecorder.current = new MediaRecorder(stream);
        chunks.current = [];

        mediaRecorder.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.current.push(e.data);
          }
        };

        mediaRecorder.current.onstop = async () => {
          const audioBlob = new Blob(chunks.current, { type: 'audio/mpeg' });
          const formData = new FormData();
          formData.append('file', audioBlob, 'recording.mp3');

          try {
            const response = await axios.post('http://127.0.0.1:8000/transcribe', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            console.log(response);
            const transcription = response.data.transcription;
            console.log("Transcript:", transcription);
            setTextMessage(prev => (prev + " " + transcription).trim());

          } catch (err) {
            console.error('Transcription error:', err);
          }

          // Cleanup
          chunks.current = [];
          mediaStream.current.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.current.start();
        setIsRecording(true);
      } else {
        // Stop recording
        console.log("hi");
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
          mediaRecorder.current.stop();
        }
        setIsRecording(false);
      }
    } catch (error) {
      console.error("Recording error:", error);
    }
  };


  const handleNewStart = async (e) => {
    try{
      handleClear();
      setTopic("");
      setDebateStarted(false);
    } catch (error) {
      console.log(error);
    };
  };

  return ( 
    <div className="debate">
      <div className="debate-header">
        {!debateStarted ? (
          <div className="debate-chat-topic">
            <h3>What is today's topic of discussion?</h3>
            <input
              type="text"
              placeholder="Ask FinalSay"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button type = "submit" className="start-button" onClick={handleStartDebate}>
              Start Debate
            </button>
          </div>
        ) : (
          <div className = "debate-container">
            <div className="debate-chat-container">
            <div className = "debate-info-topbar">
              <h3>Today's Topic:</h3>
              <p>{topic}</p>
            </div>
            <div className="debate-chat-log">
              {chatLog.map((entry, index) => (
                <div
                  key={index}
                  className={`chat-bubble ${entry.speaker === 'User' ? 'user' : 'ai'}`}
                >
                 {entry.message}
                </div>
              ))}
              {isThinking && <div className="thinking-indicator">FinalSay is thinking</div>}
              <div ref={chatEndRef} />
            </div>

            <div className="debate-chat-inputs">
              <div className="chat-input">
                <input 
                type="text" 
                placeholder="Type your argument here..." 
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                />
                <div className = "top-chat-buttons">
                  <button type = "submit" className="record-button" onClick={handleSend}>
                    <p>Send</p>
                  </button>
                  <button className="record-button" onClick={handleRecord}>
                    <p>{isRecording ? "Stop Recording" : "Use Mic"}</p>
                  </button>
                </div>
              </div>
              <div className="chat-buttons">
                <button className="clear-button" onClick={handleClear}>
                  <p>Clear Chat</p>
                </button>
                <button className="feedback-button" onClick={handleFeedback}>
                  <p>Get Feedback</p>
                </button>
                <button className="start-new-button" onClick={handleNewStart}>
                  <p>Start New Debate</p>
                </button>
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Debate;
