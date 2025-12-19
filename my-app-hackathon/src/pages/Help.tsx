// src/pages/Help.tsx
import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Textarea,
  Button,
  Paper,
  Loader,
  Group,
  Badge,
} from "@mantine/core";

export const Help = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // デモ用にクリックだけで質問できるボタン
  const exampleQuestions = [
    "手数料はいくらですか？",
    "禁止されている出品物は？",
    "商品が届かない場合はどうすればいい？",
    "発送方法について教えて",
  ];

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim()) return;

    setLoading(true);
    setAnswer("");

    // 入力欄も更新（チップを押したとき用）
    setQuery(questionText);

    try {
      const res = await fetch("/api/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: questionText }),
      });

      if (!res.ok) throw new Error("Network error");

      const data = await res.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
      setAnswer("エラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Title order={2} mb="lg" ta="center">
        AI ヘルプセンター
      </Title>
      <Text c="dimmed" ta="center" mb="xl">
        アプリの使い方やルールについて、AIがお答えします。
      </Text>

      {/* 質問入力エリア */}
      <Paper withBorder p="lg" radius="md" mb="xl">
        <Textarea
          placeholder="例：手数料はいくらですか？"
          label="質問内容"
          minRows={3}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          mb="md"
        />
        <Button
          fullWidth
          size="md"
          onClick={() => handleAsk(query)}
          disabled={loading || !query}
          color="grape"
        >
          {loading ? <Loader size="xs" color="white" /> : "AIに質問する"}
        </Button>
      </Paper>

      {/* よくある質問チップ（デモ用） */}
      <Group mb="xl" justify="center">
        {exampleQuestions.map((q) => (
          <Badge
            key={q}
            size="lg"
            variant="outline"
            style={{ cursor: "pointer" }}
            onClick={() => handleAsk(q)}
            color="gray"
          >
            {q}
          </Badge>
        ))}
      </Group>

      {/* 回答表示エリア */}
      {answer && (
        <Paper withBorder p="xl" radius="md" bg="gray.0">
          <Title order={4} mb="sm">
            AIからの回答
          </Title>
          <Text style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
            {answer}
          </Text>
        </Paper>
      )}
    </Container>
  );
};
