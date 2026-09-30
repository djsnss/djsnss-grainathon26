import React from 'react';

export default function Screw({ x = 0, y = 0, size = 10, rotation = 45 }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Outer screw head rim */}
      <circle r={size / 2} fill="url(#screwGradient)" stroke="#8b7335" strokeWidth="0.8" />
      {/* Inner shadow bevel */}
      <circle r={size / 2 - 1} fill="none" stroke="#3d3012" strokeWidth="0.5" opacity="0.6" />
      {/* Screw slot line */}
      <line
        x1={-(size / 3)}
        y1="0"
        x2={size / 3}
        y2="0"
        stroke="#231b0a"
        strokeWidth="1.2"
        strokeLinecap="round"
        transform={`rotate(${rotation})`}
      />
    </g>
  );
}

export function ScrewDefs() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <radialGradient id="screwGradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ebd287" />
          <stop offset="50%" stopColor="#c9a24b" />
          <stop offset="100%" stopColor="#7a5f22" />
        </radialGradient>
      </defs>
    </svg>
  );
}
