import unicodedata


def normalize_string(s):
    if not isinstance(s, str) or not s:
        return ""
    # Normalize the string to NFKD form, which separates characters from their diacritics
    normalized = unicodedata.normalize("NFKD", s)
    # Encode the string to ASCII, ignoring characters that can't be encoded (like accents)
    return normalized.encode("ASCII", "ignore").decode("utf-8")
