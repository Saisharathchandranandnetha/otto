from functools import wraps
from flask import request, jsonify
import jwt
import os

JWT_SECRET = os.environ.get('JWT_SECRET', 'otto_super_secret_dev_key')

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Unauthorized', 'code': 'unauthorized'}), 401

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            # Assuming payload contains userId, attach it to Flask g or request
            # For simplicity, Dify relies on current_user
            request.user_id = payload.get('userId')
        except Exception as e:
            return jsonify({'error': 'Unauthorized', 'code': 'unauthorized'}), 401
            
        return f(*args, **kwargs)
    return decorated_function
