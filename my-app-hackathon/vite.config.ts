import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // フロントエンドで "/items" や "/purchase" にアクセスすると
      // 自動的に target のURL (Cloud Run) に転送してくれる設定
      "/api": {
        target: "https://hackathon-backend-223315240416.europe-west1.run.app",
        changeOrigin: true,
      },

      // 今後APIが増えたらここに追加するか、Go側で全て /api/xxx に統一すると楽になります
    },
  },
});
