import React, { useState } from 'react';
import { Building2, Grid, PaintBucket, Maximize2, Ruler, FilePlus2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { CalculationRecord } from '../types/domain';

interface ArchitectureModuleProps {
  onSaveRecord: (record: CalculationRecord) => void;
}

type ArchSubTab = 'urbanismo' | 'paginacao' | 'pintura_gesso' | 'ambientes' | 'conversoes';

export const ArchitectureModule: React.FC<ArchitectureModuleProps> = ({ onSaveRecord }) => {
  const [activeSubTab, setActiveSubTab] = useState<ArchSubTab>('urbanismo');

  // 1. Índices Urbanísticos e Áreas (TO, CA, IP, Área construída, útil, cobertura, fachada)
  const [lotFront, setLotFront] = useState<number>(15);
  const [lotDepth, setLotDepth] = useState<number>(40);
  const [projArea, setProjArea] = useState<number>(330);
  const [floorsCount, setFloorsCount] = useState<number>(5);
  const [nonComputableArea, setNonComputableArea] = useState<number>(180);
  const [wallThicknessPct, setWallThicknessPct] = useState<number>(12);
  const [permeableArea, setPermeableArea] = useState<number>(135);
  const [roofEaveOverhang, setRoofEaveOverhang] = useState<number>(0.8);
  const [facadePerimeter, setFacadePerimeter] = useState<number>(76);
  const [facadeTotalHeight, setFacadeTotalHeight] = useState<number>(15.5);
  const [maxAllowedTO, setMaxAllowedTO] = useState<number>(60);
  const [maxAllowedCA, setMaxAllowedCA] = useState<number>(3.0);
  const [minAllowedIP, setMinAllowedIP] = useState<number>(20);

  // 2. Paginação, Pisos, Porcelanato, Cerâmica, Revestimentos e Rodapé
  const [roomWidth, setRoomWidth] = useState<number>(6.5);
  const [roomLength, setRoomLength] = useState<number>(8.0);
  const [wallTilingHeight, setWallTilingHeight] = useState<number>(2.6);
  const [openingsDeductionArea, setOpeningsDeductionArea] = useState<number>(5.4);
  const [doorsWidthSum, setDoorsWidthSum] = useState<number>(2.4);
  const [tileType, setTileType] = useState<'Porcelanato Retificado' | 'Cerâmica Esmaltada'>('Porcelanato Retificado');
  const [tileWidthCm, setTileWidthCm] = useState<number>(90);
  const [tileLengthCm, setTileLengthCm] = useState<number>(90);
  const [tileThicknessMm, setTileThicknessMm] = useState<number>(9.5);
  const [jointMm, setJointMm] = useState<number>(2.0);
  const [paginationDirection, setPaginationDirection] = useState<'reta' | 'diagonal'>('reta');

  // 3. Pintura, Forro e Gesso
  const [paintWallArea, setPaintWallArea] = useState<number>(185);
  const [paintCeilingArea, setPaintCeilingArea] = useState<number>(68);
  const [paintCoats, setPaintCoats] = useState<number>(3);
  const [paintYieldM2PerL, setPaintYieldM2PerL] = useState<number>(12);
  const [gypsumBoardType, setGypsumBoardType] = useState<'ST (Standard)' | 'RU (Resistente à Umidade)' | 'RF (Resistente ao Fogo)'>('ST (Standard)');

  // 4. Estudos Preliminares & Dimensionamento de Ambientes (NBR 15575 / Código de Obras)
  const [roomCategory, setRoomCategory] = useState<'permanencia_prolongada' | 'permanencia_transitoria' | 'banheiro_acessivel'>('permanencia_prolongada');
  const [studyWidth, setStudyWidth] = useState<number>(3.2);
  const [studyLength, setStudyLength] = useState<number>(4.0);
  const [studyCeilingHeight, setStudyCeilingHeight] = useState<number>(2.7);
  const [actualWindowArea, setActualWindowArea] = useState<number>(2.4);
  const [actualVentArea, setActualVentArea] = useState<number>(1.2);

  // 5. Conversões Arquitetônicas e Escala de Desenho (NBR 6492)
  const [realMeasureM, setRealMeasureM] = useState<number>(12.5);
  const [drawingScale, setDrawingScale] = useState<number>(50);
  const [areaToConvertM2, setAreaToConvertM2] = useState<number>(10000);

  // --- Calculations 1: Urbanismo ---
  const lotArea = lotFront * lotDepth;
  const totalBuiltArea = projArea * floorsCount + nonComputableArea;
  const computableArea = projArea * floorsCount;
  const usefulFloorArea = totalBuiltArea * (1 - wallThicknessPct / 100);
  const roofProjectionArea = Math.pow(Math.sqrt(projArea) + 2 * roofEaveOverhang, 2);
  const facadeTotalArea = facadePerimeter * facadeTotalHeight;
  const toRate = lotArea > 0 ? (projArea / lotArea) * 100 : 0;
  const caRate = lotArea > 0 ? computableArea / lotArea : 0;
  const ipRate = lotArea > 0 ? (permeableArea / lotArea) * 100 : 0;
  const urbanCompliant = toRate <= maxAllowedTO && caRate <= maxAllowedCA && ipRate >= minAllowedIP;

  // --- Calculations 2: Paginação, Pisos, Revestimentos & Rodapé ---
  const floorNetArea = roomWidth * roomLength;
  const roomPerimeter = 2 * (roomWidth + roomLength);
  const wallNetArea = Math.max(0, roomPerimeter * wallTilingHeight - openingsDeductionArea);
  const wastePct = paginationDirection === 'reta' ? 10 : 15;
  const floorTotalWithWaste = floorNetArea * (1 + wastePct / 100);
  const wallTotalWithWaste = wallNetArea * (1 + wastePct / 100);
  const singleTileAreaM2 = (tileWidthCm / 100) * (tileLengthCm / 100);
  const floorTilesCount = singleTileAreaM2 > 0 ? Math.ceil(floorTotalWithWaste / singleTileAreaM2) : 0;
  const wallTilesCount = singleTileAreaM2 > 0 ? Math.ceil(wallTotalWithWaste / singleTileAreaM2) : 0;
  const skirtingLinearM = Math.max(0, roomPerimeter - doorsWidthSum) * 1.1;
  const skirtingPiecesCount = tileLengthCm > 0 ? Math.ceil(skirtingLinearM / (tileLengthCm / 100)) : 0;
  const requiresDoubleGluing = tileWidthCm * tileLengthCm > 900;
  const mortarRateKgM2 = requiresDoubleGluing ? 7.0 : 4.5;
  const totalMortarKg = (floorTotalWithWaste + wallTotalWithWaste) * mortarRateKgM2;
  const mortarBags20kg = Math.ceil(totalMortarKg / 20);
  const lMm = tileWidthCm * 10;
  const cMm = tileLengthCm * 10;
  const groutRateKgM2 = lMm > 0 && cMm > 0 ? ((lMm + cMm) / (lMm * cMm)) * tileThicknessMm * jointMm * 1.58 : 0.4;
  const totalGroutKg = (floorTotalWithWaste + wallTotalWithWaste) * groutRateKgM2;

  // --- Calculations 3: Pintura, Forro e Gesso ---
  const totalPaintSurface = paintWallArea + paintCeilingArea;
  const totalPaintLiters = ((totalPaintSurface * paintCoats) / Math.max(1, paintYieldM2PerL)) * 1.1;
  const paintCans18L = Math.ceil(totalPaintLiters / 18);
  const acrylicPuttyKg = totalPaintSurface * 1.3; // 1.3 kg/m² para 2 demãos
  const sealerLiters = (totalPaintSurface / 10) * 1.05;
  // Placa de drywall padrão 1,20 x 1,80 m = 2,16 m²
  const gypsumPlatesCount = Math.ceil((paintCeilingArea * 1.08) / 2.16);
  const f530ProfilesMeters = Math.ceil(paintCeilingArea * 1.85);
  const tieRodsCount = Math.ceil(paintCeilingArea * 1.3);
  const jointCompoundKg = Math.ceil(paintCeilingArea * 0.65);

  // --- Calculations 4: Dimensionamento Preliminar de Ambientes ---
  const studyFloorArea = studyWidth * studyLength;
  const minInscribedCircle = Math.min(studyWidth, studyLength);
  const illuminationFraction = roomCategory === 'permanencia_prolongada' ? 1 / 6 : 1 / 8;
  const minWindowArea = studyFloorArea * illuminationFraction;
  const minVentArea = minWindowArea * 0.5;
  const minRequiredCircle = roomCategory === 'banheiro_acessivel' ? 1.5 : roomCategory === 'permanencia_prolongada' ? 2.4 : 1.5;
  const minRequiredCeiling = roomCategory === 'permanencia_prolongada' ? 2.5 : 2.3;
  const studyCompliant =
    actualWindowArea >= minWindowArea &&
    actualVentArea >= minVentArea &&
    minInscribedCircle >= minRequiredCircle &&
    studyCeilingHeight >= minRequiredCeiling;

  // --- Calculations 5: Conversões Arquitetônicas ---
  const drawingPaperCm = (realMeasureM * 100) / Math.max(1, drawingScale);

  const handleSaveCurrentCalculation = () => {
    if (activeSubTab === 'urbanismo') {
      onSaveRecord({
        id: `CALC-ARQ-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        module: 'Arquitetura',
        category: 'Índices Urbanísticos e Áreas',
        title: `Estudo Urbanístico (${lotFront}×${lotDepth}m — ${lotArea.toFixed(0)} m²)`,
        projectRef: 'PRJ-ARQ-URB',
        author: 'Arquiteto e Urbanista Responsável',
        inputs: [
          { label: 'Área do Lote', value: lotArea.toFixed(2), unit: 'm²' },
          { label: 'Projeção no Terreno', value: projArea.toFixed(2), unit: 'm²' },
          { label: 'Pavimentos Tipo', value: String(floorsCount), unit: 'pav' },
          { label: 'Área Permeável', value: permeableArea.toFixed(2), unit: 'm²' }
        ],
        outputs: [
          { label: 'Taxa de Ocupação (TO)', value: toRate.toFixed(2), unit: '%', highlight: true },
          { label: 'Coeficiente de Aproveitamento (CA)', value: caRate.toFixed(2), unit: 'x', highlight: true },
          { label: 'Índice de Permeabilidade (IP)', value: ipRate.toFixed(2), unit: '%', highlight: true },
          { label: 'Área Construída Total', value: totalBuiltArea.toFixed(2), unit: 'm²' },
          { label: 'Área Útil Estimada', value: usefulFloorArea.toFixed(2), unit: 'm²' }
        ],
        formulas: [
          `TO = (${projArea} / ${lotArea}) × 100 = ${toRate.toFixed(2)}%`,
          `CA = ${computableArea} / ${lotArea} = ${caRate.toFixed(2)}`,
          `IP = (${permeableArea} / ${lotArea}) × 100 = ${ipRate.toFixed(2)}%`
        ],
        normativeRefs: ['ABNT NBR 13532', 'ABNT NBR 6492:2021', 'Parâmetros de Zoneamento Municipal'],
        complianceStatus: urbanCompliant ? 'CONFORME' : 'ATENÇÃO',
        complianceNotes: urbanCompliant
          ? 'TO, CA e IP atendem integralmente os limites urbanísticos configurados.'
          : 'Um ou mais índices urbanísticos ultrapassam os limites parametrizados para a zona.'
      });
    } else if (activeSubTab === 'paginacao') {
      onSaveRecord({
        id: `CALC-ARQ-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        module: 'Arquitetura',
        category: 'Paginação, Revestimentos e Rodapé',
        title: `Quantitativo de ${tileType} (${tileWidthCm}×${tileLengthCm} cm)`,
        projectRef: 'PRJ-ARQ-REV',
        author: 'Arquiteto e Urbanista Responsável',
        inputs: [
          { label: 'Ambiente', value: `${roomWidth} × ${roomLength}`, unit: 'm' },
          { label: 'Peça Adotada', value: `${tileWidthCm} × ${tileLengthCm}`, unit: 'cm' },
          { label: 'Paginação', value: `${paginationDirection.toUpperCase()} (+${wastePct}%)` }
        ],
        outputs: [
          { label: 'Área Piso c/ Perda', value: floorTotalWithWaste.toFixed(2), unit: 'm²', highlight: true },
          { label: 'Peças de Piso', value: String(floorTilesCount), unit: 'unid', highlight: true },
          { label: 'Peças de Revestimento Parede', value: String(wallTilesCount), unit: 'unid' },
          { label: 'Rodapé Linear', value: skirtingLinearM.toFixed(2), unit: 'm' },
          { label: 'Argamassa Colante', value: String(mortarBags20kg), unit: 'sacos 20kg', highlight: true },
          { label: 'Rejunte Total', value: totalGroutKg.toFixed(2), unit: 'kg' }
        ],
        formulas: [
          `A_piso_total = ${floorNetArea.toFixed(2)} × ${(1 + wastePct / 100).toFixed(2)} = ${floorTotalWithWaste.toFixed(2)} m²`,
          `Consumo Argamassa = ${mortarRateKgM2.toFixed(1)} kg/m² (${requiresDoubleGluing ? 'Dupla Colagem AC-III' : 'Colagem Simples AC-II'})`
        ],
        normativeRefs: ['ABNT NBR 13753', 'ABNT NBR 14081', 'ABNT NBR 15575-3'],
        complianceStatus: 'CONFORME',
        complianceNotes: requiresDoubleGluing
          ? 'Peça > 900 cm²: especificada dupla colagem com argamassa AC-III conforme ABNT NBR 13753.'
          : 'Assentamento padrão conforme ABNT NBR 13753.'
      });
    } else if (activeSubTab === 'pintura_gesso') {
      onSaveRecord({
        id: `CALC-ARQ-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        module: 'Arquitetura',
        category: 'Pintura, Forro e Gesso',
        title: `Estimativa de Pintura (${totalPaintSurface} m²) e Forro Drywall (${paintCeilingArea} m²)`,
        projectRef: 'PRJ-ARQ-ACAB',
        author: 'Arquiteto e Urbanista Responsável',
        inputs: [
          { label: 'Área de Paredes', value: paintWallArea.toFixed(2), unit: 'm²' },
          { label: 'Área de Forro / Gesso', value: paintCeilingArea.toFixed(2), unit: 'm²' },
          { label: 'Número de Demãos', value: String(paintCoats), unit: 'demãos' }
        ],
        outputs: [
          { label: 'Volume de Tinta (+10%)', value: totalPaintLiters.toFixed(1), unit: 'L', highlight: true },
          { label: 'Latas de 18 Litros', value: String(paintCans18L), unit: 'latas', highlight: true },
          { label: 'Massa Corrida / Acrílica', value: acrylicPuttyKg.toFixed(1), unit: 'kg' },
          { label: `Placas Gesso ${gypsumBoardType}`, value: String(gypsumPlatesCount), unit: 'placas 1,20×1,80m', highlight: true },
          { label: 'Perfis Metálicos F530', value: String(f530ProfilesMeters), unit: 'm' }
        ],
        formulas: [
          `V_tinta = ((${totalPaintSurface} × ${paintCoats}) / ${paintYieldM2PerL}) × 1,10 = ${totalPaintLiters.toFixed(1)} L`,
          `N_placas_gesso = ceil((${paintCeilingArea} × 1,08) / 2,16) = ${gypsumPlatesCount} placas`
        ],
        normativeRefs: ['ABNT NBR 13245', 'ABNT NBR 15758 (Sistemas Drywall)'],
        complianceStatus: 'CONFORME',
        complianceNotes: 'Quantitativo considera reserva técnica de 10% para tinta e 8% para recorte de chapas de gesso acartonado.'
      });
    } else {
      onSaveRecord({
        id: `CALC-ARQ-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        module: 'Arquitetura',
        category: 'Estudo Preliminar de Ambientes',
        title: `Dimensionamento Lumínico e Funcional (${studyWidth}×${studyLength} m)`,
        projectRef: 'PRJ-ARQ-AMB',
        author: 'Arquiteto e Urbanista Responsável',
        inputs: [
          { label: 'Dimensões do Ambiente', value: `${studyWidth} × ${studyLength}`, unit: 'm' },
          { label: 'Pé-Direito Livre', value: studyCeilingHeight.toFixed(2), unit: 'm' },
          { label: 'Área de Janela Adotada', value: actualWindowArea.toFixed(2), unit: 'm²' }
        ],
        outputs: [
          { label: 'Área de Piso', value: studyFloorArea.toFixed(2), unit: 'm²', highlight: true },
          { label: 'Iluminação Mínima Exigida', value: minWindowArea.toFixed(2), unit: 'm²', highlight: true },
          { label: 'Ventilação Mínima Exigida', value: minVentArea.toFixed(2), unit: 'm²' },
          { label: 'Círculo Inscrito Livre', value: minInscribedCircle.toFixed(2), unit: 'm' }
        ],
        formulas: [
          `A_ilum_min = A_piso × (${roomCategory === 'permanencia_prolongada' ? '1/6' : '1/8'}) = ${minWindowArea.toFixed(2)} m²`,
          `A_vent_min = 0,50 × A_ilum_min = ${minVentArea.toFixed(2)} m²`
        ],
        normativeRefs: ['ABNT NBR 15575:2024', 'ABNT NBR 9050:2020', 'Código de Obras'],
        complianceStatus: studyCompliant ? 'CONFORME' : 'ATENÇÃO',
        complianceNotes: studyCompliant
          ? 'Ambiente atende requisitos de iluminação natural, ventilação, círculo inscrito e pé-direito.'
          : 'Revise abertura de janela ou dimensões mínimas do ambiente conforme NBR 15575.'
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Tool Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Módulo 02</span>
            <span aria-hidden="true">·</span>
            <span>Arquitetura & Urbanismo</span>
            <span aria-hidden="true">·</span>
            <span>NBR 13532 / NBR 15575 / NBR 6492</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Estudos Urbanísticos, Paginação de Revestimentos & Quantitativos Arquitetônicos
          </h2>
        </div>

        <button
          type="button"
          onClick={handleSaveCurrentCalculation}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <FilePlus2 className="w-4 h-4" />
          Registrar Cálculo no Memorial
        </button>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveSubTab('urbanismo')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeSubTab === 'urbanismo' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4 text-sky-700" />
          01. Índices Urbanísticos & Áreas (TO, CA, IP)
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('paginacao')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeSubTab === 'paginacao' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Grid className="w-4 h-4 text-sky-700" />
          02. Pisos, Porcelanato, Revestimentos & Rodapé
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('pintura_gesso')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeSubTab === 'pintura_gesso' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PaintBucket className="w-4 h-4 text-sky-700" />
          03. Pintura, Forro & Gesso Acartonado
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('ambientes')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeSubTab === 'ambientes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Maximize2 className="w-4 h-4 text-sky-700" />
          04. Dimensionamento de Ambientes (NBR 15575)
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('conversoes')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeSubTab === 'conversoes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Ruler className="w-4 h-4 text-sky-700" />
          05. Escalas & Conversões Arquitetônicas
        </button>
      </div>

      {/* TAB 1: URBANISMO & ÁREAS */}
      {activeSubTab === 'urbanismo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-900">
              Parâmetros Geométricos do Lote e Edificação
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Testada / Frente do Lote (m)</label>
                <input
                  type="number"
                  step="0.5"
                  value={lotFront}
                  onChange={(e) => setLotFront(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Profundidade do Lote (m)</label>
                <input
                  type="number"
                  step="0.5"
                  value={lotDepth}
                  onChange={(e) => setLotDepth(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Área de Projeção Horizontal (m²)</label>
                <input
                  type="number"
                  step="1"
                  value={projArea}
                  onChange={(e) => setProjArea(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nº de Pavimentos Computáveis</label>
                <input
                  type="number"
                  step="1"
                  value={floorsCount}
                  onChange={(e) => setFloorsCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Área Não Computável / Garagem (m²)</label>
                <input
                  type="number"
                  step="5"
                  value={nonComputableArea}
                  onChange={(e) => setNonComputableArea(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Área Permeável / Solo Natural (m²)</label>
                <input
                  type="number"
                  step="5"
                  value={permeableArea}
                  onChange={(e) => setPermeableArea(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Beiral de Cobertura (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={roofEaveOverhang}
                  onChange={(e) => setRoofEaveOverhang(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Desconto de Paredes p/ Área Útil (%)</label>
                <input
                  type="number"
                  step="1"
                  value={wallThicknessPct}
                  onChange={(e) => setWallThicknessPct(Math.min(35, Math.max(0, parseFloat(e.target.value) || 0)))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Perímetro Total de Fachada (m)</label>
                <input
                  type="number"
                  step="1"
                  value={facadePerimeter}
                  onChange={(e) => setFacadePerimeter(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Altura Total da Fachada (m)</label>
                <input
                  type="number"
                  step="0.5"
                  value={facadeTotalHeight}
                  onChange={(e) => setFacadeTotalHeight(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-500 mb-3">
                Limites do Zoneamento Municipal (Plano Diretor)
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">TO Máx (%)</label>
                  <input
                    type="number"
                    value={maxAllowedTO}
                    onChange={(e) => setMaxAllowedTO(parseFloat(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">CA Máx (x)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={maxAllowedCA}
                    onChange={(e) => setMaxAllowedCA(parseFloat(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">IP Mín (%)</label>
                  <input
                    type="number"
                    value={minAllowedIP}
                    onChange={(e) => setMinAllowedIP(parseFloat(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono tabular-nums"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            {/* Key Indices Result Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  Quadro de Áreas (NBR 12721 / NBR 13532)
                </h3>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                    urbanCompliant ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {urbanCompliant ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      CONFORME ZONEAMENTO
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      REVISAR ÍNDICES URBANÍSTICOS
                    </>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-xs text-slate-500">Taxa de Ocupação (TO)</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                    {toRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-1">
                    Máx: {maxAllowedTO.toFixed(0)}%
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-xs text-slate-500">Coef. Aproveitamento (CA)</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-sky-700 mt-1">
                    {caRate.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-1">
                    Máx: {maxAllowedCA.toFixed(2)}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-xs text-slate-500">Permeabilidade (IP)</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700 mt-1">
                    {ipRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-1">
                    Mín: {minAllowedIP.toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
                <div className="flex justify-between px-4 py-2.5 text-sm">
                  <span className="text-slate-600">Área Total do Terreno / Lote</span>
                  <span className="font-mono font-semibold tabular-nums">{lotArea.toFixed(2)} m²</span>
                </div>
                <div className="flex justify-between px-4 py-2.5 text-sm bg-slate-50/60">
                  <span className="text-slate-600">Área Construída Computável</span>
                  <span className="font-mono font-semibold tabular-nums">{computableArea.toFixed(2)} m²</span>
                </div>
                <div className="flex justify-between px-4 py-2.5 text-sm">
                  <span className="text-slate-600">Área Construída Total (c/ Não Computável)</span>
                  <span className="font-mono font-semibold tabular-nums text-sky-700">{totalBuiltArea.toFixed(2)} m²</span>
                </div>
                <div className="flex justify-between px-4 py-2.5 text-sm bg-slate-50/60">
                  <span className="text-slate-600">Área Útil / Privativa Líquida (-{wallThicknessPct}%)</span>
                  <span className="font-mono font-semibold tabular-nums">{usefulFloorArea.toFixed(2)} m²</span>
                </div>
                <div className="flex justify-between px-4 py-2.5 text-sm">
                  <span className="text-slate-600">Área de Cobertura em Projeção (c/ Beiral)</span>
                  <span className="font-mono font-semibold tabular-nums">{roofProjectionArea.toFixed(2)} m²</span>
                </div>
                <div className="flex justify-between px-4 py-2.5 text-sm bg-slate-50/60">
                  <span className="text-slate-600">Área Global de Fachadas (Envoltória Vertical)</span>
                  <span className="font-mono font-semibold tabular-nums">{facadeTotalArea.toFixed(2)} m²</span>
                </div>
              </div>

              {/* SVG Lot Occupancy Diagram */}
              <div className="bg-slate-900 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>PLANTA ESQUEMÁTICA DE OCUPAÇÃO DO LOTE</span>
                  <span>ESCALA AUTOMÁTICA · {lotFront}m × {lotDepth}m</span>
                </div>
                <svg viewBox="0 0 400 150" className="w-full h-36">
                  {/* Terreno */}
                  <rect x="20" y="15" width="360" height="120" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
                  {/* Área Permeável (Verde) */}
                  <rect
                    x="25"
                    y="20"
                    width={Math.min(350, Math.max(20, (ipRate / 100) * 350))}
                    height="110"
                    fill="#065F46"
                    opacity="0.75"
                  />
                  {/* Projeção Construída (Azul Técnico) */}
                  <rect
                    x="110"
                    y="28"
                    width={Math.min(250, Math.max(40, (toRate / 100) * 320))}
                    height="94"
                    fill="#0284C7"
                    stroke="#38BDF8"
                    strokeWidth="1.5"
                  />
                  <text x="32" y="40" fill="#A7F3D0" fontSize="10" fontFamily="IBM Plex Mono">
                    IP: {ipRate.toFixed(1)}%
                  </text>
                  <text x="125" y="80" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="IBM Plex Mono">
                    PROJEÇÃO: {projArea.toFixed(0)} m² (TO {toRate.toFixed(1)}%)
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAGINAÇÃO, PISOS, REVESTIMENTOS E RODAPÉ */}
      {activeSubTab === 'paginacao' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-900">
              Especificação de Paginação, Porcelanato, Cerâmica e Rodapé
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Largura do Ambiente (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(Math.max(0.5, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Comprimento do Ambiente (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={roomLength}
                  onChange={(e) => setRoomLength(Math.max(0.5, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Tipo de Revestimento</label>
                <select
                  value={tileType}
                  onChange={(e) => setTileType(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="Porcelanato Retificado">Porcelanato Técnico / Esmaltado</option>
                  <option value="Cerâmica Esmaltada">Placa Cerâmica Tradicional</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Direção da Paginação</label>
                <select
                  value={paginationDirection}
                  onChange={(e) => setPaginationDirection(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="reta">Paginação Ortogonal Reta (+10% perda)</option>
                  <option value="diagonal">Paginação Diagonal 45° (+15% perda)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Largura da Peça (cm)</label>
                <input
                  type="number"
                  step="5"
                  value={tileWidthCm}
                  onChange={(e) => setTileWidthCm(Math.max(5, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Comprimento da Peça (cm)</label>
                <input
                  type="number"
                  step="5"
                  value={tileLengthCm}
                  onChange={(e) => setTileLengthCm(Math.max(5, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Junta de Assentamento (mm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={jointMm}
                  onChange={(e) => setJointMm(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Espessura da Placa (mm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={tileThicknessMm}
                  onChange={(e) => setTileThicknessMm(Math.max(4, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Altura de Revestimento Parede (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={wallTilingHeight}
                  onChange={(e) => setWallTilingHeight(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Desconto Vãos / Portas Parede (m²)</label>
                <input
                  type="number"
                  step="0.2"
                  value={openingsDeductionArea}
                  onChange={(e) => setOpeningsDeductionArea(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Resumo de Materiais (NBR 13753 / NBR 14081)
              </h3>
              <span className="text-xs font-mono text-sky-700 font-semibold">
                {requiresDoubleGluing ? 'Dupla Colagem AC-III' : 'Colagem Simples AC-II'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs text-slate-500">Peças para Piso</div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                  {floorTilesCount} unid
                </div>
                <div className="text-xs text-slate-500 font-mono">{floorTotalWithWaste.toFixed(2)} m² c/ perda</div>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs text-slate-500">Peças para Parede</div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                  {wallTilesCount} unid
                </div>
                <div className="text-xs text-slate-500 font-mono">{wallTotalWithWaste.toFixed(2)} m² c/ perda</div>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs text-slate-500">Rodapé Linear</div>
                <div className="text-xl font-bold font-mono tabular-nums text-sky-700 mt-1">
                  {skirtingLinearM.toFixed(1)} m
                </div>
                <div className="text-xs text-slate-500 font-mono">{skirtingPiecesCount} peças lineares</div>
              </div>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-slate-600">Área Líquida de Piso (sem perdas)</span>
                <span className="font-mono font-semibold tabular-nums">{floorNetArea.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm bg-slate-50/60">
                <span className="text-slate-600">Área Líquida de Parede (descontados vãos)</span>
                <span className="font-mono font-semibold tabular-nums">{wallNetArea.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-slate-600">Consumo Total de Argamassa Colante ({mortarRateKgM2} kg/m²)</span>
                <span className="font-mono font-semibold tabular-nums text-sky-700">
                  {totalMortarKg.toFixed(1)} kg ({mortarBags20kg} sacos 20kg)
                </span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm bg-slate-50/60">
                <span className="text-slate-600">Consumo Total de Rejunte (Junta {jointMm} mm)</span>
                <span className="font-mono font-semibold tabular-nums">{totalGroutKg.toFixed(2)} kg</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PINTURA, FORRO E GESSO */}
      {activeSubTab === 'pintura_gesso' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-900">
              Parâmetros de Pintura Acrílica e Forro de Gesso (Drywall)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Área Líquida de Paredes (m²)</label>
                <input
                  type="number"
                  value={paintWallArea}
                  onChange={(e) => setPaintWallArea(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Área de Forro / Teto (m²)</label>
                <input
                  type="number"
                  value={paintCeilingArea}
                  onChange={(e) => setPaintCeilingArea(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Número de Demãos de Tinta</label>
                <input
                  type="number"
                  value={paintCoats}
                  onChange={(e) => setPaintCoats(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Rendimento da Tinta (m²/L por demão)</label>
                <input
                  type="number"
                  value={paintYieldM2PerL}
                  onChange={(e) => setPaintYieldM2PerL(Math.max(1, parseFloat(e.target.value) || 10))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Especificação da Chapa de Gesso (NBR 15758)</label>
                <select
                  value={gypsumBoardType}
                  onChange={(e) => setGypsumBoardType(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="ST (Standard)">Chapa ST Branca — Áreas Secas (Dormitórios / Salas)</option>
                  <option value="RU (Resistente à Umidade)">Chapa RU Verde — Áreas Úmidas (Banheiros / Cozinhas)</option>
                  <option value="RF (Resistente ao Fogo)">Chapa RF Rosa — Saídas de Emergência / Áreas Técnicas</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-900">
              Estimativa de Insumos de Pintura & Gesso Acartonado
            </h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-slate-600">Volume Total de Tinta Acrílica (+10% reserva)</span>
                <span className="font-mono font-semibold tabular-nums text-sky-700">
                  {totalPaintLiters.toFixed(1)} L ({paintCans18L} latas de 18L)
                </span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm bg-slate-50/60">
                <span className="text-slate-600">Selador Acrílico (1 demão preparatória)</span>
                <span className="font-mono font-semibold tabular-nums">{sealerLiters.toFixed(1)} L</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-slate-600">Massa Corrida / Acrílica (2 demãos — 1,3 kg/m²)</span>
                <span className="font-mono font-semibold tabular-nums">{acrylicPuttyKg.toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm bg-slate-50/60">
                <span className="text-slate-600">Chapas de Gesso {gypsumBoardType} (1,20 × 1,80 m)</span>
                <span className="font-mono font-semibold tabular-nums text-slate-900">{gypsumPlatesCount} chapas</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-slate-600">Perfis Metálicos Canaleta F530</span>
                <span className="font-mono font-semibold tabular-nums">{f530ProfilesMeters} m lineares</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm bg-slate-50/60">
                <span className="text-slate-600">Tirantes Rígidos c/ Regulador + Massa de Junta</span>
                <span className="font-mono font-semibold tabular-nums">
                  {tieRodsCount} unid · {jointCompoundKg} kg
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DIMENSIONAMENTO PRELIMINAR DE AMBIENTES */}
      {activeSubTab === 'ambientes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-900">
              Dimensionamento Preliminar de Ambientes (NBR 15575 / NBR 9050)
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Tipologia do Ambiente</label>
                <select
                  value={roomCategory}
                  onChange={(e) => setRoomCategory(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="permanencia_prolongada">Permanência Prolongada (Sala, Dormitório, Escritório — Ilum. 1/6)</option>
                  <option value="permanencia_transitoria">Permanência Transitória (Cozinha, Lavanderia, Circulação — Ilum. 1/8)</option>
                  <option value="banheiro_acessivel">Sanitário Acessível PME/PCR (ABNT NBR 9050 — Giro Ø 1,50 m)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Largura Livre (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={studyWidth}
                    onChange={(e) => setStudyWidth(Math.max(0.8, parseFloat(e.target.value) || 0))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Comprimento Livre (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={studyLength}
                    onChange={(e) => setStudyLength(Math.max(0.8, parseFloat(e.target.value) || 0))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Pé-Direito Livre (m)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={studyCeilingHeight}
                    onChange={(e) => setStudyCeilingHeight(Math.max(2.0, parseFloat(e.target.value) || 0))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Vão de Iluminação Projetado (m²)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={actualWindowArea}
                    onChange={(e) => setActualWindowArea(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Verificação de Desempenho Lumínico e Geométrico</h3>
              <span className={`text-xs font-semibold ${studyCompliant ? 'text-emerald-700' : 'text-amber-700'}`}>
                {studyCompliant ? 'CONFORME NBR 15575' : 'AJUSTE NECESSÁRIO'}
              </span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-slate-600">Área de Piso do Ambiente</span>
                <span className="font-mono font-semibold tabular-nums">{studyFloorArea.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm bg-slate-50/60">
                <span className="text-slate-600">Iluminação Natural Mínima Exigida ({roomCategory === 'permanencia_prolongada' ? '1/6' : '1/8'})</span>
                <span className="font-mono font-semibold tabular-nums text-sky-700">{minWindowArea.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-slate-600">Ventilação Natural Mínima Exigida (1/2 da iluminação)</span>
                <span className="font-mono font-semibold tabular-nums">{minVentArea.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm bg-slate-50/60">
                <span className="text-slate-600">Diâmetro do Círculo Inscrito (Mín. {minRequiredCircle.toFixed(2)} m)</span>
                <span className="font-mono font-semibold tabular-nums">{minInscribedCircle.toFixed(2)} m</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONVERSÕES DE UNIDADES ARQUITETÔNICAS & ESCALAS */}
      {activeSubTab === 'conversoes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Calculadora de Escala Gráfica para Pranchas (ABNT NBR 6492)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Dimensão Real na Obra (m)</label>
                <input
                  type="number"
                  step="0.5"
                  value={realMeasureM}
                  onChange={(e) => setRealMeasureM(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Escala de Plotagem (1 : X)</label>
                <select
                  value={drawingScale}
                  onChange={(e) => setDrawingScale(parseInt(e.target.value, 10))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value={20}>1:20 (Detalhamento / Marcenaria)</option>
                  <option value={25}>1:25 (Áreas Molhadas)</option>
                  <option value={50}>1:50 (Projeto Executivo)</option>
                  <option value={75}>1:75 (Apresentação)</option>
                  <option value={100}>1:100 (Projeto Legal / Prefeitura)</option>
                  <option value={200}>1:200 (Implantação Geral)</option>
                  <option value={500}>1:500 (Urbanismo / Loteamento)</option>
                </select>
              </div>
            </div>
            <div className="p-4 bg-slate-900 text-white rounded-lg flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300">Medida no Desenho Impresso (1:{drawingScale}):</span>
              <span className="text-xl font-mono font-bold tabular-nums text-sky-400">
                {drawingPaperCm.toFixed(2)} cm ({(drawingPaperCm * 10).toFixed(1)} mm)
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Conversor de Áreas Urbanas, Agrárias e Imperiais
            </h3>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Área em Metros Quadrados (m²)</label>
              <input
                type="number"
                value={areaToConvertM2}
                onChange={(e) => setAreaToConvertM2(parseFloat(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
              />
            </div>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg text-sm">
              <div className="flex justify-between px-4 py-2">
                <span className="text-slate-600">Hectares (ha — 10.000 m²)</span>
                <span className="font-mono font-semibold tabular-nums">{(areaToConvertM2 / 10000).toFixed(4)} ha</span>
              </div>
              <div className="flex justify-between px-4 py-2 bg-slate-50/60">
                <span className="text-slate-600">Alqueires Paulistas (24.200 m²)</span>
                <span className="font-mono font-semibold tabular-nums">{(areaToConvertM2 / 24200).toFixed(4)} alq</span>
              </div>
              <div className="flex justify-between px-4 py-2">
                <span className="text-slate-600">Alqueires Mineiros / Goianos (48.400 m²)</span>
                <span className="font-mono font-semibold tabular-nums">{(areaToConvertM2 / 48400).toFixed(4)} alq</span>
              </div>
              <div className="flex justify-between px-4 py-2 bg-slate-50/60">
                <span className="text-slate-600">Pés Quadrados (sq ft — 1 m² = 10,7639 ft²)</span>
                <span className="font-mono font-semibold tabular-nums">{(areaToConvertM2 * 10.76391).toFixed(2)} ft²</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
