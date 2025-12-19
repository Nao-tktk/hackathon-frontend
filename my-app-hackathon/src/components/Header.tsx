// src/components/Header.tsx
import { Group, Button, Title, Box, Text } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  // localStorageからログイン情報を簡易チェック
  const userId = localStorage.getItem("user_id");
  const userName = localStorage.getItem("user_name");
  const isLoggedIn = !!userId; // IDがあればログイン済みとみなす

  const handleLogout = () => {
    // ログアウト処理
    if (confirm("ログアウトしますか？")) {
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_name");
      alert("ログアウトしました");
      navigate("/login");
    }
  };

  return (
    <Box
      component="header"
      py="md"
      px="xl"
      style={{ borderBottom: "1px solid #e0e0e0" }}
    >
      <Group justify="space-between">
        {/* 左側：ロゴ（クリックでトップへ） */}
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Title order={3} style={{ cursor: "pointer" }}>
            ♻️ フリマアプリ
          </Title>
        </Link>

        {/* 右側：ナビゲーションボタン */}
        <Group>
          {isLoggedIn ? (
            <>
              {/* ログイン中のみ表示 */}
              <Text fw={500} size="sm" visibleFrom="xs">
                ようこそ {userName} さん
              </Text>

              <Button
                component={Link}
                to="/notifications"
                variant="subtle"
                color="orange"
              >
                🔔 お知らせ
              </Button>

              <Button
                component={Link}
                to="/help"
                variant="subtle"
                color="grape"
              >
                ❓ ヘルプ
              </Button>

              <Button component={Link} to="/sell" color="teal" variant="light">
                出品する
              </Button>

              <Button onClick={handleLogout} color="gray" variant="outline">
                ログアウト
              </Button>
            </>
          ) : (
            <>
              {/* 未ログイン時のみ表示 */}
              {/* ログインページにいる時は「ログイン」ボタンを隠す等の調整も可 */}
              <Button component={Link} to="/login" variant="default">
                ログイン
              </Button>
              <Button component={Link} to="/register" color="blue">
                新規登録
              </Button>
            </>
          )}
        </Group>
      </Group>
    </Box>
  );
};
