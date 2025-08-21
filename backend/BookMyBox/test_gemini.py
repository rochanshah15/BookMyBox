import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure API
api_key = os.getenv('GEMINI_API_KEY')
print(f"API Key loaded: {bool(api_key)}")
print(f"API Key starts with: {api_key[:10] if api_key else 'None'}...")

genai.configure(api_key=api_key)

try:
    # List available models
    print("Available models:")
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            print(f"- {model.name}")
    
    # Test with the correct model name
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Hello, this is a test message.")
    print(f"Success! Response: {response.text}")
except Exception as e:
    print(f"Error: {str(e)}")
    import traceback
    traceback.print_exc()
