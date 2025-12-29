from flask import jsonify
from config import Config
import google.generativeai as genai
from groq import Groq

PROMPT_INSTRUCTIONS = """
if conversation is hi bye type inputs reply accordingly, don't make improved prompt.

You are an expert creative assistant for prompt engineering. Your task is to take a user's simple concept and expand it into a detailed, rich, effective, and intent-aware prompt by identifying the user's intent (coding, image generation, video generation, music, poems, Q/A's, explanation, etc.).

For coding prompts, DO NOT provide code or answers. Instead, generate an improved prompt that helps the user get better results from an AI coding assistant. Focus on clarifying requirements, specifying languages, edge cases, and expected outputs.

The enhanced prompt must be a length according to the user's intent; don't make it too long if not needed, and must include intent-based features.

Do not ask questions. Generate only the final, enhanced prompt based on the user's input.

User's simple prompt: "{user_prompt}"
Enhanced prompt:
"""

class LLMService:
    GREETINGS = ["hi", "hello", "hey", "bye", "see you", "goodbye"]
    CLOSING_STATEMENTS = [
        "thanks", "thank you", "thankyou", "thx", "ty",
        "appreciate it", "appreciated", "much appreciated",
        "ok", "okay", "cool", "great", "got it", "nice", "awesome",
        "perfect", "sounds good", "that works", "alright",
        "bye", "goodbye", "see you", "see ya", "later", "take care"
    ]
    
    def __init__(self):
        # Configure Gemini API once during initialization
        if Config.GOOGLE_API_KEY:
            genai.configure(api_key=Config.GOOGLE_API_KEY)
    
    def _detect_intent_from_prompt(self, prompt):
        """Detect intent from the prompt content itself."""
        prompt_lower = prompt.lower()
        
        # Image generation keywords
        image_keywords = ["image", "photo", "picture", "generate", "create", "draw", "paint", 
                         "visual", "illustration", "artwork", "graphic", "render", "car", "bike",
                         "sunset", "portrait", "landscape", "design"]
        
        # Coding keywords
        coding_keywords = ["code", "function", "program", "script", "algorithm", "api", 
                          "class", "method", "variable", "debug", "implement", "build",
                          "create a", "write a", "make a"]
        
        # Video generation keywords
        video_keywords = ["video", "animation", "movie", "film", "clip", "footage"]
        
        # Music keywords
        music_keywords = ["music", "song", "melody", "beat", "audio", "sound", "tune"]
        
        # Writing/poetry keywords
        writing_keywords = ["poem", "story", "essay", "article", "blog", "write", "compose"]
        
        # Q&A/explanation keywords
        qa_keywords = ["explain", "what is", "how to", "why", "question", "answer", "help"]
        
        # Count matches
        image_count = sum(1 for keyword in image_keywords if keyword in prompt_lower)
        coding_count = sum(1 for keyword in coding_keywords if keyword in prompt_lower)
        video_count = sum(1 for keyword in video_keywords if keyword in prompt_lower)
        music_count = sum(1 for keyword in music_keywords if keyword in prompt_lower)
        writing_count = sum(1 for keyword in writing_keywords if keyword in prompt_lower)
        qa_count = sum(1 for keyword in qa_keywords if keyword in prompt_lower)
        
        # Return the intent with highest count
        intent_scores = {
            "image_generation": image_count,
            "coding": coding_count,
            "video_generation": video_count,
            "music": music_count,
            "writing": writing_count,
            "qa": qa_count
        }
        
        max_intent = max(intent_scores, key=intent_scores.get)
        return max_intent if intent_scores[max_intent] > 0 else None
    
    def improve_prompt(self, prompt, model_choice, previous_intent=None):
        # Check if prompt is already well structured
        if self._is_well_structured(prompt):
            return jsonify({"improved_prompt": "Your prompt is well structured, no need for improvement."})

        prompt_lower = prompt.strip().lower()

        # Only treat as greeting if the prompt is short and matches a greeting exactly
        if prompt_lower in self.GREETINGS:
            if prompt_lower in ["hi", "hello", "hey"]:
                return jsonify({"improved_prompt": "Hi! Want to make your prompt better? Send me your prompt and I'll provide an improved version."})
            elif prompt_lower in ["bye", "see you", "goodbye"]:
                return jsonify({"improved_prompt": "See you! If you need prompt improvements, just send me your prompt anytime."})

        # Context-aware response for closing statements
        if prompt_lower in self.CLOSING_STATEMENTS:
            # Use previous_intent if provided, otherwise try to detect from prompt
            intent = previous_intent or self._detect_intent_from_prompt(prompt)
            
            if intent == "image_generation":
                return jsonify({"improved_prompt": "You're welcome! If you want to generate images of other things, just type your prompt and I'll help you out."})
            elif intent == "coding":
                return jsonify({"improved_prompt": "You're welcome! If you want to create improved prompts for coding tasks, just describe what you want to build and I'll help you craft a better prompt!"})
            elif intent == "video_generation":
                return jsonify({"improved_prompt": "You're welcome! If you need help with video generation prompts, feel free to ask anytime."})
            elif intent == "music":
                return jsonify({"improved_prompt": "You're welcome! If you want to create music-related prompts, just let me know what you're looking for."})
            elif intent == "writing":
                return jsonify({"improved_prompt": "You're welcome! If you need help crafting better writing prompts, I'm here to help."})
            elif intent == "qa":
                return jsonify({"improved_prompt": "You're welcome! If you have more questions or need explanations, feel free to ask."})
            else:
                # Generic response for closing statements without specific intent
                return jsonify({"improved_prompt": "You're welcome! If you need more help with prompt improvements, just send another prompt anytime."})

        if model_choice == 'gemini':
            return self._improve_with_gemini(prompt)
        elif model_choice == 'llama3':
            return self._improve_with_llama3(prompt)
        else:
            return jsonify({"message": "Invalid model choice"}), 400

    def _is_well_structured(self, prompt):
        # Simple heuristic: prompt length, punctuation, and keywords
        prompt = prompt.strip()
        if len(prompt) > 40 and ('.' in prompt or ':' in prompt or '-' in prompt):
            return True
        # Add more checks as needed for your use case
        return False

    def _improve_with_gemini(self, simple_prompt: str):
        if not Config.GOOGLE_API_KEY:
            return jsonify({"message": "Google API key is not configured"}), 500
        try:
            model = genai.GenerativeModel('gemini-2.5-flash')
            full_instruction = PROMPT_INSTRUCTIONS.format(user_prompt=simple_prompt)
            response = model.generate_content(full_instruction)
            return jsonify({"improved_prompt": response.text.strip()})
        except Exception as e:
            return jsonify({"message": f"An error occurred with Gemini: {e}"}), 500

    def _improve_with_llama3(self, simple_prompt: str):
        api_key = Config.GROQ_API_KEY
        if not api_key:
            return jsonify({"message": "Groq API key is not configured"}), 500
        try:
            client = Groq(api_key=api_key)
            full_instruction = PROMPT_INSTRUCTIONS.format(user_prompt=simple_prompt)
            chat_completion = client.chat.completions.create(
                messages=[{"role": "user", "content": full_instruction}],
                model="llama-3.1-8b-instant",
            )
            return jsonify({"improved_prompt": chat_completion.choices[0].message.content.strip()})
        except Exception as e:
            return jsonify({"message": f"An error occurred with Llama 3: {e}"}), 500
