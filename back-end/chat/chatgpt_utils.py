import logging
from openai import AsyncOpenAI
from django.conf import settings
from channels.db import database_sync_to_async

from utils.env import env
from utils.json import extract_all_jsons

logger = logging.getLogger("global")
client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def ask_gpt(message: str):
    if isinstance(message, str):
        messages = [{"role": "user", "content": message}]
    else:
        messages = message

    thread = await client.beta.threads.create(messages=messages)

    try:
        await client.beta.threads.runs.create_and_poll(
            thread_id=thread.id,
            assistant_id=env("ASSISTANT_ID"),
            additional_instructions="IMPORTANTE: Lembre-se de sempre buscar os arquivos anexados antes de indicar recomendações, mantendo o nome exatamente igual ao do arquivo anexado. Em hipótese alguma, indique recomendações sem antes verificar os arquivos anexados. No arquivo contém um array de categorias, onde você buscará as informações. Desse array fornecido nos arquivos anexados, você pegará o valor em 'category' e colocará no campo 'category' do issue, e no array 'recommendations' do issue, você pegará o valor em 'name' do array 'services' do arquivo anexado.",
        )
    except Exception as e:
        await database_sync_to_async(logger.error)(
            "GPT error", extra={"context": "Erro ao criar o run", "request_data": messages, "response_data": str(e)}
        )

    messages = await client.beta.threads.messages.list(thread_id=thread.id, limit=1)
    latest_message = messages.data[0].content[0].text.value

    await database_sync_to_async(logger.info)(
        "GPT response", extra={"context": "Ask GPT", "request_data": message, "response_data": latest_message}
    )
    parsed_message = extract_all_jsons(latest_message)

    return parsed_message[0] if parsed_message else None
