import React, { useState, useEffect } from "react";

function ArtworkList({ artworks, onArtworkSelect }) {
    // State to track which images have been loaded successfully
    const [loadedImages, setLoadedImages] = useState(new Set());

    // Handle image loading errors by replacing the broken image with a placeholder
    const handleImageError = (e, fallbackImage) => {
        // If the image source is not already the placeholder, replace it with the fallback image
        if (e.target.src !== fallbackImage) {
            e.target.src = fallbackImage;
        }
    };

    // Once an image has loaded successfully, mark it as loaded
    const handleImageLoad = (id) => {
        // Add the artwork ID to the loaded images set
        setLoadedImages((prev) => new Set(prev).add(id));
    };

    return (
        <div className="artwork-list">
            {/* Loop through all artworks and render each one */}
            {artworks.map((artwork) => (
                <div key={artwork.id} className="artwork-item">
                    <div
                        className="artwork-title"
                        onClick={() => onArtworkSelect(artwork)} // When title is clicked, select the artwork
                    >
                        <h3>{artwork.title}</h3> {/* Display the title of the artwork */}
                    </div>
                    <div
                        className="artwork-image"
                        onClick={() => onArtworkSelect(artwork)} // When image is clicked, select the artwork
                    >
                        <img
                            src={artwork.imageSmall} // Use the small version of the artwork image
                            alt={artwork.title} // Set alt text to the title of the artwork
                            onError={(e) =>
                                handleImageError(
                                    e,
                                    "https://www.metmuseum.org/sites/all/themes/custom/metmuseum/images/placeholder-image.jpg" // Use a placeholder image if an error occurs
                                )
                            }
                            onLoad={() => handleImageLoad(artwork.id)} // Mark the image as loaded once it successfully loads
                        />
                        {/* If the image has not been loaded yet, display a loading message */}
                        {!loadedImages.has(artwork.id) && (
                            <div>Loading Image...</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ArtworkList;