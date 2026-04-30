
        window.onload = function() {
            let myAPIKey = mapToken;
            const coordinates = listing.geometry.coordinates;
            console.log("Listing geometry:", listing.geometry);
            console.log("Coordinates:", coordinates);
            if (!listing.geometry || !coordinates) {
                console.error("No coordinates found for this listing.");
                return;
            }
            const map = new maplibregl.Map({
                container: 'my-map',
                style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${myAPIKey}`,
                center: coordinates,
                zoom: 10
            });
            new maplibregl.Marker()
            .setLngLat(coordinates)
            .setPopup(
                new maplibregl.Popup({ offset: 25 }).setHTML(`
                    <h6>${listing.title}</h6>
                    <a href="/listings/${listing._id}">View</a>
        `)
        )
            .addTo(map);
        };