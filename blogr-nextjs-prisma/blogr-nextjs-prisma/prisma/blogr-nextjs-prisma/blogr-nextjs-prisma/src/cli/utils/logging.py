# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import sys
from collections.abc import Callable
from functools import wraps
from typing import Any, TypeVar, cast

from rich.console import Console

console = Console()

F = TypeVar("F", bound=Callable[..., Any])


def handle_cli_error(f: F) -> F:
    """Decorator to handle CLI errors gracefully.

    Wraps CLI command functions to catch any exceptions and display them nicely
    to the user before exiting with a non-zero status code.

    Args:
        f: The CLI command function to wrap

    Returns:
        The wrapped function that handles errors
    """

    @wraps(f)
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        try:
            return f(*args, **kwargs)
        except KeyboardInterrupt:
            console.print("\nOperation cancelled by user", style="yellow")
            sys.exit(130)  # Standard exit code for Ctrl+C
        except Exception as e:
            console.print(f"Error: {e!s}", style="bold red")
            sys.exit(1)

    return cast(F, wrapper)
