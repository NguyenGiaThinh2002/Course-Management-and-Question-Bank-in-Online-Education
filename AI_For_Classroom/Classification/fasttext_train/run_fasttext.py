import fasttext

model = fasttext.load_model('fasttext_model.bin')

# Câu hỏi cần phân loại
new_question = "Tập hợp rỗng là gì"

# Dự đoán nhãn
predicted_label = model.predict(new_question)

# Hiển thị kết quả dự đoán
print(f"Câu hỏi: {new_question}")
print(f"Độ khó dự đoán: {predicted_label[0][0].replace('__label__', '')}")

# # Duyệt qua nhãn dự đoán và thay thế từ viết tắt nếu cần
# label_mapping = {
#     "Áp": "Áp dụng",  # Thêm các nhãn khác nếu cần
#     "Ghi": "Ghi nhớ",
#     "Phân": "Phân tích",
#     "Đánh": "Đánh giá",
#     "Sáng": "Sáng tạo"
# }

# # Loại bỏ tiền tố "__label__" và khôi phục nhãn đầy đủ
# predicted_label_full = label_mapping.get(predicted_label[0][0].replace("__label__", ""), predicted_label[0][0].replace("__label__", ""))

# # Hiển thị kết quả dự đoán đầy đủ
# print(f"Câu hỏi: {new_question}")
# print(f"Độ khó dự đoán: {predicted_label_full}")