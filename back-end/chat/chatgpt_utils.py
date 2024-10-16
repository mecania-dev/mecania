import logging
from openai import AsyncOpenAI
from django.conf import settings

from utils.env import env
from utils.json import extract_all_jsons

logger = logging.getLogger("global")
client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def ask_gpt(message: str):
    thread = await client.beta.threads.create(messages=[{"role": "user", "content": message}])

    await client.beta.threads.runs.create_and_poll(thread_id=thread.id, assistant_id=env("ASSISTANT_ID"))

    messages = await client.beta.threads.messages.list(thread_id=thread.id, limit=1)
    latest_message = messages.data[0].content[0].text.value

    logger.info("GPT response", extra={"context": "Ask GPT", "request_data": message, "response_data": latest_message})
    parsed_message = extract_all_jsons(latest_message)

    return parsed_message[0] if parsed_message else None
