import useSWR from "swr";
import { useState } from "react";
import type { Item } from "../types";
import { ItemCard } from "../components/ItemCard";
import { Loader, Text, Grid, Checkbox, Group, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react"; // 👈 アイコン追加

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const ItemList = () => {
  const { data, error, isLoading } = useSWR<Item[]>("/api/items", fetcher);

  const [showSold, setShowSold] = useState(false);

  const [keyword, setKeyword] = useState("");

  console.log("届いたデータ:", data);

  if (isLoading) return <Loader color="blue" />;
  if (error) return <Text c="red">エラーが発生しました</Text>;

  // ▼▼▼ 変更: フィルターロジックの強化 ▼▼▼
  const filteredItems = data?.filter((item) => {
    // 1. 売り切れチェック
    const isSoldCheckPassed = showSold ? true : !item.status;

    if (!keyword) return isSoldCheckPassed;

    // 2. キーワードチェック (商品名 or 説明文 に含まれているか)
    // toLowerCase() で大文字小文字を区別しないようにする
    const searchTarget = (item.name + (item.description || "")).toLowerCase();
    const isKeywordPassed = searchTarget.includes(keyword.toLowerCase());

    // 両方OKなら表示
    return isSoldCheckPassed && isKeywordPassed;
  });

  return (
    <div style={{ padding: "20px" }}>
      <Group justify="space-between" align="center" mb="lg">
        <h1 style={{ margin: 0 }}>商品一覧</h1>{" "}
        <Group>
          <TextInput
            placeholder="キーワード検索..."
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(event) => setKeyword(event.currentTarget.value)}
            style={{ width: "250px" }}
          />
          <Checkbox
            label="売り切れも表示"
            checked={showSold}
            onChange={(event) => setShowSold(event.currentTarget.checked)}
          />
        </Group>
      </Group>

      {filteredItems?.length === 0 && (
        <Text c="dimmed" ta="center" mt="xl">
          条件に合う商品は見つかりませんでした
        </Text>
      )}

      <Grid>
        {filteredItems?.map((item) => (
          <Grid.Col key={item.id} span={4}>
            <ItemCard item={item} />
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
};
