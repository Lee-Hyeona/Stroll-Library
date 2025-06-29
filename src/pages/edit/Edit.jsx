import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  TextField,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import {
  StyledContainer,
  FormLeft,
  FormRight,
  CoverBox,
  ButtonGroup,
  LabelBox,
  LabelText,
} from "./style";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const blueTheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

function Edit() {
  const { bookid } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    content: "",
    categoryId: "1",
    password: "",
    apiKey: "",
    coverImgUrl: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/books/${bookid}`)
      .then((res) => {
        const book = res.data;
        setForm((prev) => ({
          ...prev,
          title: book.title,
          author: book.author,
          content: book.content,
          categoryId: String(book.categoryId),
          coverImgUrl: book.coverImgUrl || "",
        }));
      })
      .catch((err) => {
        console.error("책 정보 로딩 실패:", err);
        alert("책 정보를 불러오지 못했습니다.");
      });
  }, [bookid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const generateCover = () => {
    setLoading(true);
    axios
      .post("http://localhost:8080/api/books/generate-cover-v2", {
        title: form.title,
        content: form.content,
        apiKey: form.apiKey,
      })
      .then((res) => {
        setForm((prev) => ({ ...prev, coverImgUrl: res.data.imageUrl }));
      })
      .catch((err) => {
        console.error("이미지 생성 실패:", err);
        alert("이미지 생성에 실패했습니다.");
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = () => {
    axios
      .patch(`http://localhost:8080/api/books/${bookid}`, {
        title: form.title,
        author: form.author,
        content: form.content,
        categoryId: form.categoryId,
        password: form.password,
        coverImgUrl: form.coverImgUrl,
      })
      .then(() => {
        alert("도서 정보가 수정되었습니다.");
        navigate("/");
      })
      .catch((err) => {
        console.error("수정 요청 실패:", err);
        alert("수정에 실패했습니다.");
      });
  };

  return (
    <ThemeProvider theme={blueTheme}>
      <StyledContainer>
        <FormLeft>
          <Typography variant="h6">| BOOK SETUP</Typography>

          <LabelBox>
            <LabelText>
              <span className="required">*</span>책 제목
            </LabelText>
            <TextField
              name="title"
              value={form.title}
              fullWidth
              onChange={handleChange}
            />
          </LabelBox>

          <LabelBox>
            <LabelText>
              <span className="required">*</span>저자
            </LabelText>
            <TextField
              name="author"
              value={form.author}
              fullWidth
              onChange={handleChange}
            />
          </LabelBox>

          <LabelBox>
            <LabelText>
              <span className="required">*</span>책 소개
            </LabelText>
            <TextField
              name="content"
              value={form.content}
              fullWidth
              multiline
              rows={4}
              onChange={handleChange}
            />
          </LabelBox>

          <LabelBox>
            <LabelText>
              <span className="required">*</span>책 카테고리
            </LabelText>
            <RadioGroup
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
            >
              <FormControlLabel value="1" control={<Radio />} label="문학" />
              <FormControlLabel value="2" control={<Radio />} label="경제" />
              <FormControlLabel
                value="3"
                control={<Radio />}
                label="자기 계발"
              />
              <FormControlLabel
                value="4"
                control={<Radio />}
                label="라이프스타일"
              />
            </RadioGroup>
          </LabelBox>

          <LabelBox>
            <LabelText>
              <span className="required">*</span>비밀번호
            </LabelText>
            <TextField
              name="password"
              value={form.password}
              fullWidth
              onChange={handleChange}
            />
          </LabelBox>

          <LabelBox>
            <LabelText>
              <span className="required">*</span>API KEY
            </LabelText>
            <TextField
              name="apiKey"
              value={form.apiKey}
              fullWidth
              onChange={handleChange}
            />
          </LabelBox>

          <ButtonGroup>
            <Button
              variant="contained"
              onClick={generateCover}
              disabled={loading}
            >
              {loading ? "Generating..." : "Book Cover Create"}
            </Button>
          </ButtonGroup>
        </FormLeft>

        <FormRight>
          <Typography variant="h6">| BOOK COVER</Typography>
          <CoverBox>
            {form.coverImgUrl ? (
              <img
                src={form.coverImgUrl}
                alt="표지 미리보기"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Typography color="text.secondary">표지 미리보기 없음</Typography>
            )}
          </CoverBox>

          <Button
            sx={{ mt: 5, alignSelf: "flex-end" }}
            variant="contained"
            onClick={handleSubmit}
          >
            Edit
          </Button>
        </FormRight>
      </StyledContainer>
    </ThemeProvider>
  );
}

export default Edit;
