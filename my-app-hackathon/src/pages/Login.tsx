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
  Divider,
} from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react"; // Googleアイコン

// Firebase関連
import { auth } from "../firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  type User,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

export const Login = () => {
  const [email, setEmail] = useState(""); // nameではなくemailに変更
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const syncWithBackend = async (firebaseUser: User) => {
    try {
      const res = await fetch("/api/social-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: firebaseUser.email,
          name: firebaseUser.displayName || "No Name",
        }),
      });

      if (!res.ok) throw new Error("Backend Sync Failed");

      const data = await res.json();

      localStorage.setItem("user_id", String(data.id));
      localStorage.setItem("user_name", data.name);
      localStorage.setItem("firebase_uid", firebaseUser.uid);

      alert("ログインしました！");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("ログイン後のデータ同期に失敗しました");
    }
  };

  // ■ Googleログインの処理
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // ポップアップでGoogleログイン画面を出す
      const result = await signInWithPopup(auth, provider);

      // 成功したらバックエンドに報告
      await syncWithBackend(result.user);
    } catch (error) {
      console.error(error);
      alert("Googleログインに失敗しました");
    }
  };

  // ■ メール/パスワードログインの処理 (Firebase使用)
  const handleEmailLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await syncWithBackend(result.user);
    } catch (error) {
      // error: any ではなく型アサーションを使用
      console.error(error);
      const e = error as FirebaseError;
      if (e.code === "auth/invalid-credential") {
        alert("メールアドレスかパスワードが間違っています");
      } else {
        alert("ログインエラーが発生しました");
      }
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">ログイン</Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {/* ▼ Googleログインボタン ▼ */}
        <Button
          fullWidth
          variant="default"
          color="gray"
          leftSection={<IconBrandGoogle size={20} />}
          onClick={handleGoogleLogin}
          mb="md"
        >
          Googleでログイン
        </Button>

        <Divider
          label="またはメールアドレスで"
          labelPosition="center"
          my="lg"
        />

        <TextInput
          label="メールアドレス"
          placeholder="test@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          label="パスワード"
          placeholder="********"
          required
          mt="md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button fullWidth mt="xl" onClick={handleEmailLogin}>
          ログインする
        </Button>

        <Text c="dimmed" size="sm" ta="center" mt={5}>
          まだ登録していませんか？{" "}
          {/* 新規登録ページもFirebase対応にする必要がありますが、一旦リンクはそのまま */}
          <Anchor href="/register" size="sm">
            新規登録
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
};
