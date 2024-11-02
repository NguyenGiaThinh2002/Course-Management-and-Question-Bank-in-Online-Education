import pandas as pd

# Huấn luyện mô hình FastText
import fasttext

# Đường dẫn tới tệp CSV của bạn
file_path = 'duongdan_toi_tap_tin_moi.csv'  # Thay đổi đường dẫn

# Đọc tệp CSV với dấu phân tách ';' và kiểm tra tên các cột
df = pd.read_csv(file_path, sep=';')
df.columns = df.columns.str.strip()  
print("Tên các cột trong DataFrame:", df.columns)

# Xác định lại tên cột nếu cần thiết
label_col = 'Độ khó'  # Đảm bảo tên đúng như trong tệp CSV
text_col = 'Câu hỏi'  # Đảm bảo tên đúng như trong tệp CSV

# Đặt tên tệp output
output_file = 'fasttext_train.txt'

# Ghi dữ liệu theo định dạng của FastText
with open(output_file, 'w') as f:
    for index, row in df.iterrows():
        label = row[label_col]
        text = row[text_col]
        f.write(f"__label__{label} {text}\n")

print(f"Dữ liệu đã được lưu vào {output_file}")

model = fasttext.train_supervised(
    input=output_file, 
    epoch=100,            # Số epoch
    lr=1,              # Learning rate
    wordNgrams=3,        # Sử dụng bigram
    dim=150,             # Kích thước vector từ
    minCount=3,          # Bỏ qua các từ xuất hiện ít hơn 1 lần
    loss='softmax',      # Sử dụng softmax cho phân loại
    verbose=2            # Hiển thị thông tin chi tiết trong quá trình huấn luyện
)

# Lưu mô hình đã huấn luyện
model.save_model("fasttext_model.bin")

# Kiểm tra độ chính xác trên tập huấn luyện
print("Độ chính xác trên tập huấn luyện:", model.test(output_file))

# Tải mô hình đã huấn luyện
model = fasttext.load_model('fasttext_model.bin')

# Câu hỏi cần phân loại
new_question = "Định nghĩa tập hợp là gì?"

# Dự đoán nhãn
predicted_label = model.predict(new_question)

# Hiển thị kết quả dự đoán
print(f"Câu hỏi: {new_question}")
print(f"Độ khó dự đoán: {predicted_label[0][0].replace('__label__', '')}")
