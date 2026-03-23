export default function Toast({ message }) {
  return (
    <div className="fixed top-20 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in">
      {message}
    </div>
  );
}