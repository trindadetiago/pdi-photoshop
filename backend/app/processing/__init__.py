import importlib
import pkgutil
from app.processing import processes as _pkg


def discover_processes():
    """Auto-import all modules in the processes package to trigger registration."""
    for importer, modname, ispkg in pkgutil.iter_modules(_pkg.__path__):
        importlib.import_module(f"app.processing.processes.{modname}")
