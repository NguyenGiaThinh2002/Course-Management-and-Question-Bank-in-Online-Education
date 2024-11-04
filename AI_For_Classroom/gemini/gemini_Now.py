import os
import google.generativeai as genai
import fitz  # PyMuPDF
# source myenv/bin/activate
# Set your API key as an environment variable
os.environ["GEMINI_API_KEY"] = ''

# Configure the Google Generative AI SDK with your API key
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Define the configuration for generating responses
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# Create a GenerativeModel instance
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config
)

# Function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    text = ""
    with fitz.open(pdf_path) as pdf:
        for page in pdf:
            text += page.get_text()
    return text

# Function to generate questions from text
def generate_questions(text):
    chat_session = model.start_chat(
        history=[]
    )
    #prompt = f"Sinh ra câu hỏi có 6 mức độ nhận thức theo bloom dựa trên dữ liệu đã cho:\n\n{text}"
    prompt = f"""
    Sinh ra các câu hỏi có 6 mức độ nhận thức theo Bloom dựa trên dữ liệu đã cho:
    {text}

    Hãy xuất ra dưới dạng JSON với định dạng sau:
    [
        {{
            "level": "Remember",
            "question": "Câu hỏi tương ứng với mức độ Remember",
            "question": "Câu hỏi tương ứng với mức độ Remember",
            "question": "Câu hỏi tương ứng với mức độ Remember"
        }},
        {{
            "level": "Understand",
            "question": "Câu hỏi tương ứng với mức độ Understand",
            "question": "Câu hỏi tương ứng với mức độ Understand",
            "question": "Câu hỏi tương ứng với mức độ Understand"
        }},
        {{
            "level": "Apply",
            "question": "Câu hỏi tương ứng với mức độ Apply",
            "question": "Câu hỏi tương ứng với mức độ Apply",
            "question": "Câu hỏi tương ứng với mức độ Apply"
        }},
        {{
            "level": "Analyze",
            "question": "Câu hỏi tương ứng với mức độ Analyze",
            "question": "Câu hỏi tương ứng với mức độ Apply",
            "question": "Câu hỏi tương ứng với mức độ Apply"
        }},
        {{
            "level": "Evaluate",
            "question": "Câu hỏi tương ứng với mức độ Evaluate",
            "question": "Câu hỏi tương ứng với mức độ Evaluate",
            "question": "Câu hỏi tương ứng với mức độ Evaluate"
        }},
        {{
            "level": "Create",
            "question": "Câu hỏi tương ứng với mức độ Create",
            "question": "Câu hỏi tương ứng với mức độ Create",
            "question": "Câu hỏi tương ứng với mức độ Create"
        }}
    ]
    """

    # i neeed a pre condition for the prompt to store questions. Ví dụ như là sẽ luôn cho một dấu - Trước câu hỏi và ? cuối câu hỏi
    # Để lưu các câu hỏi đó để hiện ra cho người dùng lựa chọn. Nếu có theo dạng level thì lưu level không thì lưu dạng thông thường normal.

    response = chat_session.send_message(prompt)

    return response.text

# Main script
pdf_path = 'test1.pdf'  # Replace with your PDF file path
extracted_text = extract_text_from_pdf(pdf_path)
questions = generate_questions(extracted_text)

print("Generated Questions:")
print(questions)
