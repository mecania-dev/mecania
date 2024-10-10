import logging, time
from openai import OpenAI
from django.conf import settings

from utils.env import env
from utils.json import extract_all_jsons

logger = logging.getLogger("global")

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
    logger.info("GPT response", extra={"context": "Ask GPT", "request_data": message, "response_data": latest_message})
    parsed_message = extract_all_jsons(latest_message)
    return parsed_message[0] if parsed_message else None
