export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">✅ Tailwind Working!</h1>
        <p className="text-xl text-gray-600 mb-6">If you see colors and styling, everything is perfect! 🎉</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-red-500 h-20 rounded-lg"></div>
          <div className="bg-green-500 h-20 rounded-lg"></div>
          <div className="bg-blue-500 h-20 rounded-lg"></div>
        </div>

        <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition font-bold text-lg w-full shadow-lg hover:shadow-xl">
          Click Me - Hover Effect Test
        </button>

        <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
          <p className="text-yellow-800 font-semibold">⚠️ If this looks styled, Tailwind is 100% working!</p>
        </div>
      </div>
    </div>
  );
}