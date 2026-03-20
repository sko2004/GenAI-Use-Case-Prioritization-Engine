import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="GenAI Use-Case Engine API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    # Use a dummy key or raise warning; in production it should fail fast
    print("WARNING: Missing GROQ_API_KEY environment variable")
    api_key = "dummy-key"

client = Groq(api_key=api_key)

class GenerateRequest(BaseModel):
    businessFunction: str
    painPoints: List[str]

@app.post("/api/generate-use-cases")
async def generate_use_cases(req: GenerateRequest):
    if not req.businessFunction or not req.painPoints:
        raise HTTPException(status_code=400, detail="businessFunction and painPoints array are required.")

    formatted_points = "\n".join([f"- {p}" for p in req.painPoints])
    
    prompt = f"""Given the business function "{req.businessFunction}" and the following pain points:
    
{formatted_points}

Suggest 5 highly relevant Generative AI use cases to address these problems.
Output ONLY a valid JSON array of objects, with no markdown code blocks or additional text wrapper (just pure JSON list).
The JSON array should have exactly this schema for each object:
[
  {{
    "title": "String - Short name of the use case",
    "description": "String - 1 to 2 sentences describing what it does",
    "expected_benefit": "String - The business value out of it",
    "risks": "String - Potential pitfalls or negative implications",
    "prerequisites": "String - Data or infrastructure needed",
    "llm_generated_reason": "String - Why it perfectly matches the user's pain points"
  }}
]"""

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are an elite Management Consultant and AI Strategist assisting global enterprises in digital transformation. Produce accurate, deeply analytical, strictly JSON formatted responses."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama3-8b-8192",
            temperature=0.3,
            response_format={"type": "json_object"}
        )

        content = chat_completion.choices[0].message.content or '[]'
        
        parsed = []
        try:
            parsed_json = json.loads(content)
            # groq json_object mode might return a dict like {"useCases": [...]}
            if isinstance(parsed_json, dict):
                keys = list(parsed_json.keys())
                if len(keys) > 0 and isinstance(parsed_json[keys[0]], list):
                    parsed = parsed_json[keys[0]]
                else:
                    parsed = [parsed_json]
            elif isinstance(parsed_json, list):
                parsed = parsed_json
        except json.JSONDecodeError:
            parsed = []

        return {"useCases": parsed}
    except Exception as e:
        print(f"Error calling Groq API: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate use cases using LLM.")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
