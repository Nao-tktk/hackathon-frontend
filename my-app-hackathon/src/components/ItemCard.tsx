import { Card, Image, Text, Group, Badge } from "@mantine/core";
import { Link } from "react-router-dom"; // 👈 追加
import type { Item } from "../types";

type Props = {
  item: Item; // 親から「商品データ」をもらう
};

export const ItemCard = ({ item }: Props) => {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      component={Link} // 👈 これでリンクになる
      to={`/items/${item.id}`} // 👈 リンク先を指定
      style={{ cursor: "pointer", height: "100%" }} // カーソルを指の形に
    >
      <Card.Section>
        <Image
          src={
            // image_name が "data:..." で始まっていればそれを表示。
            // そうでなければ（空文字や default.png なら）プレースホルダーを表示
            item.image_name && item.image_name.startsWith("data:")
              ? item.image_name
              : "https://placehold.co/600x400?text=No+Image"
          }
          height={300}
          alt={item.name}
          fit="contain" // 画像が切れないように
        />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{item.name}</Text>
        <Badge color="pink" variant="light">
          ¥{item.price}
        </Badge>
      </Group>

      <Text size="sm" c="dimmed">
        {item.description ? item.description.slice(0, 30) + "..." : "説明なし"}
      </Text>
    </Card>
  );
};
