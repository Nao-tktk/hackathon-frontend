// src/pages/SellItem.tsx
import { useForm } from "react-hook-form";
import {
  TextInput,
  NumberInput,
  Button,
  Box,
  Group,
  Title,
  LoadingOverlay,
  Select,
} from "@mantine/core"; // Selectを追加
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type SellFormInput = {
  name: string;
  price: number;
  category_id: string; // Selectの値は文字列で返ってくるため
};

export const SellItem = () => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SellFormInput>();

  const onSubmit = async (data: SellFormInput) => {
    setSubmitting(true);
    const myId = localStorage.getItem("user_id");
    if (!myId) {
      alert("ログインしてください");
      navigate("/login");
      return;
    }

    try {
      // データを整える
      const payload = {
        name: data.name,
        price: data.price,
        category_id: Number(data.category_id), // 数値に変換
        seller_id: Number(myId), // ★ユーザー機能ができるまでは「1」で固定！ここら辺は仮のデータだからあとで消す！！
        description: "説明文なし", // 必須なら仮の値を入れる
      };

      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("出品失敗");

      alert("出品しました！");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box maw={400} mx="auto" mt="xl" pos="relative">
      <LoadingOverlay visible={submitting} />
      <Title order={2} mb="lg">
        商品を出品する
      </Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="商品名"
          placeholder="例: 教科書"
          mb="md"
          {...register("name", { required: "必須です" })}
          error={errors.name?.message}
        />

        {/* ▼▼▼ 追加：カテゴリー選択 ▼▼▼ */}
        <Select
          label="カテゴリー"
          placeholder="選択してください"
          mb="md"
          data={[
            { value: "1", label: "本・雑誌" },
            { value: "2", label: "家電" },
            { value: "3", label: "ファッション" },
          ]}
          onChange={(val) => setValue("category_id", val as string)}
          required
        />

        <NumberInput
          label="価格"
          placeholder="例: 1000"
          mb="xl"
          onChange={(val) => setValue("price", Number(val))}
          error={errors.price?.message}
        />

        <Group justify="center">
          <Button type="submit" fullWidth>
            出品する
          </Button>
        </Group>
      </form>
    </Box>
  );
};
