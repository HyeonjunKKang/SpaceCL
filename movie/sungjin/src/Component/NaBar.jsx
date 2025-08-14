import React, { useState } from "react";
import { CgPassword } from "react-icons/cg";
import {  useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE || "";

const NaBar = () => {
  const nav = useNavigate()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const email = form.email.trim();
    const pwd = form.password;

     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "이메일 형식이 올바르지 않아요.";//
    if (!pwd || pwd.length < 8)
      return "비밀번호는 8자 이상으로 해주세요.";
    if (form.password !== form.confirmPassword)
      return "비밀번호 확인이 일치하지 않아요.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // 중복 제출 방지
    setMsg("");

    const err = validate();
    if (err) return setMsg(err);

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          nickname: form.name || null, // 백엔드: nickname 필드
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "회원가입 실패");

      setMsg("가입 완료! 🎉 이제 로그인하세요.");
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "", // ← 키 수정
      });
      nav("/",{replace:true})
    } catch (e) {
      setMsg(e.message || "에러가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="name"
          placeholder="이름(닉네임)"
          value={form.name}
          onChange={handleChange}
          autoComplete="nickname"
        />
        <input
          type="email"
          name="email"
          placeholder="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호 (8자 이상)"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          value={form.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
        />

        {msg && (
          <p
            style={{
              color: /완료|성공/.test(msg) ? "green" : "tomato",
              marginTop: 8,
            }}
          >
            {msg}
          </p>
        )}

        <button type="submit" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? "처리중..." : "가입하기"}
        </button>
      </form>
    </div>
  );
};

export default NaBar;
