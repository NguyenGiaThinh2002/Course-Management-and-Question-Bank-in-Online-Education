# Import các thư viện cần thiết
from langchain_openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate

from langchain_openai import ChatOpenAI  # Updated import

import openai
import time

from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
import io
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

import aiohttp
import asyncio
#66cb0e027dd088ef486e4b63

async def get_file(pdfId):
    url = f"http://localhost:3000/uploadQA/getQAFiles/{pdfId}"
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                response.raise_for_status()  # Kiểm tra xem có lỗi không
                json_data = await response.json()  # Đọc dữ liệu JSON
                original_name = json_data.get('originalName')  # Lấy giá trị của 'originalName'
                pdfBuffer = json_data.get('pdfBuffer')  # Lấy giá trị của 'originalName'      
                print(original_name)

                # Nếu pdfBuffer không phải là dạng danh sách như mong đợi, trả về nó như vậy
                return pdfBuffer  

    except aiohttp.ClientError as e:
        print(f"Đã xảy ra lỗi: {e}")
        return None

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
# API key của OpenAI
openai_api_key = ""
def ask_ChatGPT(text, message):
    # Bước 1: Tách văn bản thành các đoạn nhỏ bằng RecursiveCharacterTextSplitter
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=40)
    docs = text_splitter.create_documents([text])

    # Bước 2: Tạo embeddings sử dụng OpenAIEmbeddings
    embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)

    # Bước 3: Tạo FAISS vector store để lưu trữ các vector embeddings
    db = FAISS.from_documents(docs, embeddings)

    # Bước 4: Tạo chuỗi truy vấn với RetrievalQA sử dụng OpenAI model
    retriever = db.as_retriever()

    # Tạo mô hình OpenAI (ví dụ GPT-3 hoặc GPT-4)
    llm = OpenAI(openai_api_key=openai_api_key)

    # Bước 5: Tạo RetrievalQA chain
    qa_chain = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever)

    # Bước 6: Đặt câu hỏi và nhận câu trả lời
    #query = "Nội dung chính là gì?"
    print(message)
    query = message
    
    result = qa_chain.run(query)

    print(result)
    return result

@app.route('/generateAnswer', methods=['POST'])
def ask_RAG():
    data = request.json
    # pdfId = data.get('pdfId')
    
    message = data.get('message')
    pdf_buffer = data.get('pdf_buffer')  # Optional context from PDF
    
    # inner_list = asyncio.run(get_file(pdfId))
    # data_value = inner_list.get('data', 'Default Data')
    
    extracted_text = extract_text_from_pdf_buffer(pdf_buffer)
    result = ask_ChatGPT(extracted_text, message)
    return jsonify({'response': result})

import openai
def ask_RAG():
    data = request.json
    message = data.get('message')
    pdf_buffer = data.get('pdf_buffer')  # Optional context from PDF

    extracted_text = extract_text_from_pdf_buffer(pdf_buffer)
    result = ask_ChatGPT(extracted_text, message)
    return jsonify({'response': result})


@app.route('/askChatGPT', methods=['POST'])
def ask():
    data = request.json
    message = data.get('message')  # Get the message from the request data
    message = message + "Hãy đưa ra câu trả lời ngắn gọn"
    # Call the function to get the ChatGPT response using the updated method
    try:
        # Use ChatOpenAI to get the response
        llm = ChatOpenAI(openai_api_key=openai_api_key, model_name="gpt-3.5-turbo")  # or "gpt-4"

        # Format the input as a list of messages
        messages = [{"role": "user", "content": message}]
        
        # Get the response from the LLM
        response = llm.invoke(messages)  # Get the response from the LLM
        
        # Access the content from the response object
        output = response.content if hasattr(response, 'content') else str(response)

        # Return the response in JSON format
        return jsonify({'response': output})  # Adjust according to the new return format
    except Exception as e:
        return jsonify({'error': f"An error occurred: {str(e)}"}), 500  # Return error message in JSON



# In kết quả

def start_app():
    app.run(debug=False, host='0.0.0.0', port=5004) 

if __name__ == "__main__":
    start_app()