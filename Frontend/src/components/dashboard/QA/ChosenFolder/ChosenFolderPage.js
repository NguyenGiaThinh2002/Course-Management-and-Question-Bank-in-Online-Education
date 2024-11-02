import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import ClearIcon from "@mui/icons-material/Clear";
import "./ChosenFolderPage.css";
import { useApp } from "../../../../context/AppProvider";
import { FormControl, TextField, Button, Snackbar } from "@mui/material";
import pdf from "../../../../asset/pdf.png";
import word from "../../../../asset/word.png";
import axios from "../../../../services/axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AlertModel from "../../../modal/alertModel/alert";
import { Box, InputLabel, Select, MenuItem } from "@mui/material";
import { Message } from "@mui/icons-material";
import { Alert } from "antd";
import CircularProgress from "@mui/material/CircularProgress";

export default function ChosenFolderPage({ folderId, close }) {
  //console.log("this is a folder", allQAFiles);
  const [allQAFiles, setAllQAFiles] = useState([]);
  const [allLevels, setAllLevels] = useState([]);
  //
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [createdFiles, setCreatedFiles] = useState([]);
  const [selectedFilesName, setSelectedFilesName] = useState([]);
  const [message, setMessage] = useState("");
  const [numberOfQuestions, SetNumberOfQuestions] = useState(1);
  const [selectedFile, setSelectedFile] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedFileID, setSelectFileId] = useState("");
  const [questionsArray, setQuestionsArray] = useState([]);
  const [questionsByFolderID, setQuestionsByFolderID] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState({ levelName: "Ghi Nhớ" });
  const [renderQuestions, setRenderQuestions] = useState(false);
  const [renderFiles, setRenderFiles] = useState(false);
  const [renderAnswers, setRenderAnswers] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [AIAnswerLoading, setAIAnswerLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (allQAFiles.length > 0) {
      setSelectFileId(allQAFiles[allQAFiles.length - 1]._id);
    }
  }, [allQAFiles]);

  useEffect(() => {
    const fetchData = async () => {
      if (folderId) {
        console.log("selectedFolderId", folderId);

        try {
          const response = await axios.get(
            `/uploadQA/getAllQAFiles/${folderId}`
          );
          setAllQAFiles(response.data);
          console.log("Get selectedFolderId Ok", response.data);
        } catch (error) {
          console.log("Cannot get selectedFolderId", folderId);
        }
      }
    };
    fetchData();
  }, [renderFiles, folderId]);

  useEffect(() => {
    const fetchData = async () => {
      if (folderId) {
        try {
          const response = await axios.get("/level/getAllLevels");
          setAllLevels(response.data);
          setSelectedLevel({ levelName: response.data[0].levelName });

          console.log("Get getAllLevels Ok", response.data);
        } catch (error) {
          console.log("Cannot get getAllLevels", folderId);
        }
      }
    };
    fetchData();
  }, [folderId]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `question/getQuestionsByFolderID/${folderId}`
          );
          if (response !== null) {
            setQuestionsByFolderID(response.data);
            console.log("this is response", response);
          }
        } catch (error) {
          console.log("Cannot get ClassList", error);
        }
      };
      fetchData();
    } catch (error) {
      console.log("Error getting questions");
    }
  }, [folderId, renderQuestions, renderAnswers]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedLevel({ levelName: newValue });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedFiles(files);
    const filesArray = Array.from(files);
    setSelectedFilesName(filesArray);
  };

  const handleSelectFileId = (id) => {
    setSelectFileId(id);
  };

  const handleNumberOfQuestions = (event) => {
    const value = event.target.value;
    SetNumberOfQuestions(value);
  };

  function truncateString(str, length) {
    if (str.length > length) {
      return str.substring(0, length) + "...";
    } else {
      return str;
    }
  }
  const deleteSelectedFile = async (index) => {
    const updatedFiles = [...selectedFilesName];
    updatedFiles.splice(index, 1);
    setSelectedFilesName(updatedFiles);
  };

  const handleSavePdf = async (selectedFiles) => {
    setSelectedFiles([]);
    setSelectedFilesName([]);
    setPdfLoading(true);
    try {
      const formData = new FormData();
      for (const file of selectedFiles) {
        formData.append("pdf", file);
      }

      const response = await axios.post(
        `/uploadQA/QAupload/${folderId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const Originalname = await response.data.Originalname;
      const pdfBuffer = await response.data.pdfBuffer;
      console.log("response", response);
      for (const [index, name] of Originalname.entries()) {
        const filesData = {
          folderID: folderId,
          originalName: name,
          pdfBuffer: pdfBuffer[index], // Update this to be index-specific
        };

        const uploadedFiles = await axios.post(
          "/uploadQA/createQAFiles",
          filesData
        );

        createdFiles.push(uploadedFiles.data._id);
        console.log("this was created", createdFiles);
      }
    } catch (error) {
      console.log(error);
    }
    setPdfLoading(false);
    setSelectedFilesName([]);
    setRenderFiles();
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setMessage(value);
  };

  const createQuestion = async (folderID, fileID, leveID, questionText) => {
    const formData = {
      folderID: folderID,
      pdfID: fileID,
      levelID: leveID,
      questionText: questionText,
    };
    try {
      await axios.post("question/createQuestion", formData).then((result) => {
        createAnswer(result.data._id, "...", true);
      });

      setRenderQuestions(!renderQuestions);
    } catch (error) {
      console.log("Cannot createQuestion", error);
    }
  };
  const deleteQuestion = async (questionId) => {
    try {
      await axios.post(`question/deleteQuestion/${questionId}`);
      deleteAnswer(questionId);
      setRenderQuestions(!renderQuestions);
    } catch (error) {
      console.log("Cannot deleteQuestion", error);
    }
  };

  const createAnswer = async (QuestionId, answerText, isRightAnswer) => {
    const formData = {
      questionId: QuestionId,
      answerText: answerText,
      isRightAnswer: isRightAnswer,
    };
    try {
      await axios.post(`answer/createAnswer`, formData).then(() => {
        console.log("create answer", answerText);
      });
    } catch (error) {
      console.log("Cannot create answer", error);
    }
  };

  const deleteAnswer = async (QuestionId) => {
    try {
      axios.post(`answer/deleteAnswer/${QuestionId}`).then(() => {});
    } catch (error) {
      console.log("Cannot delete answer", error);
    }
  };

  const editAnswer = async (answerId, answerText) => {
    try {
      const formAnswerData = {
        answerId: answerId,
        answerText: answerText,
      };
      await axios.post("answer/editAnswer", formAnswerData).then((response) => {
        console.log("editAnswer successfully");
      });
    } catch (error) {
      console.log("can't edit answer", error);
    }
  };

  const [QAFiles, SetQAFiles] = useState();
  const generateQuestions = async () => {
    try {
      if (numberOfQuestions < 1 || numberOfQuestions > 20) {
        await AlertModel(
          "info",
          "Vui lòng nhập số lượng câu hỏi hợp lệ (1-20)"
        );
        return;
      }
      setQuestionLoading(true);
      const theLevel = selectedLevel.levelName;
      console.log(numberOfQuestions);
      const questionGenerationText = `xin ra cho tôi đúng ${numberOfQuestions} câu hỏi ở mức độ khó là ${theLevel}`;
      console.log("questionGenerationText: " + questionGenerationText);

      const response = await axios.get(
        `/uploadQA/getQAFiles/${selectedFileID}`
      );
      SetQAFiles(response.data);
      console.log("this is what i want: ", response.data);
      const response1 = await fetch("http://127.0.0.1:5003/generateQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // message: message,
        body: JSON.stringify({
          message: questionGenerationText,
          pdf_buffer: response.data.pdfBuffer.data,
        }),
      });
      if (response1) {
        setQuestionLoading(false);
      }

      const chatbotResponse = await response1.text(); // Or response1.json() if the response is JSON
      const parsedResponse = JSON.parse(chatbotResponse);
      const decodedText = parsedResponse.response;

      console.log("Response from chatbot:", decodedText);
      const questions = decodedText
        .split("-") // Split the text by hyphen "-"
        .map((question) => question.trim()) // Remove any extra whitespace
        .filter((question) => question.length > 0); // Remove empty strings

      setQuestionsArray(questions);
      for (let i = 0; i < questions.length; i++) {
        createQuestion(folderId, selectedFileID, theLevel, questions[i]);
      }
    } catch (error) {
      console.log("Cannot generateQuestions", error);
    }
  };

  const generateWrongAnswers = async (questionId, questionText, answerText) => {
    try {
      const response1 = await fetch(
        "http://127.0.0.1:5003/generateWrongAnswers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // message: message,
          body: JSON.stringify({
            question: questionText,
            answer: answerText,
          }),
        }
      );
      const wrongAnswersText = await response1.text(); // Or response1.json() if the response is JSON
      const parsedResponse = JSON.parse(wrongAnswersText);
      const decodedText = parsedResponse.response;
      console.log("generateWrongAnswers", decodedText);

      const wrongAnswers = decodedText
        .split("-") // Split the text by hyphen "-"
        .map((answer) => answer.trim()) // Remove any extra whitespace
        .filter((answer) => answer.length > 0); // Remove empty strings

      //setQuestionsArray(wrongAnswers);
      // thing dang lam
      for (let i = 0; i < wrongAnswers.length; i++) {
        createAnswer(questionId, wrongAnswers[i], false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const askPdfAI = async () => {
    const container = document.getElementById("extractedTextContainer");
    container.innerHTML = ""; // Clear previous text
    setMessage("");
    setAIAnswerLoading(true);
    const tempMessage = message;
    const response = await axios.get(`/uploadQA/getQAFiles/${selectedFileID}`);
    SetQAFiles(response.data);
    console.log("this is what i want: ", response.data);
    const response1 = await fetch("http://127.0.0.1:5003/askAI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: tempMessage,
        pdf_buffer: response.data.pdfBuffer.data,
      }),
    });
    // Parse the response from the chatbot service
    const chatbotResponse = await response1.text(); // Or response1.json() if the response is JSON
    const parsedResponse = JSON.parse(chatbotResponse);
    const decodedText = parsedResponse.response;
    setAIAnswerLoading(false);
    displayTextGradually(decodedText, 25);
  };

  // Function to display text gradually
  const displayTextGradually = (text, delay) => {
    const container = document.getElementById("extractedTextContainer");
    container.innerHTML = ""; // Clear previous text
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Thay thế **text** bằng <strong>text</strong>
      .replace(/[*#]/g, ""); // Xóa các ký tự * và # không cần thiết
    let index = 0;

    const intervalId = setInterval(() => {
      if (index < formattedText.length) {
        // Thêm từng ký tự vào container
        container.innerHTML += formattedText.charAt(index); // Append the next character
        index++;
      } else {
        clearInterval(intervalId); // Stop the interval when done
      }
    }, delay); // Delay in milliseconds
  };

  const addQuestionManual = () => {
    createQuestion(folderId, selectedFileID, "Chưa có", "...");
  };

  const getBack = () => {
    setAllQAFiles([]);
  };

  const handleFileClick = (index) => {
    setSelectedIndex(index);
  };

  const permitQuestion = (questionId) => {
    axios
      .post(`/question/permitQuestion/${questionId}`)
      .then((response) => {
        console.log("permit successfully");
      })
      .catch((error) => console.log(error));
  };

  const QuestionAnswerBox = ({ initialQuestion }) => {
    const [question, setQuestion] = useState(initialQuestion.questionText);
    const [questionLevel, setQuestionLevel] = useState(initialQuestion.levelID);
    const [isPermitted, setIsPermitted] = useState(initialQuestion.isPermitted);
    const [answer, setAnswer] = useState();
    const [answerId, setAnswerId] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const [answerLoading, setAnswerLoading] = useState(false);

    const handleEdit = () => {
      setIsEditing(true);
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios
            .get(`answer/getRightAnswer/${initialQuestion._id}`)
            .then((result) => {
              if (result.data.length > 0) {
                setAnswer(result.data[0].answerText);
                setAnswerId(result.data[0]._id);
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
    }, [initialQuestion?._id, renderAnswers]);

    const askPdfRAG = async (question, answerId) => {
      setAnswerLoading(true);
      console.log(question);
      const response = await axios.get(
        `/uploadQA/getQAFiles/${selectedFileID}`
      );
      SetQAFiles(response.data);
      const response1 = await fetch("http://192.168.1.36:5004/generateAnswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
          pdf_buffer: response.data.pdfBuffer.data,
        }),
      });
      const chatbotResponse = await response1.text();
      const parsedResponse = JSON.parse(chatbotResponse);
      const decodedText = parsedResponse.response;
      editAnswer(answerId, decodedText);
      setAnswerLoading(false);
      setRenderAnswers(!renderAnswers);
    };

    const askChatGPT = async (question, answerId) => {
      setAnswerLoading(true);
      const response1 = await fetch("http://192.168.1.36:5004/askChatGPT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
        }),
      });
      const chatbotResponse = await response1.text();
      const parsedResponse = JSON.parse(chatbotResponse);
      const decodedText = parsedResponse.response;
      editAnswer(answerId, decodedText);
      setAnswerLoading(false);
      setRenderAnswers(!renderAnswers);
    };

    const handleSave = async () => {
      const formData = {
        questionId: initialQuestion._id,
        questionText: question,
      };
      await axios.post("question/editQuestion", formData).then((response) => {
        console.log("editQuestion successfully");
      });
      editAnswer(answerId, answer);
      setIsEditing(false);
    };

    const deleteAlert = async () => {
      const confirmed = await AlertModel("confirm", "Bạn có muốn xoá không?");
      if (confirmed) {
        deleteQuestion(initialQuestion._id);
        console.log("User confirmed");
      } else {
        //console.log("User cancelled");
      }
    };

    const permiteAlert = async (questionId, questionText, answerText) => {
      const confirmed = await AlertModel(
        "confirm",
        "Bạn có muốn duyệt để tạo đề thi không?"
      );
      if (confirmed) {
        permitQuestion(initialQuestion._id);
        setIsPermitted(true);
        generateWrongAnswers(questionId, questionText, answerText);
      } else {
        //console.log("User cancelled");
      }
      //
    };

    const classifyQuestion = async (question) => {
      const response1 = await fetch("http://127.0.0.1:5003/classifyLevel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
        }),
      });
     
      const chatbotResponse = await response1.text(); // Or response1.json() if the response is JSON
      const parsedResponse = JSON.parse(chatbotResponse);
      const decodedText = parsedResponse.response;
      console.log("QuestionLevel", decodedText);
      setQuestionLevel(decodedText);
      const formData = {
        questionId: initialQuestion._id,
        levelID: decodedText,
      };
      await axios.post("question/editQuestionLevel", formData).then((response) => {
        console.log("editQuestionLevel successfully");
      });
      
      //setQuestionLevel(response1.data)

    }

    return (
      <div className="qa-container">
        {isEditing ? (
          <div className="edit-container">
            <input
              type="text"
              className="edit-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <textarea
              className="edit-input"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            ></textarea>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="btn-11" onClick={handleSave}>
                Lưu lại
              </button>
              <button className="btn-11" onClick={() => setIsEditing(false)}>
                Huỷ
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="difficult-level">
              Độ khó: {questionLevel}
            </div>
            <div className="classify">
              {questionLevel === "Chưa có" && (
                <button className="button-34" onClick={() => classifyQuestion(question)}>Phân loại</button>
              )}
            </div>

            {isPermitted ? (
              <div className="permission" style={{ color: "green" }}>
                Đã duyệt
              </div>
            ) : (
              <div className="permission" style={{ color: "red" }}>
                Chưa duyệt
              </div>
            )}
            <h2 className="question">{question}</h2>
            {answerLoading ? (
              <CircularProgress size={25} />
            ) : (
              <p className="answer">{answer}</p>
            )}

            <div className="button-group">
              <button
                className="btn-11"
                onClick={() => askPdfRAG(question, answerId)}
              >
                Tạo câu trả lời từ PDF
              </button>
              <button
                className="btn-11"
                onClick={() => askChatGPT(question, answerId)}
              >
                Tạo câu trả lời từ nguồn khác
              </button>
              <button
                className="btn-11"
                onClick={() => {
                  permiteAlert(initialQuestion._id, question, answer);
                }}
              >
                Duyệt
              </button>
              <button className="btn-11" onClick={handleEdit}>
                Chỉnh sửa
              </button>
              <button
                className="btn-11"
                onClick={() => {
                  deleteAlert();
                }}
              >
                Xoá
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const QuestionList = useCallback(() => {
    return (
      <div>
        {questionsByFolderID.toReversed().map((question, index) => (
          <div
            style={{ marginBottom: "7px", position: "relative" }}
            key={index}
          >
            <QuestionAnswerBox key={index} initialQuestion={question} />
          </div>
        ))}
      </div>
    );
  }, [questionsByFolderID]);

  return (
    <div className="QAContainer">
      <ArrowBackIcon
        style={{
          color: "black",
          position: "absolute",
          top: "5",
          left: "50",
          fontSize: "50px",
        }}
        onClick={() => {
          close();
          getBack();
        }}
      />
      <div className="left-side-container">
        <div className="pdf-display">
          <div className="save-pdf">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="custom-file-input"
              id="customFile" // Make sure this matches the label's "for" attribute
            />
            <label className="custom-file-label" htmlFor="customFile">
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
            </label>
            <button
              className="button-87"
              onClick={() => handleSavePdf(selectedFiles)}
            >
              Lưu PDF
            </button>
          </div>
          {pdfLoading === true && <CircularProgress />}
          <div className="custom-input">
            <div className="pdf-container">
              {selectedFilesName?.map((fileID, index) => {
                // const fileInfo = getFileInfo(fileID);
                if (fileID) {
                  const filename = fileID.name;
                  const isPdf = filename.toLowerCase().endsWith(".pdf");
                  const isDocx = filename.toLowerCase().endsWith(".docx");
                  const isImage =
                    filename.toLowerCase().endsWith(".png") ||
                    filename.toLowerCase().endsWith(".jpg");
                  // filename = truncateString(filename, 15)
                  const iconSrc = isPdf ? pdf : isDocx ? word : isImage;
                  return (
                    <div className="file-container" key={fileID.lastModified}>
                      <div className="files">
                        <div className="file-content-inside">
                          <img
                            src={iconSrc}
                            alt={isPdf ? "PDF" : isDocx ? "DOCX" : "File"}
                            className="file-icon"
                          />
                          <span className="filename">
                            {truncateString(filename, 15)}
                          </span>
                          <ClearIcon
                            className="clear-file-icon"
                            onClick={() => deleteSelectedFile(index)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
          <div>
            {allQAFiles.toReversed().map((QAFile, index) => {
              if (QAFile) {
                const filename = QAFile.originalName;
                const isPdf = filename.toLowerCase().endsWith(".pdf");
                const isDocx = filename.toLowerCase().endsWith(".docx");
                const isImage =
                  filename.toLowerCase().endsWith(".png") ||
                  filename.toLowerCase().endsWith(".jpg");
                // filename = truncateString(filename, 15)
                const iconSrc = isPdf ? pdf : isDocx ? word : isImage;
                return (
                  <div
                    className={`file-container ${
                      selectedIndex === index ? "selected" : ""
                    }`}
                    key={index}
                    onClick={() => {
                      handleFileClick(index);
                      handleSelectFileId(QAFile._id);
                    }}
                  >
                    <div className="files">
                      <div className="file-content-inside">
                        <img
                          src={iconSrc}
                          alt={isPdf ? "PDF" : isDocx ? "DOCX" : "File"}
                          className="file-icon"
                        />
                        <span className="filename">
                          {truncateString(filename, 15)}
                        </span>
                        {/* <ClearIcon
                          className="clear-file-icon"
                          onClick={() => deleteSelectedFile(index)}
                        /> */}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
          <div></div>
        </div>
      </div>

      <div className="QA-generation">
        <div className="generation-info">
          <TextField
            id="filled-number"
            required
            sx={{
              width: "188px", // Keep the original width
              height: "56px", // Keep the original height
              marginBottom: "0px", // Keep the original
              "& .MuiFilledInput-root": {
                borderRadius: "46px",
                border: "1px solid #000",
                backgroundColor: "#FAFAFA",
                "&.Mui-focused": {
                  borderColor: "#6200EA",
                },
                "&::before, &::after": {
                  display: "none", // Remove MUI underline effects
                },
              },
            }}
            label="Số lượng câu hỏi"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            variant="filled"
            className="generation-info-items"
            onChange={handleNumberOfQuestions}
            value={numberOfQuestions}
          />

          <Box
            sx={{
              width: 200,
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="level-select-label" sx={{ marginBottom: "10px" }}>
                Độ khó
              </InputLabel>
              <div style={{ margin: "3px" }}></div>
              <Select
                labelId="level-select-label"
                id="level-select"
                value={selectedLevel.levelName}
                label="Level"
                onChange={handleChange}
                sx={{
                  backgroundColor: "#FAFAFA",
                  borderRadius: "46px",
                  "& .MuiSelect-select": {
                    borderRadius: "46px",
                  },
                }}
              >
                {allLevels.map((level) => (
                  <MenuItem
                    sx={{
                      width: 200,
                    }}
                    key={level.levelManualID}
                    value={level.levelName}
                  >
                    {level.levelName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <button className="button-29" onClick={generateQuestions}>
            Tạo tự động
          </button>
          <button className="button-29" onClick={addQuestionManual}>
            Tạo thủ công
          </button>
        </div>
        <div className="QATextBox">
          {questionLoading === true && <CircularProgress />}
          <div className="questions-answers">
            <QuestionList />
          </div>
        </div>
        <div className="ask-AI">
          <TextField
            sx={{
              width: 685,
              mr: 1,
              "& .MuiOutlinedInput-root": {
                border: "none",
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },
              "& .MuiInputBase-root": {
                backgroundColor: "transparent",
                boxShadow: "none",
              },
              "& .MuiInput-underline:before, & .MuiInput-underline:after": {
                display: "none",
              },
            }}
            InputProps={{
              disableUnderline: true, // Disable default underline
            }}
            onChange={handleInputChange}
            value={message}
          />

          <button onClick={() => askPdfAI()} className="send-button">
            Gửi
          </button>
        </div>
      </div>
      <div className="AI-answer-area">
        {AIAnswerLoading && <CircularProgress />}
        <div
          id="extractedTextContainer"
          style={{ margin: "7px", fontSize: "16px" }}
        ></div>
      </div>
    </div>
  );
}
