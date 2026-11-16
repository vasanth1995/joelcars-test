import { useEffect, useRef, useState } from 'react';
import { SLIDE_MS } from '../config';

// Photos change automatically every few seconds. Clicking a thumbnail pins that photo
// (auto-change stops) until the visitor presses "Auto-play".
export default function Gallery({ images, title }) {
  const [i, setI] = useState(0);
  const [pinned, setPinned] = useState(false);
  const touchX = useRef(null);
  const n = images.length;

  useEffect(() => {
    if (pinned || n < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), SLIDE_MS);
    return () => clearInterval(t);
  }, [pinned, n]);

  const pick = (idx) => {
    setI(idx);
    setPinned(true);
  };
  const step = (d) => pick((i + d + n) % n);

  if (!n) return <div className="gallery-empty">No photos yet</div>;

  return (
    <div className="gallery">
      <div className="thumbs">
        {images.map((src, idx) => (
          <button key={idx} className={idx === i ? 'on' : ''} onClick={() => pick(idx)} aria-label={`Photo ${idx + 1}`}>
            <img src={src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
      <div
        className="stage"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
        }}
      >
        {images.map((src, idx) => (
          <img key={idx} src={src} alt={`${title} photo ${idx + 1}`} className={idx === i ? 'show' : ''} />
        ))}
        {n > 1 && (
          <>
            <button className="arrow l" onClick={() => step(-1)} aria-label="Previous">
              ‹
            </button>
            <button className="arrow r" onClick={() => step(1)} aria-label="Next">
              ›
            </button>
          </>
        )}
        <div className="stage-foot">
          <span>
            {i + 1} / {n}
          </span>
          {n > 1 && (
            <button onClick={() => setPinned((p) => !p)}>{pinned ? "Play" : "Pause"}</button>
          )}
        </div>
        {!pinned && n > 1 && <div className="progress" key={i} style={{ animationDuration: `${SLIDE_MS}ms` }} />}
      </div>
    </div>
  );
}
