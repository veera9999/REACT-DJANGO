from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get
import logging


BASE_URL = "https://api.spotify.com/v1/me/"

def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None


def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type' ])

    else:
        tokens = SpotifyToken(user = session_id, access_token = access_token, refresh_token = refresh_token, token_type = token_type, expires_in = expires_in)
        tokens.save()


def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(session_id)

        return True


    return False


def refresh_spotify_token(session_id):
    tokens = get_user_tokens(session_id)
    if not tokens:
        logging.error(f"No Spotify tokens found for session_id: {session_id}")
        return None  # Consider re-authentication flow

    refresh_token = tokens.refresh_token
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    if 'access_token' in response:
        access_token = response['access_token']
        token_type = response.get('token_type', 'Bearer')
        expires_in = response.get('expires_in', 3600)
        update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token)
    else:
        logging.error(f"Failed to refresh Spotify token for session_id: {session_id} - {response.get('error')}")




def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_id)
    if not tokens:
        logging.error(f"No Spotify tokens found for session_id: {session_id}")
        raise Exception("Authentication required")

    headers = {'Content-Type': 'application/json', 'Authorization': f"Bearer {tokens.access_token}"}

    if post_:
        response = post(BASE_URL + endpoint, headers=headers)
    elif put_:
        response = put(BASE_URL + endpoint, headers=headers)
    else:
        response = get(BASE_URL + endpoint, headers=headers)

    if response.status_code not in [200, 201]:
        logging.error(f"Spotify API request failed: {response.json()}")
        return {'Error': 'Spotify API request failed'}

    try:
        return response.json()
    except ValueError as e:
        logging.error(f"Failed to decode JSON from Spotify API response: {str(e)}")
        return {'error': 'Failed to decode JSON', 'status_code': response.status_code}


def play_song(session_id):
    return execute_spotify_api_request(session_id, "player/play", put_=True)


def pause_song(session_id):
    return execute_spotify_api_request(session_id, "player/pause", put_=True)

def skip_song(session_id):
    return execute_spotify_api_request(session_id, "player/next",post_=True)