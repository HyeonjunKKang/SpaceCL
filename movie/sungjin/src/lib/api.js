import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // 백엔드 주소
  withCredentials: true,
});

// 요청 인터셉터: 로컬스토리지 토큰 → Authorization 헤더에 붙이기
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 응답 인터셉터: 401 나오면 자동 로그아웃(선택)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      // 토큰 만료/무효 → 정리
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // 필요하면 새로고침 or 라우팅
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;