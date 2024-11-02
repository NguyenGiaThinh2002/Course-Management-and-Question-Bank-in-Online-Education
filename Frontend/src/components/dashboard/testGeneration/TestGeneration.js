import React, { useCallback, useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import jsPDF from "jspdf";
import "./TestGeneration.css";
import axios from "../../../services/axios";
import { useApp } from "../../../context/AppProvider";
import robotoFont from './roboto';
export default function TestGeneration() {
  const { selectedClass } = useApp();
  const [questions, setQuestions] = useState([]);
  const getAllQuestions = async () => {
    try {
      console.log(selectedClass._id);

      await axios
        .get(`question/getQuestionsByClassID/${selectedClass._id}`)
        .then((response) => {
          setQuestions(response.data);
          console.log(response.data);
        })
        .catch((error) => console.log(error));
    } catch (error) {}
  };

  const generatePDF = async (questions) => {
    const doc = new jsPDF();
  
    // Nhúng font tiếng Việt vào jsPDF
    doc.addFileToVFS('Roboto-Regular.ttf', robotoFont);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');
  
    let yPos = 10; // Vị trí y ban đầu
    const pageHeight = 297; // Chiều cao trang A4 là 297mm
    const lineHeight = 8; // Chiều cao của mỗi dòng văn bản
    const margin = 5; // Lề trang
    const contentWidth = 180; // Chiều rộng của nội dung trừ phần lề
  
    // Hàm để kiểm tra xem có cần thêm trang mới hay không
    const checkPageOverflow = (currentYPos, linesToAdd) => {
      if (currentYPos + (linesToAdd * lineHeight) > pageHeight - margin) {
        doc.addPage();
        return margin; // Reset yPos về vị trí bắt đầu của trang mới
      }
      return currentYPos;
    };
  
    // Lặp qua từng câu hỏi
    for (const [index, question] of questions.entries()) {
      // Tạo văn bản câu hỏi và kiểm tra nếu nó quá dài
      doc.setFontSize(13);
      const questionLines = doc.splitTextToSize(`Câu ${index + 1}: ${question.questionText}`, contentWidth);
  
      // Kiểm tra nếu câu hỏi sẽ tràn ra ngoài trang
      yPos = checkPageOverflow(yPos, questionLines.length);
  
      // Thêm từng dòng của câu hỏi vào PDF
      questionLines.forEach((line) => {
        doc.text(20, yPos, line);
        yPos += lineHeight;
      });
  
      let answers = [];
  
      // Lấy câu trả lời cho câu hỏi hiện tại
      try {
        const response = await axios.get(`answer/getAllAnswers/${question._id}`);
        if (response.data.length > 0) {
          answers = response.data;
        }
      } catch (error) {
        console.log("Không thể lấy câu trả lời cho câu hỏi:", question._id, error);
      }
  
      // Thêm câu trả lời vào PDF
      doc.setFontSize(12);
      answers.forEach((answer, answerIndex) => {
        const answerLines = doc.splitTextToSize(`${String.fromCharCode(65 + answerIndex)}. ${answer.answerText}`, contentWidth - 10);
  
        // Kiểm tra nếu câu trả lời sẽ tràn ra ngoài trang
        yPos = checkPageOverflow(yPos, answerLines.length);
  
        // Thêm từng dòng của câu trả lời vào PDF
        answerLines.forEach((line) => {
          doc.text(30, yPos, line);
          yPos += lineHeight;
        });
      });
  
      // Thêm khoảng cách giữa các câu hỏi
      yPos += lineHeight;
    }
  
    // Lưu tệp PDF
    doc.save('exam.pdf');
  };
  
  

// const generatePDF = async (questions) => {
//   const doc = new jsPDF();

//   // Nhúng font tiếng Việt vào jsPDF
//   doc.addFileToVFS('Roboto-Regular.ttf', robotoFont);
//   doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
//   doc.setFont('Roboto');

//   let yPos = 10; // Vị trí y ban đầu

//   // Lặp qua từng câu hỏi
//   for (const [index, question] of questions.entries()) {
//     // Thêm câu hỏi vào PDF với số thứ tự (Câu 1, Câu 2, ...)
//     doc.setFontSize(14);
//     doc.text(20, yPos, `Câu ${index + 1}: ${question.questionText}`);
//     yPos += 10;

//     let answers = [];

//     // Lấy câu trả lời cho câu hỏi hiện tại
//     try {
//       const response = await axios.get(`answer/getAllAnswers/${question._id}`);
//       if (response.data.length > 0) {
//         answers = response.data;
//       }
//     } catch (error) {
//       console.log("Không thể lấy câu trả lời cho câu hỏi:", question._id, error);
//     }

//     // Thêm câu trả lời vào PDF
//     doc.setFontSize(12);
//     answers.forEach((answer, answerIndex) => {
//       doc.text(30, yPos, `${String.fromCharCode(65 + answerIndex)}. ${answer.answerText}`);
//       yPos += 10;
//     });

//     // Thêm khoảng cách giữa các câu hỏi
//     yPos += 10;

//     // Kiểm tra nếu gần hết trang thì thêm trang mới
//     if (yPos > 280) {
//       doc.addPage();
//       yPos = 10; // Đặt lại vị trí y cho trang mới
//     }
//   }

//   // Lưu tệp PDF
//   doc.save('exam.pdf');
// };

  const unPermitQuestion = async (questionId) => {
    try {
      await axios
        .post(`question/unPermitQuestion/${questionId}`)
        .then((response) => {
          console.log("unPermitQuestion success", response);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const QuestionList = useCallback(() => {
    return (
      <div className="exam-question-list">
        {questions.toReversed().map((question, index) => (
          <div
            style={{ marginBottom: "7px", position: "relative" }}
            key={index}
          >
            <QuestionAnswerBox key={index} initialQuestion={question} />
          </div>
        ))}
      </div>
    );
  }, [questions]);

  const QuestionAnswerBox = ({ initialQuestion }) => {
    const [question, setQuestion] = useState(initialQuestion.questionText);
    const [answers, setAnswers] = useState([]);
    const [pdfName, setPDFName] = useState("");
    const [folderName, setFolderName] = useState("");

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios
            .get(`pdf/getPdfName/${initialQuestion.pdfID}`)
            .then((result) => {
              setFolderName(result.data.pdfName);
            })
            .catch((err) => {
              console.log("Cannot get pdfName", err);
            });
        } catch (error) {
          console.log("Cannot get pdfName", error);
        }
      };

      if (initialQuestion?.pdfID) {
        fetchData();
      }
    }, [initialQuestion?.pdfID]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios
            .get(`classFolder/getFolderName/${initialQuestion.folderID}`)
            .then((result) => {
                setPDFName(result.data.folderName);
            })
            .catch((err) => {
              console.log("Cannot get pdfName", err);
            });
        } catch (error) {
          console.log("Cannot get pdfName", error);
        }
      };

      if (initialQuestion?.folderID) {
        fetchData();
      }
    }, [initialQuestion?.folderID]);




    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios
            .get(`answer/getAllAnswers/${initialQuestion._id}`)
            .then((result) => {
              if (result.data.length > 0) {
                setAnswers(result.data);
              }
            })
            .catch((err) => {
              console.log("Cannot get answer", err);
            });
        } catch (error) {
          console.log("Cannot get answer", error);
        }
      };

      if (initialQuestion?._id) {
        fetchData();
      }
    }, [initialQuestion?._id]);

    return (
      <>
        <div class="exam-container" style={{ position: "relative" }}>
          {/* <button className="btn-11" style={{position: "absolute", top: '0', right: '0'}}>Loại</button> */}
          <div className="folder-pdf-name">
          <div>{pdfName}</div>
          <div>{folderName}</div>
          </div>


          <div class="exam-question">{question}</div>
          <div class="exam-answers scrollable">
            {answers.map((answer, index) => (
              <div class="answer-option" key={answer._id}>
                <span class="answer-label">
                  {String.fromCharCode(65 + index)}.{" "}
                </span>
                {answer.isRightAnswer ? <span style={{color: "green"}} class="answer-text">{answer.answerText}</span> : <span class="answer-text">{answer.answerText}</span>}
                {/* <span class="answer-text">{answer.answerText}</span> */}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="test-generation">
      {/* <ArrowBackIcon
        style={{
          color: "black",
          position: "absolute",
          top: "6",
          left: "50",
          fontSize: "50px",
        }}
        onClick={() => {
          // close();
          // getBack();
        }}
      /> */}
      <div className="test-generation-body">
        <div className="generate-buttons">
          <button className="btn-11" onClick={() => getAllQuestions()}>
            Tạo đề thi
          </button>
          <button className="btn-11" onClick={() => generatePDF(questions)}>Tạo File PDF</button>
        </div>
        <div className="test-generation-content">
          <QuestionList />
          {/* <div className="question-answers">
            <div className="question">
              
            </div>
            <div className="answers">
              <div>A</div>
              <div>B</div>
              <div>C</div>
              <div>D</div>

            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
