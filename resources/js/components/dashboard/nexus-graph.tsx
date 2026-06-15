import { useEffect, useMemo, useRef, useState } from 'react';

type NodeType = 'note' | 'task' | 'bookmark' | 'hub';

export interface GraphNode {
    id: string;
    type: NodeType;
    label: string;
}

export interface GraphLink {
    source: string;
    target: string;
}

interface SimNode extends GraphNode {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

interface Props {
    nodes: GraphNode[];
    links: GraphLink[];
}

const HEIGHT = 440;

const TYPE_COLOR: Record<NodeType, string> = {
    note: 'var(--note)',
    task: 'var(--task)',
    bookmark: 'var(--mark)',
    hub: 'var(--primary)',
};

// Force-sim tuning — all forces are scaled by alpha so the layout reliably cools.
const REPULSION = 8800;
const HUB_DISTANCE = 165; // hub → item: sets the radius of the radial spread
const LINK_DISTANCE = 82; // item ↔ item: keeps related items clustered
const LINK_STIFFNESS = 0.05;
const GRAVITY = 0.014;
const DAMPING = 0.82;
const ALPHA_DECAY = 0.985;
const ALPHA_MIN = 0.004;
const PADDING = 36;

function prefersReducedMotion() {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function NexusGraph({ nodes, links }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(640);
    const [, setFrame] = useState(0);
    const [hovered, setHovered] = useState<string | null>(null);

    const simNodes = useRef<SimNode[]>([]);
    const alpha = useRef(1);
    const raf = useRef<number | null>(null);

    // Adjacency for hover highlighting.
    const neighbors = useMemo(() => {
        const map = new Map<string, Set<string>>();
        nodes.forEach(n => map.set(n.id, new Set()));
        links.forEach(l => {
            map.get(l.source)?.add(l.target);
            map.get(l.target)?.add(l.source);
        });
        return map;
    }, [nodes, links]);

    // Track container width.
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(entries => {
            const w = entries[0]?.contentRect.width;
            if (w) setWidth(w);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // (Re)build and run the simulation whenever the graph or width changes.
    useEffect(() => {
        const cx = width / 2;
        const cy = HEIGHT / 2;

        // Seed positions deterministically on a ring so layout is stable across reloads.
        simNodes.current = nodes.map((n, i) => {
            if (n.type === 'hub') {
                return { ...n, x: cx, y: cy, vx: 0, vy: 0 };
            }
            const angle = (i / Math.max(1, nodes.length - 1)) * Math.PI * 2;
            const r = Math.min(cx, cy) - PADDING;
            return { ...n, x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, vx: 0, vy: 0 };
        });

        function tick(a: number) {
            const ns = simNodes.current;

            // Many-body repulsion.
            for (let i = 0; i < ns.length; i++) {
                for (let j = i + 1; j < ns.length; j++) {
                    let dx = ns[i].x - ns[j].x;
                    let dy = ns[i].y - ns[j].y;
                    let dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    const force = (REPULSION / (dist * dist)) * a;
                    const nx = (dx / dist) * force;
                    const ny = (dy / dist) * force;
                    ns[i].vx += nx; ns[i].vy += ny;
                    ns[j].vx -= nx; ns[j].vy -= ny;
                }
            }

            // Link springs.
            const byId = new Map(ns.map(n => [n.id, n]));
            for (const l of links) {
                const s = byId.get(l.source);
                const t = byId.get(l.target);
                if (!s || !t) continue;
                const dx = t.x - s.x;
                const dy = t.y - s.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const target = l.source === 'hub' || l.target === 'hub' ? HUB_DISTANCE : LINK_DISTANCE;
                const diff = ((dist - target) / dist) * LINK_STIFFNESS * a;
                s.vx += dx * diff; s.vy += dy * diff;
                t.vx -= dx * diff; t.vy -= dy * diff;
            }

            // Gravity toward center + integrate.
            for (const n of ns) {
                if (n.type === 'hub') {
                    n.x = cx; n.y = cy; n.vx = 0; n.vy = 0;
                    continue;
                }
                n.vx += (cx - n.x) * GRAVITY * a;
                n.vy += (cy - n.y) * GRAVITY * a;
                n.vx *= DAMPING; n.vy *= DAMPING;
                n.x += n.vx; n.y += n.vy;
                n.x = Math.max(PADDING, Math.min(width - PADDING, n.x));
                n.y = Math.max(PADDING, Math.min(HEIGHT - PADDING, n.y));
            }
        }

        if (prefersReducedMotion()) {
            for (let i = 0; i < 400; i++) tick(Math.max(ALPHA_MIN, Math.pow(ALPHA_DECAY, i)));
            setFrame(f => f + 1);
            return;
        }

        alpha.current = 1;
        const loop = () => {
            tick(alpha.current);
            alpha.current *= ALPHA_DECAY;
            setFrame(f => f + 1);
            if (alpha.current > ALPHA_MIN) {
                raf.current = requestAnimationFrame(loop);
            }
        };
        raf.current = requestAnimationFrame(loop);

        return () => {
            if (raf.current) cancelAnimationFrame(raf.current);
        };
    }, [nodes, links, width]);

    const ns = simNodes.current;
    const byId = new Map(ns.map(n => [n.id, n]));
    const active = hovered ? neighbors.get(hovered) ?? new Set<string>() : null;

    function nodeOpacity(id: string) {
        if (!active) return 1;
        return id === hovered || active.has(id) ? 1 : 0.18;
    }

    function linkOpacity(l: GraphLink) {
        if (!hovered) return 0.5;
        return l.source === hovered || l.target === hovered ? 0.9 : 0.08;
    }

    return (
        <div ref={containerRef} className="w-full" style={{ height: HEIGHT }}>
            <svg width={width} height={HEIGHT} className="overflow-visible">
                {/* Links */}
                {links.map((l, i) => {
                    const s = byId.get(l.source);
                    const t = byId.get(l.target);
                    if (!s || !t) return null;
                    return (
                        <line
                            key={i}
                            x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                            style={{ stroke: 'var(--line)' }}
                            strokeWidth={1.25}
                            strokeOpacity={linkOpacity(l)}
                            className="transition-opacity duration-150"
                        />
                    );
                })}

                {/* Nodes */}
                {ns.map(n => {
                    const color = TYPE_COLOR[n.type];
                    const isHub = n.type === 'hub';
                    const opacity = nodeOpacity(n.id);
                    return (
                        <g
                            key={n.id}
                            transform={`translate(${n.x}, ${n.y})`}
                            opacity={opacity}
                            className="cursor-pointer transition-opacity duration-150"
                            onMouseEnter={() => setHovered(n.id)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            {/* glow / halo */}
                            <circle r={isHub ? 18 : 11} style={{ fill: color }} opacity={0.14} />
                            {/* ring */}
                            <circle
                                r={isHub ? 11 : 7}
                                style={{ fill: 'var(--surface)', stroke: color }}
                                strokeWidth={2}
                            />
                            {/* core */}
                            <circle r={isHub ? 5 : 3.5} style={{ fill: color }} />

                            {n.label && (
                                <text
                                    y={22}
                                    textAnchor="middle"
                                    className="pointer-events-none select-none font-mono"
                                    style={{ fill: 'var(--faint)', fontSize: 11 }}
                                >
                                    {n.label}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
