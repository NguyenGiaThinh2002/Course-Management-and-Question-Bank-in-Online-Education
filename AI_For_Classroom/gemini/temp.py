# RAG
import io
from langchain.chains import RetrievalQA
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma


# 2. Create a retriever with LangChain (Chroma as VectorStore example)
def create_retriever(text):
    # Split the text into chunks for retrieval (LangChain has utilities for this)
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    chunks = splitter.split_text(text)
    
    # Initialize the Vector Store
    embeddings = OpenAIEmbeddings()
    vectordb = Chroma.from_texts(chunks, embeddings)
    retriever = vectordb.as_retriever()
    
    return retriever

# 3. Combine Retrieval with Question Answering
def generate_answer_from_pdf(pdf_buffer, question):
    # Extract text from PDF
    pdf_text = extract_text_from_pdf_buffer(pdf_buffer)
    
    # Create retriever
    retriever = create_retriever(pdf_text)
    
    # Set up RetrievalQA pipeline
    qa_chain = RetrievalQA.from_chain_type(
        llm=Gemini(model='gpt-4'),  # Replace this with your Gemini model instance
        chain_type="stuff",
        retriever=retriever
    )
    
    # Generate the answer
    return qa_chain.run(question)

# Usage example:
with open("example.pdf", "rb") as f:
    pdf_buffer = f.read()

question = "Chủ đề chính của tài liệu là gì"
answer = generate_answer_from_pdf(pdf_buffer, question)
print(answer)

# END RAG