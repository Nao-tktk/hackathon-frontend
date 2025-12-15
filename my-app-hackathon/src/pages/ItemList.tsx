import useSWR from "swr";
import type { Item } from "../types";
import { ItemCard } from "../components/ItemCard";
import { Loader, Text, Grid } from "@mantine/core";

// フェッチャー（データ取得用の関数：おまじない）
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const ItemList = () => {
  // ★これだけで「データ取得」「ローディング中」「エラー」全部管理してくれる
  // プロキシ設定のおかげで、URLは '/api/items' だけでOK（Cloud Runへ飛ぶ）
  const { data, error, isLoading } = useSWR<Item[]>("/api/items", fetcher);
  console.log("届いたデータ:", data);

  if (isLoading) return <Loader color="blue" />;
  if (error) return <Text c="red">エラーが発生しました</Text>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>商品一覧</h1>
      <Grid>
        {data?.map((item) => (
          <Grid.Col key={item.id} span={4}>
            {" "}
            {/* 3列表示になる */}
            <ItemCard item={item} />
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
};
