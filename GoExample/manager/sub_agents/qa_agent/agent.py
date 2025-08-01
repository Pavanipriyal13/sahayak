from google.adk.agents import Agent
from google.adk.tools.tool_context import ToolContext
import logging

logger = logging.getLogger(__name__)

def detect_language(text: str) -> str:
    """Detect language from text input - simple heuristic approach."""
    try:
        # Simple language detection based on script
        hindi_chars = any('\u0900' <= char <= '\u097F' for char in text)
        if hindi_chars:
            return 'hindi'
        return 'english'
    except Exception as e:
        logger.warning(f"Language detection failed: {e}")
        return 'english'

def get_user_language_preference(tool_context: ToolContext) -> str:
    """Get user's preferred language from context state."""
    try:
        if hasattr(tool_context, 'state') and tool_context.state:
            preferences = tool_context.state.get("preferences", {})
            return preferences.get("language", "english").lower()
        return "english"
    except Exception:
        return "english"

def translate_response(text: str, target_language: str) -> str:
    """Simple translation/localization for common educational terms."""
    if target_language == 'hindi':
        # Basic translation patterns
        translations = {
            "Student": "छात्र",
            "Teacher": "शिक्षक", 
            "Question": "प्रश्न",
            "Answer": "उत्तर",
            "Subject": "विषय",
            "Mathematics": "गणित",
            "Science": "विज्ञान",
            "History": "इतिहास",
            "Geography": "भूगोल",
            "English": "अंग्रेजी",
            "Hindi": "हिंदी",
            "Physics": "भौतिक विज्ञान",
            "Chemistry": "रसायन विज्ञान",
            "Biology": "जीव विज्ञान",
            "Computer Science": "कंप्यूटर साइंस",
            "Thank you": "धन्यवाद",
            "Welcome": "स्वागत",
            "Help": "सहायता",
            "Learning": "शिक्षा",
            "Education": "शिक्षा"
        }
        
        for english, hindi in translations.items():
            text = text.replace(english, hindi)
    
    return text

def answer_question(question: str, tool_context: ToolContext) -> dict:
    """Answer any educational query with multilingual support."""
    try:
        logger.info(f"Answering question: {question[:100]}...")
        
        # Detect language from question
        detected_lang = detect_language(question)
        
        # Get user's preferred language from context
        preferred_lang = get_user_language_preference(tool_context)
        
        # Use detected language if no preference set, otherwise use preference
        response_lang = preferred_lang if preferred_lang != 'english' else detected_lang
        
        # Generate appropriate response based on question content and language
        if response_lang == 'hindi':
            if any(word in question.lower() for word in ['गणित', 'math', 'mathematics']):
                answer = "गणित एक बहुत महत्वपूर्ण विषय है। मैं इसमें आपकी सहायता कर सकता हूं। कृपया अपना विशिष्ट प्रश्न बताएं।"
            elif any(word in question.lower() for word in ['विज्ञान', 'science']):
                answer = "विज्ञान हमारे चारों ओर की दुनिया को समझने में मदद करता है। आपका कौन सा विज्ञान का प्रश्न है?"
            elif any(word in question.lower() for word in ['नाम', 'name', 'परिचय']):
                answer = "मैं सहायक शिक्षा एजेंट का QA सहायक हूं। मैं शिक्षा संबंधी सभी प्रश्नों का उत्तर दे सकता हूं।"
            else:
                answer = f"आपका प्रश्न '{question}' के लिए, मैं विस्तृत और सहायक उत्तर प्रदान कर सकता हूं। कृपया अधिक विशिष्ट जानकारी दें ताकि मैं बेहतर सहायता कर सकूं।"
        else:
            if any(word in question.lower() for word in ['math', 'mathematics', 'calculation']):
                answer = "Mathematics is a fundamental subject that builds logical thinking. I can help you with various math topics. Please specify your exact question."
            elif any(word in question.lower() for word in ['science', 'physics', 'chemistry', 'biology']):
                answer = "Science helps us understand the world around us. Which specific science topic would you like help with?"
            elif any(word in question.lower() for word in ['name', 'who are you', 'introduction']):
                answer = "I'm the QA assistant of Sahayak Educational Agent. I can answer all educational questions and provide detailed explanations."
            else:
                answer = f"For your question '{question}', I can provide a detailed and helpful response. Please provide more specific information so I can assist you better."
        
        # Update user's language preference if detected different language
        if hasattr(tool_context, 'state') and tool_context.state:
            preferences = tool_context.state.get("preferences", {})
            if preferences.get("language") != response_lang:
                preferences["language"] = response_lang
                try:
                    tool_context.state["preferences"] = preferences
                except Exception as e:
                    logger.warning(f"Could not update language preference: {e}")
        
        return {
            "status": "success",
            "question": question,
            "answer": answer,
            "language": response_lang,
            "detected_language": detected_lang,
            "message": "Question answered successfully" if response_lang == 'english' else "प्रश्न का उत्तर सफलतापूर्वक दिया गया"
        }
        
    except Exception as e:
        logger.error(f"Error answering question: {e}")
        error_msg = "I apologize, but I encountered an error while processing your question. Please try again."
        if response_lang == 'hindi':
            error_msg = "क्षमा करें, आपके प्रश्न को संसाधित करते समय त्रुटि हुई। कृपया पुनः प्रयास करें।"
        
        return {
            "status": "error",
            "question": question,
            "error": str(e),
            "answer": error_msg,
            "message": error_msg
        }

def provide_explanation(topic: str, difficulty_level: str, tool_context: ToolContext) -> dict:
    """Provide detailed explanation of educational topics."""
    try:
        logger.info(f"Providing explanation for topic: {topic}")
        
        # Get user's preferred language
        preferred_lang = get_user_language_preference(tool_context)
        
        # Generate explanation based on topic and difficulty
        if preferred_lang == 'hindi':
            if difficulty_level.lower() == 'easy':
                explanation = f"{topic} का सरल विवरण: यह एक महत्वपूर्ण विषय है जिसे समझना आवश्यक है। मैं इसे आसान तरीके से समझा सकता हूं।"
            elif difficulty_level.lower() == 'hard':
                explanation = f"{topic} का उन्नत विवरण: यह एक जटिल विषय है जिसके लिए गहरी समझ की आवश्यकता है।"
            else:
                explanation = f"{topic} का विस्तृत विवरण: यह विषय मध्यम स्तर का है और उचित अध्ययन से समझा जा सकता है।"
        else:
            if difficulty_level.lower() == 'easy':
                explanation = f"Simple explanation of {topic}: This is an important topic that needs to be understood. I can explain it in an easy way."
            elif difficulty_level.lower() == 'hard':
                explanation = f"Advanced explanation of {topic}: This is a complex topic that requires deep understanding."
            else:
                explanation = f"Detailed explanation of {topic}: This is a medium-level topic that can be understood with proper study."
        
        return {
            "status": "success",
            "topic": topic,
            "difficulty_level": difficulty_level,
            "explanation": explanation,
            "language": preferred_lang,
            "message": "Explanation provided successfully" if preferred_lang == 'english' else "व्याख्या सफलतापूर्वक प्रदान की गई"
        }
        
    except Exception as e:
        logger.error(f"Error providing explanation: {e}")
        error_msg = "Sorry, I couldn't provide the explanation. Please try again."
        if preferred_lang == 'hindi':
            error_msg = "क्षमा करें, मैं व्याख्या प्रदान नहीं कर सका। कृपया पुनः प्रयास करें।"
        
        return {
            "status": "error",
            "topic": topic,
            "error": str(e),
            "explanation": error_msg,
            "message": error_msg
        }

qa_agent = Agent(
    name="qa_agent",
    model="gemini-2.0-flash",
    description="Multilingual educational Q&A agent that answers queries in Hindi and English",
    instruction="""
    You are a multilingual educational Q&A assistant. Follow these rules strictly:

1. Detect the user's **preferred language** from:
   - The conversation context or provided state.
   - If a preferred language is explicitly provided, ALWAYS respond in that language.
   - If no preference is provided, detect the language from the user's latest query.

2. Translate your response into the selected language before returning the answer.
   - Never include English translations unless the selected language is English.
   - Do not mention that you translated or detected language—just respond naturally.

3. Supported languages include (but are not limited to): Hindi, English, Spanish, French, German, Arabic, Bengali, Tamil, Telugu, Gujarati, and others.

4. Your answers should:
   - Use clear, natural phrasing in the chosen language.
   - Maintain educational tone and accuracy.
   - Adapt examples and cultural references for the language context if relevant.

5. If the user's question is ambiguous, respond in the chosen language and ask clarifying questions in that same language.

6. If the language preference changes during the conversation, switch immediately without acknowledgment.

EXAMPLES:
- If user preference = 'French', answer all questions in French.
- If user preference = 'Spanish', all explanations and examples should be in Spanish.
- If user writes in English and preference is 'German', respond only in German.
"""
)