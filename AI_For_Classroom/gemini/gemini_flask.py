import os
import io
import google.generativeai as genai
import fitz  # PyMuPDF
from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)
# from bson import Binary

CORS(app) 
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

def extract_text_from_pdf_buffer(pdf_buffer):
    if isinstance(pdf_buffer, list):
        pdf_buffer = bytes(pdf_buffer)  # Convert list of integers to bytes
    elif not isinstance(pdf_buffer, io.BytesIO):
        raise TypeError("Expected pdf_buffer to be a BytesIO object or bytes")

    pdf_buffer = io.BytesIO(pdf_buffer)  # Wrap it in a BytesIO object

    text = ""
    with fitz.open(stream=pdf_buffer, filetype="pdf") as pdf:
        for page_num in range(len(pdf)):
            page = pdf.load_page(page_num)
            text += page.get_text()
    return text
# Function to generate questions from a PDF buffer
def chatbot_response(msg, pdf_buffer):
    extracted_text = extract_text_from_pdf_buffer(pdf_buffer)  # Ensure this function is defined
    questions = generate_questions(extracted_text, msg)
    print("Generated Questions:", questions)
    return questions

# Function to generate questions from text
def generate_questions(text, msg):
    chat_session = model.start_chat(history=[])
    print(msg)
    prompt = f"""
    {msg} dựa trên dữ liệu sau đây:
    Xin ra câu hỏi ngắn gọn và chỉnh hỏi về kiến thức chứ không đề cập (hình, chương hoặc câu), trước câu hỏi hãy có dấu - đầu dòng, kết thúc bằng dấu chấm hỏi và Không viết gì thêm ngoài câu hỏi.
    "{text}"
    """
    response = chat_session.send_message(prompt)
    return response.text

def generate_wrong_answers(question, answer):
    chat_session = model.start_chat(history=[])
    prompt = f"""
    Dựa vào câu hỏi và câu trả lời sau đây:
    Câu hỏi: {question},
    Câu trả lời: {answer},
    Xin ra cho tôi 3 câu trả lời sai tương tự và cùng độ dài với câu trả lời đúng ở trên, trước câu trả lời hãy có dấu - đầu dòng, kết thúc bằng dấu chấm. . Không viết gì thêm ngoài câu trả lời.
    """
    response = chat_session.send_message(prompt)
    return response.text

@app.route('/classifyLevel', methods=['POST'])
def classifyLevel():
    data = request.json
    message = data.get('message')
    if not message:
        return jsonify({'error': 'Message is required'}), 400
    
    response = classifyLevel(message)
    print("classifyLevel Response:", response)
    return jsonify({'response': response})

@app.route('/generateWrongAnswers', methods=['POST'])
def generateWrongAnswers():
    data = request.json
    question = data['question']
    answer = data['answer']
    response = generate_wrong_answers(question, answer)
    return jsonify({'response': response})

# Route to generate questions from a PDF buffer
@app.route('/generateQuestions', methods=['POST'])
def generate_questions_route():
    data = request.json
    message = data.get('message')
    
    pdf_buffer = data.get('pdf_buffer')
    # print("pdf_buffer", pdf_buffer)
    print("message" ,message)
    
    if not message or not pdf_buffer:
        return jsonify({'error': 'Both message and PDF buffer are required'}), 400
    
    response = chatbot_response(message, pdf_buffer)
    print("Generated Questions Response:", response)
    return jsonify({'response': response})

# Function to interact with AI, potentially using PDF content as context
def response_by_AI(msg, pdf_buffer):
    extracted_text = extract_text_from_pdf_buffer(pdf_buffer) if pdf_buffer else ""
    questions = generate_answers_by_AI(extracted_text, msg)
    print("Generated AI Response:", questions)
    return questions

# Function to generate answers from text using AI
def generate_answers_by_AI(text, msg):
    chat_session = model.start_chat(history=[])
    print(msg)
    prompt = f"""
    {msg}, dựa trên dữ liệu sau đây:
    "{text}"
    """
    response = chat_session.send_message(prompt)
    return response.text

import joblib
def classifyLevel(message):
    model = joblib.load('logistic_regression_model.pkl')
    vectorizer = joblib.load('tfidf_vectorizer.pkl')
    le = joblib.load('label_encoder.pkl')

    # Bước 2: Nhập câu hỏi cần phân loại
    new_question = message  # Thay đổi câu hỏi theo ý bạn

    # Bước 3: Chuyển đổi câu hỏi thành định dạng mà mô hình có thể sử dụng
    new_question_vectorized = vectorizer.transform([new_question])

    # Bước 4: Dự đoán độ khó của câu hỏi
    predicted_label_encoded = model.predict(new_question_vectorized)

    # Bước 5: Chuyển đổi nhãn đã mã hóa thành nhãn gốc
    predicted_label = le.inverse_transform(predicted_label_encoded)
    return predicted_label[0]

# Route to interact with AI and get responses
@app.route('/askAI', methods=['POST'])
def ask_ai_route():
    data = request.json
    message = data.get('message')
    pdf_buffer = data.get('pdf_buffer')  # Optional context from PDF
    #print(pdf_buffer)
    if not message:
        return jsonify({'error': 'Message is required'}), 400
    
    response = response_by_AI(message, pdf_buffer)
    print("AI Response:", response)
    return jsonify({'response': response})


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5003)
    
print("Generated Questions:")
#print(questions)
