import useSWR from "swr";
import { useState } from "react";
import type { Item } from "../types";
import { ItemCard } from "../components/ItemCard";
import { Loader, Text, Grid, Checkbox, Group } from "@mantine/core";

// フェッチャー（データ取得用の関数：おまじない）
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const ItemList = () => {
  // ★これだけで「データ取得」「ローディング中」「エラー」全部管理してくれる
  // プロキシ設定のおかげで、URLは '/api/items' だけでOK（Cloud Runへ飛ぶ）
  const { data, error, isLoading } = useSWR<Item[]>("/api/items", fetcher);

  const [showSold, setShowSold] = useState(false);

  console.log("届いたデータ:", data);

  if (isLoading) return <Loader color="blue" />;
  if (error) return <Text c="red">エラーが発生しました</Text>;

  const filteredItems = data?.filter((item) => {
    if (showSold) return true; // スイッチONなら全員通す（売り切れも表示）
    return item.status !== "SOLD_OUT"; // スイッチOFFなら「売れてないもの」だけ通す
  });

  return (
    <div style={{ padding: "20px" }}>
      <Group justify="space-between" align="center" mb="lg">
        <h1 style={{ margin: 0 }}>商品一覧</h1>
        <Checkbox
          label="売り切れも表示する"
          checked={showSold}
          onChange={(event) => setShowSold(event.currentTarget.checked)}
        />
      </Group>

      <Grid>
        {/* data?.map ではなく filteredItems?.map に変えるのがポイント！ */}
        {filteredItems?.map((item) => (
          <Grid.Col key={item.id} span={4}>
            <ItemCard item={item} />
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
};
