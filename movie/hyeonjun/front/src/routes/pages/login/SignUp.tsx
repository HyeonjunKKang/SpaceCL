// src/pages/SignUp.tsx
import { useState } from 'react';
import { parseNetworkError } from '../../../utils/network/networkError';
import { useNavigate } from 'react-router-dom';
import { signUpUseCase } from '../../../useCase/auth.usecase';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const navigate = useNavigate();

  const handleMoveToLogin = () => {
    navigate('/login');
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    console.log('asdfsafds');

    if (pw !== pw2) {
      setErr('비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    if (pw.length < 8) {
      setErr('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    try {
      await signUpUseCase(name, email, pw);
      setOk(true);
    } catch (error: any) {
      const parsed = parseNetworkError(error);
      setErr(parsed.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="mx-auto w-[400px] bg-blue-100 p-4 rounded-md shadow">
        <h1 className="text-center text-xl font-semibold mb-4">JOIN</h1>

        {ok ? (
          <div className="text-center">
            <div className="p-3 bg-green-100 text-green-800 rounded mb-6">
              회원가입이 완료되었습니다. 로그인 해주세요.
            </div>
            <button onClick={handleMoveToLogin} className="hover:cursor-pointer">
              확인
            </button>
          </div>
        ) : (
          <form className="flex flex-col gap-3" onSubmit={onSubmit}>
            {err && <div className="p-2 bg-red-100 text-red-700 rounded">{err}</div>}

            <label className="text-sm">name</label>
            <input
              required
              className="bg-white w-full p-2 rounded border"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={32}
            />

            <label className="text-sm">email</label>
            <input
              required
              className="bg-white w-full p-2 rounded border"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              maxLength={128}
            />

            <label className="text-sm">password</label>
            <input
              required
              className="bg-white w-full p-2 rounded border"
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              minLength={8}
              maxLength={64}
            />

            <label className="text-sm">confirm password</label>
            <input
              required
              className="bg-white w-full p-2 rounded border"
              type="password"
              value={pw2}
              onChange={e => setPw2(e.target.value)}
              minLength={8}
              maxLength={64}
            />

            <button
              disabled={loading}
              className="p-2 mt-6 bg-white rounded border hover:bg-gray-50 disabled:opacity-60"
              type="submit"
            >
              {loading ? '처리 중…' : 'OK'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
