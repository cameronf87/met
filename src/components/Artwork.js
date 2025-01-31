import React, { useState, useEffect } from "react";

function Artwork({ artworkId, onArtworkSelect }) {
    // State to store artwork data
    const [artwork, setArtwork] = useState(null);

    // Fetch artwork data when the component first mounts or when the artworkId changes
    useEffect(() => {
        // Fetching the artwork details using the provided artworkId
        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${artworkId}`)
            .then((response) => response.json()) // Parse the JSON response
            .then((data) => {
                console.log("Artwork data:", data); // Log the fetched data (for debugging purposes)
                setArtwork(data); // Update the state with the fetched artwork data
            })
            .catch((error) => {
                // Log any errors that occur during the fetch process
                console.error("Error fetching artwork details:", error);
            });
    }, [artworkId]); // Only run this effect when the artworkId prop changes

    // If no artwork data is available yet, don't render anything
    if (!artwork) {
        return null; // Avoid rendering an incomplete artwork component
    }

    // Destructure important properties from the fetched artwork data
    const { title, artistDisplayName, primaryImageSmall, primaryImage } = artwork;

    // Decide which image to display — prefer the smaller image if available, otherwise fallback to a larger one
    const imageUrl = primaryImageSmall || primaryImage || 'https://archive.org/details/placeholder-image'; // Use a placeholder image if neither is available

    return (
        <div
            className="artwork-container"
            onClick={() => onArtworkSelect(artwork.objectID)} // Handle the click event to select this artwork
            style={{ cursor: "pointer" }} // Change cursor to a pointer to indicate interactivity
        >
            <div className="artwork-thumbnail">
                <img
                    src={imageUrl} // Set the image source based on the selected artwork's image
                    alt={title} // Use the artwork's title as the alt text for accessibility
                    className="artwork-thumbnail-img"
                />
            </div>
            <div className="artwork-details">
                <h3>{title}</h3> {/* Display the title of the artwork */}
                <p>{artistDisplayName}</p> {/* Display the artist's name */}
            </div>
        </div>
    );
}

export default Artwork;