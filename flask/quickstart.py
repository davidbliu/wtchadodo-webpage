# from __future__ import print_function
import httplib2
import os

from apiclient import discovery
import oauth2client
from oauth2client import client
from oauth2client import tools

# SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly'
SCOPES = 'https://www.googleapis.com/auth/drive'
CLIENT_SECRET_FILE = 'client_secret.json'
APPLICATION_NAME = 'Drive API Python Quickstart'

try:
    import argparse
    flags = argparse.ArgumentParser(parents=[tools.argparser]).parse_args()
except ImportError:
    flags = None

def get_credentials():
    home_dir = os.path.expanduser('~')
    credential_dir = os.path.join(home_dir, '.credentials')
    if not os.path.exists(credential_dir):
        os.makedirs(credential_dir)

    store = oauth2client.file.Storage('credentials.json')
    credentials = store.get()
    if not credentials or credentials.invalid:
        flow = client.flow_from_clientsecrets(CLIENT_SECRET_FILE, SCOPES)
        flow.user_agent = APPLICATION_NAME
        if flags:
            credentials = tools.run_flow(flow, store, flags)
        else: # Needed only for compatibility with Python 2.6
            credentials = tools.run(flow, store)
    return credentials

def get_service():
    credentials = get_credentials()
    http = credentials.authorize(httplib2.Http())
    service = discovery.build('drive', 'v2', http=http)
    return service

def get_permissions(file_id):
    # fileId = '0BwLZUlGsG71ONks1NUhWaV9abUE'
    results = service.permissions().list(fileId = file_id).execute()['items']
    return results

# creates a new doc and returns the doc_id
def create_doc(title):
    body = {
          'title': title,
          'description': 'new wtcha dodo file',
          'mimeType': 'application/vnd.google-apps.drive-sdk',
      }
    doc = service.files().insert(body = body).execute()
    doc_id = doc['selfLink'].split('/')[-1]
    return doc_id

def add_permissions(doc_id, emails):
    print 'add_permissoins'

service = get_service()


if __name__ == '__main__':
    doc_id= '0BwLZUlGsG71ONks1NUhWaV9abUE'
    # print get_permissions(doc_id)
    create_doc('test_doc')
