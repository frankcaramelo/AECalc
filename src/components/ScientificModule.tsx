import React, { useState } from 'react';
import { Calculator, Compass, History, FilePlus2, RotateCcw } from 'lucide-react';
import { CalculationRecord } from '../types/domain';

interface ScientificModuleProps {
  onSaveRecord: (record: CalculationRecord) => void;
}

type AngleMode = 'DEG' | 'RAD' | 'GRAD';

export const ScientificModule: React.FC<ScientificModuleProps> = ({ onSaveRecord }) => {
  // Keypad & Expression Workbench State
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [secondaryValue, setSecondaryValue] = useState<string>('2');
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [lastFormula, setLastFormula] = useState<string>('Pronto para cálculo científico de precisão');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [localTape, setLocalTape] = useState<Array<{ expr: string; result: string; mode: string }>>([
    { expr: 'sin(30°) + cos(60°)', result: '1.00000000', mode: 'DEG' },
    { expr: '√(144) × π', result: '37.69911184', mode: 'RAD' },
    { expr: '5! (Fatorial)', result: '120', mode: 'INT' }
  ]);

  // Dedicated Angle & Slope Converter State
  const [convAngleInput, setConvAngleInput] = useState<string>('30');
  const [convAngleSource, setConvAngleSource] = useState<'DEG' | 'RAD' | 'GRAD' | 'SLOPE'>('DEG');

  const toRadians = (val: number, mode: AngleMode): number => {
    if (mode === 'RAD') return val;
    if (mode === 'DEG') return (val * Math.PI) / 180;
    return (val * Math.PI) / 200;
  };

  const fromRadians = (rad: number, mode: AngleMode): number => {
    if (mode === 'RAD') return rad;
    if (mode === 'DEG') return (rad * 180) / Math.PI;
    return (rad * 200) / Math.PI;
  };

  const formatNum = (n: number): string => {
    if (!Number.isFinite(n)) return 'Erro: Indefinido';
    if (Math.abs(n) < 1e-12) return '0';
    const fixed = Number(n.toPrecision(10));
    return String(fixed);
  };

  const recordToTape = (expr: string, result: string) => {
    setLastFormula(`${expr} = ${result}`);
    setLocalTape((prev) => [{ expr, result, mode: angleMode }, ...prev.slice(0, 14)]);
  };

  const handleDigit = (digit: string) => {
    setErrorMsg(null);
    if (digit === '.' && displayValue.includes('.')) return;
    setDisplayValue((prev) => (prev === '0' && digit !== '.' ? digit : prev + digit));
  };

  const handleBinaryOperation = (op: '+' | '-' | '×' | '÷' | '%' | 'pow' | 'nroot' | 'logb') => {
    setErrorMsg(null);
    const a = parseFloat(displayValue);
    const b = parseFloat(secondaryValue);
    if (Number.isNaN(a) || Number.isNaN(b)) {
      setErrorMsg('Insira valores numéricos válidos para X e Y.');
      return;
    }

    let res = 0;
    let formula = '';

    switch (op) {
      case '+':
        res = a + b;
        formula = `${a} + ${b}`;
        break;
      case '-':
        res = a - b;
        formula = `${a} - ${b}`;
        break;
      case '×':
        res = a * b;
        formula = `${a} × ${b}`;
        break;
      case '÷':
        if (b === 0) {
          setErrorMsg('Divisão por zero não é permitida.');
          return;
        }
        res = a / b;
        formula = `${a} ÷ ${b}`;
        break;
      case '%':
        res = (a * b) / 100;
        formula = `${b}% de ${a} = (${a} × ${b}) / 100`;
        break;
      case 'pow':
        res = Math.pow(a, b);
        formula = `${a} ^ ${b}`;
        break;
      case 'nroot':
        if (b === 0) {
          setErrorMsg('O índice da raiz (Y) não pode ser zero.');
          return;
        }
        if (a < 0 && b % 2 === 0) {
          setErrorMsg('Raiz de índice par não admite radicando negativo no domínio real.');
          return;
        }
        res = a < 0 ? -Math.pow(Math.abs(a), 1 / b) : Math.pow(a, 1 / b);
        formula = `⁹√X com Y=${b}, X=${a} → ${a}^(1/${b})`;
        break;
      case 'logb':
        if (a <= 0 || b <= 0 || b === 1) {
          setErrorMsg('Logaritmo exige X > 0, base Y > 0 e Y ≠ 1.');
          return;
        }
        res = Math.log(a) / Math.log(b);
        formula = `log_${b}(${a}) = ln(${a}) / ln(${b})`;
        break;
    }

    const formatted = formatNum(res);
    setDisplayValue(formatted);
    recordToTape(formula, formatted);
  };

  const handleUnaryFunction = (
    fn:
      | 'sqrt'
      | 'cbrt'
      | 'sq'
      | 'ln'
      | 'log10'
      | 'sin'
      | 'cos'
      | 'tan'
      | 'asin'
      | 'acos'
      | 'atan'
      | 'sinh'
      | 'cosh'
      | 'tanh'
      | 'fact'
      | 'inv'
  ) => {
    setErrorMsg(null);
    const x = parseFloat(displayValue);
    if (Number.isNaN(x)) {
      setErrorMsg('Valor X inválido.');
      return;
    }

    let res = 0;
    let formula = '';

    switch (fn) {
      case 'sqrt':
        if (x < 0) {
          setErrorMsg('Raiz quadrada real requer X ≥ 0.');
          return;
        }
        res = Math.sqrt(x);
        formula = `√(${x})`;
        break;
      case 'cbrt':
        res = Math.cbrt(x);
        formula = `∛(${x})`;
        break;
      case 'sq':
        res = x * x;
        formula = `(${x})²`;
        break;
      case 'ln':
        if (x <= 0) {
          setErrorMsg('Logaritmo natural ln(X) requer X > 0.');
          return;
        }
        res = Math.log(x);
        formula = `ln(${x})`;
        break;
      case 'log10':
        if (x <= 0) {
          setErrorMsg('Logaritmo decimal log10(X) requer X > 0.');
          return;
        }
        res = Math.log10(x);
        formula = `log₁₀(${x})`;
        break;
      case 'sin':
        res = Math.sin(toRadians(x, angleMode));
        formula = `sin(${x} ${angleMode})`;
        break;
      case 'cos':
        res = Math.cos(toRadians(x, angleMode));
        formula = `cos(${x} ${angleMode})`;
        break;
      case 'tan':
        res = Math.tan(toRadians(x, angleMode));
        formula = `tan(${x} ${angleMode})`;
        break;
      case 'asin':
        if (x < -1 || x > 1) {
          setErrorMsg('Arco-seno exige valor entre -1 e +1.');
          return;
        }
        res = fromRadians(Math.asin(x), angleMode);
        formula = `arcsin(${x}) em ${angleMode}`;
        break;
      case 'acos':
        if (x < -1 || x > 1) {
          setErrorMsg('Arco-cosseno exige valor entre -1 e +1.');
          return;
        }
        res = fromRadians(Math.acos(x), angleMode);
        formula = `arccos(${x}) em ${angleMode}`;
        break;
      case 'atan':
        res = fromRadians(Math.atan(x), angleMode);
        formula = `arctan(${x}) em ${angleMode}`;
        break;
      case 'sinh':
        res = Math.sinh(x);
        formula = `sinh(${x})`;
        break;
      case 'cosh':
        res = Math.cosh(x);
        formula = `cosh(${x})`;
        break;
      case 'tanh':
        res = Math.tanh(x);
        formula = `tanh(${x})`;
        break;
      case 'inv':
        if (x === 0) {
          setErrorMsg('Divisão por zero em 1/X.');
          return;
        }
        res = 1 / x;
        formula = `1 / (${x})`;
        break;
      case 'fact': {
        if (x < 0 || !Number.isInteger(x)) {
          setErrorMsg('Fatorial (n!) exige número inteiro não-negativo.');
          return;
        }
        if (x > 170) {
          setErrorMsg('Overflow IEEE 754: informe n ≤ 170.');
          return;
        }
        let acc = 1;
        for (let i = 2; i <= x; i++) acc *= i;
        res = acc;
        formula = `${x}!`;
        break;
      }
    }

    const formatted = formatNum(res);
    setDisplayValue(formatted);
    recordToTape(formula, formatted);
  };

  const insertConstant = (name: string, val: number) => {
    setErrorMsg(null);
    const formatted = formatNum(val);
    setDisplayValue(formatted);
    setLastFormula(`Constante ${name} carregada = ${formatted}`);
  };

  const handleSaveToMemorial = () => {
    const newRecord: CalculationRecord = {
      id: `CALC-SCI-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      module: 'Científico',
      category: 'Matemática Aplicada & Trigonometria',
      title: `Cálculo Científico: ${lastFormula}`,
      projectRef: 'PRJ-GERAL',
      author: 'Memória Científica do Projeto',
      inputs: [
        { label: 'Operando Principal (X)', value: displayValue },
        { label: 'Operando Auxiliar / Base (Y)', value: secondaryValue },
        { label: 'Unidade Angular', value: angleMode }
      ],
      outputs: [{ label: 'Resultado Numérico', value: displayValue, highlight: true }],
      formulas: [lastFormula],
      normativeRefs: ['IEEE 754 Double Precision', 'SI — Sistema Internacional de Unidades'],
      complianceStatus: 'INFORMATIVO',
      complianceNotes: 'Memória de cálculo trigonométrica/algébrica auditada com precisão de 10 dígitos significativos.'
    };
    onSaveRecord(newRecord);
  };

  // Angle converter calculations
  const parsedConv = parseFloat(convAngleInput) || 0;
  let degValue = 0;
  if (convAngleSource === 'DEG') degValue = parsedConv;
  else if (convAngleSource === 'RAD') degValue = (parsedConv * 180) / Math.PI;
  else if (convAngleSource === 'GRAD') degValue = parsedConv * 0.9;
  else if (convAngleSource === 'SLOPE') degValue = (Math.atan(parsedConv / 100) * 180) / Math.PI;

  const radValue = (degValue * Math.PI) / 180;
  const gradValue = degValue / 0.9;
  const slopePctValue = Math.tan(radValue) * 100;

  const toDMS = (deg: number): string => {
    const sign = deg < 0 ? '-' : '';
    const abs = Math.abs(deg);
    const d = Math.floor(abs);
    const mFloat = (abs - d) * 60;
    const m = Math.floor(mFloat);
    const s = ((mFloat - m) * 60).toFixed(1);
    return `${sign}${d}° ${m}' ${s}"`;
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Módulo 01</span>
            <span aria-hidden="true">·</span>
            <span>Matemática Aplicada</span>
            <span aria-hidden="true">·</span>
            <span>Precisão IEEE 754</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Calculadora Científica de Engenharia & Conversor Angular
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Operações aritméticas, potenciação, radiciação, logaritmos, trigonometria direta/inversa, hiperbólicas, fatorial e topografia.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            {(['DEG', 'RAD', 'GRAD'] as AngleMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setAngleMode(mode)}
                className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  angleMode === mode
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSaveToMemorial}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FilePlus2 className="w-4 h-4" />
            Registrar no Memorial
          </button>
        </div>
      </div>

      {/* Main Grid: Workbench Left + Angle Converter & History Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Scientific Calculator Console (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          {/* Digital Readout */}
          <div className="bg-slate-900 text-white rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>EXPRESSÃO: {lastFormula}</span>
              <span>MODO ANGULAR: {angleMode}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">
                  Registrador Principal X (Resultado / Entrada)
                </label>
                <input
                  type="number"
                  step="any"
                  value={displayValue}
                  onChange={(e) => {
                    setErrorMsg(null);
                    setDisplayValue(e.target.value);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2.5 text-2xl font-mono tabular-nums text-white focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Operando Y (Expoente / Base / 2º Valor)
                </label>
                <input
                  type="number"
                  step="any"
                  value={secondaryValue}
                  onChange={(e) => {
                    setErrorMsg(null);
                    setSecondaryValue(e.target.value);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2.5 text-2xl font-mono tabular-nums text-sky-300 focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="text-xs text-amber-300 font-mono pt-1">
                Atenção: {errorMsg}
              </div>
            )}
          </div>

          {/* Mathematical Constants Bar */}
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-2">
              Constantes Matemáticas e Físicas de Precisão
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <button
                type="button"
                onClick={() => insertConstant('π (Pi)', Math.PI)}
                className="px-3 py-2 text-xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors cursor-pointer"
              >
                π = 3.1416
              </button>
              <button
                type="button"
                onClick={() => insertConstant('e (Euler)', Math.E)}
                className="px-3 py-2 text-xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors cursor-pointer"
              >
                e = 2.7183
              </button>
              <button
                type="button"
                onClick={() => insertConstant('φ (Áurea)', (1 + Math.sqrt(5)) / 2)}
                className="px-3 py-2 text-xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors cursor-pointer"
              >
                φ = 1.6180
              </button>
              <button
                type="button"
                onClick={() => insertConstant('g (Gravidade)', 9.80665)}
                className="px-3 py-2 text-xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors cursor-pointer"
              >
                g = 9.8067
              </button>
              <button
                type="button"
                onClick={() => insertConstant('√2 (Diagonal)', Math.SQRT2)}
                className="px-3 py-2 text-xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors cursor-pointer"
              >
                √2 = 1.4142
              </button>
              <button
                type="button"
                onClick={() => insertConstant('√3 (Trifásico)', Math.sqrt(3))}
                className="px-3 py-2 text-xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors cursor-pointer"
              >
                √3 = 1.7321
              </button>
            </div>
          </div>

          {/* Advanced Functions Matrix */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-500">
              Funções Científicas (Aplicadas sobre X ou par X, Y)
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => handleUnaryFunction('sin')}
                className="py-2.5 px-3 text-xs font-mono font-medium bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                sin(X)
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('cos')}
                className="py-2.5 px-3 text-xs font-mono font-medium bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                cos(X)
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('tan')}
                className="py-2.5 px-3 text-xs font-mono font-medium bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                tan(X)
              </button>
              <button
                type="button"
                onClick={() => handleBinaryOperation('pow')}
                className="py-2.5 px-3 text-xs font-mono font-medium bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                X ^ Y
              </button>
              <button
                type="button"
                onClick={() => handleBinaryOperation('nroot')}
                className="py-2.5 px-3 text-xs font-mono font-medium bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                ʸ√X
              </button>

              <button
                type="button"
                onClick={() => handleUnaryFunction('asin')}
                className="py-2.5 px-3 text-xs font-mono font-medium bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                arcsin(X)
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('acos')}
                className="py-2.5 px-3 text-xs font-mono font-medium bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                arccos(X)
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('atan')}
                className="py-2.5 px-3 text-xs font-mono font-medium bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                arctan(X)
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('sqrt')}
                className="py-2.5 px-3 text-xs font-mono font-medium bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                √X
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('cbrt')}
                className="py-2.5 px-3 text-xs font-mono font-medium bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                ∛X
              </button>

              <button
                type="button"
                onClick={() => handleUnaryFunction('sinh')}
                className="py-2.5 px-3 text-xs font-mono font-medium bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                sinh(X)
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('cosh')}
                className="py-2.5 px-3 text-xs font-mono font-medium bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                cosh(X)
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('tanh')}
                className="py-2.5 px-3 text-xs font-mono font-medium bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                tanh(X)
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('ln')}
                className="py-2.5 px-3 text-xs font-mono font-medium bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                ln(X)
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('log10')}
                className="py-2.5 px-3 text-xs font-mono font-medium bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                log₁₀(X)
              </button>

              <button
                type="button"
                onClick={() => handleBinaryOperation('logb')}
                className="py-2.5 px-3 text-xs font-mono font-medium bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                log_Y(X)
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('fact')}
                className="py-2.5 px-3 text-xs font-mono font-medium bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                X! (Fatorial)
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('sq')}
                className="py-2.5 px-3 text-xs font-mono font-medium bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                X²
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('inv')}
                className="py-2.5 px-3 text-xs font-mono font-medium bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                1 / X
              </button>
              <button
                type="button"
                onClick={() => {
                  setDisplayValue('0');
                  setSecondaryValue('2');
                  setErrorMsg(null);
                }}
                className="py-2.5 px-3 text-xs font-mono font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg transition-colors inline-flex items-center justify-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Limpar
              </button>
            </div>
          </div>

          {/* Basic Operations & Numeric Keypad */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-500 mb-2">
              Operações Básicas (entre X e Y) e Teclado Rápido para X
            </div>
            <div className="grid grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => handleBinaryOperation('+')}
                className="py-3 text-sm font-mono font-bold bg-sky-700 hover:bg-sky-800 text-white rounded-lg transition-colors cursor-pointer"
              >
                X + Y
              </button>
              <button
                type="button"
                onClick={() => handleBinaryOperation('-')}
                className="py-3 text-sm font-mono font-bold bg-sky-700 hover:bg-sky-800 text-white rounded-lg transition-colors cursor-pointer"
              >
                X − Y
              </button>
              <button
                type="button"
                onClick={() => handleBinaryOperation('×')}
                className="py-3 text-sm font-mono font-bold bg-sky-700 hover:bg-sky-800 text-white rounded-lg transition-colors cursor-pointer"
              >
                X × Y
              </button>
              <button
                type="button"
                onClick={() => handleBinaryOperation('÷')}
                className="py-3 text-sm font-mono font-bold bg-sky-700 hover:bg-sky-800 text-white rounded-lg transition-colors cursor-pointer"
              >
                X ÷ Y
              </button>
              <button
                type="button"
                onClick={() => handleBinaryOperation('%')}
                className="py-3 text-sm font-mono font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors cursor-pointer"
              >
                Y% de X
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2 mt-2">
              {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', '00'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleDigit(d)}
                  className="py-2 text-sm font-mono font-medium bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-md transition-colors cursor-pointer"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Angle & Topographic Slope Converter + Calculation Tape (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Angle & Slope Converter */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Conversão de Ângulos & Declividade Topográfica
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">Graus · Rad · Grad · %</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Valor de Entrada
                </label>
                <input
                  type="number"
                  step="any"
                  value={convAngleInput}
                  onChange={(e) => setConvAngleInput(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tabular-nums focus:outline-none focus:border-sky-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Unidade de Origem
                </label>
                <select
                  value={convAngleSource}
                  onChange={(e) => setConvAngleSource(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-sky-600"
                >
                  <option value="DEG">Graus Decimais (°)</option>
                  <option value="RAD">Radianos (rad)</option>
                  <option value="GRAD">Gradianos / Grado (gon)</option>
                  <option value="SLOPE">Inclinação / Rampa (%)</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/60">
                <span className="text-xs text-slate-600">Graus Decimais (°)</span>
                <span className="text-sm font-mono font-semibold tabular-nums text-slate-900">
                  {degValue.toFixed(6)}°
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-slate-600">Sexagesimal (G° M&apos; S&quot;)</span>
                <span className="text-sm font-mono font-semibold tabular-nums text-slate-900">
                  {toDMS(degValue)}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/60">
                <span className="text-xs text-slate-600">Radianos (rad)</span>
                <span className="text-sm font-mono font-semibold tabular-nums text-slate-900">
                  {radValue.toFixed(6)} rad
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-slate-600">Gradianos Topográficos (gon)</span>
                <span className="text-sm font-mono font-semibold tabular-nums text-slate-900">
                  {gradValue.toFixed(6)} gon
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/60">
                <span className="text-xs text-slate-600">Inclinação Equivalente (i = tan θ × 100)</span>
                <span className="text-sm font-mono font-semibold tabular-nums text-sky-700">
                  {Math.abs(degValue) === 90 ? '∞ (Vertical)' : `${slopePctValue.toFixed(2)} %`}
                </span>
              </div>
            </div>
          </div>

          {/* Calculation Tape */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Fita de Auditoria Científica
                </h3>
              </div>
              <span className="text-xs text-slate-500">Clique para reutilizar em X</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto border border-slate-200 rounded-lg">
              {localTape.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDisplayValue(item.result)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="text-xs font-mono text-slate-600 truncate pr-3">
                    {item.expr}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono font-semibold text-slate-900 tabular-nums">
                      = {item.result}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {item.mode}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
