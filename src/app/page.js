import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass p-10 max-w-2xl w-full flex flex-col items-center text-center gap-6">
        <div className="emoji-placeholder mb-2">🐍😇</div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Snake Game by AI Angels
        </h1>
        <p className="text-lg text-foreground/80">
          Welcome to the AI Angels Snake Game! Guide your snake to eat the food,
          grow longer, and achieve the highest score you can. Avoid running into
          the walls or yourself!
        </p>
        <div className="controls-info text-md text-foreground/80 bg-white/40 rounded-lg p-4 shadow-sm">
          <strong>Controls:</strong>
          <br />
          <span className="controls-keys font-semibold">Arrow keys</span> or{" "}
          <span className="controls-keys font-semibold">WASD</span> to move the
          snake.
          <br />
          <span className="controls-tip">
            Press any key after a game over to restart.
          </span>
        </div>
        <p className="text-md text-foreground/80">
          Click the button below to launch and play the game in your browser!
        </p>
        <Link href="/snake">
          <button className="mt-4 px-6 py-3 rounded-lg bg-foreground text-background font-bold text-lg shadow-lg hover:bg-opacity-80 transition">
            Play Snake Game
          </button>
        </Link>
      </div>
    </div>
  );
}
