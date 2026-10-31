import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SectorData {
  name: string;
  value: number; // Market Cap Weight
  change: number; // % change
  pe: number;
}

const sectorHierarchy: SectorData[] = [
  { name: 'Financial Services', value: 38, change: 1.45, pe: 21.4 },
  { name: 'Information Technology', value: 26, change: 2.10, pe: 28.6 },
  { name: 'Oil, Gas & Consumable', value: 14, change: -0.65, pe: 14.2 },
  { name: 'Fast Moving Consumer Goods', value: 12, change: 0.35, pe: 38.1 },
  { name: 'Automobile', value: 8, change: 1.82, pe: 26.5 },
  { name: 'Healthcare & Pharma', value: 7, change: -0.40, pe: 31.2 },
  { name: 'Metals & Mining', value: 6, change: -1.20, pe: 11.5 },
  { name: 'Construction & Capital Goods', value: 6, change: 1.15, pe: 35.4 },
  { name: 'Power & Utilities', value: 5, change: 0.85, pe: 19.8 },
  { name: 'Telecommunication', value: 4, change: 0.50, pe: 45.0 }
];

export default function SectorHeatmap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous SVG
    d3.select(containerRef.current).selectAll('*').remove();

    const width = containerRef.current.clientWidth || 800;
    const height = 450;

    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%')
      .style('font-family', 'inherit');

    // Create hierarchical data structure for treemap
    const root = d3.hierarchy({ children: sectorHierarchy } as any)
      .sum((d: any) => d.value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const treemap = d3.treemap<any>()
      .size([width, height])
      .padding(4)
      .round(true);

    treemap(root);

    // Color scale based on % change
    const colorScale = d3.scaleLinear<string>()
      .domain([-1.5, 0, 1.5])
      .range(['#f43f5e', '#1e1b4b', '#10b981']);

    const tooltip = d3.select(containerRef.current)
      .append('div')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', '#070514')
      .style('border', '1px solid #8b5cf6')
      .style('border-radius', '12px')
      .style('padding', '10px 14px')
      .style('color', '#fff')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '50')
      .style('box-shadow', '0 10px 25px rgba(0,0,0,0.5)');

    const node = svg.selectAll('g')
      .data(root.leaves())
      .enter()
      .append('g')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`);

    node.append('rect')
      .attr('id', (d: any) => `rect-${d.data.name}`)
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('rx', 12)
      .attr('ry', 12)
      .attr('fill', (d: any) => colorScale(d.data.change))
      .attr('stroke', '#1e1b4b')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', (event, d: any) => {
        d3.select(event.currentTarget as SVGElement).attr('stroke', '#fbbf24').attr('stroke-width', 3);
        tooltip.style('visibility', 'visible')
          .html(`
            <strong>${d.data.name}</strong><br/>
            Weight: ${d.data.value}% of Nifty 50<br/>
            Change: <span style="color: ${d.data.change >= 0 ? '#34d399' : '#f87171'}">${d.data.change >= 0 ? '+' : ''}${d.data.change}%</span><br/>
            P/E Ratio: ${d.data.pe}
          `);
      })
      .on('mousemove', (event) => {
        const [x, y] = d3.pointer(event, containerRef.current);
        tooltip.style('top', `${y - 70}px`).style('left', `${x + 15}px`);
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget as SVGElement).attr('stroke', '#1e1b4b').attr('stroke-width', 2);
        tooltip.style('visibility', 'hidden');
      });

    // Sector Name
    node.append('text')
      .attr('x', 12)
      .attr('y', 22)
      .text((d: any) => (d.x1 - d.x0 > 90 && d.y1 - d.y0 > 50 ? d.data.name : ''))
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .attr('fill', '#ffffff')
      .style('pointer-events', 'none');

    // Percentage Change
    node.append('text')
      .attr('x', 12)
      .attr('y', 42)
      .text((d: any) => (d.x1 - d.x0 > 90 && d.y1 - d.y0 > 50 ? `${d.data.change >= 0 ? '+' : ''}${d.data.change}%` : ''))
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', (d: any) => d.data.change >= 0 ? '#34d399' : '#f87171')
      .style('pointer-events', 'none');

  }, []);

  return (
    <div className="bg-[#0c081e] border border-violet-900/40 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Nifty 50 Sector Performance Heatmap</h2>
          <p className="text-xs text-slate-400 mt-1">Real-time sector weight and performance treemap rendered with D3.js</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Positive</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500 inline-block" /> Negative</div>
        </div>
      </div>
      <div ref={containerRef} className="w-full h-[450px] relative" />
    </div>
  );
}
