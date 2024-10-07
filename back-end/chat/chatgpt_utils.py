import time
from openai import OpenAI
from django.conf import settings

from utils.env import env
from utils.json import extract_all_jsons

client = OpenAI()
client.api_key = settings.OPENAI_API_KEY


def ask_gpt(message: str):
    thread = client.beta.threads.create(messages=[{"role": "user", "content": message}])
    run = client.beta.threads.runs.create(thread_id=thread.id, assistant_id=env("ASSISTANT_ID"))

    while run.status != "completed":
        run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
        time.sleep(1)

    message_response = client.beta.threads.messages.list(thread_id=thread.id)
    messages = message_response.data
    latest_message = messages[0].content[0].text.value
    parsed_message = extract_all_jsons(latest_message)[0]
    return parsed_message
