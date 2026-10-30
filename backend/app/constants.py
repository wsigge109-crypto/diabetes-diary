from typing import Literal

Context = Literal["fasting", "before_meal", "after_meal", "bedtime"]
RangeContext = Literal["fasting", "after_meal", "bedtime"]

DEFAULT_RANGES: dict[str, dict] = {
    "fasting": {"hint": "Утренние измерения", "min": 4.0, "max": 7.0},
    "after_meal": {"hint": "Через 2 часа", "min": None, "max": 9.0},
    "bedtime": {"hint": "Вечерний контроль", "min": 5.0, "max": 8.0},
}
