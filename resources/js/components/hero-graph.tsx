// Shared decorative animation used by the marketing welcome page and the auth
// layout: a self-contained SVG where edges draw in, nodes pop and float, and the
// central hub pulses. Purely presentational — it mirrors the dashboard graph.

type HeroNode = {
    id: string;
    x: number;
    y: number;
    color: string;
    r: number;
    label?: string;
};

const HUB: HeroNode = { id: 'hub', x: 300, y: 210, color: '#3b82f6', r: 17 };

const SATELLITES: HeroNode[] = [
    { id: 'n1', x: 130, y: 90, color: '#60a5fa', r: 10, label: 'Notes' },
    { id: 'n2', x: 480, y: 95, color: '#fbbf24', r: 10, label: 'Tasks' },
    { id: 'n3', x: 500, y: 300, color: '#a78bfa', r: 10, label: 'Marks' },
    { id: 'n4', x: 110, y: 320, color: '#60a5fa', r: 9 },
    { id: 'n5', x: 300, y: 360, color: '#fbbf24', r: 8 },
    { id: 'n6', x: 210, y: 200, color: '#a78bfa', r: 7 },
    { id: 'n7', x: 400, y: 200, color: '#60a5fa', r: 7 },
];

const CROSS_LINKS: [string, string][] = [
    ['n1', 'n6'],
    ['n7', 'n2'],
    ['n4', 'n5'],
];

export function HeroGraph({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 600 420"
            className={className ?? 'w-full'}
            role="img"
            aria-label="An animated graph connecting notes, tasks and bookmarks"
        >
            {/* Edges hub → satellites */}
            {SATELLITES.map((n, i) => {
                const len = Math.hypot(n.x - HUB.x, n.y - HUB.y);

                return (
                    <line
                        key={`e-${n.id}`}
                        x1={HUB.x}
                        y1={HUB.y}
                        x2={n.x}
                        y2={n.y}
                        stroke={n.color}
                        strokeOpacity={0.35}
                        strokeWidth={1.4}
                        strokeDasharray={len}
                        strokeDashoffset={len}
                        style={{
                            animation: `nx-draw 0.8s ease-out ${0.5 + i * 0.12}s forwards`,
                        }}
                    />
                );
            })}

            {/* Cross links for texture */}
            {CROSS_LINKS.map(([a, b], i) => {
                const s = SATELLITES.find((n) => n.id === a)!;

                const t = SATELLITES.find((n) => n.id === b)!;

                const len = Math.hypot(t.x - s.x, t.y - s.y);

                return (
                    <line
                        key={`c-${i}`}
                        x1={s.x}
                        y1={s.y}
                        x2={t.x}
                        y2={t.y}
                        stroke="#94a3b8"
                        strokeOpacity={0.18}
                        strokeWidth={1}
                        strokeDasharray={len}
                        strokeDashoffset={len}
                        style={{
                            animation: `nx-draw 0.8s ease-out ${1.1 + i * 0.12}s forwards`,
                        }}
                    />
                );
            })}

            {/* Satellites */}
            {SATELLITES.map((n, i) => (
                <g
                    key={n.id}
                    style={{
                        animation: `nx-pop 0.5s cubic-bezier(.34,1.56,.64,1) ${0.7 + i * 0.12}s both`,
                    }}
                >
                    <g
                        style={{
                            animation: `nx-float ${5 + (i % 3)}s ease-in-out ${i * 0.3}s infinite`,
                            transformOrigin: `${n.x}px ${n.y}px`,
                        }}
                    >
                        <circle
                            cx={n.x}
                            cy={n.y}
                            r={n.r + 8}
                            fill={n.color}
                            opacity={0.12}
                        />
                        <circle
                            cx={n.x}
                            cy={n.y}
                            r={n.r}
                            fill="#0b1120"
                            stroke={n.color}
                            strokeWidth={2.2}
                        />
                        <circle
                            cx={n.x}
                            cy={n.y}
                            r={n.r / 2.6}
                            fill={n.color}
                        />
                        {n.label && (
                            <text
                                x={n.x}
                                y={n.y - n.r - 9}
                                textAnchor="middle"
                                fill="#cbd5e1"
                                fontSize={12}
                                className="font-mono"
                            >
                                {n.label}
                            </text>
                        )}
                    </g>
                </g>
            ))}

            {/* Hub */}
            <g
                style={{
                    animation:
                        'nx-pop 0.6s cubic-bezier(.34,1.56,.64,1) 0.3s both',
                }}
            >
                <circle
                    cx={HUB.x}
                    cy={HUB.y}
                    r={HUB.r + 14}
                    fill={HUB.color}
                    opacity={0.18}
                    style={{
                        animation: 'nx-pulse 3s ease-in-out infinite',
                        transformOrigin: `${HUB.x}px ${HUB.y}px`,
                    }}
                />
                <circle
                    cx={HUB.x}
                    cy={HUB.y}
                    r={HUB.r}
                    fill="#0b1120"
                    stroke={HUB.color}
                    strokeWidth={3}
                />
                <circle cx={HUB.x} cy={HUB.y} r={HUB.r / 2.4} fill="#bfdbfe" />
            </g>
        </svg>
    );
}

export const heroKeyframes = `
@keyframes nx-fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes nx-draw { to { stroke-dashoffset: 0; } }
@keyframes nx-pop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }
@keyframes nx-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
@keyframes nx-pulse { 0%, 100% { transform: scale(1); opacity: 0.18; } 50% { transform: scale(1.18); opacity: 0.3; } }
@keyframes nx-drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -20px); } }
@media (prefers-reduced-motion: reduce) {
  [style*="nx-fade-up"], [style*="nx-pop"], [style*="nx-draw"], [style*="nx-float"], [style*="nx-pulse"], [style*="nx-drift"] {
    animation: none !important;
    opacity: 1 !important;
    stroke-dashoffset: 0 !important;
    transform: none !important;
  }
}
`;
