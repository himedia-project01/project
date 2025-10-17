import './App.css';
import NavMenu from './pages/navMenu';
function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow">
        <div className="text-2xl font-bold text-red-600">우리들의 게시판</div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="인기 검색어"
            className="border px-3 py-1 rounded-l-lg"
          />
          <button className="bg-red-600 text-white px-3 rounded-r-lg">검색</button>
        </div>
      </header>

      <NavMenu />

      <main className="p-10 text-center text-gray-600">
        <h2 className="text-xl font-semibold">메인 콘텐츠 영역</h2>
      </main>
    </div>
  );
}

export default App;