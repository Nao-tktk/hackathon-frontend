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
import { IconBrandGoogle } from "@tabler/icons-react";

// Firebase関連
import { auth } from "../firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword, // 👈 新規作成用関数
  updateProfile, // 👈 名前保存用関数
  type User, // 👈 'type' を付けてインポート
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ■ 共通処理: バックエンドと同期をとる関数
  // Firebaseで認証した後、自前のDBにも「この人が来たよ」と登録してIDをもらう
  const syncWithBackend = async (firebaseUser: User) => {
    try {
      // ログインも登録も /api/social-login で統一して処理できます
      // (DBになければ作り、あればIDを返す仕組みになっているため)
      const res = await fetch("/api/social-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: firebaseUser.email,
          name: firebaseUser.displayName || name || "No Name",
        }),
      });

      if (!res.ok) throw new Error("Backend Sync Failed");

      const data = await res.json();

      // アプリ内で使うデータを保存
      localStorage.setItem("user_id", String(data.id));
      localStorage.setItem("user_name", data.name);
      localStorage.setItem("firebase_uid", firebaseUser.uid);

      alert("登録しました！");
      navigate("/");
      // window.location.reload(); // 必要であれば
    } catch (error) {
      console.error(error);
      alert("登録後のデータ同期に失敗しました");
    }
  };

  // ■ Googleで登録
  const handleGoogleRegister = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await syncWithBackend(result.user);
    } catch (error) {
      console.error(error);
      alert("Google登録に失敗しました");
    }
  };

  // ■ メールアドレスで新規登録
  const handleEmailRegister = async () => {
    if (!name) {
      alert("名前を入力してください");
      return;
    }
    try {
      // 1. Firebaseでユーザー作成 (メールとパスワード)
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 2. Firebase上のプロフィール(名前)を更新
      // (メール登録だけだと名前が空っぽなので、ここで設定しておく)
      await updateProfile(result.user, {
        displayName: name,
      });

      // 3. バックエンドに同期
      await syncWithBackend(result.user);
    } catch (error) {
      console.error(error);
      // 型アサーションを使って安全にエラーコードを読む
      const e = error as FirebaseError;

      if (e.code === "auth/email-already-in-use") {
        alert("このメールアドレスは既に登録されています");
      } else if (e.code === "auth/weak-password") {
        alert("パスワードが弱すぎます（6文字以上にしてください）");
      } else {
        alert("登録エラーが発生しました: " + e.message);
      }
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">新規登録</Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Button
          fullWidth
          variant="default"
          color="gray"
          leftSection={<IconBrandGoogle size={20} />}
          onClick={handleGoogleRegister}
          mb="md"
        >
          Googleで登録
        </Button>

        <Divider
          label="またはメールアドレスで"
          labelPosition="center"
          my="lg"
        />

        <TextInput
          label="ユーザー名（ニックネーム）"
          placeholder="例: フリマ太郎"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          mb="md"
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
          placeholder="6文字以上"
          required
          mt="md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button fullWidth mt="xl" onClick={handleEmailRegister}>
          アカウント作成
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
