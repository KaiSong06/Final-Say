import { useEffect, useRef, useState } from 'react';  
import axios from 'axios';

const Debate = () => {
  const [chatLog, setChatLog] = useState([]);
  const [debateStarted, setDebateStarted] = useState(false);
  const [topic, setTopic] = useState('');
  const [textMessage, setTextMessage] = useState('');
  const chatEndRef = useRef(null);
  const [count,setCount] = useState(0);

useEffect(() => {
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

  fetchChatHistory();
}, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    }, [chatLog]);


  const handleStartDebate = () => {
    try {
      if (topic.trim() !== '') {
        setDebateStarted(true);
      } else {
        alert("Please enter a debate topic.");
      }
    } catch (error) {
      console.log(error);
    };
    
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
      fetchChatHistory();
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
      fetchChatHistory();
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

  const handleRecord = async (e) => {
    console.log("hi");
  }

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
                 {entry.message}
                </div>
              ))}
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
                <button className="record-button" onClick={handleSend}>
                  <p>Send</p>
                </button>
              </div>
              <div className="chat-buttons">
                <button className="clear-button" onClick={handleClear}>
                  <p>Clear Chat</p>
                </button>
                <button className="record-button" onClick={handleRecord}>
                  <p>Use Mic</p>
                </button>
                <button className="feedback-button" onClick={handleFeedback}>
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