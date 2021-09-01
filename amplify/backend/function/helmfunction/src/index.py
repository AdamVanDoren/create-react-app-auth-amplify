# helmfunction

import requests
import json
import os


# Helm API Parameters
KEY = os.environ.get('HELM_KEY')
URI = 'https://crowley.helmconnect.com/'
ENDPOINT = 'api/v1/Jobs/Orders/FindOrders?page=1&FromDate=2021-09-01T16:16:00-07:00'
HEADERS = {'API-Key': KEY, 'Content-Type': 'application/json'}

# Output Template
RESPONSE = {
    'statusCode': '200',
    'headers': {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    },
}


def get_orders():
    """Returns current orders from Helm."""
    uri = URI + ENDPOINT
    response = requests.get(uri, headers=HEADERS)
    return response.json().get('Data').get('Page')


def handler(event, context):
    method = event.get('httpMethod')
    resource = event.get('resource')

    if resource == '/helm/orders':
        if method == 'GET':
            body = {
                'event': event,
                'orders': get_orders()
            }
        else:
            body = {
                'event': event,
                'message': 'Not allowed!'
            }
    elif resource == '/helm/message':
        if method == 'GET':
            body = {
                'event': event,
                'message': 'Hello from your new Amplify Python lambda!'
            }
        else:
            body = {
                'event': event,
                'message': 'Not allowed!'
            }
    else:
        body = {
            'event': event,
            'message': 'Incorrect endpoint!'
        }

    RESPONSE['body'] = json.dumps(body)

    return RESPONSE
