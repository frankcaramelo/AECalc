import React, { useState } from 'react';
import {
  TrendingUp,
  Home,
  Layers,
  BrickWall,
  Scale,
  FilePlus2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { CalculationRecord } from '../types/domain';

interface EngineeringModuleProps {
  onSaveRecord: (record: CalculationRecord) => void;
}

type EngSubTab = 'escadas_rampas' | 'telhados' | 'concreto_fundacoes' | 'alvenaria_insumos' | 'conversoes_eng';

export const EngineeringModule: React.FC<EngineeringModuleProps> = ({ onSaveRecord }) => {
  const [activeSubTab, setActiveSubTab] = useState<EngSubTab>('escadas_rampas');

  // 1. Escadas (Blondel + NBR 9050 / 9077) & Rampas (NBR 9050)
  const [stairHeightCm, setStairHeightCm] = useState<number>(288);
  const [desiredRiserCm, setDesiredRiserCm] = useState<number>(17.8);
  const [treadDepthCm, setTreadDepthCm] = useState<number>(28.5);
  const [stairLandingM, setStairLandingM] = useState<number>(1.2);
  const [rampHeightM, setRampHeightM] = useState<number>(0.75);
  const [rampSlopePct, setRampSlopePct] = useState<number>(8.0);

  // 2. Telhados e Coberturas
  const [roofWidthM, setRoofWidthM] = useState<number>(8.0);
  const [roofLengthM, setRoofLengthM] = useState<number>(14.0);
  const [eaveOverhangM, setEaveOverhangM] = useState<number>(0.6);
  const [roofWaters, setRoofWaters] = useState<1 | 2 | 3 | 4>(2);
  const [roofSlopePct, setRoofSlopePct] = useState<number>(30);
  const [roofTileYieldPerM2, setRoofTileYieldPerM2] = useState<number>(16); // Romana = 16 telhas/m²

  // 3. Concreto, Aço, Fundações Simplificadas e Cargas (NBR 6118 / NBR 6120)
  const [concLengthM, setConcLengthM] = useState<number>(6.0);
  const [concWidthM, setConcWidthM] = useState<number>(4.5);
  const [concThicknessM, setConcThicknessM] = useState<number>(0.12);
  const [concElementsCount, setConcElementsCount] = useState<number>(4);
  const [steelRateKgM3, setSteelRateKgM3] = useState<number>(85);
  const [footingLoadKn, setFootingLoadKn] = useState<number>(650);
  const [soilSigmaMpa, setSoilSigmaMpa] = useState<number>(0.25);
  const [slabOccupancyKnM2, setSlabOccupancyKnM2] = useState<number>(2.0);

  // 4. Alvenaria (Blocos / Tijolos), Argamassa de Assentamento e Rejunte
  const [wallAreaM2, setWallAreaM2] = useState<number>(120);
  const [blockLengthCm, setBlockLengthCm] = useState<number>(39);
  const [blockHeightCm, setBlockHeightCm] = useState<number>(19);
  const [blockWidthCm, setBlockWidthCm] = useState<number>(14);
  const [mortarJointCm, setMortarJointCm] = useState<number>(1.5);

  // 5. Conversões de Unidades de Engenharia
  const [forceKn, setForceKn] = useState<number>(100);
  const [stressMpa, setStressMpa] = useState<number>(25);

  // --- Calculations 1: Escadas & Rampas ---
  const stepsCount = Math.max(1, Math.round(stairHeightCm / Math.max(10, desiredRiserCm)));
  const actualRiserCm = stairHeightCm / stepsCount;
  const blondelValue = 2 * actualRiserCm + treadDepthCm;
  const stairHorizontalRunM = ((stepsCount - 1) * treadDepthCm) / 100 + stairLandingM;
  const stairAngleDeg = (Math.atan(actualRiserCm / treadDepthCm) * 180) / Math.PI;
  const stairCompliant =
    actualRiserCm >= 16.0 &&
    actualRiserCm <= 18.0 &&
    treadDepthCm >= 28.0 &&
    treadDepthCm <= 32.0 &&
    blondelValue >= 63.0 &&
    blondelValue <= 65.0;

  const rampHorizontalRunM = rampSlopePct > 0 ? (rampHeightM * 100) / rampSlopePct : 0;
  const maxRampSegmentHeight =
    rampSlopePct <= 5.0 ? 1.5 : rampSlopePct <= 6.25 ? 1.0 : rampSlopePct <= 8.33 ? 0.8 : 0;
  const rampSegmentsCount = maxRampSegmentHeight > 0 ? Math.ceil(rampHeightM / maxRampSegmentHeight) : 99;
  const rampCompliant = rampSlopePct <= 8.33 && (rampSlopePct <= 6.25 || rampSegmentsCount <= 15);

  // --- Calculations 2: Telhados ---
  const totalWidthWithEaves = roofWidthM + 2 * eaveOverhangM;
  const totalLengthWithEaves = roofLengthM + 2 * eaveOverhangM;
  const roofHorizProjectionArea = totalWidthWithEaves * totalLengthWithEaves;
  const slopeCorrectionFactor = Math.sqrt(1 + Math.pow(roofSlopePct / 100, 2));
  const roofInclinedArea = roofHorizProjectionArea * slopeCorrectionFactor;
  const effectiveSpanForRidge = roofWaters === 1 ? totalWidthWithEaves : totalWidthWithEaves / 2;
  const ridgeHeightM = (effectiveSpanForRidge * roofSlopePct) / 100;
  const roofTilesTotal = Math.ceil(roofInclinedArea * roofTileYieldPerM2 * 1.05); // +5% quebra
  const battensLinearM = Math.ceil(roofInclinedArea * 3.1); // Ripas (espaçamento 33 cm)
  const raftersLinearM = Math.ceil(roofInclinedArea * 2.0); // Caibros (espaçamento 50 cm)

  // --- Calculations 3: Concreto, Aço, Sapata e Cargas ---
  const totalConcreteVolM3 = concLengthM * concWidthM * concThicknessM * concElementsCount;
  const totalSteelKg = totalConcreteVolM3 * steelRateKgM3;
  const cementBags50kg = Math.ceil(totalConcreteVolM3 * 7.0); // ~350 kg/m³ C25/C30
  const sandVolumeM3 = totalConcreteVolM3 * 0.56;
  const gravelVolumeM3 = totalConcreteVolM3 * 0.82;
  const soilSigmaKnM2 = soilSigmaMpa * 1000;
  const footingAreaM2 = soilSigmaKnM2 > 0 ? (1.05 * footingLoadKn) / soilSigmaKnM2 : 0;
  const footingSideM = Math.ceil(Math.sqrt(footingAreaM2) * 20) / 20;
  const footingHeightM = Math.max(0.35, (footingSideM - 0.25) / 3);
  // Cargas simplificadas de laje (NBR 6120): Peso próprio (25 kN/m³ * espessura) + revestimento (1,0 kN/m²) + sobrecarga
  const slabSelfWeightKnM2 = concThicknessM * 25.0;
  const totalSlabLoadKnM2 = slabSelfWeightKnM2 + 1.0 + slabOccupancyKnM2;

  // --- Calculations 4: Alvenaria & Argamassa ---
  const blockAreaWithJointM2 =
    ((blockLengthCm + mortarJointCm) / 100) * ((blockHeightCm + mortarJointCm) / 100);
  const blocksPerM2 = blockAreaWithJointM2 > 0 ? 1 / blockAreaWithJointM2 : 12.5;
  const totalBlocksWithWaste = Math.ceil(wallAreaM2 * blocksPerM2 * 1.05);
  const singleBlockVolM3 = (blockLengthCm / 100) * (blockHeightCm / 100) * (blockWidthCm / 100);
  const layingMortarM3 = Math.max(0, (1 - blocksPerM2 * (blockLengthCm / 100) * (blockHeightCm / 100)) * (blockWidthCm / 100) * wallAreaM2 * 1.1);

  const handleSaveEngineeringRecord = () => {
    if (activeSubTab === 'escadas_rampas') {
      onSaveRecord({
        id: `CALC-ENG-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        module: 'Engenharia',
        category: 'Escadas e Rampas Acessíveis',
        title: `Escada H=${stairHeightCm} cm (${stepsCount} espelhos) & Rampa i=${rampSlopePct}%`,
        projectRef: 'PRJ-ENG-CIRC',
        author: 'Engenheiro Civil Responsável',
        inputs: [
          { label: 'Desnível Escada (H)', value: stairHeightCm.toFixed(1), unit: 'cm' },
          { label: 'Piso Adotado (P)', value: treadDepthCm.toFixed(1), unit: 'cm' },
          { label: 'Desnível Rampa (h)', value: rampHeightM.toFixed(2), unit: 'm' },
          { label: 'Inclinação Rampa (i)', value: rampSlopePct.toFixed(2), unit: '%' }
        ],
        outputs: [
          { label: 'Espelhos da Escada', value: `${stepsCount} × ${actualRiserCm.toFixed(2)}`, unit: 'cm', highlight: true },
          { label: 'Índice de Blondel (2E+P)', value: blondelValue.toFixed(2), unit: 'cm', highlight: true },
          { label: 'Comprimento Rampa', value: rampHorizontalRunM.toFixed(2), unit: 'm', highlight: true },
          { label: 'Segmentos de Rampa', value: String(rampSegmentsCount), unit: 'lanços' }
        ],
        formulas: [
          `Blondel: 2E + P = 2(${actualRiserCm.toFixed(2)}) + ${treadDepthCm.toFixed(2)} = ${blondelValue.toFixed(2)} cm`,
          `Comprimento Rampa: C = (h × 100) / i = (${rampHeightM} × 100) / ${rampSlopePct} = ${rampHorizontalRunM.toFixed(2)} m`
        ],
        normativeRefs: ['ABNT NBR 9050:2020 (Seção 6.6.2 e 6.8.2)', 'ABNT NBR 9077:2001'],
        complianceStatus: stairCompliant && rampCompliant ? 'CONFORME' : 'ATENÇÃO',
        complianceNotes:
          stairCompliant && rampCompliant
            ? 'Escada e rampa atendem integralmente os limites de conforto e segurança da NBR 9050 e NBR 9077.'
            : 'Verifique limites de espelho (16 a 18 cm), Blondel (63 a 65 cm) ou inclinação máxima de rampa (8,33%).'
      });
    } else if (activeSubTab === 'telhados') {
      onSaveRecord({
        id: `CALC-ENG-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        module: 'Engenharia',
        category: 'Telhados e Coberturas',
        title: `Cobertura ${roofWaters} Água(s) — Inclinação ${roofSlopePct}%`,
        projectRef: 'PRJ-ENG-COB',
        author: 'Engenheiro Civil Responsável',
        inputs: [
          { label: 'Planta Base', value: `${roofWidthM} × ${roofLengthM}`, unit: 'm' },
          { label: 'Beiral', value: eaveOverhangM.toFixed(2), unit: 'm' },
          { label: 'Águas / Inclinação', value: `${roofWaters} águas / ${roofSlopePct}%` }
        ],
        outputs: [
          { label: 'Área Inclinada Real', value: roofInclinedArea.toFixed(2), unit: 'm²', highlight: true },
          { label: 'Altura da Cumeeira', value: ridgeHeightM.toFixed(2), unit: 'm', highlight: true },
          { label: 'Quantidade de Telhas (+5%)', value: String(roofTilesTotal), unit: 'unid', highlight: true },
          { label: 'Ripas / Caibros', value: `${battensLinearM} / ${raftersLinearM}`, unit: 'm' }
        ],
        formulas: [
          `Fator Inclinação = √(1 + (${roofSlopePct}/100)²) = ${slopeCorrectionFactor.toFixed(4)}`,
          `A_inclinada = ${roofHorizProjectionArea.toFixed(2)} × ${slopeCorrectionFactor.toFixed(4)} = ${roofInclinedArea.toFixed(2)} m²`
        ],
        normativeRefs: ['ABNT NBR 15575-5', 'ABNT NBR 7190 (Estruturas de Madeira)'],
        complianceStatus: 'CONFORME',
        complianceNotes: 'Quantitativo inclui 5% de reserva técnica para quebras e recortes em espigões/cumeeiras.'
      });
    } else {
      onSaveRecord({
        id: `CALC-ENG-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        module: 'Engenharia',
        category: 'Concreto, Aço, Alvenaria e Fundações',
        title: `Concreto (${totalConcreteVolM3.toFixed(2)} m³) & Sapata Isolada (${footingLoadKn} kN)`,
        projectRef: 'PRJ-ENG-EST',
        author: 'Engenheiro Civil Responsável',
        inputs: [
          { label: 'Volume de Concreto', value: totalConcreteVolM3.toFixed(2), unit: 'm³' },
          { label: 'Carga Axial Sapata (Nk)', value: footingLoadKn.toFixed(0), unit: 'kN' },
          { label: 'Tensão Admissível Solo', value: soilSigmaMpa.toFixed(2), unit: 'MPa' }
        ],
        outputs: [
          { label: 'Consumo de Aço CA-50', value: totalSteelKg.toFixed(1), unit: 'kg', highlight: true },
          { label: 'Cimento CP-II (50 kg)', value: String(cementBags50kg), unit: 'sacos' },
          { label: 'Base da Sapata Quadrada', value: `${footingSideM.toFixed(2)} × ${footingSideM.toFixed(2)}`, unit: 'm', highlight: true },
          { label: 'Carga Total Laje (NBR 6120)', value: totalSlabLoadKnM2.toFixed(2), unit: 'kN/m²' }
        ],
        formulas: [
          `A_sapata = (1,05 × ${footingLoadKn}) / ${soilSigmaKnM2} = ${footingAreaM2.toFixed(2)} m²`,
          `Carga Laje = g_pp (${slabSelfWeightKnM2.toFixed(2)}) + g_rev (1,00) + q (${slabOccupancyKnM2.toFixed(2)}) = ${totalSlabLoadKnM2.toFixed(2)} kN/m²`
        ],
        normativeRefs: ['ABNT NBR 6118:2023', 'ABNT NBR 6120:2019', 'ABNT NBR 6122:2022'],
        complianceStatus: 'CONFORME',
        complianceNotes: 'Pré-dimensionamento estrutural compatível com Estados-Limites de Serviço e Último.'
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Módulo 03</span>
            <span aria-hidden="true">·</span>
            <span>Engenharia Civil & Estruturas</span>
            <span aria-hidden="true">·</span>
            <span>NBR 9050 / NBR 9077 / NBR 6118 / NBR 6120</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Escadas, Rampas, Coberturas, Concreto Armado, Fundações & Alvenaria
          </h2>
        </div>

        <button
          type="button"
          onClick={handleSaveEngineeringRecord}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <FilePlus2 className="w-4 h-4" />
          Registrar Cálculo no Memorial
        </button>
      </div>

      {/* Sub-navigation */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveSubTab('escadas_rampas')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeSubTab === 'escadas_rampas' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-sky-700" />
          01. Escadas (Blondel) & Rampas (NBR 9050)
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('telhados')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeSubTab === 'telhados' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home className="w-4 h-4 text-sky-700" />
          02. Telhados, Águas & Coberturas
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('concreto_fundacoes')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeSubTab === 'concreto_fundacoes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-sky-700" />
          03. Concreto, Aço, Sapatas & Cargas (NBR 6118/6120)
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('alvenaria_insumos')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeSubTab === 'alvenaria_insumos' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BrickWall className="w-4 h-4 text-sky-700" />
          04. Alvenaria, Blocos, Tijolos & Argamassa
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('conversoes_eng')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeSubTab === 'conversoes_eng' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-4 h-4 text-sky-700" />
          05. Conversões de Unidades Estruturais
        </button>
      </div>

      {/* TAB 1: ESCADAS & RAMPAS */}
      {activeSubTab === 'escadas_rampas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Stair Calculator */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Dimensionamento de Escadas (Fórmula de Blondel)
              </h3>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold ${
                  stairCompliant ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {stairCompliant ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {stairCompliant ? 'NBR 9050 / 9077 OK' : 'FORA DE FAIXA'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Desnível Piso a Piso H (cm)</label>
                <input
                  type="number"
                  step="1"
                  value={stairHeightCm}
                  onChange={(e) => setStairHeightCm(Math.max(20, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Espelho Alvo E (16 a 18 cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={desiredRiserCm}
                  onChange={(e) => setDesiredRiserCm(Math.max(10, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Piso Adotado P (28 a 32 cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={treadDepthCm}
                  onChange={(e) => setTreadDepthCm(Math.max(20, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Patamar Intermediário (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={stairLandingM}
                  onChange={(e) => setStairLandingM(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs text-slate-500">Nº de Espelhos</div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                  {stepsCount} degraus
                </div>
                <div className="text-xs font-mono text-slate-500">E = {actualRiserCm.toFixed(2)} cm</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs text-slate-500">Blondel (2E + P)</div>
                <div className="text-xl font-bold font-mono tabular-nums text-sky-700 mt-0.5">
                  {blondelValue.toFixed(2)} cm
                </div>
                <div className="text-xs font-mono text-slate-500">Ideal: 63–64 cm</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs text-slate-500">Projeção Total</div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                  {stairHorizontalRunM.toFixed(2)} m
                </div>
                <div className="text-xs font-mono text-slate-500">θ = {stairAngleDeg.toFixed(1)}°</div>
              </div>
            </div>

            {/* Technical Stair Profile SVG */}
            <div className="bg-slate-900 rounded-lg p-4 text-white">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                <span>CORTE ESQUEMÁTICO DA ESCADA</span>
                <span>2E + P = {blondelValue.toFixed(2)} cm</span>
              </div>
              <svg viewBox="0 0 400 135" className="w-full h-32">
                <polyline
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                  points="30,115 30,97 65,97 65,79 100,79 100,61 135,61 135,43 170,43 170,25 260,25"
                />
                <line x1="30" y1="115" x2="260" y2="115" stroke="#64748B" strokeDasharray="4 4" />
                <line x1="260" y1="25" x2="260" y2="115" stroke="#64748B" strokeDasharray="4 4" />
                <text x="270" y="75" fill="#E2E8F0" fontSize="11" fontFamily="IBM Plex Mono">
                  H = {stairHeightCm} cm
                </text>
                <text x="75" y="128" fill="#94A3B8" fontSize="10" fontFamily="IBM Plex Mono">
                  C = {stairHorizontalRunM.toFixed(2)} m ({stepsCount - 1} pisos de {treadDepthCm} cm)
                </text>
              </svg>
            </div>
          </div>

          {/* Ramp Calculator */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Cálculo de Rampas Acessíveis (ABNT NBR 9050 — Tabela 6)
              </h3>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold ${
                  rampCompliant ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {rampCompliant ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {rampCompliant ? 'CONFORME NBR 9050' : 'INCLINAÇÃO EXCEDIDA'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Desnível Total a Vencer h (m)</label>
                <input
                  type="number"
                  step="0.05"
                  value={rampHeightM}
                  onChange={(e) => setRampHeightM(Math.max(0.05, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Inclinação i (%) — Máx 8,33%</label>
                <input
                  type="number"
                  step="0.25"
                  value={rampSlopePct}
                  onChange={(e) => setRampSlopePct(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg text-sm">
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-600">Comprimento Horizontal de Rampa (C = h × 100 / i)</span>
                <span className="font-mono font-semibold tabular-nums text-sky-700">
                  {rampHorizontalRunM.toFixed(2)} m
                </span>
              </div>
              <div className="flex justify-between px-4 py-2.5 bg-slate-50/60">
                <span className="text-slate-600">Segmentos Exigidos (Desnível máx/seg: {maxRampSegmentHeight.toFixed(2)} m)</span>
                <span className="font-mono font-semibold tabular-nums">{rampSegmentsCount} segmento(s)</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-600">Comprimento Total c/ Patamares de 1,20 m</span>
                <span className="font-mono font-semibold tabular-nums">
                  {(rampHorizontalRunM + Math.max(0, rampSegmentsCount - 1) * 1.2).toFixed(2)} m
                </span>
              </div>
            </div>

            {/* Ramp SVG */}
            <div className="bg-slate-900 rounded-lg p-4 text-white">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                <span>PERFIL LONGITUDINAL DA RAMPA (i = {rampSlopePct.toFixed(2)}%)</span>
                <span>RELAÇÃO 1 : {(100 / Math.max(0.1, rampSlopePct)).toFixed(1)}</span>
              </div>
              <svg viewBox="0 0 400 120" className="w-full h-28">
                <polygon points="30,95 320,95 320,35" fill="#0284C7" fillOpacity="0.25" stroke="#38BDF8" strokeWidth="2" />
                <text x="150" y="88" fill="#E2E8F0" fontSize="11" fontFamily="IBM Plex Mono">
                  Projeção C = {rampHorizontalRunM.toFixed(2)} m
                </text>
                <text x="328" y="68" fill="#38BDF8" fontSize="11" fontFamily="IBM Plex Mono">
                  h = {rampHeightM.toFixed(2)} m
                </text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TELHADOS E COBERTURAS */}
      {activeSubTab === 'telhados' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Geometria do Telhado, Quantidade de Águas e Telhas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Largura / Vão Base (m)</label>
                <input
                  type="number"
                  step="0.5"
                  value={roofWidthM}
                  onChange={(e) => setRoofWidthM(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Comprimento Base (m)</label>
                <input
                  type="number"
                  step="0.5"
                  value={roofLengthM}
                  onChange={(e) => setRoofLengthM(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Projeção de Beiral (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={eaveOverhangM}
                  onChange={(e) => setEaveOverhangM(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Quantidade de Águas</label>
                <select
                  value={roofWaters}
                  onChange={(e) => setRoofWaters(parseInt(e.target.value, 10) as any)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value={1}>1 Água (Meia-Água)</option>
                  <option value={2}>2 Águas (Cumeeira Central)</option>
                  <option value={3}>3 Águas (Tacaniça Frontal)</option>
                  <option value={4}>4 Águas (Espigões nos 4 Cantos)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Inclinação do Telhado (%)</label>
                <input
                  type="number"
                  step="1"
                  value={roofSlopePct}
                  onChange={(e) => setRoofSlopePct(Math.max(5, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Rendimento da Telha (unid/m²)</label>
                <select
                  value={roofTileYieldPerM2}
                  onChange={(e) => setRoofTileYieldPerM2(parseFloat(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value={16}>Cerâmica Romana / Americana (16 telhas/m²)</option>
                  <option value={17}>Cerâmica Portuguesa (17 telhas/m²)</option>
                  <option value={24}>Cerâmica Colonial (24 telhas/m²)</option>
                  <option value={10.5}>Telha de Concreto (10,5 telhas/m²)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Área Inclinada, Cumeeira e Madeiramento
            </h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg text-sm">
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-600">Área em Projeção Horizontal (c/ Beiral)</span>
                <span className="font-mono font-semibold tabular-nums">{roofHorizProjectionArea.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 bg-slate-50/60">
                <span className="text-slate-600">Área Inclinada Real (Fator {slopeCorrectionFactor.toFixed(4)})</span>
                <span className="font-mono font-semibold tabular-nums text-sky-700">{roofInclinedArea.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-600">Altura da Cumeeira / Pendural (h)</span>
                <span className="font-mono font-semibold tabular-nums">{ridgeHeightM.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 bg-slate-50/60">
                <span className="text-slate-600">Total de Telhas Necessárias (+5% quebra)</span>
                <span className="font-mono font-semibold tabular-nums text-slate-900">{roofTilesTotal} telhas</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-600">Madeiramento: Ripas / Caibros</span>
                <span className="font-mono font-semibold tabular-nums">
                  {battensLinearM} m ripas · {raftersLinearM} m caibros
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONCRETO, AÇO, FUNDAÇÕES E CARGAS */}
      {activeSubTab === 'concreto_fundacoes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Volume de Concreto, Armadura, Sapata Isolada e Cargas (NBR 6118 / 6120)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Comprimento do Elemento (m)</label>
                <input
                  type="number"
                  step="0.5"
                  value={concLengthM}
                  onChange={(e) => setConcLengthM(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Largura do Elemento (m)</label>
                <input
                  type="number"
                  step="0.5"
                  value={concWidthM}
                  onChange={(e) => setConcWidthM(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Espessura / Altura (m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={concThicknessM}
                  onChange={(e) => setConcThicknessM(Math.max(0.05, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Quantidade de Elementos Iguais</label>
                <input
                  type="number"
                  value={concElementsCount}
                  onChange={(e) => setConcElementsCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Taxa Média de Aço (kg/m³)</label>
                <input
                  type="number"
                  value={steelRateKgM3}
                  onChange={(e) => setSteelRateKgM3(Math.max(20, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Carga Axial no Pilar Nk (kN)</label>
                <input
                  type="number"
                  value={footingLoadKn}
                  onChange={(e) => setFootingLoadKn(Math.max(10, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Tensão Admissível do Solo σ_adm (MPa)</label>
                <input
                  type="number"
                  step="0.05"
                  value={soilSigmaMpa}
                  onChange={(e) => setSoilSigmaMpa(Math.max(0.05, parseFloat(e.target.value) || 0.1))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Sobrecarga de Utilização (kN/m²)</label>
                <input
                  type="number"
                  step="0.5"
                  value={slabOccupancyKnM2}
                  onChange={(e) => setSlabOccupancyKnM2(Math.max(0.5, parseFloat(e.target.value) || 1.5))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Resultados Estruturais & Pré-Dimensionamento de Fundação
            </h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg text-sm">
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-600">Volume Total de Concreto Usinado / Virado</span>
                <span className="font-mono font-semibold tabular-nums text-sky-700">{totalConcreteVolM3.toFixed(2)} m³</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 bg-slate-50/60">
                <span className="text-slate-600">Peso Total de Armadura CA-50/CA-60</span>
                <span className="font-mono font-semibold tabular-nums">{totalSteelKg.toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-600">Insumos Traço C25: Cimento / Areia / Brita</span>
                <span className="font-mono font-semibold tabular-nums">
                  {cementBags50kg} sc · {sandVolumeM3.toFixed(2)} m³ · {gravelVolumeM3.toFixed(2)} m³
                </span>
              </div>
              <div className="flex justify-between px-4 py-2.5 bg-slate-50/60">
                <span className="text-slate-600">Área Mínima da Sapata Isolada (1,05 × Nk / σ_adm)</span>
                <span className="font-mono font-semibold tabular-nums">{footingAreaM2.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-600">Sapata Rígida Recomendada (Base × Altura)</span>
                <span className="font-mono font-semibold tabular-nums text-emerald-700">
                  {footingSideM.toFixed(2)} × {footingSideM.toFixed(2)} m (h = {(footingHeightM * 100).toFixed(0)} cm)
                </span>
              </div>
              <div className="flex justify-between px-4 py-2.5 bg-slate-50/60">
                <span className="text-slate-600">Carga Distribuída Total na Laje (NBR 6120)</span>
                <span className="font-mono font-semibold tabular-nums">{totalSlabLoadKnM2.toFixed(2)} kN/m²</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ALVENARIA, BLOCOS, TIJOLOS E ARGAMASSA */}
      {activeSubTab === 'alvenaria_insumos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Quantitativo de Blocos, Tijolos e Argamassa de Assentamento
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Área Líquida de Alvenaria (m²)</label>
                <input
                  type="number"
                  value={wallAreaM2}
                  onChange={(e) => setWallAreaM2(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Comprimento do Bloco/Tijolo (cm)</label>
                <input
                  type="number"
                  value={blockLengthCm}
                  onChange={(e) => setBlockLengthCm(Math.max(5, parseFloat(e.target.value) || 19))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Altura do Bloco/Tijolo (cm)</label>
                <input
                  type="number"
                  value={blockHeightCm}
                  onChange={(e) => setBlockHeightCm(Math.max(4, parseFloat(e.target.value) || 19))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Espessura da Parede / Bloco (cm)</label>
                <input
                  type="number"
                  value={blockWidthCm}
                  onChange={(e) => setBlockWidthCm(Math.max(7, parseFloat(e.target.value) || 14))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Espessura da Junta de Argamassa (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={mortarJointCm}
                  onChange={(e) => setMortarJointCm(Math.max(0.5, parseFloat(e.target.value) || 1.5))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Resumo de Alvenaria e Assentamento</h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg text-sm">
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-600">Consumo Unitário por m² de Parede</span>
                <span className="font-mono font-semibold tabular-nums">{blocksPerM2.toFixed(2)} blocos/m²</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 bg-slate-50/60">
                <span className="text-slate-600">Quantidade Total de Blocos / Tijolos (+5% perda)</span>
                <span className="font-mono font-semibold tabular-nums text-sky-700">{totalBlocksWithWaste} unidades</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-600">Volume de Argamassa de Assentamento (+10%)</span>
                <span className="font-mono font-semibold tabular-nums">{layingMortarM3.toFixed(3)} m³</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONVERSÕES DE UNIDADES DE ENGENHARIA */}
      {activeSubTab === 'conversoes_eng' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Conversor de Cargas e Forças (SI ↔ Técnico)</h3>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Força em Quilonewtons (kN)</label>
              <input
                type="number"
                value={forceKn}
                onChange={(e) => setForceKn(parseFloat(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
              />
            </div>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg text-sm">
              <div className="flex justify-between px-4 py-2">
                <span className="text-slate-600">Tonelada-força (tf — 1 tf ≈ 9,80665 kN)</span>
                <span className="font-mono font-semibold tabular-nums">{(forceKn / 9.80665).toFixed(3)} tf</span>
              </div>
              <div className="flex justify-between px-4 py-2 bg-slate-50/60">
                <span className="text-slate-600">Quilograma-força (kgf)</span>
                <span className="font-mono font-semibold tabular-nums">{((forceKn * 1000) / 9.80665).toFixed(1)} kgf</span>
              </div>
              <div className="flex justify-between px-4 py-2">
                <span className="text-slate-600">Newtons (N)</span>
                <span className="font-mono font-semibold tabular-nums">{(forceKn * 1000).toFixed(0)} N</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Conversor de Tensão e Resistência (MPa ↔ kgf/cm²)</h3>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tensão / f_ck em Megapascal (MPa)</label>
              <input
                type="number"
                value={stressMpa}
                onChange={(e) => setStressMpa(parseFloat(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
              />
            </div>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg text-sm">
              <div className="flex justify-between px-4 py-2">
                <span className="text-slate-600">Quilograma-força por cm² (kgf/cm²)</span>
                <span className="font-mono font-semibold tabular-nums">{(stressMpa * 10.19716).toFixed(2)} kgf/cm²</span>
              </div>
              <div className="flex justify-between px-4 py-2 bg-slate-50/60">
                <span className="text-slate-600">Quilonewtons por m² (kN/m² ou kPa)</span>
                <span className="font-mono font-semibold tabular-nums">{(stressMpa * 1000).toFixed(0)} kN/m²</span>
              </div>
              <div className="flex justify-between px-4 py-2">
                <span className="text-slate-600">Tonelada-força por m² (tf/m²)</span>
                <span className="font-mono font-semibold tabular-nums">{(stressMpa * 101.9716).toFixed(2)} tf/m²</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
