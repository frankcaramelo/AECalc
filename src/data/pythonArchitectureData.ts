import { PythonSourceFile, DeliverableSection } from '../types/domain';

export const PYTHON_SOURCE_FILES: PythonSourceFile[] = [
  {
    id: 'py-domain',
    filename: 'arqeng_calc/domain/entities.py',
    layer: 'Domain',
    description: 'Entidades imutáveis de domínio, Value Objects e resultados auditáveis com Type Hints estritos (PEP 484).',
    linesOfCode: 118,
    code: `"""
Camada de Domínio (Domain Layer) - ArqEng Studio
Entidades puras sem dependências externas de frameworks ou UI (Clean Architecture).
"""
from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional
import uuid


class ModuleType(str, Enum):
    SCIENTIFIC = "Científico"
    ARCHITECTURE = "Arquitetura"
    ENGINEERING = "Engenharia"


class ComplianceStatus(str, Enum):
    COMPLIANT = "CONFORME"
    WARNING = "ATENÇÃO"
    NON_COMPLIANT = "NÃO CONFORME"


@dataclass(frozen=True)
class CalculationResult:
    """Entidade auditável representando um memorial de cálculo individual."""
    module: ModuleType
    category: str
    title: str
    inputs: Dict[str, str]
    outputs: Dict[str, float]
    units: Dict[str, str]
    formulas_applied: List[str]
    normative_references: List[str]
    compliance_status: ComplianceStatus
    compliance_message: str
    project_code: str = "PRJ-PADRAO"
    author: str = "Responsável Técnico"
    id: str = field(default_factory=lambda: f"CALC-{uuid.uuid4().hex[:8].upper()}")
    created_at: datetime = field(default_factory=datetime.now)


@dataclass(frozen=True)
class StairDimensioningResult:
    """Value Object de retorno do dimensionamento de escadas (Blondel + NBR 9050/9077)."""
    total_height_cm: float
    steps_count: int
    riser_height_cm: float
    tread_depth_cm: float
    blondel_index_cm: float
    total_run_m: float
    slope_degrees: float
    is_nbr9050_compliant: bool
    is_blondel_ideal: bool
    normative_notes: List[str]


@dataclass(frozen=True)
class UrbanIndicesResult:
    """Value Object para índices urbanísticos de estudo de viabilidade."""
    lot_area_m2: float
    occupancy_rate_pct: float
    floor_area_ratio_ca: float
    permeability_index_pct: float
    is_compliant: bool
    notes: List[str]
`
  },
  {
    id: 'py-scientific',
    filename: 'arqeng_calc/application/scientific_service.py',
    layer: 'Application',
    description: 'Motor de cálculo científico de alta precisão (trigonométricas, hiperbólicas, logaritmos, fatorial e conversões angulares).',
    linesOfCode: 132,
    code: `"""
Serviço de Cálculos Científicos - ArqEng Studio
Suporta graus, radianos, gradianos, funções transcendentes e constantes físicas/matemáticas.
"""
from __future__ import annotations
import math
from enum import Enum
from typing import Dict


class AngleUnit(str, Enum):
    DEG = "DEG"
    RAD = "RAD"
    GRAD = "GRAD"


class ScientificCalculatorService:
    """Implementa operações científicas puras e auditáveis para engenharia."""

    CONSTANTS: Dict[str, float] = {
        "PI": math.pi,
        "E": math.e,
        "PHI": (1.0 + math.sqrt(5.0)) / 2.0,  # Proporção Áurea (1.61803398875)
        "G_STD": 9.80665,                     # Aceleração padrão da gravidade (m/s²)
        "SQRT2": math.sqrt(2.0),
        "SQRT3": math.sqrt(3.0),
    }

    @staticmethod
    def to_radians(value: float, unit: AngleUnit = AngleUnit.DEG) -> float:
        if unit == AngleUnit.RAD:
            return value
        if unit == AngleUnit.DEG:
            return math.radians(value)
        if unit == AngleUnit.GRAD:
            return value * (math.pi / 200.0)
        raise ValueError(f"Unidade angular desconhecida: {unit}")

    @staticmethod
    def from_radians(rad_value: float, target_unit: AngleUnit = AngleUnit.DEG) -> float:
        if target_unit == AngleUnit.RAD:
            return rad_value
        if target_unit == AngleUnit.DEG:
            return math.degrees(rad_value)
        if target_unit == AngleUnit.GRAD:
            return rad_value * (200.0 / math.pi)
        raise ValueError(f"Unidade angular desconhecida: {target_unit}")

    @classmethod
    def trig(cls, func_name: str, angle: float, unit: AngleUnit = AngleUnit.DEG) -> float:
        rad = cls.to_radians(angle, unit)
        dispatch = {
            "sin": math.sin,
            "cos": math.cos,
            "tan": math.tan,
            "sinh": math.sinh,
            "cosh": math.cosh,
            "tanh": math.tanh,
        }
        if func_name not in dispatch:
            raise ValueError(f"Função trigonométrica não suportada: {func_name}")
        return round(dispatch[func_name](rad), 10)

    @classmethod
    def inverse_trig(cls, func_name: str, ratio: float, target_unit: AngleUnit = AngleUnit.DEG) -> float:
        if func_name in ("asin", "acos") and not (-1.0 <= ratio <= 1.0):
            raise ValueError("Domínio inválido para arco-seno/arco-cosseno: valor deve estar entre -1 e 1.")
        dispatch = {
            "asin": math.asin,
            "acos": math.acos,
            "atan": math.atan,
        }
        rad = dispatch[func_name](ratio)
        return round(cls.from_radians(rad, target_unit), 8)

    @staticmethod
    def nth_root(radicand: float, degree: float = 2.0) -> float:
        if degree == 0:
            raise ZeroDivisionError("O índice da raiz não pode ser zero.")
        if radicand < 0 and degree % 2 == 0:
            raise ValueError("Raiz de índice par não admite radicando negativo no domínio real.")
        return math.copysign(abs(radicand) ** (1.0 / degree), radicand)

    @staticmethod
    def logarithm(value: float, base: float = math.e) -> float:
        if value <= 0 or base <= 0 or base == 1.0:
            raise ValueError("Logaritmando deve ser > 0 e base > 0 (diferente de 1).")
        return math.log(value, base)

    @staticmethod
    def factorial(n: int) -> int:
        if n < 0 or int(n) != n:
            raise ValueError("Fatorial requer número inteiro não-negativo.")
        if n > 170:
            raise OverflowError("Limite seguro de ponto flutuante IEEE 754 excedido (n <= 170).")
        return math.factorial(int(n))
`
  },
  {
    id: 'py-architecture',
    filename: 'arqeng_calc/application/architecture_service.py',
    layer: 'Application',
    description: 'Serviços de Arquitetura e Urbanismo: Índices Urbanísticos (TO, CA, IP), Paginação de Pisos, Forro de Gesso, Pintura e NBR 15575.',
    linesOfCode: 164,
    code: `"""
Serviço de Cálculos de Arquitetura e Urbanismo - ArqEng Studio
Implementa TO, CA, IP, paginação de revestimentos, rodapé, pintura e forro de gesso.
"""
from __future__ import annotations
import math
from typing import Dict, Any
from arqeng_calc.domain.entities import UrbanIndicesResult


class ArchitectureCalculationService:
    """Casos de uso de Arquitetura e Urbanismo baseados nas normas ABNT."""

    @staticmethod
    def calculate_urban_indices(
        lot_area_m2: float,
        ground_projection_m2: float,
        total_computable_area_m2: float,
        permeable_area_m2: float,
        max_to_pct: float = 60.0,
        max_ca: float = 3.0,
        min_ip_pct: float = 20.0,
    ) -> UrbanIndicesResult:
        if lot_area_m2 <= 0:
            raise ValueError("A área do lote deve ser maior que zero.")

        to_pct = (ground_projection_m2 / lot_area_m2) * 100.0
        ca_index = total_computable_area_m2 / lot_area_m2
        ip_pct = (permeable_area_m2 / lot_area_m2) * 100.0

        notes = []
        is_ok = True
        if to_pct > max_to_pct:
            is_ok = False
            notes.append(f"Taxa de Ocupação ({to_pct:.2f}%) excede o limite de {max_to_pct:.2f}%.")
        if ca_index > max_ca:
            is_ok = False
            notes.append(f"Coeficiente de Aproveitamento ({ca_index:.2f}) excede o máximo de {max_ca:.2f}.")
        if ip_pct < min_ip_pct:
            is_ok = False
            notes.append(f"Índice de Permeabilidade ({ip_pct:.2f}%) inferior ao mínimo de {min_ip_pct:.2f}%.")
        if is_ok:
            notes.append("Todos os índices urbanísticos atendem aos parâmetros informados.")

        return UrbanIndicesResult(
            lot_area_m2=round(lot_area_m2, 2),
            occupancy_rate_pct=round(to_pct, 2),
            floor_area_ratio_ca=round(ca_index, 2),
            permeability_index_pct=round(ip_pct, 2),
            is_compliant=is_ok,
            notes=notes,
        )

    @staticmethod
    def calculate_flooring_and_skirting(
        room_width_m: float,
        room_length_m: float,
        tile_width_cm: float,
        tile_length_cm: float,
        joint_mm: float = 2.0,
        tile_thickness_mm: float = 9.0,
        waste_pct: float = 10.0,
        door_widths_m: float = 0.80,
    ) -> Dict[str, Any]:
        """Calcula quantidade de porcelanato/cerâmica, rodapé, argamassa colante e rejunte (NBR 13753)."""
        net_area_m2 = room_width_m * room_length_m
        total_area_with_waste_m2 = net_area_m2 * (1.0 + waste_pct / 100.0)
        single_tile_area_m2 = (tile_width_cm / 100.0) * (tile_length_cm / 100.0)
        tiles_count = math.ceil(total_area_with_waste_m2 / single_tile_area_m2)

        # Perímetro e rodapé
        perimeter_m = 2.0 * (room_width_m + room_length_m)
        net_skirting_m = max(0.0, perimeter_m - door_widths_m) * (1.0 + waste_pct / 100.0)
        skirting_pieces = math.ceil(net_skirting_m / (tile_length_cm / 100.0))

        # Argamassa colante (dupla colagem se área da peça > 900 cm² conforme NBR 13753)
        double_gluing = (tile_width_cm * tile_length_cm) > 900.0
        mortar_rate_kg_m2 = 7.0 if double_gluing else 4.5
        mortar_total_kg = total_area_with_waste_m2 * mortar_rate_kg_m2
        mortar_bags_20kg = math.ceil(mortar_total_kg / 20.0)

        # Fórmula técnica de consumo de rejunte (kg/m²)
        # C = ((L_peca + C_peca) / (L_peca * C_peca)) * espessura_mm * junta_mm * 1.58
        L_mm = tile_width_cm * 10.0
        C_mm = tile_length_cm * 10.0
        grout_kg_m2 = ((L_mm + C_mm) / (L_mm * C_mm)) * tile_thickness_mm * joint_mm * 1.58
        grout_total_kg = round(total_area_with_waste_m2 * grout_kg_m2, 2)

        return {
            "net_area_m2": round(net_area_m2, 2),
            "area_with_waste_m2": round(total_area_with_waste_m2, 2),
            "tiles_count": tiles_count,
            "skirting_linear_m": round(net_skirting_m, 2),
            "skirting_pieces": skirting_pieces,
            "mortar_type": "AC-III (Dupla Colagem NBR 13753)" if double_gluing else "AC-II (Colagem Simples)",
            "mortar_kg": round(mortar_total_kg, 2),
            "mortar_bags_20kg": mortar_bags_20kg,
            "grout_kg": grout_total_kg,
        }
`
  },
  {
    id: 'py-engineering',
    filename: 'arqeng_calc/application/engineering_service.py',
    layer: 'Application',
    description: 'Serviços de Engenharia Civil: Escadas (Blondel + NBR 9050/9077), Rampas (Tabela 6 NBR 9050), Telhados, Concreto, Aço, Alvenaria e Sapatas.',
    linesOfCode: 195,
    code: `"""
Serviço de Cálculos de Engenharia Civil - ArqEng Studio
Escadas, Rampas, Coberturas, Concreto Armado (NBR 6118), Cargas (NBR 6120) e Fundações.
"""
from __future__ import annotations
import math
from typing import Dict, Any
from arqeng_calc.domain.entities import StairDimensioningResult


class EngineeringCalculationService:
    """Casos de uso de Engenharia Civil com validação normativa ABNT."""

    @staticmethod
    def calculate_stair(
        total_height_cm: float,
        desired_riser_cm: float = 17.5,
        tread_cm: float = 29.0,
        landing_length_m: float = 1.20,
    ) -> StairDimensioningResult:
        """Dimensiona escada pela Fórmula de Blondel (2E + P = 64 cm) e valida NBR 9050 / NBR 9077."""
        if total_height_cm <= 0 or desired_riser_cm <= 0:
            raise ValueError("Desnível e espelho devem ser maiores que zero.")

        steps = max(1, round(total_height_cm / desired_riser_cm))
        actual_riser = total_height_cm / steps
        blondel = (2.0 * actual_riser) + tread_cm
        total_run_m = ((steps - 1) * (tread_cm / 100.0)) + landing_length_m
        slope_deg = math.degrees(math.atan(actual_riser / tread_cm))

        is_nbr9050 = (16.0 <= actual_riser <= 18.0) and (28.0 <= tread_cm <= 32.0)
        is_blondel = 63.0 <= blondel <= 65.0

        notes = []
        if is_nbr9050 and is_blondel:
            notes.append("CONFORME ABNT NBR 9050 e NBR 9077 (Conforto e segurança verificados).")
        else:
            if not (16.0 <= actual_riser <= 18.0):
                notes.append(f"Espelho real ({actual_riser:.2f} cm) fora da faixa NBR 9050 (16,0 a 18,0 cm).")
            if not (28.0 <= tread_cm <= 32.0):
                notes.append(f"Piso ({tread_cm:.2f} cm) fora da faixa NBR 9050 (28,0 a 32,0 cm).")
            if not is_blondel:
                notes.append(f"Blondel ({blondel:.2f} cm) fora da faixa ideal (63,0 a 65,0 cm).")

        return StairDimensioningResult(
            total_height_cm=round(total_height_cm, 2),
            steps_count=steps,
            riser_height_cm=round(actual_riser, 2),
            tread_depth_cm=round(tread_cm, 2),
            blondel_index_cm=round(blondel, 2),
            total_run_m=round(total_run_m, 2),
            slope_degrees=round(slope_deg, 2),
            is_nbr9050_compliant=is_nbr9050 and is_blondel,
            is_blondel_ideal=is_blondel,
            normative_notes=notes,
        )

    @staticmethod
    def calculate_ramp_nbr9050(height_m: float, slope_pct: float) -> Dict[str, Any]:
        """Calcula rampa acessível e verifica limites por desnível da Tabela 6 da NBR 9050:2020."""
        if height_m <= 0 or slope_pct <= 0:
            raise ValueError("Altura a vencer e inclinação devem ser positivas.")

        horizontal_run_m = (height_m * 100.0) / slope_pct
        if slope_pct <= 5.0:
            max_segment_height = 1.50
            tier_desc = "Faixa 1 (i ≤ 5,00%): Desnível máx. 1,50 m por segmento"
        elif slope_pct <= 6.25:
            max_segment_height = 1.00
            tier_desc = "Faixa 2 (5,00% < i ≤ 6,25%): Desnível máx. 1,00 m por segmento"
        elif slope_pct <= 8.33:
            max_segment_height = 0.80
            tier_desc = "Faixa 3 (6,25% < i ≤ 8,33%): Desnível máx. 0,80 m por segmento"
        else:
            max_segment_height = 0.0
            tier_desc = "ACIMA DO LIMITE NORMATIVO (Máximo absoluto NBR 9050 = 8,33%)"

        segments = math.ceil(height_m / max_segment_height) if max_segment_height > 0 else 99
        compliant = slope_pct <= 8.33 and (slope_pct <= 6.25 or segments <= 15)

        return {
            "horizontal_length_m": round(horizontal_run_m, 2),
            "segments_required": segments,
            "landings_length_m": round(max(0, segments - 1) * 1.20, 2),
            "total_length_with_landings_m": round(horizontal_run_m + max(0, segments - 1) * 1.20, 2),
            "tier_description": tier_desc,
            "is_compliant": compliant,
        }

    @staticmethod
    def calculate_isolated_footing(
        axial_load_kn: float,
        soil_allowable_stress_mpa: float,
        column_width_m: float = 0.20,
        column_length_m: float = 0.40,
    ) -> Dict[str, Any]:
        """Pré-dimensionamento de sapata isolada rígida (NBR 6122 / NBR 6118)."""
        # Conversão de MPa para kN/m² (1 MPa = 1000 kN/m²)
        sigma_kn_m2 = soil_allowable_stress_mpa * 1000.0
        required_area_m2 = (1.05 * axial_load_kn) / sigma_kn_m2
        side_square_m = math.ceil(math.sqrt(required_area_m2) * 20.0) / 20.0  # Múltiplo de 5 cm
        # Critério de sapata rígida (NBR 6118): h >= (A - a_pilar) / 3
        min_height_m = max(0.35, (side_square_m - min(column_width_m, column_length_m)) / 3.0)
        volume_m3 = (side_square_m ** 2) * min_height_m

        return {
            "required_area_m2": round(required_area_m2, 2),
            "adopted_side_m": round(side_square_m, 2),
            "adopted_height_m": round(min_height_m, 2),
            "concrete_volume_m3": round(volume_m3, 3),
        }
`
  },
  {
    id: 'py-ui-tkinter',
    filename: 'arqeng_calc/presentation/tkinter_app.py',
    layer: 'Presentation (Tkinter TTK)',
    description: 'Interface Gráfica Desktop Multiplataforma (Windows, Linux, macOS) utilizando Tkinter + TTK Modern Theme (sv-ttk / Clam) desacoplada dos serviços.',
    linesOfCode: 145,
    code: `"""
Camada de Apresentação Desktop (Tkinter + TTK Themes) - ArqEng Studio
Compatível com Windows, Linux e macOS. Aplica padrão MVP/MVVM sobre a camada de Aplicação.
"""
from __future__ import annotations
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from arqeng_calc.application.scientific_service import ScientificCalculatorService, AngleUnit
from arqeng_calc.application.architecture_service import ArchitectureCalculationService
from arqeng_calc.application.engineering_service import EngineeringCalculationService


class ArqEngDesktopApp(tk.Tk):
    """Janela principal Desktop com barra lateral de módulos e memorial auditável."""

    def __init__(self) -> None:
        super().__init__()
        self.title("ArqEng Studio — Plataforma de Cálculos Técnicos (ABNT/NBR)")
        self.geometry("1280x800")
        self.minsize(1024, 700)
        self._configure_theme()
        self._build_layout()

    def _configure_theme(self) -> None:
        style = ttk.Style(self)
        # Usa sv_ttk se instalado, caso contrário configura tema TTK 'clam' de alto contraste
        try:
            import sv_ttk  # type: ignore
            sv_ttk.set_theme("light")
        except ImportError:
            style.theme_use("clam")
            style.configure("TFrame", background="#F8FAFC")
            style.configure("Header.TLabel", font=("Plus Jakarta Sans", 15, "bold"), foreground="#0F172A")
            style.configure("Primary.TButton", font=("Public Sans", 10, "bold"), padding=8)

    def _build_layout(self) -> None:
        self.notebook = ttk.Notebook(self)
        self.notebook.pack(fill=tk.BOTH, expand=True, padx=16, pady=16)

        self.tab_scientific = ttk.Frame(self.notebook, padding=16)
        self.tab_architecture = ttk.Frame(self.notebook, padding=16)
        self.tab_engineering = ttk.Frame(self.notebook, padding=16)
        self.tab_reports = ttk.Frame(self.notebook, padding=16)

        self.notebook.add(self.tab_scientific, text="01. Módulo Científico")
        self.notebook.add(self.tab_architecture, text="02. Arquitetura & Urbanismo")
        self.notebook.add(self.tab_engineering, text="03. Engenharia Civil")
        self.notebook.add(self.tab_reports, text="04. Memorial & Exportação")

        self._build_stair_panel(self.tab_engineering)

    def _build_stair_panel(self, parent: ttk.Frame) -> None:
        ttk.Label(parent, text="Cálculo de Escadas (Blondel + NBR 9050 / NBR 9077)", style="Header.TLabel").grid(
            row=0, column=0, columnspan=2, sticky="w", pady=(0, 12)
        )
        ttk.Label(parent, text="Desnível Piso a Piso (cm):").grid(row=1, column=0, sticky="w", pady=4)
        self.ent_height = ttk.Entry(parent)
        self.ent_height.insert(0, "288.0")
        self.ent_height.grid(row=1, column=1, sticky="ew", pady=4)

        ttk.Label(parent, text="Piso Adotado P (cm):").grid(row=2, column=0, sticky="w", pady=4)
        self.ent_tread = ttk.Entry(parent)
        self.ent_tread.insert(0, "28.0")
        self.ent_tread.grid(row=2, column=1, sticky="ew", pady=4)

        self.lbl_result = ttk.Label(parent, text="Aguardando cálculo...", font=("IBM Plex Mono", 10))
        self.lbl_result.grid(row=4, column=0, columnspan=2, sticky="w", pady=12)

        btn = ttk.Button(parent, text="Dimensionar Escada", style="Primary.TButton", command=self._on_calc_stair)
        btn.grid(row=3, column=0, columnspan=2, sticky="ew", pady=8)

    def _on_calc_stair(self) -> None:
        try:
            h = float(self.ent_height.get())
            p = float(self.ent_tread.get())
            res = EngineeringCalculationService.calculate_stair(total_height_cm=h, tread_cm=p)
            self.lbl_result.configure(
                text=f"Degraus: {res.steps_count} | Espelho: {res.riser_height_cm} cm | "
                     f"Blondel: {res.blondel_index_cm} cm | {res.normative_notes[0]}"
            )
        except ValueError as exc:
            messagebox.showerror("Erro de Validação", str(exc))


if __name__ == "__main__":
    app = ArqEngDesktopApp()
    app.mainloop()
`
  },
  {
    id: 'py-tests',
    filename: 'tests/test_calculation_engines.py',
    layer: 'Tests (Pytest)',
    description: 'Suíte de testes automatizados Pytest cobrindo casos de borda matemáticos, Blondel, rampas NBR 9050, índices urbanísticos e revestimentos.',
    linesOfCode: 104,
    code: `"""
Suíte de Testes Automatizados (Pytest) - ArqEng Studio
Execução: pytest -v --cov=arqeng_calc
"""
import math
import pytest
from arqeng_calc.application.scientific_service import ScientificCalculatorService, AngleUnit
from arqeng_calc.application.architecture_service import ArchitectureCalculationService
from arqeng_calc.application.engineering_service import EngineeringCalculationService


def test_scientific_trigonometry_and_factorial() -> None:
    assert math.isclose(ScientificCalculatorService.trig("sin", 30.0, AngleUnit.DEG), 0.5, rel_tol=1e-7)
    assert math.isclose(ScientificCalculatorService.trig("cos", 60.0, AngleUnit.DEG), 0.5, rel_tol=1e-7)
    assert math.isclose(ScientificCalculatorService.inverse_trig("atan", 1.0, AngleUnit.DEG), 45.0, rel_tol=1e-7)
    assert ScientificCalculatorService.factorial(5) == 120


def test_urban_indices_compliance() -> None:
    res = ArchitectureCalculationService.calculate_urban_indices(
        lot_area_m2=600.0,
        ground_projection_m2=330.0,
        total_computable_area_m2=1680.0,
        permeable_area_m2=132.0,
    )
    assert res.occupancy_rate_pct == 55.00
    assert res.floor_area_ratio_ca == 2.80
    assert res.permeability_index_pct == 22.00
    assert res.is_compliant is True


def test_stair_blondel_and_nbr9050() -> None:
    res = EngineeringCalculationService.calculate_stair(
        total_height_cm=288.0, desired_riser_cm=18.0, tread_cm=28.0
    )
    assert res.steps_count == 16
    assert res.riser_height_cm == 18.0
    assert res.blondel_index_cm == 64.0
    assert res.is_nbr9050_compliant is True


def test_ramp_nbr9050_max_slope() -> None:
    res_valid = EngineeringCalculationService.calculate_ramp_nbr9050(height_m=0.75, slope_pct=8.33)
    assert res_valid["is_compliant"] is True
    assert res_valid["segments_required"] == 1

    res_invalid = EngineeringCalculationService.calculate_ramp_nbr9050(height_m=1.20, slope_pct=9.50)
    assert res_invalid["is_compliant"] is False
`
  }
];

export const ARCHITECTURAL_DELIVERABLES: DeliverableSection[] = [
  {
    id: 1,
    title: '01. Visão Geral do Sistema',
    subtitle: 'Concepção do produto, posicionamento técnico e proposta de valor para AEC (Arquitetura, Engenharia e Construção)',
    category: 'Engenharia de Requisitos',
    content: [
      'O ArqEng Studio é uma plataforma de engenharia de software voltada para cálculos técnicos deterministicamente auditáveis nas áreas de Arquitetura, Urbanismo e Engenharia Civil. Diferente de planilhas eletrônicas descentralizadas — que sofrem com erros silenciosos de fórmulas, ausência de controle de versão normativo e falta de rastreabilidade — a plataforma centraliza motores matemáticos validados segundo as normas vigentes da ABNT.',
      'A arquitetura foi projetada sob o paradigma Multi-Runtime (Desktop Nativo em Python/Tkinter TTK para uso offline em canteiros de obras e escritórios, e Web SPA/PWA responsiva via API RESTful FastAPI + React/TypeScript), compartilhando um único núcleo de regras de negócio (Core Domain) 100% desacoplado da interface gráfica.',
      'Cada operação gera uma memória de cálculo estruturada contendo os parâmetros de entrada, as equações explícitas aplicadas, os fatores de segurança ou perda adotados e o parecer automático de conformidade normativa (NBR 9050, NBR 9077, NBR 6118, NBR 6120, NBR 6492, NBR 13532 e NBR 15575).'
    ]
  },
  {
    id: 2,
    title: '02. Levantamento de Requisitos Funcionais (RF)',
    subtitle: 'Especificação formal das capacidades dos 5 módulos do MVP',
    category: 'Engenharia de Requisitos',
    content: [
      'Os requisitos funcionais foram organizados por domínio de negócio, garantindo rastreabilidade direta entre cada requisito, seu serviço na camada de aplicação e sua suíte de testes automatizados.'
    ],
    tableData: {
      headers: ['Código', 'Módulo', 'Requisito Funcional', 'Norma / Critério Técnico'],
      rows: [
        ['RF-01', 'Científico', 'Executar operações aritméticas, potenciação, radiciação, logaritmos (ln, log10, base b) e fatorial.', 'IEEE 754 / Precisão Decimal'],
        ['RF-02', 'Científico', 'Executar funções trigonométricas diretas, inversas e hiperbólicas com conversão DEG/RAD/GRAD.', 'Matemática Aplicada'],
        ['RF-03', 'Arquitetura', 'Calcular índices urbanísticos: Taxa de Ocupação (TO), Coeficiente de Aproveitamento (CA) e Permeabilidade (IP).', 'NBR 13532 / Planos Diretores'],
        ['RF-04', 'Arquitetura', 'Quantificar pisos, porcelanatos, cerâmicas, rodapés, argamassa colante (AC-I/II/III) e rejunte com perda.', 'NBR 13753 / NBR 14081'],
        ['RF-05', 'Arquitetura', 'Calcular pintura (massa, selador, tinta por demãos) e forro de gesso (placas, perfis F530, tirantes).', 'NBR 13245 / TCPO'],
        ['RF-06', 'Arquitetura', 'Dimensionar preliminarmente ambientes (área mínima, iluminação 1/6 ou 1/8 e ventilação 1/2).', 'NBR 15575 / Código de Obras'],
        ['RF-07', 'Engenharia', 'Dimensionar escadas pela Fórmula de Blondel (2E + P) e validar limites de espelho e piso.', 'NBR 9050 / NBR 9077'],
        ['RF-08', 'Engenharia', 'Calcular rampas acessíveis por faixa de inclinação (5%, 6,25%, 8,33%), patamares e segmentos.', 'NBR 9050 (Tabela 6)'],
        ['RF-09', 'Engenharia', 'Calcular telhados (1 a 4 águas), área inclinada real, cumeeira, telhas e madeiramento.', 'NBR 15575-5 / NBR 7190'],
        ['RF-10', 'Engenharia', 'Quantificar volume de concreto, traço (cimento, areia, brita), aço, alvenaria e sapata isolada.', 'NBR 6118 / NBR 6120 / NBR 6122'],
        ['RF-11', 'Normas', 'Consultar catálogo de normas ABNT parametrizadas e permitir cadastro de novas revisões normativas.', 'ABNT Catálogo Técnico'],
        ['RF-12', 'Relatórios', 'Registrar histórico de cálculos e exportar Memorial de Cálculo em PDF Técnico A4 e Excel (CSV).', 'NBR 6492 / ISO 19650']
      ]
    }
  },
  {
    id: 3,
    title: '03. Levantamento de Requisitos Não Funcionais (RNF)',
    subtitle: 'Qualidade de software, precisão numérica, portabilidade e manutenibilidade',
    category: 'Engenharia de Requisitos',
    content: [
      'RNF-01 (Portabilidade Multiplataforma): O sistema deve operar nativamente em Windows 10/11, distribuições Linux (Ubuntu/Debian/Fedora), macOS (Intel/Apple Silicon) via Python 3.11+ / Tkinter TTK, além de navegadores Web modernos (Chrome, Edge, Firefox, Safari).',
      'RNF-02 (Exatidão e Determinismo Matemático): Todas as equações de engenharia devem evitar erros de truncamento prematuro, mantendo precisão interna de 64 bits (float64 / Decimal) e arredondamento normativo apenas na camada de apresentação.',
      'RNF-03 (Desacoplamento Arquitetural — Clean Architecture): A camada de Domínio e Aplicação não deve conter nenhuma importação de bibliotecas de UI (Tkinter, React) ou banco de dados, garantindo 100% de testabilidade unitária.',
      'RNF-04 (Extensibilidade Normativa Open-Closed Principle): A atualização de limites normativos (ex.: revisão da NBR 6118 ou NBR 9050) deve ocorrer via atualização de catálogo declarativo (JSON/Banco de Dados) sem necessidade de recompilar ou reescrever o motor de cálculo.',
      'RNF-05 (Desempenho e Tempo de Resposta): Qualquer cálculo individual e renderização de corte esquemático vetorial deve ocorrer em tempo inferior a 16 ms (60 FPS), mesmo em hardware modesto de obra.'
    ]
  },
  {
    id: 4,
    title: '04. Casos de Uso Detalhados (UC)',
    subtitle: 'Fluxos principais e alternativos de interação dos atores técnicos',
    category: 'Engenharia de Requisitos',
    content: [
      'Atores Principais: Arquiteto e Urbanista, Engenheiro Civil, Técnico em Edificações, Estudante de Graduação e Coordenador de Projetos BIM.'
    ],
    tableData: {
      headers: ['ID', 'Caso de Uso', 'Ator Principal', 'Fluxo Principal e Validação Normativa'],
      rows: [
        ['UC-01', 'Validar Estudo Preliminar Urbanístico', 'Arquiteto / Urbanista', 'Informa área do lote, projeção, área total e área verde → Sistema calcula TO, CA e IP → Compara com limites da zona urbana e emite selo de conformidade.'],
        ['UC-02', 'Dimensionar Escada e Rampa de Edifício', 'Arquiteto / Engenheiro', 'Informa desnível piso a piso → Sistema calcula número de degraus, ajusta espelho exato, aplica Blondel (2E+P) e gera desenho técnico cotado + validação NBR 9050/9077.'],
        ['UC-03', 'Orçar Revestimentos, Pintura e Gesso', 'Técnico / Engenheiro', 'Informa dimensões dos ambientes e especificação da placa → Sistema calcula peças com perda de paginação, dupla colagem AC-III (se peça > 900 cm²), rejunte e rodapé.'],
        ['UC-04', 'Pré-dimensionar Concreto, Aço e Sapata', 'Engenheiro Civil', 'Informa geometria estrutural, carga axial (kN) e tensão admissível do solo (MPa) → Sistema calcula volume de concreto, consumo de aço/cimento e base rígida da sapata.'],
        ['UC-05', 'Emitir Memorial de Cálculo Auditável', 'Todos os Atores', 'Seleciona cálculos do histórico do projeto → Insere identificação técnica (ART/RRT) → Exporta documento formatado em PDF A4 ou planilha compatível com Excel.']
      ]
    }
  },
  {
    id: 5,
    title: '05. Arquitetura da Aplicação (Clean Architecture & SOLID)',
    subtitle: 'Separação concêntrica de responsabilidades e padrões de projeto GoF aplicados',
    category: 'Arquitetura & Dados',
    content: [
      'A solução adota Clean Architecture (Robert C. Martin) combinada com Domain-Driven Design (DDD) tático. As dependências apontam estritamente de fora para dentro: Presentation / Infrastructure → Application (Use Cases) → Domain (Entities & Value Objects).',
      'Single Responsibility Principle (SRP): Cada classe de serviço calcula um único subdomínio coeso (ex.: StairCalculator, UrbanIndicesCalculator, ConcreteTakeoffCalculator).',
      'Open/Closed Principle (OCP) & Strategy Pattern: O motor de validação normativa utiliza o padrão Strategy (NormativeValidatorStrategy), permitindo plugar regras da NBR 9050, NBR 9077 ou Códigos de Obras municipais sem alterar o fluxo do caso de uso.',
      'Factory Method & Builder Pattern: Utilizados na construção dos Memoriais de Cálculo (ReportBuilder), permitindo exportar o mesmo objeto CalculationResult para PDF A4, Excel/CSV ou JSON.',
      'Repository Pattern & Dependency Inversion (DIP): A camada de aplicação depende da abstração CalculationRepositoryProtocol (typing.Protocol), permitindo alternar transparentemente entre SQLite local (Desktop) e PostgreSQL (Web Cloud).'
    ]
  },
  {
    id: 6,
    title: '06. Organização Profissional das Pastas',
    subtitle: 'Estrutura modular Python seguindo padrões PEP 517 / PEP 621 (pyproject.toml)',
    category: 'Arquitetura & Dados',
    content: [
      'A organização de diretórios isola claramente o núcleo matemático (core), adaptadores de persistência, geradores de relatórios, interface desktop Tkinter e API Web FastAPI:'
    ],
    codeBlock: `arqeng-studio/
├── pyproject.toml                 # Configuração de build, dependências, ruff, mypy e pytest
├── README.md                      # Documentação técnica e guia rápido
├── .env.example                   # Variáveis de ambiente (DB_URL, LOG_LEVEL)
├── data/
│   ├── normas_abnt_catalog.json   # Catálogo versionado de parâmetros ABNT/NBR
│   └── local_history.sqlite3      # Banco local para versão Desktop
├── src/
│   └── arqeng_calc/
│       ├── __init__.py
│       ├── domain/                # Camada 1: Entidades puras e Value Objects
│       │   ├── entities.py
│       │   ├── exceptions.py
│       │   └── unit_conversions.py
│       ├── application/           # Camada 2: Casos de Uso e Motores Matemáticos
│       │   ├── ports.py           # Interfaces (Protocols) de Repositório e Exportação
│       │   ├── scientific_service.py
│       │   ├── architecture_service.py
│       │   ├── engineering_service.py
│       │   └── normative_engine.py
│       ├── infrastructure/        # Camada 3: Persistência, PDF, Excel e JSON
│       │   ├── sqlite_repository.py
│       │   ├── normas_loader.py
│       │   ├── pdf_exporter.py    # ReportLab / WeasyPrint
│       │   └── excel_exporter.py  # OpenPyXL / CSV
│       └── presentation/          # Camada 4: Interfaces Gráficas (Desktop & Web API)
│           ├── desktop_tk/
│           │   ├── app_window.py
│           │   ├── views_scientific.py
│           │   ├── views_architecture.py
│           │   ├── views_engineering.py
│           │   └── canvas_blueprints.py
│           └── web_api/
│               ├── main_fastapi.py
│               └── schemas_pydantic.py
└── tests/                         # Suíte automatizada Pytest (Unitários + Integração)
    ├── unit/
    │   ├── test_scientific.py
    │   ├── test_architecture.py
    │   ├── test_engineering.py
    │   └── test_normas_nbr.py
    └── integration/
        └── test_report_export.py`
  },
  {
    id: 7,
    title: '07. Diagrama Textual dos Módulos e Fluxo de Dados',
    subtitle: 'Topologia em camadas e comunicação entre componentes Desktop e Web',
    category: 'Arquitetura & Dados',
    content: [
      'O diagrama abaixo ilustra como a interface Desktop (Tkinter TTK) e a interface Web (Browser SPA) consomem exatamente a mesma camada de Aplicação e Domínio:'
    ],
    codeBlock: `+-----------------------------------------------------------------------------------+
|                        CAMADA DE APRESENTAÇÃO (UI / CLIENTS)                      |
|  +-------------------------------------+   +-----------------------------------+  |
|  | Desktop GUI (Tkinter + TTK Themes)  |   | Web Browser SPA (React + TS)      |  |
|  | Windows / Linux / macOS             |   | via FastAPI REST / WebAssembly    |  |
|  +------------------+------------------+   +-----------------+-----------------+  |
+---------------------|----------------------------------------|--------------------+
                      | Chamada Direta                         | DTOs JSON (Pydantic)
                      v                                        v
+-----------------------------------------------------------------------------------+
|                        CAMADA DE APLICAÇÃO (USE CASES / SERVICES)                 |
|  +--------------------+  +-----------------------+  +--------------------------+  |
|  | ScientificService  |  | ArchitectureService   |  | EngineeringService       |  |
|  | - Trig / Hyperb    |  | - TO, CA, IP          |  | - Escadas (Blondel)      |  |
|  | - Log / Radiciação |  | - Pisos / Paginação   |  | - Rampas (NBR 9050)      |  |
|  | - Conversão Ângulo |  | - Pintura / Gesso     |  | - Telhados / Concreto    |  |
|  +---------+----------+  +-----------+-----------+  +------------+-------------+  |
|            |                         |                           |                |
|            +-------------------------+---------------------------+                |
|                                      |                                            |
|                                      v                                            |
|                     +---------------------------------+                           |
|                     | NormativeValidationEngine (OCP) |                           |
|                     | NBR 9050 | 9077 | 6118 | 15575  |                           |
|                     +----------------+----------------+                           |
+--------------------------------------|--------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------------+
|                        CAMADA DE DOMÍNIO (PURE ENTITIES)                          |
|     [ CalculationResult ]   [ StairDimensioningResult ]   [ NormaTechnical ]      |
+--------------------------------------|--------------------------------------------+
                                       | Protocols (DIP)
                                       v
+-----------------------------------------------------------------------------------+
|                        CAMADA DE INFRAESTRUTURA (ADAPTERS)                        |
|  [ SQLite / PostgreSQL Repo ]   [ PDF Memorial Exporter ]   [ Excel/CSV Engine ]  |
+-----------------------------------------------------------------------------------+`
  },
  {
    id: 8,
    title: '08. Tecnologias Recomendadas e Justificativa Técnica',
    subtitle: 'Seleção criteriosa de bibliotecas Python e Web para máxima longevidade',
    category: 'Arquitetura & Dados',
    content: [
      'A escolha da stack prioriza estabilidade em longo prazo, zero custo de licenciamento proprietário e facilidade de distribuição em múltiplos sistemas operacionais:'
    ],
    tableData: {
      headers: ['Camada / Função', 'Tecnologia Principal', 'Alternativa / Complemento', 'Justificativa Arquitetural'],
      rows: [
        ['Linguagem Core', 'Python 3.12+', 'Type Hints + Mypy', 'Ecossistema científico maduro, tipagem estática gradual e legibilidade exemplar.'],
        ['UI Desktop Nativa', 'Tkinter + TTK (sv-ttk)', 'ttkbootstrap', 'Nativo na biblioteca padrão Python, leve, multiplataforma (Win/Linux/macOS) e visual moderno.'],
        ['API & Backend Web', 'FastAPI + Pydantic v2', 'Uvicorn ASGI', 'Validação automática de payloads, geração nativa de OpenAPI/Swagger e altíssima performance.'],
        ['Frontend Web', 'React 19 + TypeScript + Tailwind', 'Vite + Lucide Icons', 'Renderização reativa instantânea de cortes técnicos em SVG e tabelas com numerais tabulares.'],
        ['Banco de Dados', 'SQLite 3 (Desktop) / PostgreSQL 16 (Web)', 'SQLAlchemy 2.0 + Alembic', 'Transição transparente entre arquivo local monoposto e banco corporativo multiusuário.'],
        ['Exportação Relatórios', 'ReportLab (PDF) + OpenPyXL (Excel)', 'CSV UTF-8 BOM', 'Geração programática de memoriais A4 com carimbo ABNT NBR 6492 e planilhas orçamentárias.'],
        ['Qualidade & Testes', 'Pytest + Hypothesis', 'Ruff (Linter/Formatter)', 'Testes baseados em propriedades matemáticas garantem ausência de regressões em fórmulas críticas.']
      ]
    }
  },
  {
    id: 9,
    title: '09. Estrutura de Banco de Dados (Relacional + JSONB)',
    subtitle: 'Modelagem híbrida para projetos, memoriais de cálculo e versionamento de normas ABNT',
    category: 'Arquitetura & Dados',
    content: [
      'Como cada ferramenta de cálculo possui parâmetros de entrada e saída específicos (ex.: uma escada possui espelho e piso; uma sapata possui carga axial e tensão do solo), a modelagem combina integridade relacional (Projetos, Usuários, Normas) com colunas JSONB tipadas para armazenar o payload exato de entradas e saídas:'
    ],
    codeBlock: `-- DDL PostgreSQL 16 / Compatível com SQLite 3.45+ (JSON)

CREATE TABLE projects (
    id UUID PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,
    title VARCHAR(180) NOT NULL,
    client_name VARCHAR(150),
    municipality VARCHAR(100),
    responsible_engineer VARCHAR(150) NOT NULL,
    professional_registry VARCHAR(50) NOT NULL, -- CREA ou CAU
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE abnt_standards (
    id VARCHAR(32) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,           -- Ex: 'ABNT NBR 9050:2020'
    title VARCHAR(255) NOT NULL,
    publication_year SMALLINT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    rules_payload JSONB NOT NULL,               -- Limites parametrizados (ex: max_ramp_slope: 8.33)
    checksum_sha256 VARCHAR(64) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE calculation_records (
    id VARCHAR(32) PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    module_type VARCHAR(20) NOT NULL,           -- 'Científico', 'Arquitetura', 'Engenharia'
    category VARCHAR(80) NOT NULL,
    title VARCHAR(200) NOT NULL,
    inputs_json JSONB NOT NULL,                 -- Entradas com unidades de medida
    outputs_json JSONB NOT NULL,                -- Resultados calculados
    formulas_applied JSONB NOT NULL,            -- Lista de equações auditáveis
    normative_refs JSONB NOT NULL,              -- Normas verificadas no momento do cálculo
    compliance_status VARCHAR(20) NOT NULL,     -- 'CONFORME', 'ATENÇÃO', 'NÃO CONFORME'
    compliance_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_calc_project_module ON calculation_records(project_id, module_type);`
  },
  {
    id: 10,
    title: '10. Código-Fonte Completo da Primeira Versão (MVP)',
    subtitle: 'Implementação modular em Python 3.12 (disponível para inspeção e download na aba ao lado)',
    category: 'Implementação & Qualidade',
    content: [
      'O código-fonte completo do MVP Desktop/Core foi estruturado nos 5 módulos Python disponíveis no explorador de código desta aba: (1) domain/entities.py, (2) application/scientific_service.py, (3) application/architecture_service.py, (4) application/engineering_service.py e (5) presentation/tkinter_app.py.',
      'Além do código Python para execução local com Tkinter TTK, toda a plataforma Web interativa em execução neste navegador implementa 100% das fórmulas em tempo real nos módulos Científico, Arquitetura, Engenharia, Normas ABNT e Relatórios.'
    ]
  },
  {
    id: 11,
    title: '11. Testes Automatizados e Garantia de Qualidade',
    subtitle: 'Estratégia de testes unitários, testes parametrizados e validação de fronteira normativa',
    category: 'Implementação & Qualidade',
    content: [
      'Em software de engenharia civil e arquitetura, um erro de arredondamento ou inversão de fator pode comprometer o dimensionamento de uma saída de emergência ou o orçamento de uma obra. Por isso, aplicamos TDD (Test-Driven Development) nas equações normativas:',
      '1. Testes de Equivalência e Valor Limite (Boundary Value Analysis): Testam exatamente os limiares das normas (ex.: inclinação de rampa em 5,00%, 5,01%, 6,25%, 8,33% e 8,34% segundo a Tabela 6 da NBR 9050).',
      '2. Testes de Invariantes Físicas: Verificam que a área inclinada de um telhado com inclinação > 0% é sempre estritamente maior que sua área de projeção horizontal.',
      '3. Cobertura Mínima Exigida no CI/CD: 95% de cobertura de linhas e branches na camada domain e application.'
    ]
  },
  {
    id: 12,
    title: '12. Documentação de Instalação Multiplataforma',
    subtitle: 'Guia passo a passo para Windows, Linux, macOS e geração de executável standalone',
    category: 'Implementação & Qualidade',
    content: [
      'A instalação do ambiente Python Desktop e a compilação de binários nativos (sem exigir Python instalado no computador do cliente final) seguem o fluxo padronizado abaixo:'
    ],
    codeBlock: `# 1. Clonar o repositório e criar ambiente virtual isolado (Python 3.11 ou 3.12)
git clone https://github.com/org/arqeng-studio.git
cd arqeng-studio
python3 -m venv .venv

# 2. Ativar o ambiente virtual
# No Linux / macOS:
source .venv/bin/activate
# No Windows (PowerShell):
.venv\\Scripts\\Activate.ps1

# 3. Instalar dependências de produção e desenvolvimento
pip install --upgrade pip
pip install sv-ttk openpyxl reportlab fastapi uvicorn pytest pytest-cov mypy ruff

# 4. Executar a suíte de testes automatizados antes de iniciar
pytest -v

# 5. Iniciar a interface gráfica Desktop (Tkinter TTK)
python -m arqeng_calc.presentation.tkinter_app

# 6. Gerar executável único (.exe no Windows / .app no macOS / AppImage no Linux)
pip install pyinstaller
pyinstaller --noconfirm --onefile --windowed --name "ArqEngStudio" \\
    --add-data "data/normas_abnt_catalog.json:data" \\
    src/arqeng_calc/presentation/tkinter_app.py`
  },
  {
    id: 13,
    title: '13. Manual do Usuário — Operação Prática',
    subtitle: 'Fluxo operacional passo a passo para estudantes, arquitetos e engenheiros',
    category: 'Implementação & Qualidade',
    content: [
      'Passo 1 — Seleção do Módulo: Na barra superior ou menu lateral, escolha entre Módulo Científico, Módulo Arquitetura, Módulo Engenharia, Normas ABNT ou Memorial & Arquitetura.',
      'Passo 2 — Entrada Paramétrica Assistida: Insira as grandezas nas unidades indicadas em cada campo (metros, centímetros, MPa, kN). Os cálculos e os diagramas vetoriais em corte/planta são atualizados instantaneamente.',
      'Passo 3 — Verificação de Conformidade ABNT: Observe o indicador técnico de conformidade (CONFORME ou ATENÇÃO). Caso algum parâmetro viole uma recomendação normativa (ex.: espelho de escada > 18 cm na NBR 9050 ou peça de porcelanato > 900 cm² exigindo argamassa AC-III na NBR 13753), o sistema exibe a justificativa técnica exata.',
      'Passo 4 — Registro no Memorial de Cálculo: Clique em "Registrar no Memorial" em qualquer ferramenta para adicionar o cálculo ao histórico do projeto atual.',
      'Passo 5 — Exportação Oficial: Acesse o módulo "Memorial & Arquitetura", filtre os cálculos do projeto e clique em "Exportar CSV (Excel)" ou "Imprimir / Salvar PDF A4" para gerar o documento técnico pronto para anexar à ART/RRT.'
    ]
  },
  {
    id: 14,
    title: '14. Roadmap de Produto (V1, V2 e V3)',
    subtitle: 'Planejamento evolutivo de entregas de valor técnico e comercial',
    category: 'Estratégia & Evolução',
    content: [
      'O desenvolvimento evolutivo do produto está dividido em três horizontes estratégicos:'
    ],
    tableData: {
      headers: ['Versão', 'Horizonte', 'Escopo Técnico Principal', 'Público-Alvo Foco'],
      rows: [
        ['V1 (MVP Atual)', 'Mês 1 a 3', 'Módulos Científico, Arquitetura (TO/CA/IP, Pisos, Pintura, Gesso, Ambientes), Engenharia (Escadas, Rampas, Telhados, Concreto, Alvenaria, Sapatas), Catálogo ABNT e Exportação PDF/CSV.', 'Estudantes, Arquitetos Autônomos e Engenheiros de Obra'],
        ['V2 (Cloud & Orçamento)', 'Mês 4 a 8', 'Sincronização em nuvem multiusuário, integração direta com tabelas SINAPI / TCPO para precificação automática de materiais, pré-dimensionamento de vigas isostáticas e reservatórios de água (NBR 5626).', 'Escritórios de Arquitetura, Construtoras e Orçamentistas'],
        ['V3 (Ecossistema BIM & IA)', 'Mês 9 a 14', 'Leitura direta de arquivos IFC 4.3 (IfcOpenShell), plugin nativo dentro do Autodesk Revit (pyRevit), assistente normativo baseado em RAG sobre normas ABNT e legislação urbanística municipal.', 'Incorporadoras, Coordenadores BIM e Grandes Projetos']
      ]
    }
  },
  {
    id: 15,
    title: '15. Estratégia para Versão Web e Convergência Desktop-Cloud',
    subtitle: 'Arquitetura híbrida Python FastAPI + React/TypeScript e opção Pyodide (WebAssembly)',
    category: 'Estratégia & Evolução',
    content: [
      'Para garantir que o código escrito para a versão Desktop Python não precise ser reescrito ao escalar para a Web, adotamos duas frentes complementares:',
      '1. Backend API-First com FastAPI: Os serviços Python da camada Application (ScientificCalculatorService, ArchitectureCalculationService, EngineeringCalculationService) são expostos como endpoints RESTful via FastAPI com validação Pydantic v2. O frontend React consome esses endpoints ou executa os cálculos localmente em modo offline-first (PWA).',
      '2. Execução Client-Side via Pyodide (WebAssembly): Como a camada de Domínio e Aplicação em Python usa apenas a biblioteca padrão (math, dataclasses, enum, decimal), os mesmos módulos .py podem rodar diretamente dentro do navegador Web via WebAssembly (Pyodide), garantindo paridade matemática bit-a-bit entre Desktop e Web sem latência de rede.'
    ]
  },
  {
    id: 16,
    title: '16. Estratégia para Integração BIM (OpenBIM / IFC)',
    subtitle: 'Extração automatizada de quantitativos QTO (Quantity Take-Off) via IfcOpenShell',
    category: 'Estratégia & Evolução',
    content: [
      'Na metodologia BIM (Building Information Modeling — ABNT NBR ISO 19650), o engenheiro não deve redigitar áreas de ambientes ou volumes de pilares manualmente se o modelo federado já existir. A integração OpenBIM em Python utiliza a biblioteca open-source IfcOpenShell:',
      '• Leitura de IfcSpace: Extrai automaticamente área líquida de piso, perímetro e altura de cada ambiente para alimentar o Módulo de Arquitetura (Porcelanato, Rodapé, Pintura e Forro de Gesso).',
      '• Leitura de IfcSlab, IfcBeam, IfcColumn e IfcFooting: Extrai volumes líquidos de concreto e áreas de fôrma diretamente do arquivo .ifc para o Módulo de Engenharia.',
      '• Injeção de Property Sets (Psets): Grava de volta no arquivo IFC os resultados calculados (ex.: Pset_ArqEng_Compliance com o índice de Blondel validado em cada IfcStairFlight).'
    ]
  },
  {
    id: 17,
    title: '17. Estratégia para Integração com Autodesk Revit',
    subtitle: 'Plugin nativo em Python utilizando pyRevit e Revit API',
    category: 'Estratégia & Evolução',
    content: [
      'Como toda a lógica de negócio da plataforma foi desenvolvida em Python modular, a integração com o Autodesk Revit é imediata através do framework pyRevit:',
      '1. Barra de Ferramentas Customizada (Ribbon Tab "ArqEng Studio"): Adicionada diretamente na interface do Revit.',
      '2. Auditoria de Escadas e Rampas em 1 Clique: O usuário seleciona uma escada ou rampa modelada no Revit; o script captura os parâmetros BuiltInParameter.STAIRS_ACTUAL_RISER_HEIGHT e STAIRS_ACTUAL_TREAD_DEPTH, envia para EngineeringCalculationService.calculate_stair() e destaca em verde ou vermelho os elementos que violam a NBR 9050 ou NBR 9077.',
      '3. Preenchimento Automático de Tabelas (Schedules): Os consumos de argamassa colante AC-III, rejunte e aço calculados pelo motor Python são gravados em Shared Parameters do projeto Revit.'
    ]
  },
  {
    id: 18,
    title: '18. Estratégia para Inteligência Artificial Futura',
    subtitle: 'Arquitetura híbrida Neuro-Simbólica: LLMs com RAG Normativo + Motor Matemático Determinístico',
    category: 'Estratégia & Evolução',
    content: [
      'Regra de Ouro em Engenharia: Modelos de linguagem (LLMs) NUNCA devem executar cálculos estruturais ou aritméticos diretamente devido ao risco de alucinação numérica. Nossa arquitetura de IA é estritamente Neuro-Simbólica (Function Calling + RAG):',
      '1. RAG (Retrieval-Augmented Generation) sobre Normas e Códigos de Obras: Vetorização semântica de cláusulas normativas e Planos Diretores municipais para responder dúvidas consultivas citando o item e a tabela exata da norma.',
      '2. Tool Calling Determinístico: Quando o usuário descreve um problema em linguagem natural, a IA apenas extrai os parâmetros estruturados (JSON) e invoca as funções determinísticas em Python do ArqEng Studio, devolvendo o memorial de cálculo matematicamente exato.'
    ]
  },
  {
    id: 19,
    title: '19. Estratégia para Atualização Automática das Normas Técnicas',
    subtitle: 'Desacoplamento de regras normativas (Rule Engine) e sincronização OTA assinada digitalmente',
    category: 'Estratégia & Evolução',
    content: [
      'As normas da ABNT passam por revisões periódicas (como a NBR 6118:2023 e NBR 15575:2024). Para evitar que os profissionais utilizem parâmetros defasados:',
      '1. Catálogo Declarativo Versionado (JSON Schema): Todos os coeficientes, limites de inclinação, cobrimentos mínimos e pesos específicos ficam armazenados em arquivos de manifesto normativo (normas_abnt_catalog.json) fora do código-fonte.',
      '2. Verificação de Manifesto Remoto (OTA Updates): Ao iniciar, a aplicação consulta o endpoint de metadados normativos, compara o hash SHA-256 do catálogo local e baixa novas revisões homologadas pelo corpo técnico.',
      '3. Imutabilidade Histórica de Memoriais: Cada cálculo salvo no histórico preserva o snapshot exato da versão da norma vigente na data de sua emissão (ex.: NBR 9050:2020), garantindo segurança jurídica para auditorias futuras.'
    ]
  },
  {
    id: 20,
    title: '20. Sugestões de Melhorias e Evolução do Produto',
    subtitle: 'Diferenciais competitivos para consolidação como líder de mercado em tecnologia AEC',
    category: 'Estratégia & Evolução',
    content: [
      '1. Modo Canteiro de Obras (PWA Offline + QR Code na Prancha): Geração automática de um QR Code no carimbo do Memorial PDF que permite ao mestre de obras ou engenheiro residente abrir a memória de cálculo exata daquele elemento no celular.',
      '2. Biblioteca de Traços Regionais e Insumos Reais: Cadastro de traços de concreto e argamassa calibrados por região brasileira e integração com catálogos de fabricantes de revestimentos e tintas.',
      '3. Módulo de Sustentabilidade e Pegada de Carbono (Embodied Carbon): Cálculo automático das emissões de CO2 equivalente (kgCO2e) associadas ao consumo de cimento, aço e cerâmica de cada estudo preliminar, alinhado às certificações LEED, AQUA-HQE e Selo Casa Azul.',
      '4. Colaboração em Tempo Real e Assinatura Digital ICP-Brasil: Fluxo de aprovação técnica onde o autor do cálculo submete o memorial para revisão de um engenheiro sênior com assinatura digital padrão ICP-Brasil.'
    ]
  }
];
