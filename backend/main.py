from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import whisper
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def index():
    return {"message": "Hello, World!"}

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    """
    Transcribe the audio to text
    """
    # Save the uploaded file temporarily
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as temp_file:
        temp_file.write(await file.read())

    # Load the Whisper model and transcribe the audio
    model = whisper.load_model("base")
    result = model.transcribe(temp_file_path)

    # Clean up the temporary file
    os.remove(temp_file_path)

    return {"transcription": result["text"]}