export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
      <h1
        className="  text-6xl 
                    font-bold 
                    text-red-500 
                    cursor-pointer
                    transition-transform 
                    duration-300 
                    origin-center
                    hover:scale-150"
      >
        404
      </h1>
      <p className="taxt-gray-400 mt-4">This page does not exist.</p>
    </div>
  );
}
