import json
from channels.generic.websocket import WebsocketConsumer

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        # Accept the WebSocket connection
        self.accept()

    def disconnect(self, close_code):
        # Handle WebSocket disconnection
        pass

    def receive(self, text_data):
        # Handle incoming messages from the WebSocket
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Call the ChatGPT API or handle message processing here
        response = self.get_ai_response(message)

        # Send the response back to WebSocket
        self.send(text_data=json.dumps({
            'message': response
        }))

    def get_ai_response(self, user_message):
        # Replace this with actual ChatGPT API call
        return f'AI response to: {user_message}'
