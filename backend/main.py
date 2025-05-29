from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate
import google.generativeai as ChatGoogleGenerativeAI
from google import genai
import whisper
from dotenv import load_dotenv
import os

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

#Load models
GPT = init_chat_model("gpt-4o-mini", model_provider="openai", api_key=OPENAI_API_KEY)
Gemini = ChatGoogleGenerativeAI(model="gemini-2.5-Flash", api_key=GEMINI_API_KEY)

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

@app.post("/response")
def response(arg: str, topic: str):
    """
    Return the AI generated response
    """
    system_template = ""