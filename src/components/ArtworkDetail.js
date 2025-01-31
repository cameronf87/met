import React, { useState, useEffect } from "react";

function ArtworkDetail({ artworkId, onBack }) {
  // State to store the detailed artwork data
  const [artwork, setArtwork] = useState(null);

  // Fetch artwork details when the component mounts or when the artworkId changes
  useEffect(() => {
    // Fetch the detailed data for the selected artwork using its ID
    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${artworkId}`)
      .then((response) => response.json()) // Parse the JSON response from the API
      .then((data) => setArtwork(data)) // If the data is fetched successfully, store it in state
      .catch((err) => setArtwork(null)); // If an error occurs, set artwork to null (no data available)
  }, [artworkId]); // This effect will run every time the artworkId changes

  // If no artwork data is available yet, show a loading message
  if (!artwork) {
    return <div>Loading artwork details...</div>; // Inform the user that the details are still loading
  }

  // Destructure the relevant properties from the fetched artwork data
  const { title, artistDisplayName, objectDate, primaryImage, medium, description } = artwork;

  // Decide which image to display — use the artwork's image if available, or fallback to a placeholder
  const imageUrl = primaryImage || 'https://archive.org/details/placeholder-image'; // Use a placeholder if no image is found

  return (
    <div className="artwork-detail">
      {/* Button to go back to the artwork list */}
      <button onClick={onBack}>Back to List</button>

      {/* Display the artwork's title */}
      <h2>{title}</h2>
      
      {/* Display the artist's name */}
      <p>{artistDisplayName}</p>
      
      {/* Display the date the artwork was created */}
      <p>{objectDate}</p>
      
      {/* Show the image of the artwork if available */}
      {imageUrl ? (
        <img src={imageUrl} alt={title} /> // Display the artwork's image
      ) : (
        <p>No image available</p> // If there's no image, display a message instead
      )}

      {/* Display the medium (material) used for the artwork */}
      <p>{medium}</p>
      
      {/* Display the artwork's description */}
      <p>{description}</p>
    </div>
  );
}

export default ArtworkDetail;