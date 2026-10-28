import React, { useState } from 'react';
import { BookOpen, Search, PlusCircle, X } from 'lucide-react';
import { NormaTechnicalEntry } from '../types/domain';

interface NormasModuleProps {
  normas: NormaTechnicalEntry[];
  onAddNorma: (norma: NormaTechnicalEntry) => void;
}

export const NormasModule: React.FC<NormasModuleProps> = ({ normas, onAddNorma }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // New Norma Form State
  const [newCode, setNewCode] = useState<string>('ABNT NBR 5626:2020');
  const [newTitle, setNewTitle] = useState<string>('Sistemas prediais de água fria e água quente — Projeto, execução, operação e manutenção');
  const [newYear, setNewYear] = useState<number>(2020);
  const [newDomain, setNewDomain] = useState<NormaTechnicalEntry['domain']>('Segurança & Desempenho');
  const [newSummary, setNewSummary] = useState<string>(
    'Especifica requisitos para projeto e dimensionamento de reservatórios prediais de água potável, pressões dinâmicas/estáticas e velocidades máximas.'
  );
  const [newParamItem, setNewParamItem] = useState<string>('Reserva Técnica e Consumo Diário Per Capita');
  const [newParamReq, setNewParamReq] = useState<string>('Dimensionamento de reservatório superior (40%) e inferior (60%) para no mínimo 2 dias de consumo.');
  const [newParamLimit, setNewParamLimit] = useState<string>('Pressão estática máx ≤ 40 m.c.a. (400 kPa)');

  const filteredNormas = normas.filter((n) => {
    const matchesDomain = selectedDomain === 'ALL' || n.domain === selectedDomain;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      n.code.toLowerCase().includes(q) ||
      n.title.toLowerCase().includes(q) ||
      n.summary.toLowerCase().includes(q) ||
      n.parameters.some(
        (p) =>
          p.item.toLowerCase().includes(q) ||
          p.requirement.toLowerCase().includes(q) ||
          p.formulaOrLimit.toLowerCase().includes(q)
      );
    return matchesDomain && matchesSearch;
  });

  const handleCreateNorma = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newTitle.trim()) return;
    const entry: NormaTechnicalEntry = {
      id: `nbr-custom-${Date.now()}`,
      code: newCode.trim(),
      title: newTitle.trim(),
      committee: 'ABNT/CB-002 Construção Civil',
      year: newYear,
      status: 'Vigente',
      domain: newDomain,
      summary: newSummary.trim(),
      parameters: [
        {
          item: newParamItem.trim(),
          requirement: newParamReq.trim(),
          formulaOrLimit: newParamLimit.trim(),
          section: 'Seção Principal'
        }
      ],
      updateStrategyNote: 'Cadastrada dinamicamente no catálogo extensível de normas técnicas.'
    };
    onAddNorma(entry);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Módulo 04</span>
            <span aria-hidden="true">·</span>
            <span>Catálogo Normativo Parametrizado</span>
            <span aria-hidden="true">·</span>
            <span>ABNT / NBR</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Base de Normas Técnicas ABNT e Parâmetros de Validação
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Consulta rápida de limites normativos (NBR 9050, 9077, 6120, 6118, 6492, 13532 e 15575) com arquitetura aberta para cadastro de novas NBRs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
          {showAddForm ? 'Fechar Cadastro' : 'Adicionar Nova Norma ABNT'}
        </button>
      </div>

      {/* Add New Norma Form */}
      {showAddForm && (
        <form onSubmit={handleCreateNorma} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Cadastrar Nova Norma Técnica no Catálogo Paramétrico
            </h3>
            <span className="text-xs font-mono text-slate-500">Open-Closed Normative Schema</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Código da Norma</label>
              <input
                type="text"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Ano da Edição Vigente</label>
              <input
                type="number"
                required
                value={newYear}
                onChange={(e) => setNewYear(parseInt(e.target.value, 10) || 2024)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Domínio de Aplicação</label>
              <select
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value as any)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="Arquitetura & Acessibilidade">Arquitetura & Acessibilidade</option>
                <option value="Estruturas & Fundações">Estruturas & Fundações</option>
                <option value="Segurança & Desempenho">Segurança & Desempenho</option>
                <option value="Representação & Projetos">Representação & Projetos</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Título Oficial da Norma</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Escopo / Resumo Técnico</label>
              <input
                type="text"
                required
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Parâmetro Técnico Principal</label>
              <input
                type="text"
                value={newParamItem}
                onChange={(e) => setNewParamItem(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Descrição da Exigência</label>
              <input
                type="text"
                value={newParamReq}
                onChange={(e) => setNewParamReq(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Fórmula ou Limite Numérico</label>
              <input
                type="text"
                value={newParamLimit}
                onChange={(e) => setNewParamLimit(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg cursor-pointer"
            >
              Salvar Norma no Catálogo
            </button>
          </div>
        </form>
      )}

      {/* Search & Domain Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por código (ex: NBR 9050, Blondel, cobrimento, CAA II)..."
            className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sky-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          {[
            { id: 'ALL', label: 'Todas as Normas' },
            { id: 'Arquitetura & Acessibilidade', label: 'Acessibilidade' },
            { id: 'Estruturas & Fundações', label: 'Estruturas' },
            { id: 'Segurança & Desempenho', label: 'Desempenho & Incêndio' },
            { id: 'Representação & Projetos', label: 'Projetos & Desenho' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedDomain(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedDomain === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Standards List */}
      <div className="space-y-6">
        {filteredNormas.map((norma) => (
          <div key={norma.id} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-semibold text-sky-700">{norma.code}</span>
                  <span aria-hidden="true">·</span>
                  <span>{norma.domain}</span>
                  <span aria-hidden="true">·</span>
                  <span>{norma.committee}</span>
                  <span aria-hidden="true">·</span>
                  <span>Status: {norma.status}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{norma.title}</h3>
              </div>
              <div className="text-xs font-mono text-slate-500 shrink-0">
                Edição Base: {norma.year}
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">{norma.summary}</p>

            {/* Parameters Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                    <th className="py-2.5 px-4">Critério / Item Normativo</th>
                    <th className="py-2.5 px-4">Requisito Técnico</th>
                    <th className="py-2.5 px-4">Fórmula / Limite Paramétrico</th>
                    <th className="py-2.5 px-4">Seção NBR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {norma.parameters.map((param, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{param.item}</td>
                      <td className="py-2.5 px-4 text-slate-600">{param.requirement}</td>
                      <td className="py-2.5 px-4 font-mono font-medium text-sky-800 tabular-nums">
                        {param.formulaOrLimit}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-slate-500">{param.section}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Estratégia de atualização: {norma.updateStrategyNote}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
