import pandas as pd
import fasttext

# Đọc tệp CSV
file_path = 'duongdan_toi_tap_tin_moi.csv'  # Thay đổi đường dẫn
df = pd.read_csv(file_path, sep=';')
df.columns = df.columns.str.strip()  

# Ghi dữ liệu theo định dạng của FastText
output_file = 'fasttext_train.txt'
with open(output_file, 'w') as f:
    for index, row in df.iterrows():
        label = row['Độ khó'].strip()  # Loại bỏ khoảng trắng
        text = row['Câu hỏi'].strip()  # Loại bỏ khoảng trắng
        f.write(f"__label__{label} {text}\n")

# Huấn luyện mô hình FastText
model = fasttext.train_supervised(
    input="fasttext_train.txt", 
    epoch=50,            # Tăng số epoch
    lr=0.5,              # Thay đổi learning rate
    wordNgrams=2,        # Sử dụng bigram
    dim=100,             # Kích thước vector từ

    loss='softmax',      # Sử dụng softmax cho phân loại
    verbose=2            # Hiển thị thông tin chi tiết trong quá trình huấn luyện
)

# Lưu mô hình đã huấn luyện
model.save_model("fasttext_model.bin")

# Kiểm tra độ chính xác trên tập huấn luyện
print(model.test("fasttext_train.txt"))
