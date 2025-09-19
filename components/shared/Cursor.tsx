"use client";

export const Cursor = () => {
  return (
    <span
      className="inline-block w-2.5 h-5 ml-0.5 bg-[#00FF41]"
      style={{
        animation: "blink 2s step-start infinite",
      }}
    >
      <style jsx>{`
        @keyframes blink {
          0%,
          50%,
          100% {
            opacity: 1;
          }
          25%,
          75% {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
};
