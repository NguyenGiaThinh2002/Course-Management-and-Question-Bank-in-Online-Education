import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import joblib

# Đường dẫn tới tệp CSV gốc
file_path = 'duongdan_toi_tap_tin_moi.csv'  # Thay đổi đường dẫn tới tệp CSV của bạn

# Bước 1: Đọc dữ liệu từ tệp CSV
try:
    # Sử dụng dấu chấm phẩy để tách các cột
    df = pd.read_csv(file_path, sep=';', error_bad_lines=False, warn_bad_lines=True)

    # Kiểm tra kích thước DataFrame
    print("Kích thước DataFrame:", df.shape)

    # Bước 2: Lọc các dòng có đủ cột
    df = df.dropna()  # Loại bỏ các dòng có giá trị NaN

    # Kiểm tra kích thước DataFrame sau khi lọc
    print("Kích thước DataFrame sau khi lọc:", df.shape)

    # Bước 3: Tiền xử lý dữ liệu
    # Giả sử cột đầu tiên là nhãn (label) và cột thứ hai là đặc trưng (feature)
    
    X = df.iloc[:, 1].values  # Câu hỏi
    y = df.iloc[:, 0].values  # Độ khó

    from sklearn.preprocessing import LabelEncoder
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

    from sklearn.feature_extraction.text import TfidfVectorizer
    vectorizer = TfidfVectorizer()
    X_train_vectorized = vectorizer.fit_transform(X_train)
    X_test_vectorized = vectorizer.transform(X_test)

    model = LogisticRegression(max_iter=1000) 
    model.fit(X_train_vectorized, y_train)

    y_pred = model.predict(X_test_vectorized)

    accuracy = accuracy_score(y_test, y_pred)
    print(f"Độ chính xác của mô hình: {accuracy:.2f}")

    joblib.dump(model, 'logistic_regression_model.pkl')
    joblib.dump(vectorizer, 'tfidf_vectorizer.pkl')
    joblib.dump(le, 'label_encoder.pkl')

except FileNotFoundError:
    print(f"Tệp {file_path} không tồn tại. Vui lòng kiểm tra đường dẫn.")
except Exception as e:
    print(f"Đã xảy ra lỗi: {e}")
