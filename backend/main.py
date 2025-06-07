'''
uvicorn main:app --reload
'''
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from langchain.chat_models import init_chat_model
from fastapi.responses import StreamingResponse
import asyncio
from google import genai
from google.genai import types
import vertexai
import whisper
from dotenv import load_dotenv
import os

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

#Load model
GPT = init_chat_model("gpt-4o-mini", model_provider="openai", api_key=OPENAI_API_KEY)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://final-say.vercel.app"],
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
async def response(arg: str, topic: str, context: str):
    async def generate_stream():
        try:
            client = genai.Client(
                vertexai=True,
                project=os.getenv("PROJECT_ID"),
                location="us-central1",
            )

            MODEL_NAME = f"projects/{os.getenv("PROJECT_ID")}/locations/us-central1/tunedModels/{os.getenv("MODEL_ID")}"
            
            contents = [
                types.Content(
                    role="user",
                    parts=[{
                        "text": f"""
                        You are an expert AI Debate Coach. Your task is to argue against the student's position in a formal debate.

                        Student's Resolution:
                        "{topic}"

                        Student's Argument:
                        "{arg}"

                        Context:
                        "{context}"
                        """
                    }]
                )
            ]

            # Stream the response
            stream = client.models.generate_content_stream(
                model=MODEL_NAME,
                contents=contents
            )

            for chunk in stream:
                if chunk.text:
                    yield f"data: {chunk.text}\n\n"
                await asyncio.sleep(0.01)
                
        except Exception as e:
            print(f"Server Error: {str(e)}")
            yield f"data: Error: {str(e)}\n\n"

    return StreamingResponse(
        generate_stream(),
        media_type="text/event-stream"
    )
