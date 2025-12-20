import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Paper,
  TextInput,
  Button,
  Group,
  Text,
  ScrollArea,
  Box,
} from "@mantine/core";

interface Message {
  id: number;
  sender_id: number;
  content: string;
  created_at: string;
}

export const Chat = () => {
  const { itemId, partnerId } = useParams(); // URLから商品IDと相手IDを取得
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const myId = Number(localStorage.getItem("user_id"));

  // チャット履歴の取得
  const fetchMessages = async () => {
    if (!myId || !itemId || !partnerId) return;

    try {
      const res = await fetch(
        `/api/messages?item_id=${itemId}&user_id=${myId}&partner_id=${partnerId}`
      );
      if (!res.ok) throw new Error("取得失敗");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  // 初回ロード時 & 定期更新（簡易的なリアルタイム風処理）
  useEffect(() => {
    if (!myId) {
      alert("ログインしてください");
      navigate("/login");
      return;
    }
    fetchMessages();

    // 3秒ごとに新着メッセージを確認（ハッカソン用簡易ポーリング）
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [itemId, partnerId, myId]);

  // メッセージ送信
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_id: Number(itemId),
          sender_id: myId,
          receiver_id: Number(partnerId),
          content: newMessage,
        }),
      });

      if (res.ok) {
        setNewMessage("");
        fetchMessages(); // すぐに画面更新
      }
    } catch {
      alert("送信エラー");
    }
  };

  return (
    <Container size="sm" py="xl">
      <Title order={3} mb="md">
        出品者とのチャット
      </Title>

      {/* メッセージ表示エリア */}
      <Paper
        withBorder
        p="md"
        h={400}
        radius="md"
        mb="md"
        component={ScrollArea}
      >
        {messages.length === 0 ? (
          <Text c="dimmed" ta="center" mt={100}>
            まだメッセージはありません。
            <br />
            質問を送ってみましょう！
          </Text>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === myId;
            return (
              <Box
                key={msg.id}
                mb="sm"
                style={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                }}
              >
                <Paper
                  p="xs"
                  radius="lg"
                  bg={isMe ? "blue.1" : "gray.1"}
                  style={{ maxWidth: "70%" }}
                >
                  <Text size="sm">{msg.content}</Text>
                  <Text size="xs" c="dimmed" ta="right">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </Paper>
              </Box>
            );
          })
        )}
      </Paper>

      {/* 入力エリア */}
      <Group>
        <TextInput
          placeholder="メッセージを入力..."
          style={{ flex: 1 }}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend}>送信</Button>
      </Group>
    </Container>
  );
};
