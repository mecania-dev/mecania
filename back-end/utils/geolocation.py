from functools import partial
from geopy.geocoders import Nominatim
from geopy.distance import geodesic

geolocator = Nominatim(user_agent="mecania")
geocode = partial(geolocator.geocode, language="pt-BR")


def get_coords_from_address(address):
    location = geocode(address)
    if location:
        return location.latitude, location.longitude
    return None


def calculate_distance(coords1, coords2):
    if coords1 and coords2:
        return geodesic(coords1, coords2).kilometers
    return None
