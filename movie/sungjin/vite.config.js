import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const NGROK_HOST = process.env.NGROK_HOST || ""; // 예: "aac575579b6b.ngrok-free.app"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,                   // 외부 접속 허용 (0.0.0.0)
    proxy: {                      // 프론트 -> 백엔드 프록시
      "/api": "http://localhost:4000",
    },
    // Vite 5+: 외부 도메인 허용
    allowedHosts: NGROK_HOST ? [NGROK_HOST, ".ngrok-free.app"] : true,
    // ngrok일 때만 HMR을 WSS:443로 설정, 로컬은 기본값 사용
    hmr: NGROK_HOST
      ? { protocol: "wss", host: NGROK_HOST, clientPort: 443 }
      : undefined,
  },
});
