# Import các thư viện cần thiết
from transformers import AutoTokenizer, AutoModel
import faiss
import numpy as np
import torch

# Hàm tạo vector embeddings từ văn bản
def embed_documents(texts, model, tokenizer):
    inputs = tokenizer(texts, padding=True, truncation=True, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
    embeddings = outputs.last_hidden_state.mean(dim=1).cpu().numpy()
    return embeddings

# Hàm tìm kiếm văn bản tương tự
def search(query, index, model, tokenizer, top_k=5):
    query_embedding = embed_documents([query], model, tokenizer)
    distances, indices = index.search(query_embedding, top_k)
    return distances, indices

# Đoạn văn bản mẫu để xử lý
texts = [
    "Retrieve-and-Augment Generation (RAG) is a method where a model retrieves relevant information from a knowledge base and uses that information to generate a response.",
    "This helps in reducing hallucinations and improving the accuracy of the generated text, especially for specific domain queries.",
    "FAISS is a library for efficient similarity search and clustering of dense vectors.",
    "Hugging Face provides various pre-trained models that can be used for generating embeddings."
]

# Cài đặt mô hình và tokenizer
model_name = "distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)

# Tạo embeddings cho văn bản
embeddings = embed_documents(texts, model, tokenizer)

# Tạo FAISS index và thêm embeddings vào index
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)

# Đặt câu hỏi và thực hiện tìm kiếm
query = "What is RAG?"
distances, indices = search(query, index, model, tokenizer)

# In kết quả
print("Query:", query)
print("Distances:", distances)
print("Indices:", indices)
print("Results:")
for i in indices[0]:
    print(texts[i])
