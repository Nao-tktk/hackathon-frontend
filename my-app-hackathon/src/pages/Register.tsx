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

export const Register = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      // 1. バックエンドの登録API (/api/register) を叩く
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      if (!res.ok) {
        const errorText = await res.text(); // サーバーが送ってきた生のエラー文
        throw new Error(errorText || "登録に失敗しました");
      }

      const data = await res.json();

      // 2. 成功したら、そのままログイン状態にする (IDと名前を保存)
      localStorage.setItem("user_id", String(data.id));
      localStorage.setItem("user_name", name);

      alert("登録しました！");
      navigate("/"); // トップページへ移動
      window.location.reload(); // ヘッダーを更新するためにリロード
    } catch (error) {
      // errorがError型かどうかのチェックを入れて安全にメッセージを表示
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("エラーが発生しました");
      }
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">新規ユーザー登録</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="ユーザー名"
          placeholder="例: 山田花子"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <PasswordInput
          label="パスワード"
          placeholder="4文字以上"
          required
          mt="md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button fullWidth mt="xl" onClick={handleRegister}>
          登録してはじめる
        </Button>

        <Text c="dimmed" size="sm" ta="center" mt={5}>
          すでにアカウントをお持ちですか？{" "}
          <Anchor href="/login" size="sm">
            ログイン
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
};
