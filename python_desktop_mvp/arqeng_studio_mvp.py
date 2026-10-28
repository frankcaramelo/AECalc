"""
ArqEng Studio — Plataforma Profissional de Cálculos Técnicos (Desktop & Core Engine)
Compatível com Windows, Linux e macOS (Python 3.11+ / Tkinter TTK / Clean Architecture).
"""
from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import math
from typing import Dict, List, Any
import uuid


class ModuleType(str, Enum):
    SCIENTIFIC = "Científico"
    ARCHITECTURE = "Arquitetura"
    ENGINEERING = "Engenharia"


class AngleUnit(str, Enum):
    DEG = "DEG"
    RAD = "RAD"
    GRAD = "GRAD"


@dataclass(frozen=True)
class StairDimensioningResult:
    total_height_cm: float
    steps_count: int
    riser_height_cm: float
    tread_depth_cm: float
    blondel_index_cm: float
    total_run_m: float
    slope_degrees: float
    is_nbr9050_compliant: bool
    normative_notes: List[str]


class ScientificCalculatorService:
    """Motor científico com trigonometria, hiperbólicas, logaritmos, radiciação e fatorial."""

    @staticmethod
    def to_radians(value: float, unit: AngleUnit = AngleUnit.DEG) -> float:
        if unit == AngleUnit.RAD:
            return value
        if unit == AngleUnit.DEG:
            return math.radians(value)
        if unit == AngleUnit.GRAD:
            return value * (math.pi / 200.0)
        raise ValueError(f"Unidade inválida: {unit}")

    @classmethod
    def trig(cls, func_name: str, angle: float, unit: AngleUnit = AngleUnit.DEG) -> float:
        rad = cls.to_radians(angle, unit)
        funcs = {
            "sin": math.sin,
            "cos": math.cos,
            "tan": math.tan,
            "sinh": math.sinh,
            "cosh": math.cosh,
            "tanh": math.tanh,
        }
        return round(funcs[func_name](rad), 10)

    @staticmethod
    def factorial(n: int) -> int:
        if n < 0 or int(n) != n:
            raise ValueError("Fatorial requer inteiro não-negativo.")
        return math.factorial(int(n))


class ArchitectureCalculationService:
    """Cálculos de Arquitetura e Urbanismo (TO, CA, IP, Paginação, Porcelanato, Pintura e Gesso)."""

    @staticmethod
    def calculate_urban_indices(
        lot_area_m2: float,
        ground_projection_m2: float,
        total_computable_area_m2: float,
        permeable_area_m2: float,
    ) -> Dict[str, float]:
        if lot_area_m2 <= 0:
            raise ValueError("Área do lote deve ser positiva.")
        return {
            "to_pct": round((ground_projection_m2 / lot_area_m2) * 100.0, 2),
            "ca_index": round(total_computable_area_m2 / lot_area_m2, 2),
            "ip_pct": round((permeable_area_m2 / lot_area_m2) * 100.0, 2),
        }


class EngineeringCalculationService:
    """Cálculos de Engenharia Civil (Escadas Blondel NBR 9050/9077, Rampas, Telhados, Concreto, Sapatas)."""

    @staticmethod
    def calculate_stair(
        total_height_cm: float,
        desired_riser_cm: float = 17.5,
        tread_cm: float = 29.0,
        landing_length_m: float = 1.20,
    ) -> StairDimensioningResult:
        steps = max(1, round(total_height_cm / desired_riser_cm))
        actual_riser = total_height_cm / steps
        blondel = (2.0 * actual_riser) + tread_cm
        total_run_m = ((steps - 1) * (tread_cm / 100.0)) + landing_length_m
        slope_deg = math.degrees(math.atan(actual_riser / tread_cm))
        compliant = (16.0 <= actual_riser <= 18.0) and (28.0 <= tread_cm <= 32.0) and (63.0 <= blondel <= 65.0)
        notes = ["CONFORME NBR 9050 e NBR 9077"] if compliant else ["Verificar faixa normativa (Blondel 63-65 cm)"]
        return StairDimensioningResult(
            total_height_cm=round(total_height_cm, 2),
            steps_count=steps,
            riser_height_cm=round(actual_riser, 2),
            tread_depth_cm=round(tread_cm, 2),
            blondel_index_cm=round(blondel, 2),
            total_run_m=round(total_run_m, 2),
            slope_degrees=round(slope_deg, 2),
            is_nbr9050_compliant=compliant,
            normative_notes=notes,
        )
