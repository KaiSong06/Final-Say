import { useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Components
import RecordAudio from "./components/recordAudio"

// Pages
import Home from './pages/Home';
import Navbar from './pages/Navbar';
import Debate from './pages/Debate';
import NotFound from './pages/NotFound';
import About from './pages/About';

function App() {

  const handleRecordingComplete = async (audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
  }
  return (
    <Router>
      <div className = "App">
        <Navbar />
        <div className = "content">
          <Switch>
          <Route exact path = "/">
            <Home />
          </Route>
          <Route path = "/about">
            <About />
          </Route>
          <Route path = "/debate">
            <Debate />
          </Route>
          <Route path = "*">
            <NotFound />
          </Route>
        </Switch>
        </div>
      </div>
    </Router>
  )
}

export default App
