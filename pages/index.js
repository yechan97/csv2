import { useState, useRef } from 'react';

export default function Home() {
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState(false);
  const fileInput = useRef();

  const checkPassword = () => {
    if (password === '1234') setAuth(true);
    else alert('비밀번호가 틀렸습니다.');
  };

  const uploadFile = async () => {
    const file = fileInput.current.files[0];
    if (!file) {
      alert('파일을 선택해주세요!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      alert('업로드 실패');
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '성경DB.csv';
    a.click();
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 font-sans">
      <div className="bg-white p-10 rounded shadow text-center">
        <h1 className="text-3xl font-bold mb-6">📖 성경 DB 변환기</h1>

        {!auth ? (
          <>
            <input
              type="password"
              placeholder="비밀번호"
              className="border p-2 mb-4 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="bg-blue-500 text-white p-2 w-full" onClick={checkPassword}>
              확인
            </button>
          </>
        ) : (
          <>
            <input ref={fileInput} type="file" accept=".pdf,.twm" className="border p-2 mb-4 w-full" />
            <button className="bg-green-500 text-white p-2 w-full" onClick={uploadFile}>
              CSV로 변환 및 다운로드
            </button>
          </>
        )}
      </div>
    </div>
  );
}
