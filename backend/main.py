from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage, AIMessage
import whisper
from dotenv import load_dotenv
import os

#-

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

#Load models
GPT = init_chat_model("gpt-4o-mini", model_provider="openai", api_key=OPENAI_API_KEY)
Gemini = ChatGoogleGenerativeAI(model="gemini-2.0-flash-001", api_key=GEMINI_API_KEY)

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
def response(arg: str, topic: str, context: str):
    try:
        """
        Return the AI generated response
        """

        #Get initial response
        responsePrompt = f"""
        You are an expert AI Debate Coach. Your task is to argue against the student’s position in a formal debate. Read the student's argument and craft a compelling, well-structured rebuttal. Use logical reasoning, evidence, and rhetorical skill to dismantle their claims and strengthen the opposing stance.

        Student’s Resolution:
        "{topic}"

        Student’s Argument:
        "{arg}"

        Context:
        "{context}"
        Respond with your rebuttal only, as if you are their opponent in a competitive debate. Limit your rebuttal to 150 words.
        """
        response_obj = Gemini([HumanMessage(content=responsePrompt)])
        response_text = response_obj[0].content if isinstance(response_obj, list) else response_obj.content

        #Check response
        checkPrompt = f"""
        You are an expert in detecting and correcting biases in language model outputs.
        Read the following LLM-generated response and revise it to remove any potential bias — including cultural, political, gender, racial, or socioeconomic bias — that may result from the model’s training data.
        Your goal is to produce a neutral, inclusive, and fact-based version of the response, without changing its intended meaning or usefulness.
        Only return the corrected response. Do not include any commentary or explanation.

        Original Response: {response_text}
        """

        checked_response_obj = GPT([AIMessage(content=checkPrompt)])
        final_response = checked_response_obj[0].content if isinstance(checked_response_obj, list) else checked_response_obj.content

        print("Final Response" + final_response)
        return {"response": final_response}
    except Exception as e:
        print("Error in /response:", str(e))
        return {"error": str(e)}