let map, directionsService, directionsRenderer;
let currentLocation = { lat: 28.6139, lng: 77.2090 }; // Default to New Delhi, India

function initMap() {
    // Initialize the map with a default center
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: currentLocation,
    });

    // Create DirectionsService and DirectionsRenderer objects
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        panel: document.getElementById("directions-panel"),
    });

    // Get the user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Update the map center to user's current location
                map.setCenter(currentLocation);

                // Set the evacuation route to a nearby safe zone
                const safeZone = { lat: 28.6448, lng: 77.2169 }; // Example: Connaught Place, New Delhi
                calculateRoute(currentLocation, safeZone);
            },
            () => {
                alert("Failed to fetch location. Using default location (New Delhi).");
                const defaultSafeZone = { lat: 28.6448, lng: 77.2169 };
                calculateRoute(currentLocation, defaultSafeZone);
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Function to calculate and display the route
function calculateRoute(startLocation, endLocation) {
    const request = {
        origin: startLocation,
        destination: endLocation,
        travelMode: google.maps.TravelMode.DRIVING, // Options: WALKING, BICYCLING, TRANSIT
        provideRouteAlternatives: true,
    };

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
        } else {
            alert("Directions request failed: " + status);
        }
    });
}