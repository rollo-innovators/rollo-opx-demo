import json
import os

from backend.common.agent.vector_store import VectorStore
from load_dotenv import load_dotenv
from langchain_openai import ChatOpenAI
import logging
from langchain.agents import AgentExecutor, create_tool_calling_agent
from ..toolkit import Toolkit
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage
load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

PROMPT = """
You are OPX, an assistant responsible for Operational Excellence. You will assist with heavy machinery and use tools to 
make it easy for a human to interact with it. You will also assist with the maintenance of the machinery.
Use markdown, keep it concise and to the point. If the user reports a broken or malfunctioning machine, you should 
help them as much as possible and afterwards ask if they'd like to create a SAP ticket - then call the appropriate tool.

Keep your generations to summaries, each message should have max 30 words. Generate markdown, make sure that there's a lot of \\ns. Do not use nested lists. ALWAYS used ordered lists.

If you're not sure what to do, you can ask the user for more information.
"""
PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            PROMPT
        ),
        ("placeholder", "{chat_history}"),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}"),
    ]
)

class Agent:
    """
    Base class for an agent
    """

    def __init__(self):
        """
        Initialize the agent
        """
        self.vector_store = VectorStore()
        self.model = ChatOpenAI(model='gpt-4o')
        self.toolkit = Toolkit()
        temp = create_tool_calling_agent(self.model, self.toolkit.get_tools(), prompt=PROMPT)
        self.agent = AgentExecutor(agent=temp, tools=self.toolkit.get_tools(), verbose=True,
                                   return_intermediate_steps=True)

    def __call__(self, message, history):
        """
        Call the agent
        """
        retrieved = self.vector_store.search(message)
        generated = self.generate_response(message, retrieved, history)
        return generated

    def generate_response(self, message, retrieved, history):
        """
        Generate a response
        """
        message = f"""
        POSSIBLY RELEVANT DOCUMENTS:
        {retrieved}
        
        HISTORY SO FAR:
        {history}
        
        USER MESSAGE:
        {message}
        """

        return self.agent.invoke(
            {
                "input": message,
            }
    )
    
    def interpret_image(self, image):
        """
        Interpret an image
        """
        
        message = HumanMessage(
                content=[
                    {"type": "text", "text": "Interpret the image, you are a machine operator - look for damages or issues."},
                    {"type": "image_url", "image_url": {"url": image}},
                ],
            ) 
        response = self.model.invoke([message])
        return response