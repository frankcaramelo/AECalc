import { useState } from 'react';
import { INITIAL_CALCULATION_RECORDS, INITIAL_NORMAS_ABNT } from './data/normasData';
import { CalculationRecord, NormaTechnicalEntry } from './types/domain';
import { ScientificModule } from './components/ScientificModule';
import { ArchitectureModule } from './components/ArchitectureModule';
import { EngineeringModule } from './components/EngineeringModule';
import { NormasModule } from './components/NormasModule';
import { ReportsAndArchitectureModule } from './components/ReportsAndArchitectureModule';

type PrimaryModule = 'cientifico' | 'arquitetura' | 'engenharia' | 'normas' | 'relatorios';

export function App() {
  const [activeModule, setActiveModule] = useState<PrimaryModule>('arquitetura');
  const [records, setRecords] = useState<CalculationRecord[]>(INITIAL_CALCULATION_RECORDS);
  const [normas, setNormas] = useState<NormaTechnicalEntry[]>(INITIAL_NORMAS_ABNT);
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  const handleSaveRecord = (newRecord: CalculationRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
    setFeedbackBanner(`Memória "${newRecord.title}" adicionada ao Memorial de Cálculo (${records.length + 1} itens).`);
    setTimeout(() => {
      setFeedbackBanner(null);
    }, 4000);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddNorma = (newNorma: NormaTechnicalEntry) => {
    setNormas((prev) => [newNorma, ...prev]);
    setFeedbackBanner(`Norma "${newNorma.code}" incorporada ao catálogo técnico parametrizado.`);
    setTimeout(() => {
      setFeedbackBanner(null);
    }, 4000);
  };

  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Data_Hora',
      'Modulo',
      'Categoria',
      'Titulo',
      'Projeto',
      'Responsavel',
      'Entradas',
      'Resultados',
      'Formulas',
      'Normas_ABNT',
      'Status_Conformidade'
    ];
    const rows = records.map((r) => [
      r.id,
      r.timestamp,
      r.module,
      r.category,
      `"${r.title.replace(/"/g, '""')}"`,
      r.projectRef,
      `"${r.author.replace(/"/g, '""')}"`,
      `"${r.inputs.map((i) => `${i.label}: ${i.value} ${i.unit || ''}`).join(' | ')}"`,
      `"${r.outputs.map((o) => `${o.label}: ${o.value} ${o.unit || ''}`).join(' | ')}"`,
      `"${r.formulas.join(' ; ').replace(/"/g, '""')}"`,
      `"${r.normativeRefs.join(', ')}"`,
      r.complianceStatus
    ]);
    const csvString = '\uFEFF' + [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `memorial_calculo_arqeng_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="flex items-center justify-between gap-8 px-6 lg:px-10 py-4 bg-white border-b border-slate-200 sticky top-0 z-30 no-print">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveModule('arquitetura');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          ArqEng TechCalc
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setActiveModule('cientifico')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeModule === 'cientifico'
                ? 'text-slate-900 font-semibold border-b-2 border-sky-700'
                : ''
            }`}
          >
            Científico
          </button>
          <button
            type="button"
            onClick={() => setActiveModule('arquitetura')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeModule === 'arquitetura'
                ? 'text-slate-900 font-semibold border-b-2 border-sky-700'
                : ''
            }`}
          >
            Arquitetura
          </button>
          <button
            type="button"
            onClick={() => setActiveModule('engenharia')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeModule === 'engenharia'
                ? 'text-slate-900 font-semibold border-b-2 border-sky-700'
                : ''
            }`}
          >
            Engenharia
          </button>
          <button
            type="button"
            onClick={() => setActiveModule('normas')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeModule === 'normas'
                ? 'text-slate-900 font-semibold border-b-2 border-sky-700'
                : ''
            }`}
          >
            Normas ABNT
          </button>
          <button
            type="button"
            onClick={() => setActiveModule('relatorios')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeModule === 'relatorios'
                ? 'text-slate-900 font-semibold border-b-2 border-sky-700'
                : ''
            }`}
          >
            Memorial & Arquitetura ({records.length})
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Exportar Planilha CSV
          </button>
        </div>
      </header>

      {/* Mobile Navigation Bar */}
      <div className="flex md:hidden items-center gap-2 overflow-x-auto px-4 py-2.5 bg-white border-b border-slate-200 no-print">
        {[
          { id: 'cientifico', label: 'Científico' },
          { id: 'arquitetura', label: 'Arquitetura' },
          { id: 'engenharia', label: 'Engenharia' },
          { id: 'normas', label: 'Normas ABNT' },
          { id: 'relatorios', label: `Memorial (${records.length})` }
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveModule(item.id as PrimaryModule)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 ${
              activeModule === item.id ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Feedback Notification Banner */}
      {feedbackBanner && (
        <div className="bg-sky-900 text-white px-6 lg:px-10 py-2.5 text-xs font-medium flex items-center justify-between no-print">
          <span>{feedbackBanner}</span>
          <button
            type="button"
            onClick={() => setActiveModule('relatorios')}
            className="underline font-semibold ml-4 whitespace-nowrap cursor-pointer"
          >
            Abrir Memorial de Cálculo
          </button>
        </div>
      )}

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-[1360px] mx-auto px-6 lg:px-10 py-8">
        {activeModule === 'cientifico' && <ScientificModule onSaveRecord={handleSaveRecord} />}
        {activeModule === 'arquitetura' && <ArchitectureModule onSaveRecord={handleSaveRecord} />}
        {activeModule === 'engenharia' && <EngineeringModule onSaveRecord={handleSaveRecord} />}
        {activeModule === 'normas' && <NormasModule normas={normas} onAddNorma={handleAddNorma} />}
        {activeModule === 'relatorios' && (
          <ReportsAndArchitectureModule
            records={records}
            onDeleteRecord={handleDeleteRecord}
            onExportCsv={handleExportCsv}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 lg:px-10 py-5 text-xs text-slate-500 no-print">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            ArqEng TechCalc — Plataforma Profissional de Cálculos Técnicos para Arquitetura, Urbanismo e Engenharia Civil
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveModule('normas')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Catálogo ABNT/NBR
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveModule('relatorios')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Arquitetura Python & 20 Entregáveis
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
