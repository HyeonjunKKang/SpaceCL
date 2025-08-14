import { useState } from 'react';
import { signInUseCase } from '../../../useCase/auth.usecase';
import { parseNetworkError } from '../../../utils/network/networkError';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setOk(false);

    if (!email.trim()) return setErr('이메일을 입력해 주세요.');
    if (!pw.trim()) return setErr('비밀번호를 입력해 주세요.');
    if (pw.length < 8) return setErr('비밀번호는 8자 이상이어야 합니다.');

    setLoading(true);
    try {
      await signInUseCase(email, pw); // 성공 시 내부에서 토큰/유저 상태 저장 가정
      setOk(true);
      navigate('/'); // 라우팅 사용 시
    } catch (error: any) {
      const e = parseNetworkError(error);
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="w-[400px] mx-auto my-auto bg-blue-100 p-4 rounded-[4px]">
        <p className="text-lg font-semibold mb-3">Login</p>

        {err && <div className="mb-3 rounded bg-red-100 text-red-700 p-2">{err}</div>}
        {ok && (
          <div className="mb-3 rounded bg-green-100 text-green-800 p-2">로그인에 성공했습니다.</div>
        )}

        <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
          <div className="flex gap-5 items-center">
            <label className="w-[50px]" htmlFor="login-email">
              ID
            </label>
            <input
              id="login-email"
              required
              className="bg-white w-full p-2 rounded-[4px] border"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              maxLength={128}
              autoComplete="email"
              aria-invalid={!!err && !email}
            />
          </div>

          <div className="flex gap-5 items-center">
            <label className="w-[50px]" htmlFor="login-pw">
              PW
            </label>
            <input
              id="login-pw"
              required
              className="bg-white w-full p-2 rounded-[4px] border"
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              minLength={8}
              maxLength={64}
              autoComplete="current-password"
              aria-invalid={!!err && pw.length < 8}
            />
          </div>

          <button
            type="submit"
            className="p-2 mt-4 bg-white rounded border hover:bg-gray-50 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? '처리 중…' : 'OK'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
