
import hashlib
import os
import secrets

def hash_password(password: str) -> str:
    """Hashes a password with a random salt using PBKDF2."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    )
    return f"{salt}${key.hex()}"

def verify_password(stored_password: str, provided_password: str) -> bool:
    """Verifies a stored password against the provided password."""
    try:
        salt, key = stored_password.split('$')
        new_key = hashlib.pbkdf2_hmac(
            'sha256',
            provided_password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        return new_key.hex() == key
    except Exception:
        return False
