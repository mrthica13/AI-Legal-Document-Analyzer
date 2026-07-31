import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

# Gemini Client
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def summarize_text(text: str):

    if not text.strip():
        return "No text found in the PDF."

    prompt = f"""
You are an AI Legal Document Analyzer.

Read the following legal document and provide:

1. A short summary.
2. Important clauses.
3. Risks (if any).
4. Final conclusion.

Document:

{text}
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt
        )

        return response.text

    except Exception as e:
        print("Gemini Error:", e)
        return f"AI Summary Failed: {str(e)}"