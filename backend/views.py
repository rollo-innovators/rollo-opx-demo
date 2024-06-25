import json
from django.shortcuts import render
from rest_framework.views import APIView
from django.http import JsonResponse
from .common.agent import Agent
from .common.toolkit import Toolkit


class ChatView(APIView):
    agent = Agent()

    def post(self, request):
        message = request.data.get('message')
        history = request.data.get('history', [])
        image = message.get('image')
        message = message.get('content')
        if image is not None:
            message = message + " Previous Chain's Image Interpretation:\n" + self.agent.interpret_image(image).content
            print(message)
        response = self.agent(message, history)

        output = response['output']
        intermediate_steps = self.serialize_intermediate_steps(response['intermediate_steps'])

        return JsonResponse({"output": output, "intermediate_steps": intermediate_steps})

    def serialize_intermediate_steps(self, intermediate_steps):
        serialized_steps = []
        for step in intermediate_steps:
            if isinstance(step, tuple):
                tool_action, result = step
                serialized_step = {
                    'tool': tool_action.tool,
                    'tool_input': tool_action.tool_input,
                    'log': tool_action.log,
                    'message_log': [
                        {
                            'content': chunk.content,
                            'additional_kwargs': chunk.additional_kwargs,
                            'response_metadata': chunk.response_metadata,
                            'id': chunk.id,
                            'tool_calls': chunk.tool_calls,
                            'tool_call_chunks': chunk.tool_call_chunks,
                        }
                        for chunk in tool_action.message_log
                    ],
                    'tool_call_id': tool_action.tool_call_id,
                    'result': result,
                }
                serialized_steps.append(serialized_step)
            else:
                serialized_steps.append(step)
        return serialized_steps


class ActionView(APIView):
    toolkit = Toolkit()
    
    def post(self, request):
        action = request.data.get('action')
        return "Executed Action: " + action