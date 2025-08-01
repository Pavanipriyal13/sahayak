from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from typing import Optional, Dict, Any

app = FastAPI(title="Sahayak Simple API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3003",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3003"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    prompt: str
    user_id: Optional[str] = "default_user"
    session_id: Optional[str] = None

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Sahayak API is running"}

@app.post("/run")
async def run_agent(request: ChatRequest):
    """Handle chat messages from React app"""
    try:
        message = request.prompt.lower()
        
        # Simple response logic
        if "नमस्ते" in request.prompt or "hello" in message:
            response = "नमस्ते! आपका स्वागत है। मैं आपकी कैसे मदद कर सकता हूं? (Hello! Welcome. How can I help you?)"
        elif "पावनी" in request.prompt or "pavani" in message:
            response = "नमस्ते पावनी! आपका स्वागत है। मैं आपकी शिक्षा में कैसे मदद कर सकता हूं? (Hello Pavani! Welcome. How can I help you with your education?)"
        elif "attendance" in message or "उपस्थिति" in request.prompt:
            response = "I can help you with attendance management. Please provide student details."
        elif "evaluation" in message or "मूल्यांकन" in request.prompt:
            response = "I can help you with student evaluations. What type of evaluation do you need?"
        elif "visualization" in message or "विज़ुअलाइज़ेशन" in request.prompt:
            response = "I can create educational visualizations. What topic would you like to visualize?"
        elif "help" in message or "मदद" in request.prompt:
            response = "I can help you with:\n- Attendance management\n- Student evaluations\n- Educational visualizations\n- Learning paths\n- Progress analysis\n- Resource recommendations"
        else:
            response = f"Thank you for your message: '{request.prompt}'. I'm here to help with educational tasks. You can ask me about attendance, evaluations, visualizations, or any other educational content."
        
        return {
            "response": response,
            "user_id": request.user_id,
            "session_id": request.session_id or "simple_session",
            "status": "success"
        }
        
    except Exception as e:
        return {
            "error": f"Failed to process request: {str(e)}",
            "status": "error"
        }

@app.get("/")
async def root():
    return {"message": "Sahayak Educational API is running"}

if __name__ == "__main__":
    print("Starting Simple Sahayak API Server...")
    print("Access the API at: http://localhost:8001")
    print("Health check at: http://localhost:8001/health")
    print("API docs at: http://localhost:8001/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=8001) 