import os
from dotenv import load_dotenv
from .assertions import is_primitive_class

# Load the .env file
load_dotenv()


def env(key: str, default=None, type=None, split: str = None, validate_split=None):
    if type is not None and not is_primitive_class(type):
        raise ValueError("type must be a primitive type like int, float, bool, or str")

    if isinstance(default, bool) or type == bool:
        return os.environ.get(key, str(default)) == "True"

    if type is not None:
        return type(os.environ.get(key, default))

    value = os.environ.get(key, default)

    if split is not None:
        return [item for item in value.split(split) if item and (validate_split is None or validate_split(item))]

    return value
