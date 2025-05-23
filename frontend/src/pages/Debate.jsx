import { useEffect, useRef, useState } from 'react';  

const Debate = () => {
  const [chatLog, setChatLog] = useState([]);
  const [debateStarted, setDebateStarted] = useState(false);
  const [topic, setTopic] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetch('/chat.json')
      .then((res) => res.json())
      .then((data) => setChatLog(data));
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog]);

  const handleStartDebate = () => {
    if (topic.trim() !== '') {
      setDebateStarted(true);
      // You could also store the topic to sessionStorage if needed
    } else {
      alert("Please enter a debate topic.");
    }
  };

  return ( 
    <div className="debate">
      <div className="debate-header">
        <h2 className="typewriter"><span>Speak or write your arguments here!</span></h2>

        {!debateStarted ? (
          <div className="debate-chat-topic">
            <h3>Debate Topic</h3>
            <input
              type="text"
              placeholder="What would you like to talk about..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button className="start-button" onClick={handleStartDebate}>
              Start Debate
            </button>
          </div>
        ) : (
          <div className="debate-chat-container">
            <div className="debate-chat-log">
              {chatLog.map((entry, index) => (
                <div
                  key={index}
                  className={`chat-bubble ${entry.speaker === 'User' ? 'user' : 'ai'}`}
                >
                  <strong>{entry.speaker}:</strong> {entry.message}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="debate-chat-inputs">
              <div className="chat-input">
                <input type="text" placeholder="Type your argument here..." />
                <button className="record-button">
                  <p>Use Mic</p>
                </button>
              </div>
              <div className="chat-buttons">
                <button className="clear-button">
                  <p>Clear Chat</p>
                </button>
                <button className="send-button">
                  <p>Send</p>
                </button>
                <button className="feedback-button">
                  <p>Get Feedback</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Debate;

/*
- Store Chat History in Session Storage
- Connect recordAudio component to the debate page
*/