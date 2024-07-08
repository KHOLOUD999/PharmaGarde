from flask import Flask, render_template, jsonify
import requests
from bs4 import BeautifulSoup
import json
import re

app = Flask(__name__)

def scrape_drugstore_names():
    base_urls = [
        'https://www.guidepharmacies.ma/pharmacies-de-garde/rabat.html',
        'https://www.guidepharmacies.ma/pharmacies-de-garde/sale.html',
        'https://www.guidepharmacies.ma/pharmacies-de-garde/temara.html',
        'https://www.guidepharmacies.ma/pharmacies-de-garde/casablanca.html'
    ]
    drugstore_names = []

    for url in base_urls:
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            for eventdesc in soup.find_all('div', class_='eventdesc'):
                name_element = eventdesc.find('h4')
                if name_element:
                    name = name_element.text.strip()
                    first_part = name.split(' - ')[0]
                    formatted_name = first_part.replace('-', ' ')
                    drugstore_names.append(formatted_name)
        else:
            print(f"Failed to retrieve data from {url}")

    return drugstore_names

def get_coordinates(drugstore_names):
    api_key = 'your actual api key'  # Replace with your actual API key
    geocode_url = 'https://maps.googleapis.com/maps/api/geocode/json'
    places_url = 'https://maps.googleapis.com/maps/api/place/details/json'
    default_photo_url = 'https://via.placeholder.com/150'  # Placeholder URL if no photo available
    coordinates = []

    for name in drugstore_names:
        params = {
            'address': name,
            'key': api_key
        }
        response = requests.get(geocode_url, params=params)
        if response.status_code == 200:
            data = response.json()
            if data['status'] == 'OK':
                location = data['results'][0]['geometry']['location']
                place_id = data['results'][0]['place_id']

                # Fetch place details to get the phone number and photo reference
                place_params = {
                    'place_id': place_id,
                    'fields': 'formatted_phone_number,photos',
                    'key': api_key
                }
                place_response = requests.get(places_url, params=place_params)
                if place_response.status_code == 200:
                    place_data = place_response.json()
                    phone_number = place_data['result'].get('formatted_phone_number', 'Phone number not available')

                    # Handle photo fetching
                    photo_reference = None
                    if 'photos' in place_data['result'] and len(place_data['result']['photos']) > 0:
                        photo_reference = place_data['result']['photos'][0]['photo_reference']

                    # Construct photo URL
                    if photo_reference:
                        photo_url = f'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={api_key}'
                    else:
                        photo_url = default_photo_url  # Use default photo if no photo_reference

                    coordinates.append({
                        'name': name,
                        'location': location,
                        'phone_number': phone_number,
                        'photo_url': photo_url
                    })
                else:
                    print(f"Failed to fetch place details for {name}")
            else:
                print(f"No results found for {name}")
        else:
            print(f"Geocoding request failed for {name}")

    return coordinates


@app.route('/')
def index():
    drugstore_names = scrape_drugstore_names()
    if drugstore_names:
        coordinates = get_coordinates(drugstore_names)
        return render_template('test2.html', coordinates=coordinates)
    else:
        return "Failed to retrieve drugstore names."

@app.route('/get_drugstore_coordinates')
def get_drugstore_coordinates():
    drugstore_names = scrape_drugstore_names()
    if drugstore_names:
        coordinates = get_coordinates(drugstore_names)
        return jsonify(coordinates)
    else:
        return jsonify([])

if __name__ == '__main__':
    app.run(debug=True)
