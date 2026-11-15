export default function SoldMarquee({ items }) {
  if (!items?.length) return null;
  // Repeat so the loop is seamless even with only a few photos.
  const reps = Math.max(2, Math.ceil(12 / items.length));
  const row = Array.from({ length: reps }, () => items).flat();
  const secs = Math.max(20, row.length * 4);
  return (
    <div className="marquee">
      <div className="marquee-track" style={{ animationDuration: `${secs}s` }}>
        {[...row, ...row].map((s, i) => (
          <figure key={i} className="sold-item">
            <img src={s.image_url} alt={s.caption || 'Sold car'} loading="lazy" />
            <span className="sold-tag">SOLD</span>
            {s.caption && <figcaption>{s.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </div>
  );
}
