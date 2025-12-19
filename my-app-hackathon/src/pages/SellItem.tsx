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
  Textarea,
  Loader,
  FileInput,
  Image,
} from "@mantine/core"; // Selectを追加
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconSparkles, IconPhoto } from "@tabler/icons-react";

type SellFormInput = {
  name: string;
  price: number;
  category_id: string;
  description: string;
};

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (e) => {
      img.src = e.target?.result as string;
      img.onload = () => {
        // 画像のリサイズ設定 (最大幅 800px にする)
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round(height * (MAX_WIDTH / width));
          width = MAX_WIDTH;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // JPEG形式で圧縮率0.7 (70%画質) にして文字列化
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        } else {
          reject(new Error("Canvas context failed"));
        }
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

export const SellItem = () => {
  const [submitting, setSubmitting] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SellFormInput>();

  const currentName = watch("name");

  const handleFileChange = async (payload: File | null) => {
    setFile(payload);
    if (payload) {
      const base64 = await compressImage(payload);
      setPreview(base64);
    } else {
      setPreview(null);
    }
  };

  const handleGenerateDescription = async () => {
    // 名前か画像、どっちかは欲しい
    if (!currentName && !file) {
      alert("商品名を入力するか、画像をアップロードしてください！");
      return;
    }

    setLoadingAI(true);
    try {
      let imageBase64 = "";
      if (file) {
        // "data:image/png;base64,..." の頭の部分（メタデータ）を削除して送る必要がある場合が多いが、
        // 今回はバックエンド側で処理するか、そのまま送ってGeminiに任せる。
        // ここではそのまま送ります。
        imageBase64 = await compressImage(file);
      }

      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_name: currentName,
          item_image: imageBase64, // 👈 画像データも送る！
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setValue("description", data.description);
      } else {
        alert("AI生成に失敗しました");
      }
    } catch (error) {
      console.error(error);
      alert("通信エラーが発生しました");
    } finally {
      setLoadingAI(false);
    }
  };

  const onSubmit = async (data: SellFormInput) => {
    setSubmitting(true);
    const myId = localStorage.getItem("user_id");
    if (!myId) {
      alert("ログインしてください");
      navigate("/login");
      return;
    }

    try {
      let imageString = "";
      if (file) {
        imageString = await compressImage(file);
      }

      const payload = {
        name: data.name,
        price: data.price,
        category_id: Number(data.category_id), // 数値に変換
        seller_id: Number(myId),
        description: data.description, // 必須なら仮の値を入れる
        image_name: imageString,
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
        <Box mb="md">
          <FileInput
            label="商品画像"
            placeholder="画像を選択してください"
            accept="image/png,image/jpeg"
            leftSection={<IconPhoto size={16} />}
            onChange={handleFileChange}
            clearable
          />
          {preview && (
            <Image
              src={preview}
              h={200}
              mt="sm"
              radius="md"
              fit="contain"
              bg="gray.1"
            />
          )}
        </Box>

        <TextInput
          label="商品名"
          placeholder="例: 教科書"
          mb="md"
          {...register("name", { required: "必須です" })}
          error={errors.name?.message}
        />

        <Group justify="flex-end" mb={5}>
          <Button
            variant="light"
            color="grape"
            size="xs"
            onClick={handleGenerateDescription}
            disabled={loadingAI || !currentName} // 名前がないと押せない
            leftSection={
              loadingAI ? <Loader size={12} /> : <IconSparkles size={16} />
            }
          >
            {loadingAI ? "AIが考え中..." : "AIで説明文を作る"}
          </Button>
        </Group>

        <Textarea
          label="商品説明"
          placeholder="商品の状態や特徴を入力してください"
          minRows={4}
          mb="md"
          {...register("description")}
        />

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
