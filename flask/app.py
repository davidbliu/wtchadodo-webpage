from flask import Flask, request, jsonify, redirect, url_for, session, Response, make_response
from flask.ext.cors import CORS
import json
import quickstart as gdriver 
app = Flask(__name__)
app.secret_key = 'aslkdfjlsfj'
CORS(app)

def get_response(obj):
    return Response(json.dumps(obj), mimetype='application/json')

@app.route("/")
def hello():
    return "Hello World!"

""" Permissions """

@app.route('/get_permissions')
def get_permissions():
    doc_id = request.args.get('id')
    doc_id = '0BwLZUlGsG71ONks1NUhWaV9abUE'
    permissions = gdriver.get_permissions(doc_id)
    return get_response({'results':permissions})

@app.route('/add_permissions')
def add_permissions():
    emails = request.args.get('emails')
    doc_id = request.args.get('doc_id')
    doc_id = '0BwLZUlGsG71ONks1NUhWaV9abUE'
    return 'add_permissions'

@app.route('/remove_permissions')
def remove_permissions():
    emails = request.args.get('emails')
    doc_id = request.args.get('doc_id')
    doc_id = '0BwLZUlGsG71ONks1NUhWaV9abUE'
    return 'remove_permisisons'

""" Channel Creation """

@app.route("/create_channel")
def create_channel():
    name = request.args.get('name')
    description = request.args.get('description')
    collaborators = request.args.get('collaborators');
    emails = [x.strip() for x in  collaborators.split(',')]
    doc_id  = gdriver.create_doc('dodo_'+ name)
    gdriver.add_permissions(doc_id, emails)
    return get_response({'id': doc_id});

@app.route("/edit_channel")
def edit_channel():
    return get_response({'hi':'there'})



if __name__ == "__main__":
    port = 5000
    app.run(host='0.0.0.0', port=port, debug=True)
