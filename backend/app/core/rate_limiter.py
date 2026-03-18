# app/core/rate_limiter.py

from slowapi import Limiter
from slowapi.util import get_remote_address


# Create limiter instance
# This identifies users based on IP address
limiter = Limiter(key_func=get_remote_address)