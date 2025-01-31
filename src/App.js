import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, useLocation, useNavigate } from "react-router-dom";
import "./App.css";

function App() {
    const [artworkIds, setArtworkIds] = useState([]); // Holds all artwork IDs for the current search/pagination
    const [artworks, setArtworks] = useState([]); // Holds detailed artwork information
    const [loading, setLoading] = useState(false); // Tracks loading state
    const [error, setError] = useState(null); // Tracks errors if they occur
    const [searchTerm, setSearchTerm] = useState(""); // Holds search input value
    const [selectedArtwork, setSelectedArtwork] = useState(null); // Stores the artwork selected for the modal
    const [departmentFilter, setDepartmentFilter] = useState(""); // Holds the selected department filter
    const [departments, setDepartments] = useState([]); // Stores available departments
    const artworksPerPage = 12; // Number of artworks to show per page

    const location = useLocation();
    const navigate = useNavigate();

    // Page management: get the current page from the URL or default to page 1
    const queryParams = new URLSearchParams(location.search);
    const pageFromURL = parseInt(queryParams.get("page")) || 1;
    const [page, setPage] = useState(pageFromURL);

    // Fetch departments dynamically on initial load
    useEffect(() => {
        fetch("https://collectionapi.metmuseum.org/public/collection/v1/departments")
            .then((response) => response.json())
            .then((data) => setDepartments(data.departments || []))
            .catch(() => setError("Error fetching departments."));
    }, []);

    // Fetch artwork IDs based on search term or department filter
    const fetchArtworkIds = useCallback(() => {
        setLoading(true); // Show loading spinner
        setError(null); // Reset any previous errors

        const isIdSearch = !isNaN(searchTerm) && searchTerm.trim() !== ""; // Check if search term is a valid ID

        let searchUrl = "";

        if (isIdSearch) {
            // If the search term is an ID, fetch the specific artwork by its ID
            searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${searchTerm}`;
        } else {
            // Otherwise, it's a title or keyword search
            searchUrl = searchTerm
                ? `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchTerm}&size=1000` // Search by title/keyword
                : `https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${departmentFilter || "1"}&page=1&size=1000`; // Search by department filter
        }

        // Fetch artwork IDs
        fetch(searchUrl)
            .then((response) => response.json())
            .then((data) => {
                if (isIdSearch) {
                    // If searching by ID, only expect one object
                    if (data.objectID) {
                        setArtworkIds([data.objectID]); // Set the specific object ID
                    } else {
                        setError("No artwork found with that ID.");
                    }
                } else {
                    // For text-based searches, return a list of object IDs
                    setArtworkIds(data.objectIDs || []);
                    if (data.objectIDs.length === 0) {
                        setError("No artworks found.");
                    }
                }
            })
            .catch(() => setError("Error fetching artwork data"))
            .finally(() => setLoading(false)); // Stop loading state
    }, [searchTerm, departmentFilter]);

    // Fetch artwork details when artworkIds change or pagination changes
    useEffect(() => {
        if (artworkIds.length === 0) return; // If there are no artwork IDs, don't fetch details

        setLoading(true); // Show loading state
        const currentIds = artworkIds.slice((page - 1) * artworksPerPage, page * artworksPerPage); // Paginate artwork IDs

        // Fetch details for each artwork
        const fetchDetails = currentIds.map((id) =>
            fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
                .then((res) => res.json())
                .then((detailData) => ({
                    id: detailData.objectID,
                    title: detailData.title,
                    description: detailData.objectDescription || "No description available.",
                    imageSmall: detailData.primaryImageSmall || "https://www.svgrepo.com/show/508699/landscape-placeholder.svg", // New placeholder image
                    imageLarge: detailData.primaryImage || "https://www.svgrepo.com/show/508699/landscape-placeholder.svg", // New placeholder image
                }))
                .catch(() => null) // If fetching details fails, return null
        );

        Promise.all(fetchDetails) // Wait for all fetch requests to complete
            .then((details) => setArtworks(details.filter(Boolean))) // Filter out null results
            .catch(() => setError("Error fetching artwork details"))
            .finally(() => setLoading(false)); // Stop loading state

        // Update the URL with the current page
        navigate(`?page=${page}`, { replace: true });
    }, [page, artworkIds, navigate]);

    // Fetch initial artworks when the page loads if there is no search term
    useEffect(() => {
        if (searchTerm === "" && departmentFilter === "") {
            fetchArtworkIds(); // Trigger initial fetch if no search term is provided
        }
    }, [searchTerm, departmentFilter, fetchArtworkIds]);

    // Handle the search input change
    const handleSearchChange = (event) => setSearchTerm(event.target.value);

    // Handle the department filter change and reset pagination to page 1
    const handleDepartmentFilterChange = (event) => {
        const newDepartment = event.target.value;
        setDepartmentFilter(newDepartment);
        setPage(1); // Reset pagination to page 1
    };

    // Handle search button click (or Enter key press)
    const handleSearchClick = () => {
        fetchArtworkIds(); // Trigger fetchArtworkIds directly when search button is clicked
    };

    // Handle "Enter" key press to trigger search
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            fetchArtworkIds(); // Trigger search on Enter key press
        }
    };

    // Handle closing the modal (when clicked outside the modal content)
    const handleModalClose = (event) => {
        if (event.target.classList.contains("modal-backdrop")) {
            setSelectedArtwork(null); // Close the modal by clearing the selected artwork
        }
    };

    // Show loading state or any errors if they occur
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="App">
            <header className="App-header">
                <h1>Explore the Met's Artwork Collection</h1>

                <input
                    type="text"
                    placeholder="Search by title or ID"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyPress} // Add event listener for the "Enter" key press
                />

                <select value={departmentFilter} onChange={handleDepartmentFilterChange}>
                    <option value="">All Departments</option>
                    {departments.map((department) => (
                        <option key={department.departmentId} value={department.departmentId}>
                            {department.displayName}
                        </option>
                    ))}
                </select>

                <button onClick={handleSearchClick}>Search</button>
            </header>

            {/* Modal for selected artwork */}
            {selectedArtwork && (
                <div className="modal modal-backdrop" onClick={handleModalClose}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={() => setSelectedArtwork(null)}>&times;</span>
                        <h2>{selectedArtwork.title}</h2>
                        <img src={selectedArtwork.imageLarge} alt={selectedArtwork.title} />
                        <p>{selectedArtwork.description}</p>
                        <p>ID: {selectedArtwork.id}</p>
                    </div>
                </div>
            )}

            <div className="artwork-list">
                {artworks.map((artwork) => (
                    <div key={artwork.id} className="artwork-item">
                        <h3 onClick={() => setSelectedArtwork(artwork)}>{artwork.title}</h3>
                        <img
                            src={artwork.imageSmall}
                            alt={artwork.title}
                            onClick={() => setSelectedArtwork(artwork)}
                        />
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                <button onClick={() => setPage(page + 1)} disabled={page * artworksPerPage >= artworkIds.length}>Next</button>
            </div>
        </div>
    );
}

function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default AppWrapper;