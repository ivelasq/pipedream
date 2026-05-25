---
title: "Connecting Python with LLMs"
author: "Isabella Velásquez"
date: 2026-05-09
description: This talk explores how to connect Python code directly to LLMs using chatlas, a lightweight library that makes LLM integration straightforward and flexible.
image: "thumbnail.jpeg"
image-alt: "Promotional graphic for a PyLadies Monterrey event titled Connecting Python with LLMs on May 9, 2026, at 12:30pm CT. A black snake decorated with pink and gold flowers curves across a white background with floral accents."
format:
  html:
    css: /talk/talks.css
language: 
  title-block-author-single: "Presented by"
  title-block-published: "Presented on"
---

```{=html}
<a href="https://www.linkedin.com/in/pyladies-monterrey-3ab6061b8/" class="btn btn-secondary">
  <i class="bi bi-calendar-event"></i>&nbsp;&nbsp;Event
</a>

<a href="https://019e0d75-ef39-43e7-55c0-dabb66e317bd.share.connect.posit.cloud/" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">
  <i class="bi bi-tv"></i>&nbsp;&nbsp;Slides
</a>

<a href="https://github.com/ivelasq/2026-05-09_connecting-python-with-llms" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">
  <i class="bi bi-github"></i>&nbsp;&nbsp;Repo
</a>
```

<br>

## Details

<ul style="list-style-type: none; padding-left: 0;">
  <li>👥 <a href="https://www.linkedin.com/in/pyladies-monterrey-3ab6061b8/">PyLadies Monterrey</a></li>
  <li>📆 09 May 2026 // 12:30 PM CST</li>
  <li>💻️ Virtual</li>
</ul>

## Description

Large language models (LLMs) like ChatGPT and Claude have become powerful tools for everyday work, but using them through a browser interface is just the beginning. This talk explores how to connect Python code directly to LLMs using [chatlas](https://posit-dev.github.io/chatlas/), a lightweight library that makes LLM integration straightforward and flexible.

## Slides

<iframe src="https://019e0d75-ef39-43e7-55c0-dabb66e317bd.share.connect.posit.cloud/#/title-slide" height="415" width="800" ></iframe>

## Summary

::: {.panel-tabset}

### Español

_Este resumen fue generado por Claude Sonnet 4.6 y revisado por mí._

#### ¿Qué son los modelos de lenguaje grandes?

Los LLMs son modelos de IA entrenados con cantidades masivas de texto — libros, sitios web, código — que pueden entender y generar texto similar al humano. Impulsan herramientas que la mayoría de nosotros ya usamos: ChatGPT, Claude, Gemini. Pero usarlos a través de un navegador es solo el comienzo.

> *"Hoy iremos más allá de la interfaz web y aprenderemos cómo integrar estos modelos directamente en tu código Python. Esto abre posibilidades para la automatización, flujos de trabajo personalizados y la creación de tus propias herramientas impulsadas por IA."*

#### Interactuando con LLMs usando chatlas

Hay varias formas de trabajar con LLMs en Python de forma programática: SDKs de proveedores (OpenAI, Anthropic, Google), o frameworks como LangChain, LlamaIndex y Haystack. [chatlas](https://posit-dev.github.io/chatlas/) busca un punto intermedio: lo suficientemente simple para comenzar rápidamente, pero lo suficientemente flexible para aplicaciones reales.

> *"chatlas fue diseñado para hacer que la integración con LLMs sea sencilla. No necesitas aprender abstracciones complejas ni navegar por archivos de configuración. Maneja tareas comunes como el historial de conversación automáticamente, mientras te da acceso a funciones avanzadas cuando las necesites."*

Comenzar toma tres líneas:[^1-es]

[^1-es]: Esto requiere que Ollama esté instalado y el modelo `gemma3` descargado localmente. Consulta el artículo [Setting up local LLMs for R and Python](https://posit.co/blog/setting-up-local-llms-for-r-and-python) para instrucciones de configuración.

```python
from chatlas import ChatOllama

chat = ChatOllama(model="gemma3")

chat.chat("Tell me something about Monterrey, Mexico.")
```

También puedes agregar un system prompt para controlar el comportamiento del modelo — por ejemplo, restringirlo a respuestas en español de no más de tres oraciones:

```python
chat = ChatOllama(model="gemma3",
                  system_prompt="Reply in Spanish using at most three sentences.")

chat.chat("Tell me something about Monterrey, Mexico.")
```

chatlas funciona en la consola de Python para experimentación rápida, en scripts para automatización, y en notebooks de Jupyter para trabajo exploratorio.

#### Proveedores y modelos

Un **proveedor** es una empresa que aloja y sirve modelos (OpenAI, Anthropic, Google). Un **modelo** es el LLM específico que estás usando (GPT-4, Claude, Gemini). Los modelos se diferencian en varias dimensiones:

1. **Contexto** — ¿cuántos tokens puedes darle al modelo?
2. **Velocidad** — ¿cuántos tokens por segundo?
3. **Costo** — ¿cuánto por millón de tokens?
4. **Inteligencia** — capacidad de razonamiento y precisión
5. **Capacidades** — visión, llamada de herramientas, salida estructurada, etc.

chatlas soporta APIs comerciales, modelos locales vía Ollama, y servicios empresariales como Bedrock. Lo más importante: cambiar de proveedor solo requiere cambiar la importación (`ChatOllama` vs `ChatAnthropic`) y el modelo (`gemma3` vs `claude-sonnet-4-6`) — el resto de tu código permanece prácticamente igual:[^2-es]

```python
from chatlas import ChatOllama
chat = ChatOllama(model="gemma3")

# or

from chatlas import ChatAnthropic
chat = ChatAnthropic(model="claude-sonnet-4-6",
                     api_key=os.getenv("ANTHROPIC_API_KEY"))
```

[^2-es]: A diferencia de `ChatOllama`, `ChatAnthropic` requiere una clave de API porque los modelos de Anthropic son un servicio de pago. Para saber cómo almacenar y acceder a las claves de API de forma segura, consulta [How to set and access environment variables in Python](https://ivelasq.rbind.io/til-python/python-env/).

> *"Esta flexibilidad significa que puedes comenzar con un proveedor y cambiar a otro sin reescribir tu código."*

#### Llamada de herramientas (tool calling)

Por defecto, los LLMs no tienen acceso a datos en tiempo real. Pregúntales sobre el clima y obtendrás información general — no el pronóstico de hoy. La llamada de herramientas soluciona esto permitiendo que el modelo llame a tus funciones de Python.

La clave es el docstring: le dice al modelo qué hace la función y qué parámetros necesita. chatlas lo convierte automáticamente a un formato que el modelo entiende.

```python
import requests

def get_current_weather(lat: float, lng: float):
    """
    Get the current weather given a latitude and longitude.

    Parameters
    ----------
    lat: The latitude of the location.
    lng: The longitude of the location.
    """
    lat_lng = f"latitude={lat}&longitude={lng}"
    url = f"https://api.open-meteo.com/v1/forecast?{lat_lng}&current=temperature_2m,wind_speed_10m"
    response = requests.get(url)
    return response.json()["current"]

chat.register_tool(get_current_weather)
chat.chat("How's the weather in Monterrey, Mexico?")
```

Una vez registrada, el modelo reconoce cuándo necesita datos del clima, llama a la función con las coordenadas correctas, e integra el resultado en una respuesta natural:

```
# 🔧 tool request
 get_current_weather(lat=25.6866, lng=-100.3161)

# ✅ tool result
 {'temperature_2m': 23.1, 'wind_speed_10m': 4.5}

The current weather in Monterrey is 23.1°C with light winds of 4.5 km/h.
```

> *"Este es el poder de la llamada de herramientas — tu LLM ahora puede interactuar con cualquier API o fuente de datos que le proporciones."*

#### Entrada multimodal

chatlas puede manejar más que solo texto. Pásale un archivo de imagen y hazle preguntas sobre él:

```python
chat = ChatOllama(model="gemma3")

chat.chat(
    chatlas.content_image_file("./images/View_of_Monterrey.jpg"),
    "Can you explain this image? Be concise."
)
```

Los PDFs funcionan de la misma manera — útil para procesar artículos de investigación, informes o facturas:

```python
chat = ChatAnthropic(model="claude-sonnet-4-6",
                     api_key=os.getenv("ANTHROPIC_API_KEY"))

chat.chat(
    chatlas.content_pdf_file("./images/data-projects-in-monterrey-mexico.pdf"),
    "What are the main findings? Be concise."
)
```

No todos los modelos soportan todos los tipos de entrada, así que vale la pena revisar la documentación del proveedor — pero los modelos con capacidad de visión y de documentos son cada vez más comunes.

#### Streaming e historial de chat

El streaming devuelve respuestas fragmento a fragmento a medida que se generan, lo que crea una experiencia más fluida:

```python
stream = chat.stream("My name is Isabella.")
for chunk in stream:
    print(chunk)
```

El historial de chat se mantiene automáticamente. Más tarde en la misma sesión:

```python
chat.chat("What's my name?")
# → Your name is Isabella!
```

> *"No necesitas gestionar el contexto manualmente — simplemente funciona. Esto hace que construir aplicaciones conversacionales sea mucho más simple."*

Juntos, el streaming y el historial de chat persistente son la base de cualquier chatbot.

#### Ejemplos prácticos

##### Resumen de documentos en lote

Define los campos que quieres con un modelo de Pydantic, recorre una carpeta de PDFs, y guarda los resultados como un CSV:

```python
from pathlib import Path
from pydantic import BaseModel
import pandas as pd

chat = ChatGoogle(model="gemini-1.5-flash")

class Paper(BaseModel):
    """Extract key information from this research paper."""
    title: str
    authors: list[str]
    year: int
    key_findings: str  # 1-2 sentences

papers = []
for pdf_path in Path("research_papers/").glob("*.pdf"):
    result = chat.chat_structured(
        chatlas.content_pdf_file(pdf_path), data_model=Paper
    )
    papers.append(result.model_dump())

pd.DataFrame(papers).to_csv("paper_summaries.csv", index=False)
```

> *"Algo que tomaría horas de trabajo manual se convierte en un script corto que se ejecuta en minutos."*

##### Construyendo un chatbot con Shiny

chatlas se integra directamente con [Shiny for Python](https://shiny.posit.co/py/). Shiny proporciona la interfaz de chat; chatlas se encarga del LLM:

```python
from chatlas import ChatOllama
from shiny.express import ui

chat = ui.Chat(id="ui_chat")
chat.ui()

chat_model = ChatOllama(model="gemma3:1b")

@chat.on_user_submit
async def handle_user_input():
    response = chat_model.stream(chat.user_input())
    await chat.append_message_stream(response)
```

##### Conectando un chatbot a tus propios datos

Los chatbots genéricos (ChatGPT, Claude) no pueden responder preguntas sobre los datos de tu organización. Con chatlas puedes registrar herramientas que consulten tus bases de datos locales, registros de eventos o APIs internas:

```python
EVENTS = [
    {"name": "Python & LLMs Workshop", "date": "2026-05-09",
     "location": "TEC de Monterrey", "attendees": 45, "topic": "chatlas and AI"},
]

def get_upcoming_events(topic: str = None):
    """Get upcoming PyLadies Monterrey events, optionally filtered by topic."""
    return [e for e in EVENTS if topic.lower() in e["topic"].lower()]

chat = ChatAnthropic(model="claude-sonnet-4-5")
chat.register_tool(get_upcoming_events)

chat.chat("What events do we have about AI?")
```

El modelo llama a la función, obtiene los datos, y responde de forma natural — en este caso incluso cambiando al español para la audiencia de PyLadies Monterrey.

Para un ejemplo completo que combina Shiny, chatlas y llamada de herramientas en un chatbot funcional de PyLadies Monterrey, consulta [`monterrey_app.py`](https://github.com/ivelasq/2026-05-09_connecting-python-with-llms/blob/main/monterrey_app.py) en el repositorio de la charla.

##### Desplegando chatbots

No lo cubrimos en la charla, pero si quieres desplegar chatbots de Shiny for Python conectados a LLMs con chatlas, [Posit Connect Cloud](https://connect.posit.cloud/) es una opción gratuita. Hay documentación disponible sobre cómo [Deploy a LLM-powered Shiny for Python App with Secrets](https://docs.posit.co/connect-cloud/how-to/python/llm-shiny-python.html).

#### Lo que sigue

Una vez que te sientas cómoda con lo básico, hay técnicas poderosas para explorar:

- **MCP (Model Context Protocol)** — un protocolo estandarizado para conectar LLMs a fuentes de datos y herramientas
- **RAG (Retrieval Augmented Generation)** — fundamenta las respuestas en tus propios documentos y bases de conocimiento
- **Evals** — prueba y mide sistemáticamente la calidad y confiabilidad de tu aplicación LLM

#### Resumen

chatlas hace que conectar Python con LLMs sea sencillo:

- **Multi-proveedor** — alterna entre OpenAI, Anthropic, Google, Ollama y más cambiando solo una línea
- **Llamada de herramientas** — registra cualquier función de Python para que el modelo pueda llamar APIs reales y acceder a datos en vivo
- **Multimodal** — pasa imágenes y PDFs junto con prompts de texto
- **Streaming** — devuelve respuestas fragmento a fragmento para una experiencia de usuario fluida
- **Con estado** — el historial de conversación se rastrea automáticamente
- **Integración con Shiny** — construye interfaces de chat interactivas en unas pocas líneas de código

### English

_This summary was generated by Claude Sonnet 4.6 and reviewed by me._

#### What are Large Language Models?

LLMs are AI models trained on massive amounts of text — books, websites, code — that can understand and generate human-like text. They power tools most of us already use: ChatGPT, Claude, Gemini. But using them through a browser is just the beginning.

> *"Today we'll go beyond the web interface and learn how to integrate these models directly into your Python code. This opens up possibilities for automation, custom workflows, and building your own AI-powered tools."*

#### Interacting with LLMs using chatlas

There are several ways to work with LLMs in Python programmatically: provider SDKs (OpenAI, Anthropic, Google), or frameworks like LangChain, LlamaIndex, and Haystack. [chatlas](https://posit-dev.github.io/chatlas/) aims for a middle ground: simple enough to get started quickly, but flexible enough for real applications.

> *"chatlas was designed to make LLM integration straightforward. You don't need to learn complex abstractions or wade through configuration files. It handles common tasks like conversation history automatically, while still giving you access to advanced features when you need them."*

Getting started takes three lines:[^1]

[^1]: This requires Ollama to be installed and the `gemma3` model downloaded locally. See the [Setting up local LLMs for R and Python](https://posit.co/blog/setting-up-local-llms-for-r-and-python) blog post for setup instructions.

```python
from chatlas import ChatOllama

chat = ChatOllama(model="gemma3")

chat.chat("Tell me something about Monterrey, Mexico.")
```

You can also add a system prompt to control the model's behavior — for example, restricting it to Spanish responses no longer than three sentences:

```python
chat = ChatOllama(model="gemma3",
                  system_prompt="Reply in Spanish using at most three sentences.")

chat.chat("Tell me something about Monterrey, Mexico.")
```

chatlas works in the Python console for quick experimentation, in scripts for automation, and in Jupyter notebooks for exploratory work.

#### Providers and models

A **provider** is a company that hosts and serves models (OpenAI, Anthropic, Google). A **model** is the specific LLM you're using (GPT-4, Claude, Gemini). Models differ along several dimensions:

1. **Context** — how many tokens can you give the model?
2. **Speed** — how many tokens per second?
3. **Cost** — how much per million tokens?
4. **Intelligence** — reasoning ability and accuracy
5. **Capabilities** — vision, tool calling, structured output, etc.

chatlas supports commercial APIs, local models via Ollama, and enterprise services like Bedrock. Crucially, switching providers requires only changing the import (`ChatOllama` vs `ChatAnthropic`) and the model (`gemma3` vs `claude-sonnet-4-6`) — the rest of your code stays mostly the same:[^2]

```python
from chatlas import ChatOllama
chat = ChatOllama(model="gemma3")

# or

from chatlas import ChatAnthropic
chat = ChatAnthropic(model="claude-sonnet-4-6",
                     api_key=os.getenv("ANTHROPIC_API_KEY"))
```

[^2]: Unlike `ChatOllama`, `ChatAnthropic` requires an API key because Anthropic's models are a paid service. For how to store and access API keys securely, see [How to set and access environment variables in Python](https://ivelasq.rbind.io/til-python/python-env/).

> *"This flexibility means you can start with one provider and switch to another without rewriting your code."*

#### Tool calling

Out of the box, LLMs don't have access to real-time data. Ask about the weather and you'll get general climate information — not today's forecast. Tool calling fixes this by letting the model call your Python functions.

The key is the docstring: it tells the model what the function does and what parameters it needs. chatlas converts this automatically into a format the model understands.

```python
import requests

def get_current_weather(lat: float, lng: float):
    """
    Get the current weather given a latitude and longitude.

    Parameters
    ----------
    lat: The latitude of the location.
    lng: The longitude of the location.
    """
    lat_lng = f"latitude={lat}&longitude={lng}"
    url = f"https://api.open-meteo.com/v1/forecast?{lat_lng}&current=temperature_2m,wind_speed_10m"
    response = requests.get(url)
    return response.json()["current"]

chat.register_tool(get_current_weather)
chat.chat("How's the weather in Monterrey, Mexico?")
```

Once registered, the model recognizes when it needs weather data, calls the function with the right coordinates, and weaves the result into a natural response:

```
# 🔧 tool request
 get_current_weather(lat=25.6866, lng=-100.3161)

# ✅ tool result
 {'temperature_2m': 23.1, 'wind_speed_10m': 4.5}

The current weather in Monterrey is 23.1°C with light winds of 4.5 km/h.
```

> *"This is the power of tool calling — your LLM can now interact with any API or data source you provide."*

#### Multi-modal input

chatlas can handle more than text. Pass an image file and ask questions about it:

```python
chat = ChatOllama(model="gemma3")

chat.chat(
    chatlas.content_image_file("./images/View_of_Monterrey.jpg"),
    "Can you explain this image? Be concise."
)
```

PDFs work the same way — useful for processing research papers, reports, or invoices:

```python
chat = ChatAnthropic(model="claude-sonnet-4-6",
                     api_key=os.getenv("ANTHROPIC_API_KEY"))

chat.chat(
    chatlas.content_pdf_file("./images/data-projects-in-monterrey-mexico.pdf"),
    "What are the main findings? Be concise."
)
```

Not all models support every input type, so it's worth checking provider documentation — but vision-capable and document-capable models are increasingly common.

#### Streaming and chat history

Streaming returns responses chunk by chunk as they're generated, which creates a more responsive experience:

```python
stream = chat.stream("My name is Isabella.")
for chunk in stream:
    print(chunk)
```

Chat history is maintained automatically. Later in the same session:

```python
chat.chat("What's my name?")
# → Your name is Isabella!
```

> *"You don't need to manually manage context — it just works. This makes building conversational applications much simpler."*

Together, streaming and persistent chat history are the foundation of any chatbot.

#### Practical examples

##### Batch document summarization

Define the fields you want with a Pydantic model, loop through a folder of PDFs, and save the results as a CSV:

```python
from pathlib import Path
from pydantic import BaseModel
import pandas as pd

chat = ChatGoogle(model="gemini-1.5-flash")

class Paper(BaseModel):
    """Extract key information from this research paper."""
    title: str
    authors: list[str]
    year: int
    key_findings: str  # 1-2 sentences

papers = []
for pdf_path in Path("research_papers/").glob("*.pdf"):
    result = chat.chat_structured(
        chatlas.content_pdf_file(pdf_path), data_model=Paper
    )
    papers.append(result.model_dump())

pd.DataFrame(papers).to_csv("paper_summaries.csv", index=False)
```

> *"Something that would take hours of manual work becomes a short script that runs in minutes."*

##### Building a chatbot with Shiny

chatlas integrates directly with [Shiny for Python](https://shiny.posit.co/py/). Shiny provides the chat UI; chatlas handles the LLM:

```python
from chatlas import ChatOllama
from shiny.express import ui

chat = ui.Chat(id="ui_chat")
chat.ui()

chat_model = ChatOllama(model="gemma3:1b")

@chat.on_user_submit
async def handle_user_input():
    response = chat_model.stream(chat.user_input())
    await chat.append_message_stream(response)
```

##### Connecting a chatbot to your own data

Generic chatbots (ChatGPT, Claude) can't answer questions about your organization's data. With chatlas you can register tools that query your local databases, event records, or internal APIs:

```python
EVENTS = [
    {"name": "Python & LLMs Workshop", "date": "2026-05-09",
     "location": "TEC de Monterrey", "attendees": 45, "topic": "chatlas and AI"},
]

def get_upcoming_events(topic: str = None):
    """Get upcoming PyLadies Monterrey events, optionally filtered by topic."""
    return [e for e in EVENTS if topic.lower() in e["topic"].lower()]

chat = ChatAnthropic(model="claude-sonnet-4-5")
chat.register_tool(get_upcoming_events)

chat.chat("What events do we have about AI?")
```

The model calls the function, gets the data, and responds naturally — in this case even switching to Spanish for the PyLadies Monterrey audience.

For a full example that combines Shiny, chatlas, and tool calling into a working PyLadies Monterrey chatbot, see [`monterrey_app.py`](https://github.com/ivelasq/2026-05-09_connecting-python-with-llms/blob/main/monterrey_app.py) in the talk repo.

##### Deploying chatbots

We didn't cover this in the talk, but if you want to deploy Shiny for Python chatbots connected to LLMs with chatlas, [Posit Connect Cloud](https://connect.posit.cloud/) is a free option. Documentation is available on how to [Deploy a LLM-powered Shiny for Python App with Secrets](https://docs.posit.co/connect-cloud/how-to/python/llm-shiny-python.html).

#### What's next

Once you're comfortable with the basics, there are powerful techniques to explore:

- **MCP (Model Context Protocol)** — a standardized protocol for connecting LLMs to data sources and tools
- **RAG (Retrieval Augmented Generation)** — ground responses in your own documents and knowledge bases
- **Evals** — systematically test and measure your LLM application's quality and reliability

#### Summary

chatlas makes it straightforward to connect Python to LLMs:

- **Multi-provider** — swap between OpenAI, Anthropic, Google, Ollama, and more by changing one line
- **Tool calling** — register any Python function so the model can call real APIs and access live data
- **Multi-modal** — pass images and PDFs alongside text prompts
- **Streaming** — return responses chunk by chunk for a responsive user experience
- **Stateful** — conversation history is tracked automatically
- **Shiny integration** — build interactive chat UIs in a few lines of code

:::

