import joblib

# Bước 1: Tải mô hình, vectorizer và label encoder
model = joblib.load('logistic_regression_model.pkl')
vectorizer = joblib.load('tfidf_vectorizer.pkl')
le = joblib.load('label_encoder.pkl')

# Bước 2: Nhập câu hỏi cần phân loại
new_question = "Tập hợp rỗng là gì"  # Thay đổi câu hỏi theo ý bạn

# Bước 3: Chuyển đổi câu hỏi thành định dạng mà mô hình có thể sử dụng
new_question_vectorized = vectorizer.transform([new_question])

# Bước 4: Dự đoán độ khó của câu hỏi
predicted_label_encoded = model.predict(new_question_vectorized)

# Bước 5: Chuyển đổi nhãn đã mã hóa thành nhãn gốc
predicted_label = le.inverse_transform(predicted_label_encoded)

# Bước 6: Hiển thị kết quả
print(f"Câu hỏi: '{new_question}'")
print(f"Độ khó dự đoán: {predicted_label[0]}")
