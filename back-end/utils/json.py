import regex
import json


def extract_all_jsons(input_string):
    # Regex pattern to match all JSON objects
    pattern = regex.compile(r"\{(?:[^{}]|(?R))*\}")  # Matches entire JSON objects, allowing for nested structures
    matches = pattern.findall(input_string)  # Find all matches

    json_objects = []
    for match in matches:
        try:
            json_object = json.loads(match)  # Parse each matched JSON string
            json_objects.append(json_object)  # Add to the list of JSON objects
        except json.JSONDecodeError:
            continue  # Skip any malformed JSON strings

    return json_objects  # Return the list of parsed JSON objects
