import { useState, useEffect } from "react";

function App() {
  // 文字列を表示するので <string> で型指定します
  const [data, setData] = useState<string>("読み込み中...");

  // ★ あなたのCloud RunのURL
  const API_URL =
    "https://hackathon-backend-223315240416.europe-west1.run.app/user?name=test";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((result) => {
        // 結果がnullならメッセージ、あればJSON文字列に変換してセット
        setData(result ? JSON.stringify(result) : "データなし (接続成功！)");
      })
      .catch((err: unknown) => {
        // エラーハンドリング
        if (err instanceof Error) {
          setData("エラー発生: " + err.message);
        } else {
          setData("予期せぬエラーが発生しました");
        }
      });
  }, []);

  return (
    <div style={{ padding: "50px", fontFamily: "sans-serif" }}>
      <h1>Frontend & Backend Connection Test</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h3>バックエンドからの応答:</h3>
        <p style={{ fontWeight: "bold", color: "blue" }}>{data}</p>
      </div>
    </div>
  );
}

export default App;
