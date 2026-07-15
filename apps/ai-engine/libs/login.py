import os
import jwt
from functools import wraps
from flask import request, jsonify

JWT_SECRET = os.environ.get('JWT_SECRET', 'otto_super_secret_dev_key')

def login_required(view):
    @wraps(view)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'code': 'unauthorized', 'message': 'Unauthorized'}), 401
        
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            # Dify expects current_user or something. We'll set user_id
            request.user_id = payload.get('userId')
        except Exception:
            return jsonify({'code': 'unauthorized', 'message': 'Unauthorized'}), 401
            
        return view(*args, **kwargs)
    return decorated

# Mock system_required for compatibility
def system_required(view):
    @wraps(view)
    def decorated(*args, **kwargs):
        return view(*args, **kwargs)
    return decorated
