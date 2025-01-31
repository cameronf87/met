# Met Museum Artworks Collection

This is a React-based web application that allows users to explore artworks from The Metropolitan Museum of Art's collection. Users can search for artworks by title or ID, filter by department, and view detailed information about each piece, including the artist, date, description, and images.

## Features

- **Artwork Search:** Search by title or ID to find specific artworks.
- **Department Filter:** Filter artworks by department (e.g., European Paintings, Ancient Art, etc.).
- **Artwork Details:** View detailed information about an artwork, including its description, artist, medium, and image.
- **Pagination:** Browse through a list of artworks with pagination controls.
- **Responsive Design:** The app is fully responsive and works on both desktop and mobile devices.

## Installation

To get started with the project, clone this repository and install the necessary dependencies.

### 1. Clone the repository

```bash
git clone https://github.com/cameronf87/met.git
cd met
````
### 2. Install dependencies
Make sure you have Node.js installed. Then, install the dependencies using npm or yarn:
```
bash
Copy
npm install

or

bash
Copy
yarn install
````
### 3. Start the development server
Once the dependencies are installed, you can start the application with:
```
bash
Copy
npm start

or

bash
Copy
yarn start
````
The app will be available at http://localhost:3000 in your browser.

## Project Structure
src/App.js: The main entry point of the application.
src/Artwork.js: Displays individual artwork with clickable image and title.
src/ArtworkDetail.js: Shows detailed information about a specific artwork.
src/ArtworkList.js: Renders a list of artworks with thumbnails and titles.
src/App.css: Styling for the application.

## API
This app uses The Metropolitan Museum of Art's public API to fetch artwork data. For more details about the API, visit: Met Museum Collection API

## Endpoints used:
Artwork Search: https://collectionapi.metmuseum.org/public/collection/v1/search
Artwork Details: https://collectionapi.metmuseum.org/public/collection/v1/objects/{id}
Departments: https://collectionapi.metmuseum.org/public/collection/v1/departments

## Technologies Used
React - Frontend framework for building the user interface.
CSS - For styling the components.
Metropolitan Museum Collection API - For fetching artwork data.

## Contributing
Contributions are welcome! If you have suggestions for improvements or bug fixes, feel free to open an issue or submit a pull request.

- Fork the repository.
- Create your branch (git checkout -b feature/your-feature).
- Commit your changes (git commit -am 'Add new feature').
- Push to the branch (git push origin feature/your-feature).
- Create a new Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
Metropolitan Museum of Art: For providing access to their collection through their API.
React: The powerful JavaScript library that made building this app possible.
CSS: For styling and making the app look good!