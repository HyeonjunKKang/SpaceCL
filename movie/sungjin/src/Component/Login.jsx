import React, { useState } from "react";
import { use } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../auth/AuthContext";

const API = (import.meta.env.VITE_API_BASE || "http://localhost:4000").replace(/\/$/, "");

const Login= () => {
  const navigate=useNavigate()
  const { login } = useAuth();
   const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setMsg("");

    if (!email || !pw) return setMsg("이메일/비밀번호를 입력해주세요.");

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pw }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "로그인 실패");
       // ★ 컨텍스트 + localStorage 모두 갱신 (AuthContext가 내부에서 해줌)
      //   네 컨텍스트 시그니처에 맞춰 객체 형태로 전달
      login({ user: data.user, token: data.token });

      
      setMsg("로그인 성공! ✅");
      // 상위에서 모달 닫기/상태 갱신하고 싶으면 콜백 사용
       navigate("/", { replace: true }); 
    } catch (err) {
      setMsg(err.message || "에러가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={onSubmit}>
      <input type="text" id="email" placeholder="이메일 또는 아이디를 입력해주세요" value={email}onChange={(e) => setEmail(e.target.value)} />
    <input type="password" id="password"placeholder="비밀 번호를 입력해주세여"value={pw} onChange={(e) => setPw(e.target.value)} />
     {msg && (
          <p style={{ color: /성공/.test(msg) ? "green" : "tomato", marginTop: 8 }}>
            {msg}
          </p>
        )}

        <button type="submit" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? "처리중..." : "로그인"}
        </button>
   </form> </div>
  );
};

export default Login;
