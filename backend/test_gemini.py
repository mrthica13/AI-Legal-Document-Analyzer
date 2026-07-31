import os
from dotenv import load_dotenv
from google import genai

# Load .env
load_dotenv()

# Create Gemini Client
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

try:
    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents="Say Hello"
    )

    print("\n✅ SUCCESS\n")
    print(response.text)

except Exception as e:
    print("\n❌ ERROR\n")
    print(e)