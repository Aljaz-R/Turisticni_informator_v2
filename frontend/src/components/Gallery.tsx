import { useState } from "react";

export function Gallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  if (!images?.length) return null;
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        src={images[active]}
        alt=""
        style={{ width: "100%", maxHeight: 480, objectFit: "cover", borderRadius: 8 }}
      />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              border: i === active ? "2px solid #333" : "1px solid #ccc",
              padding: 0,
              borderRadius: 6,
              background: "transparent",
              cursor: "pointer"
            }}
            aria-label={`Slika ${i + 1}`}
          >
            <img
              src={src}
              alt=""
              width={100}
              height={70}
              style={{ objectFit: "cover", borderRadius: 6, display: "block" }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
