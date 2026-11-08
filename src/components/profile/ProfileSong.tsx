// A member's profile song: YouTube's privacy-mode player (youtube-nocookie.com), built from the video id alone.
// Browsers may block sound that starts by itself; then the visitor presses Play once.
export function ProfileSong({ videoId, name }: { videoId: string; name: string }) {
  // The id is checked to be exactly 11 safe characters before it's saved, so this URL can only point at YouTube.
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&rel=0`;
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs tracking-widest text-muted uppercase">♪ {name}&apos;s song</p>
      <iframe
        src={src}
        title={`${name}'s profile song`}
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        className="aspect-video w-full max-w-sm rounded-lg border border-line"
      />
    </div>
  );
}
