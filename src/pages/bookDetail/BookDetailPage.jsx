import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ModalButton } from "../../components/bookDetail/ModalButton";
import { useNavigate } from "react-router-dom";

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/books/${id}`)
      .then((res) => setBook(res.data))
      .catch((err) => {
        console.error("책 정보를 불러오는 데 실패했습니다!!", err);
      });
  }, [id]);

  if (!book) return <div>로딩 중...</div>;

  return (
    <div
      style={{
        marginTop: "100px", // 헤더 아래로 내림
        marginLeft: "20px", // 왼쪽 여백
        fontWeight: "bold",
      }}
    >
      <div
        style={{
          display: "flex",
          padding: "80px",
          gap: "60px",
          alignItems: "flex-start",
        }}
      >
        {/* 왼쪽: 표지 */}
        <div style={{ width: "380px" }}>
          <img
            src={book.coverImgUrl}
            alt="표지"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/no-image.png";
            }}
            style={{
              width: "100%",
              height: "450px",
              border: "1px solid #ccc",
              objectFit: "cover",
            }}
          />
        </div>

        {/* 오른쪽: 내용 */}
        <div
          style={{
            flex: 1,
            position: "relative",
            border: "1px solid #eee",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.05)",
            textAlign: "left",
          }}
        >
          {/* 버튼 */}
          <div
            style={{
              position: "absolute",
              top: "30px",
              right: "30px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <ModalButton type="edit" book={book} />
            <ModalButton type="delete" book={book} />
          </div>

          {/* 정보 출력 */}
          <p style={{ color: "#888", marginBottom: "5px", fontSize: "15px" }}>
            {book.categoryName}
          </p>

          <h2 style={{ margin: "0 0 30px", fontSize: "20px" }}>{book.title}</h2>

          <div style={{ marginBottom: "10px" }}>
            <h4 style={{ margin: "0 1px 0", fontSize: "15px", color: "#888" }}>
              저자
            </h4>
            <p
              style={{ margin: "2px 2px 0", fontSize: "18px", fontWeight: 700 }}
            >
              {book.author}
            </p>
          </div>

          <p style={{ marginBottom: "10px", color: "#888", fontSize: "12px" }}>
            등록일: {new Date(book.createDate).toLocaleDateString()}
            <br />
            {/* <p style={{ marginBottom: "20px", color: "#555" }}> */}
            수정일: {new Date(book.updateDate).toLocaleString()}
          </p>

          <div
            style={{
              flex: 1,
              marginTop: "30px",
              position: "relative",
              border: "1px solid #eee",
              padding: "30px",
              borderRadius: "8px",
              // boxShadow: "0 0 10px rgba(0,0,0,0.05)",
              textAlign: "left",
            }}
          >
            <div>
              <p
                style={{
                  marginTop: "-30px",
                  marginLeft: "-20px",
                  fontSize: "15px",
                }}
              >
                <br />
                📖줄거리
              </p>

              <p
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.6",
                  fontSize: "13px",
                  marginLeft: "-20px",
                  color: "#555",
                  fontWeight: 500,
                }}
              >
                {book.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
