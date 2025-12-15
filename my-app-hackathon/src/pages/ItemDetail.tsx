import { useParams, useNavigate } from "react-router-dom"; // useNavigate追加
import {
  Container,
  Title,
  Text,
  Button,
  Image,
  Badge,
  Group,
  Card,
  LoadingOverlay,
} from "@mantine/core";
import useSWR, { mutate } from "swr"; // mutate追加
import type { Item } from "../types";
import { useState } from "react";
import { Link } from "react-router-dom";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: items } = useSWR<Item[]>("/api/items", fetcher);

  // 購入処理中のローディング管理
  const [isPurchasing, setIsPurchasing] = useState(false);

  // 該当する商品を探す
  const item = items?.find((i) => i.id === Number(id));

  if (!items) return <Text>読み込み中...</Text>;
  if (!item) return <Text>商品が見つかりません</Text>;

  // ★購入ボタンを押したときの処理
  const handlePurchase = async () => {
    if (!confirm("本当に購入しますか？")) return;

    setIsPurchasing(true);
    try {
      // main.go の設定に合わせて "/purchase"に送ります
      const response = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer_id: 1, // 買う人（仮で1）
          item_id: item.id, // 買う商品
        }),
      });

      if (!response.ok) {
        throw new Error("購入に失敗しました");
      }

      alert("購入しました！🎉");

      // データを再取得して画面を更新（SOLD表示にするため）
      mutate("/items");
      navigate("/"); // 一覧に戻る
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました。サーバーログを確認してください。");
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Container size={800} my="xl" pos="relative">
      <LoadingOverlay visible={isPurchasing} />

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Image
            src={
              item.image_name === "default.png" || !item.image_name
                ? "https://placehold.co/600x400?text=No+Image"
                : item.image_name
            }
            height={300}
            alt={item.name}
          />
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
          <Title order={2}>{item.name}</Title>
          {/* 売り切れならバッジを変える */}
          {item.status === "SOLD_OUT" ? (
            <Badge color="gray" size="xl">
              SOLD OUT
            </Badge>
          ) : (
            <Badge color="pink" size="xl" variant="light">
              ¥{item.price.toLocaleString()}
            </Badge>
          )}
        </Group>

        <Text size="sm" c="dimmed" mb="xl">
          カテゴリーID: {item.category_id} / 出品者ID: {item.seller_id}
        </Text>

        {/* ▼▼▼ 追加: チャットへのリンク ▼▼▼ */}
        {/* 自分の出品でない場合のみ表示するのが親切ですが、一旦全員表示でもOK */}
        <Button
          component={Link}
          to={`/chat/${item.id}/${item.seller_id}`}
          variant="outline"
          size="lg"
        >
          出品者に質問する 💬
        </Button>
        {/* ▲▲▲ 追加ここまで ▲▲▲ */}

        <Title order={4} mb="xs">
          商品説明
        </Title>
        <Text size="md" mb="xl">
          {item.description || "商品説明はありません。"}
        </Text>

        {/* 売り切れならボタンを押せなくする */}
        <Button
          fullWidth
          size="xl"
          color={item.status === "SOLD_OUT" ? "gray" : "orange"}
          disabled={item.status === "SOLD_OUT"}
          onClick={handlePurchase}
        >
          {item.status === "SOLD_OUT" ? "売り切れました" : "購入する"}
        </Button>
      </Card>
    </Container>
  );
};
