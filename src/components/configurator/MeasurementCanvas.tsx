import React, { useState } from 'react';
import { CustomDesignConfig } from '../../types';
import { Eye, Layers, Compass, Maximize2 } from 'lucide-react';

interface MeasurementCanvasProps {
  config: CustomDesignConfig;
}

export const MeasurementCanvas: React.FC<MeasurementCanvasProps> = ({ config }) => {
  const [viewMode, setViewMode] = useState<'cad2d' | 'iso3d' | 'rotation360'>('cad2d');
  const [rotationAngle, setRotationAngle] = useState<number>(0);

  const {
    shape,
    widthMm,
    heightMm,
    thicknessMm,
    centerArchMm = 0,
    holeCount = 0,
    holeDiameterMm = 20,
    customColorTint = 'clear',
  } = config;

  // ViewBox coordinates and scale
  const viewBoxWidth = 600;
  const viewBoxHeight = 440;
  const padding = 70;

  // Calculate scaled glass dimension inside viewport
  const maxAvailW = viewBoxWidth - padding * 2;
  const maxAvailH = viewBoxHeight - padding * 2;

  const aspectRatio = widthMm / (heightMm || 1);
  let glassW = maxAvailW;
  let glassH = maxAvailW / aspectRatio;

  if (glassH > maxAvailH) {
    glassH = maxAvailH;
    glassW = maxAvailH * aspectRatio;
  }

  // Ensure minimum rendering size
  glassW = Math.max(glassW, 140);
  glassH = Math.max(glassH, 140);

  const glassX = (viewBoxWidth - glassW) / 2;
  const glassY = (viewBoxHeight - glassH) / 2;

  // Glass tint styling
  const tintFillMap: Record<string, string> = {
    clear: 'url(#glassClearGrad)',
    extra_clear: 'url(#glassExtraClearGrad)',
    bronze: 'url(#glassBronzeGrad)',
    smoke: 'url(#glassSmokeGrad)',
    frosted: 'url(#glassFrostedGrad)',
  };

  const currentGlassFill = tintFillMap[customColorTint] || tintFillMap.clear;

  // Generate SVG path based on selected shape
  const getGlassPath = (): string => {
    switch (shape) {
      case 'oval': {
        const rx = glassW / 2;
        const ry = glassH / 2;
        const cx = glassX + rx;
        const cy = glassY + ry;
        return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
      }
      case 'curved': {
        const archOffset = Math.min((centerArchMm / Math.max(widthMm, 1)) * glassW * 1.5, glassH * 0.35);
        return `M ${glassX} ${glassY + archOffset} 
                Q ${glassX + glassW / 2} ${glassY - archOffset} ${glassX + glassW} ${glassY + archOffset} 
                L ${glassX + glassW} ${glassY + glassH} 
                Q ${glassX + glassW / 2} ${glassY + glassH - archOffset * 0.5} ${glassX} ${glassY + glassH} Z`;
      }
      case 'perforated':
      case 'lasercut':
      case 'rectangle':
      case 'square':
      default:
        return `M ${glassX} ${glassY} L ${glassX + glassW} ${glassY} L ${glassX + glassW} ${glassY + glassH} L ${glassX} ${glassY + glassH} Z`;
    }
  };

  // Generate holes
  const renderHoles = () => {
    if (!holeCount || holeCount <= 0) return null;
    const holes: { cx: number; cy: number }[] = [];
    const insetX = Math.min(glassW * 0.15, 30);
    const insetY = Math.min(glassH * 0.15, 30);

    if (holeCount === 1) {
      holes.push({ cx: glassX + glassW / 2, cy: glassY + glassH / 2 });
    } else if (holeCount === 2) {
      holes.push({ cx: glassX + insetX, cy: glassY + glassH / 2 });
      holes.push({ cx: glassX + glassW - insetX, cy: glassY + glassH / 2 });
    } else if (holeCount >= 4) {
      holes.push({ cx: glassX + insetX, cy: glassY + insetY });
      holes.push({ cx: glassX + glassW - insetX, cy: glassY + insetY });
      holes.push({ cx: glassX + insetX, cy: glassY + glassH - insetY });
      holes.push({ cx: glassX + glassW - insetX, cy: glassY + glassH - insetY });
    }

    const holeRadius = Math.max((holeDiameterMm / 40) * 10, 6);

    return holes.map((h, i) => (
      <g key={i}>
        <circle cx={h.cx} cy={h.cy} r={holeRadius} fill="#ffffff" stroke="#C58B38" strokeWidth="1.5" />
        {/* Center Crosshairs */}
        <line x1={h.cx - holeRadius - 3} y1={h.cy} x2={h.cx + holeRadius + 3} y2={h.cy} stroke="#C58B38" strokeWidth="0.75" strokeDasharray="2,2" />
        <line x1={h.cx} y1={h.cy - holeRadius - 3} x2={h.cx} y2={h.cy + holeRadius + 3} stroke="#C58B38" strokeWidth="0.75" strokeDasharray="2,2" />
        {/* Hole Label */}
        {i === 0 && (
          <text x={h.cx + holeRadius + 6} y={h.cy + 4} fill="#C58B38" fontSize="10" fontFamily="Space Grotesk, monospace" fontWeight="600">
            Ø{holeDiameterMm}mm
          </text>
        )}
      </g>
    ));
  };

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs relative">
      {/* Visualizer Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#C58B38] animate-pulse"></div>
          <span className="text-xs font-semibold text-gray-800 tracking-wider uppercase">
            Ölçülü Teknik Çizim (CAD View)
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-[#C58B38] border border-amber-200 font-medium">
            Tolerans: ±0.5 mm
          </span>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center bg-white p-0.5 rounded-lg border border-gray-200 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode('cad2d')}
            className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'cad2d'
                ? 'bg-[#C58B38] text-white font-bold shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            2D CAD
          </button>
          <button
            type="button"
            onClick={() => setViewMode('iso3d')}
            className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'iso3d'
                ? 'bg-[#C58B38] text-white font-bold shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            3D İzometrik
          </button>
          <button
            type="button"
            onClick={() => setViewMode('rotation360')}
            className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'rotation360'
                ? 'bg-[#C58B38] text-white font-bold shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            360° Rotasyon
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full aspect-[4/3] bg-[#fafafa] flex items-center justify-center p-4 overflow-hidden select-none border-b border-gray-200">
        {/* Interactive 360 rotation slider if active */}
        {viewMode === 'rotation360' && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 border border-gray-200 px-4 py-2 rounded-xl flex items-center gap-3 shadow-md">
            <span className="text-xs text-gray-700 font-medium">Rotasyon:</span>
            <input
              type="range"
              min="0"
              max="360"
              value={rotationAngle}
              onChange={(e) => setRotationAngle(Number(e.target.value))}
              className="accent-[#C58B38] cursor-pointer w-32"
            />
            <span className="text-xs font-mono font-bold text-[#C58B38] w-8">{rotationAngle}°</span>
          </div>
        )}

        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-full max-h-[460px] transition-transform duration-200"
          style={{
            transform:
              viewMode === 'iso3d'
                ? 'rotateX(50deg) rotateZ(-30deg) scale(0.95)'
                : viewMode === 'rotation360'
                ? `rotateY(${rotationAngle}deg)`
                : 'none',
          }}
        >
          <defs>
            {/* Background Grid Pattern */}
            <pattern id="cadGridSmall" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.75" />
            </pattern>
            <pattern id="cadGridLarge" width="75" height="75" patternUnits="userSpaceOnUse">
              <rect width="75" height="75" fill="url(#cadGridSmall)" />
              <path d="M 75 0 L 0 0 0 75" fill="none" stroke="#d1d5db" strokeWidth="1.2" />
            </pattern>

            {/* Glass Color Gradients */}
            <linearGradient id="glassClearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#f3f4f6" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0.85" />
            </linearGradient>

            <linearGradient id="glassExtraClearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.85" />
            </linearGradient>

            <linearGradient id="glassBronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0.45" />
            </linearGradient>

            <linearGradient id="glassSmokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.5" />
            </linearGradient>

            <linearGradient id="glassFrostedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.8" />
            </linearGradient>

            {/* Dimension Line Arrows */}
            <marker id="cadArrowStart" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 10 1 L 2 5 L 10 9 z" fill="#C58B38" />
            </marker>
            <marker id="cadArrowEnd" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#C58B38" />
            </marker>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="url(#cadGridLarge)" />

          {/* Isometric 3D Thickness extrusion layer if iso3d mode */}
          {viewMode === 'iso3d' && (
            <g transform={`translate(${thicknessMm * 0.4}, ${thicknessMm * 0.4})`}>
              <path
                d={getGlassPath()}
                fill="#cbd5e1"
                stroke="#94a3b8"
                strokeWidth="1.5"
                opacity="0.6"
              />
            </g>
          )}

          {/* Main Glass Body */}
          <path
            d={getGlassPath()}
            fill={currentGlassFill}
            stroke="#C58B38"
            strokeWidth="2"
            filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.08))"
          />

          {/* Chamfered / Polished Edge specular line */}
          <path
            d={getGlassPath()}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
            strokeOpacity="0.8"
            transform="scale(0.99) translate(3, 2)"
          />

          {/* Render drilled holes if specified */}
          {renderHoles()}

          {/* ============================================================== */}
          {/* CAD DIMENSIONS AND ANNOTATIONS                                 */}
          {/* ============================================================== */}

          {/* 1. TOP HORIZONTAL DIMENSION (GENİŞLİK / WIDTH) */}
          <g className="cad-dimension-horizontal">
            {/* Extension lines */}
            <line x1={glassX} y1={glassY} x2={glassX} y2={glassY - 35} stroke="#C58B38" strokeWidth="0.8" strokeDasharray="3,2" />
            <line x1={glassX + glassW} y1={glassY} x2={glassX + glassW} y2={glassY - 35} stroke="#C58B38" strokeWidth="0.8" strokeDasharray="3,2" />

            {/* Main Dimension Arrow line */}
            <line
              x1={glassX + 6}
              y1={glassY - 26}
              x2={glassX + glassW - 6}
              y2={glassY - 26}
              stroke="#C58B38"
              strokeWidth="1.2"
              markerStart="url(#cadArrowStart)"
              markerEnd="url(#cadArrowEnd)"
            />

            {/* Dimension Text Box */}
            <rect
              x={glassX + glassW / 2 - 45}
              y={glassY - 37}
              width="90"
              height="20"
              rx="4"
              fill="#ffffff"
              stroke="#C58B38"
              strokeWidth="1"
            />
            <text
              x={glassX + glassW / 2}
              y={glassY - 23}
              fill="#1e293b"
              fontSize="11"
              fontWeight="700"
              textAnchor="middle"
              fontFamily="Space Grotesk, monospace"
            >
              {widthMm} mm
            </text>
          </g>

          {/* 2. RIGHT VERTICAL DIMENSION (YÜKSEKLİK / HEIGHT) */}
          <g className="cad-dimension-vertical">
            {/* Extension lines */}
            <line x1={glassX + glassW} y1={glassY} x2={glassX + glassW + 35} y2={glassY} stroke="#C58B38" strokeWidth="0.8" strokeDasharray="3,2" />
            <line x1={glassX + glassW} y1={glassY + glassH} x2={glassX + glassW + 35} y2={glassY + glassH} stroke="#C58B38" strokeWidth="0.8" strokeDasharray="3,2" />

            {/* Main Dimension Arrow line */}
            <line
              x1={glassX + glassW + 26}
              y1={glassY + 6}
              x2={glassX + glassW + 26}
              y2={glassY + glassH - 6}
              stroke="#C58B38"
              strokeWidth="1.2"
              markerStart="url(#cadArrowStart)"
              markerEnd="url(#cadArrowEnd)"
            />

            {/* Dimension Text Box */}
            <rect
              x={glassX + glassW + 15}
              y={glassY + glassH / 2 - 10}
              width="80"
              height="20"
              rx="4"
              fill="#ffffff"
              stroke="#C58B38"
              strokeWidth="1"
            />
            <text
              x={glassX + glassW + 55}
              y={glassY + glassH / 2 + 4}
              fill="#1e293b"
              fontSize="11"
              fontWeight="700"
              textAnchor="middle"
              fontFamily="Space Grotesk, monospace"
            >
              {heightMm} mm
            </text>
          </g>

          {/* 3. CENTER ARCH (ORTA BOMBE) INDICATION IF APPLICABLE */}
          {shape === 'curved' && centerArchMm > 0 && (
            <g className="cad-dimension-arch">
              <line
                x1={glassX + glassW / 2}
                y1={glassY}
                x2={glassX + glassW / 2}
                y2={glassY - 20}
                stroke="#d97706"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <text
                x={glassX + glassW / 2}
                y={glassY - 5}
                fill="#b45309"
                fontSize="10"
                fontFamily="Space Grotesk, monospace"
                fontWeight="600"
                textAnchor="middle"
              >
                Bombe: {centerArchMm}mm
              </text>
            </g>
          )}

          {/* 4. CORNER TECHNICAL SPEC BADGE (BOTTOM LEFT) */}
          <g transform={`translate(${glassX + 10}, ${glassY + glassH - 26})`}>
            <rect width="115" height="18" rx="3" fill="#ffffff" fillOpacity="0.9" stroke="#e2e8f0" strokeWidth="0.8" />
            <text x="6" y="12" fill="#475569" fontSize="9" fontFamily="Space Grotesk, monospace" fontWeight="600">
              t = {thicknessMm} mm • {config.edgeFinish.toUpperCase()}
            </text>
          </g>
        </svg>

        {/* Floating Quick Summary Chip */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 items-end pointer-events-none">
          <div className="bg-white/95 border border-gray-200 text-gray-800 px-3 py-1.5 rounded-lg shadow-sm text-xs font-mono backdrop-blur-md">
            <span className="text-gray-500">Alan:</span> {(config.calculatedAreaM2 || 0).toFixed(2)} m²
            <span className="mx-1.5 text-gray-300">|</span>
            <span className="text-gray-500">Ağırlık:</span> {(config.calculatedWeightKg || 0).toFixed(1)} kg
          </div>
        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-gray-50 text-[11px] text-gray-500">
        <div className="flex items-center gap-2">
          <Maximize2 className="w-3.5 h-3.5 text-[#C58B38]" />
          <span>Gerçek ölçeklendirme orantılı vektör motoru ile gösterilmektedir.</span>
        </div>
        <div className="font-mono text-[#C58B38] font-medium">
          EN 12150 & EN 1364 Üretim Kriteri
        </div>
      </div>
    </div>
  );
};
