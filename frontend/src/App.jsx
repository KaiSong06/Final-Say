import { useState } from 'react'
import RecordAudio from "./components/recordAudio"

function App() {

  const handleRecordingComplete = async (audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
  }
  return (
    <>
      <RecordAudio onRecordingComplete={handleRecordingComplete}/>
    </>
  )
}

export default App
