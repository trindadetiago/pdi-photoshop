from __future__ import annotations

from typing import Callable

from app.schemas import ProcessDefinition


class ProcessRegistry:
    _registry: dict[str, tuple[ProcessDefinition, Callable]] = {}

    @classmethod
    def register(cls, definition: ProcessDefinition):
        def decorator(func: Callable):
            cls._registry[definition.id] = (definition, func)
            return func
        return decorator

    @classmethod
    def get_all_definitions(cls) -> list[ProcessDefinition]:
        return [defn for defn, _ in cls._registry.values()]

    @classmethod
    def get_function(cls, process_id: str) -> Callable | None:
        entry = cls._registry.get(process_id)
        return entry[1] if entry else None

    @classmethod
    def get_definition(cls, process_id: str) -> ProcessDefinition | None:
        entry = cls._registry.get(process_id)
        return entry[0] if entry else None
