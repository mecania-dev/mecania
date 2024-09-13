from typing import Iterable
from openai import OpenAI, LengthFinishReasonError
from django.conf import settings

client = OpenAI()
client.api_key = settings.OPENAI_API_KEY


def ask_gpt(messages: Iterable[object]):
    try:
        completion = client.chat.completions.create(model="gpt-3.5-turbo", messages=messages, max_tokens=500)
        chat_response = completion.choices[0].message

        return chat_response
    except Exception as e:
        # Handle edge cases
        if type(e) == LengthFinishReasonError:
            # Retry with a higher max tokens
            print("Too many tokens: ", e)
            pass
        else:
            # Handle other exceptions
            print(e)
            pass
