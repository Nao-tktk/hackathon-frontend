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
          src="https://placehold.co/400x200?text=No+Image" // 仮画像
          height={160}
          alt={item.name}
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
