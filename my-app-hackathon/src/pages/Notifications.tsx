// src/pages/Notifications.tsx
import { useEffect, useState } from "react";
import { Container, Title, Paper, Text, Group, Stack } from "@mantine/core";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: number;
  item_id: number;
  item_name: string;
  sender_id: number;
  sender_name: string;
  content: string;
  created_at: string;
}

export const Notifications = () => {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const navigate = useNavigate();
  const myId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!myId) return;

    // 定期的に通知をチェック (3秒ごと)
    const fetchNotifs = async () => {
      try {
        const res = await fetch(`/api/notifications?user_id=${myId}`);
        if (res.ok) {
          const data = await res.json();
          setNotifs(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 3000);
    return () => clearInterval(interval);
  }, [myId]);

  return (
    <Container size="sm" py="xl">
      <Title order={3} mb="lg">
        🔔 お知らせ（受信メッセージ）
      </Title>

      {notifs.length === 0 ? (
        <Text c="dimmed" ta="center">
          まだメッセージはありません
        </Text>
      ) : (
        <Stack>
          {notifs.map((n) => (
            <Paper
              key={n.id}
              withBorder
              p="md"
              radius="md"
              style={{ cursor: "pointer", transition: "0.2s" }}
              onClick={() => navigate(`/chat/${n.item_id}/${n.sender_id}`)}
            >
              <Group justify="space-between" mb="xs">
                <Text fw={700} size="lg">
                  送信者ID {n.sender_id}
                </Text>
                <Text size="xs" c="dimmed">
                  {new Date(n.created_at).toLocaleString()}
                </Text>
              </Group>

              <Text size="sm" mb="xs">
                商品: <span style={{ fontWeight: "bold" }}>{n.item_name}</span>
              </Text>

              <Paper bg="gray.1" p="xs" radius="sm">
                <Text size="sm" lineClamp={2}>
                  {n.content}
                </Text>
              </Paper>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
};
