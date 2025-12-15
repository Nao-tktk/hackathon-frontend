import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Button,
  Container,
  Title,
  Paper,
  Text,
  Anchor,
} from "@mantine/core";

export const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // 1. バックエンドに送信
      const res = await fetch("/api/login", {
        // main.goに追加したパス
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      if (!res.ok) throw new Error("ログイン失敗");

      const data = await res.json();

      // 2. 成功したらIDを保存 (localStorage)
      localStorage.setItem("user_id", String(data.id));
      localStorage.setItem("user_name", name);

      alert("ログインしました！");
      navigate("/"); // トップへ戻る
    } catch (error) {
      alert("名前かパスワードが間違っています");
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">ログイン</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="ユーザー名"
          placeholder="テスト太郎"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <PasswordInput
          label="パスワード"
          placeholder="pass1234"
          required
          mt="md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button fullWidth mt="xl" onClick={handleLogin}>
          ログインする
        </Button>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          まだ登録していませんか？{" "}
          <Anchor href="/register" size="sm">
            新規登録
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
};
