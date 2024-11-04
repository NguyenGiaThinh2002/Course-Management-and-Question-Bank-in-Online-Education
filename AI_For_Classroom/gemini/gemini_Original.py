# AIzaSyBaDHbFRViW4BQ4MQzpDUmXVzfwUoFywoE
"""
Install the Google AI Python SDK

$ pip install google-generativeai

See the getting started guide for more information:
https://ai.google.dev/gemini-api/docs/get-started/python
"""

import os

import google.generativeai as genai

#genai.configure(api_key=os.environ["AIzaSyBaDHbFRViW4BQ4MQzpDUmXVzfwUoFywoE"])
# Directly setting the API key in the script (for testing purposes)
os.environ["GEMINI_API_KEY"] = ''

# Configure the Google Generative AI SDK with your API key
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Create the model
# See https://ai.google.dev/api/python/google/generativeai/GenerativeModel
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
  # safety_settings = Adjust safety settings
  # See https://ai.google.dev/gemini-api/docs/safety-settings
)

chat_session = model.start_chat(
  history=[
  ]
)

message = "Tell me a joke."
response = chat_session.send_message(message)


print(response.text)
