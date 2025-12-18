# WebGIS Course Assignment 2

**Project Weight**: This assignment represents **0.25%** of the total TA (Teaching Assistant) evaluation.

**Submission**: Submit the link to your forked repository in the VC (Virtual Classroom).

---

## Table of Contents

1. [Overview](#overview)
2. [Understanding OpenLayers Library](#understanding-openlayers-library)
   - [What is OpenLayers?](#what-is-openlayers)
   - [Key Capabilities and Features](#key-capabilities-and-features)
   - [What Can You Do with OpenLayers?](#what-can-you-do-with-openlayers)
3. [Understanding Asynchronous JavaScript and the Fetch API](#understanding-asynchronous-javascript-and-the-fetch-api)
4. [Getting Started](#getting-started)
5. [Assignment Structure](#assignment-structure)
6. [Part 1: Interactive Map with Geocoding Search](#part-1-interactive-map-with-geocoding-search)
   - [Requirements](#requirements)
   - [Geocoding API](#geocoding-api)
7. [Part 2: Weather Data Display](#part-2-weather-data-display)
   - [Requirements](#requirements-1)
   - [Weather API](#weather-api)
8. [Technical Requirements](#technical-requirements)
   - [Project Structure](#project-structure)
   - [Technologies to Use](#technologies-to-use)
   - [Code Quality](#code-quality)
9. [Submission Guidelines](#submission-guidelines)
   - [Important Notes](#important-notes)
10. [Learning Objectives](#learning-objectives)
11. [Resources](#resources)
12. [Questions?](#questions)

---

## Overview

This assignment focuses on implementing interactive web mapping using OpenLayers library and integrating external APIs for geocoding and weather data. You will learn to use the `fetch` API for making HTTP requests and handling responses.

---

## Understanding OpenLayers Library

### What is OpenLayers?

OpenLayers is a high-performance, open-source JavaScript library designed for displaying dynamic, interactive maps in web browsers. It is maintained by the Open Source Geospatial Foundation and provides a comprehensive toolkit for building web-based Geographic Information Systems (GIS) applications.

### Key Capabilities and Features

#### 1. **Layer Support**

OpenLayers supports multiple types of map layers:

- **Raster Layers**:

  - **Tile Layers**: Display tiled map services (XYZ, TMS, WMTS)
  - **Image Layers**: Support for WMS (Web Map Service) and static images
  - **OSM Integration**: Direct integration with OpenStreetMap tiles
  - **Commercial Services**: Support for Bing Maps, Google Maps (via third-party), and other tile providers

- **Vector Layers**:

  - **GeoJSON**: Native support for GeoJSON format
  - **KML/KMZ**: Import and display Google Earth formats
  - **GML**: Geographic Markup Language support
  - **GPX**: GPS Exchange Format for track data
  - **TopoJSON**: Efficient topology-based vector format
  - **Vector Tiles**: Support for Mapbox Vector Tiles and other vector tile formats

- **Special Layers**:
  - **Heatmaps**: Visualize data density using heatmap layers
  - **Image Static**: Display single static images with geographic bounds
  - **Tile WMS**: Tiled Web Map Service layers

#### 2. **Controls and Interactions**

- **Built-in Controls**:

  - Zoom controls (buttons, slider, mouse wheel)
  - Scale line and scale bar
  - Full-screen control
  - Attribution control
  - Overview map (mini map)
  - Rotate control
  - Mouse position display

- **User Interactions**:
  - **Pan**: Drag to move the map
  - **Zoom**: Mouse wheel, pinch, or controls
  - **Rotate**: Rotate the map view
  - **Select**: Click to select features
  - **Modify**: Edit vector features
  - **Draw**: Create new vector features (points, lines, polygons)
  - **Snap**: Snap to existing features while drawing

#### 3. **Styling and Customization**

- **Feature Styling**:

  - Custom styles for points, lines, and polygons
  - Icon customization with images or symbols
  - Color, width, and opacity controls
  - Style functions for dynamic styling based on feature properties
  - Text labels with customizable fonts and positioning

- **Control Customization**:
  - CSS-based styling for all controls
  - Custom control creation
  - Control positioning and visibility management

#### 4. **Projections and Coordinate Systems**

- Support for multiple map projections (Web Mercator, Geographic, custom projections)
- Automatic coordinate transformations
- Support for various coordinate reference systems (CRS)
- EPSG code support for standard projections

#### 5. **Performance Features**

- **Rendering Technologies**:

  - Canvas 2D rendering (default, fast)
  - WebGL rendering for high-performance vector rendering
  - Optimized tile loading and caching
  - Efficient vector rendering for large datasets

- **Optimization**:
  - Clustering for point features
  - Feature simplification at different zoom levels
  - Tile caching and preloading
  - Mobile device optimization

#### 6. **Advanced Features**

- **Animations**: Smooth view transitions and zoom animations
- **Popups and Overlays**: Display information boxes and custom overlays
- **Geolocation**: Access to device GPS/location services
- **Import/Export**: Support for various data formats
- **Event Handling**: Comprehensive event system for user interactions
- **Plugins**: Extensible architecture for custom functionality

### What Can You Do with OpenLayers?

With OpenLayers, you can:

- Create interactive web maps with multiple data sources
- Display geographic data from various formats (GeoJSON, KML, WMS, etc.)
- Build custom mapping applications with full control over appearance and behavior
- Integrate with various mapping services and APIs
- Create data visualization tools (heatmaps, thematic maps)
- Build GIS applications for data collection, editing, and analysis
- Develop location-based web applications
- Create mobile-responsive mapping solutions

---

## Understanding Asynchronous JavaScript and the Fetch API

### What is Asynchronous Programming?

**Asynchronous programming** allows your code to perform tasks without blocking the execution of other code. In web development, this is crucial when making network requests (like API calls) because:

- Network requests can take time to complete
- You don't want to freeze the entire webpage while waiting for a response
- Users can continue interacting with your application while data loads in the background

### JavaScript Promises

A **Promise** is an object that represents the eventual completion (or failure) of an asynchronous operation. A Promise can be in one of three states:

- **Pending**: The operation is still in progress
- **Fulfilled**: The operation completed successfully
- **Rejected**: The operation failed

### The Fetch API

The **Fetch API** is a modern JavaScript interface for making HTTP requests. It provides a simple, promise-based way to fetch resources from the network.

#### Basic Fetch Syntax

```javascript
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    // Handle the data
  })
  .catch((error) => {
    // Handle errors
  });
```

#### How Fetch Works

1. **`fetch(url)`** - Initiates a network request to the specified URL
2. **`.then(response => response.json())`** - Processes the response and converts it to JSON
3. **`.then(data => {...})`** - Handles the parsed data
4. **`.catch(error => {...})`** - Handles any errors that occur

### Using Async/Await

**Async/await** is a modern syntax that makes asynchronous code easier to read and write. It's built on top of Promises.

#### Async/Await Syntax

```javascript
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    // Handle the data
  } catch (error) {
    // Handle errors
  }
}
```

#### Key Concepts

- **`async`** - Declares a function as asynchronous
- **`await`** - Pauses execution until the Promise resolves
- **`try/catch`** - Handles both success and error cases

### Fetch API in This Assignment

In this assignment, you will use the Fetch API to:

1. **Geocoding Requests** (Part 1):

   ```javascript
   // Example: Fetching coordinates from a geocoding API
   const response = await fetch(
     `https://api.example.com/geocode?address=${searchTerm}`
   );
   const data = await response.json();
   const coordinates = [data.longitude, data.latitude];
   ```

2. **Weather Data Requests** (Part 2):
   ```javascript
   // Example: Fetching weather data for coordinates
   const response = await fetch(
     `https://api.example.com/weather?lat=${lat}&lon=${lon}`
   );
   const data = await response.json();
   // Display weather information
   ```

### Error Handling

Always handle potential errors when using fetch:

```javascript
async function fetchWithErrorHandling(url) {
  try {
    const response = await fetch(url);

    // Check if the response is OK (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    // Show user-friendly error message
    alert("Failed to fetch data. Please try again.");
  }
}
```

---

## Getting Started

1. **Fork this repository** to your own GitHub account
2. Clone your forked repository to your local machine
3. **Rename the current README.md file** - This file contains the assignment instructions. Rename it to something like `ASSIGNMENT_README.md` or `INSTRUCTIONS.md` so you can create your own project README.md file
4. Work on your fork and commit your changes regularly
5. Submit the link to your forked repository upon completion

## Assignment Structure

This assignment is divided into **two parts**:

---

## Part 1: Interactive Map with Geocoding Search

### Requirements

1. **Create a map using OpenLayers library**

   - Initialize an OpenLayers map with a base layer (e.g., OSM, Bing Maps, or any tile layer)
   - Set an appropriate initial view (center and zoom level)

2. **Add a search bar**

   - Place a search input field at the top of the map
   - Include a search button next to the input field

3. **Implement geocoding functionality**

   - When the user clicks the search button:
     - Use the `fetch` API to request geocoding services (OpenMapQuest or other geocoding APIs)
     - Parse the response to extract coordinates (latitude and longitude)
     - Animate the map to zoom to the found location using OpenLayers animation features
   - Handle errors appropriately (e.g., location not found, API errors)

4. **Documentation**
   - Add a section in your README explaining all the OpenLayers features you used for creating the map
   - Include descriptions of layers, views, controls, and animations

### Geocoding API

**Example: OpenMapQuest Geocoding API**

As an example, you can use **OpenMapQuest Geocoding API** for this assignment. You can find more information at: https://developer.mapquest.com/documentation/geocoding-api/

#### What is an API Key?

An **API Key** (Application Programming Interface Key) is a unique identifier used to authenticate and authorize requests to an API service. It acts like a password that:

- Identifies your application to the API provider
- Tracks your API usage for billing and rate limiting
- Provides security by restricting access to authorized users only
- Allows the provider to monitor and manage API access

#### How to Get an API Key

1. **Visit the API provider's website** (e.g., https://developer.mapquest.com/)
2. **Create an account** - Sign up for a free developer account
3. **Navigate to the API section** - Look for "Get API Key", "Create App", or "My Apps" section
4. **Generate your API key** - Follow the instructions to create a new API key
5. **Copy and store your API key securely** - Never commit API keys directly to public repositories. Use environment variables or configuration files that are excluded from version control (add them to `.gitignore`)

#### ⚠️ Important: API Key Security

**DO NOT put your API keys directly in your code files (index.html, script.js, etc.).**

- **Why?** API keys in code can be exposed if your repository is public, leading to unauthorized usage and potential charges
- **What to do instead:**
  - Use placeholder text in your code (e.g., `const API_KEY = 'YOUR_API_KEY_HERE'`)
  - Store API keys in a separate configuration file that is excluded from version control
  - Add sensitive files to `.gitignore`
  - For this assignment, you can use a simple approach: hardcode with a placeholder and replace it locally when testing

**Submission:** When you submit your assignment link in VC, you must also submit your API keys separately through the VC system. Do not include API keys in your repository or README file.

**Your Task - API Research and Comparison:**

You are required to:

1. **Find at least 3 different geocoding APIs** - Research and discover geocoding APIs available online (you can use web search or AI tools)
2. **Research pricing information** for each API you find:
   - Free tier limits (if available)
   - Paid pricing structure
   - Rate limits
   - How to obtain an API key
   - Any other relevant details
3. **Compare the pricing** of at least 3 different geocoding APIs
4. **Calculate price ratios** between the APIs (e.g., "API A costs X times more than API B for the same number of requests")
5. **Provide your analysis** in your README including:
   - A comparison table with **all pricing information you found** and calculated ratios
   - Your reasoning for choosing a specific API for this assignment
   - Justification based on pricing, free tier limits, and features
6. **Document your choice** - Explain why you selected the API you're using in your project

**Note**: You are free to use AI tools or web search to find and gather information about geocoding APIs. Make sure to verify information from official sources.

---

## Part 2: Weather Data Display

### Requirements

1. **Implement click event on map**

   - Add an event listener to detect clicks on the map
   - Extract the coordinates (latitude and longitude) from the clicked point

2. **Fetch weather data**

   - When a user clicks on a point on the map:
     - Use the `fetch` API to request weather data for the clicked coordinates
     - Find and use a suitable weather API (see section below)

3. **Display weather information**
   - Create a div element to display weather data
   - Show the div on the map (you can position it as an overlay or in a corner)
   - Display relevant weather information (temperature, conditions, humidity, etc.)
   - Handle loading states and errors appropriately

### Weather API

**Example: OpenWeatherMap API**

As an example, you can use **OpenWeatherMap API** for this assignment. You can find more information at: https://openweathermap.org/api

**Your Task - API Research and Comparison:**

You are required to:

1. **Find at least 3 different weather APIs** - Research and discover weather APIs available online (you can use web search or AI tools)
2. **Research pricing information** for each API you find:
   - Free tier limits (if available)
   - Paid pricing structure
   - Rate limits
   - How to obtain an API key
   - Any other relevant details
3. **Compare the pricing** of at least 3 different weather APIs
4. **Calculate price ratios** between the APIs (e.g., "API A costs X times more than API B for the same number of calls")
5. **Provide your analysis** in your README including:
   - A comparison table with **all pricing information you found** and calculated ratios
   - Your reasoning for choosing a specific API for this assignment
   - Justification based on pricing, free tier limits, data quality, and features
6. **Document your choice** - Explain why you selected the API you're using in your project

**Note**: Most weather APIs require API keys. Register for a free account to obtain an API key. You are free to use AI tools or web search to find and gather information about weather APIs. Make sure to verify information from official sources.

---

## Technical Requirements

### Project Structure

Your project must include the following files:

- **README.md** - Your own documentation file explaining your project structure, setup instructions, API configurations, OpenLayers features used, API comparisons, and any other relevant information about your project. **Note:** After forking, rename the original README.md (assignment instructions) to a different name and create your own README.md for your project documentation.
- **index.html** - Main HTML file containing the page structure and map container
- **style.css** - CSS file for styling the page and map interface
- **script.js** - JavaScript file containing all the application logic, OpenLayers map initialization, API calls, and event handlers

### Technologies to Use

- **OpenLayers**: For map rendering and interaction
- **JavaScript Fetch API**: For making HTTP requests
- **HTML/CSS**: For structure and styling
- **No frameworks required**: Use vanilla JavaScript

### Code Quality

- Write clean, well-commented code
- Use proper error handling
- Follow JavaScript best practices
- Ensure responsive design

---

## Submission Guidelines

1. Complete both parts of the assignment
2. Include a comprehensive README with:
   - Setup instructions
   - API keys configuration (if needed)
   - OpenLayers features documentation
   - **API comparison with price ratios** (for both geocoding and weather APIs)
   - **Justification for chosen APIs** with reasoning based on pricing analysis
   - List of geocoding APIs and their websites
   - List of weather APIs and their websites
   - Screenshots or demo GIFs
3. **Use suitable commit messages** - Write clear, descriptive commit messages that explain what changes were made in each commit. Examples:
   - "Add OpenLayers map initialization with OSM base layer"
   - "Implement geocoding search functionality with fetch API"
   - "Add weather data display on map click"
   - "Update README with API comparison and OpenLayers documentation"
4. Ensure your code is properly committed and pushed to your forked repository
5. **Submit the link to your forked repository in the VC (Virtual Classroom) system**
6. **Submit your API keys separately in the VC system** - Do not include API keys in your code or repository. When submitting your assignment link, provide your API keys through the VC submission system so the instructor can test your application

### Important Notes

- **Final Presentation**: All concepts, features, and implementations explained in this assignment will be evaluated during the final presentation. Make sure you understand:
  - How OpenLayers works and its key features
  - How to use the `fetch` API for HTTP requests
  - How geocoding APIs work and how to integrate them
  - How weather APIs work and how to display data
  - Your API selection rationale and price comparisons
  - All code you've written and how it functions
- **Commit History**: Your commit history should show a logical progression of your work. Regular commits with meaningful messages demonstrate good development practices.

---

## Learning Objectives

By completing this assignment, you will:

- Understand how to use the JavaScript `fetch` API for HTTP requests
- Learn to integrate OpenLayers library for web mapping
- Gain experience with geocoding APIs and coordinate transformation
- Practice working with external APIs and handling responses
- Implement interactive features in web maps
- Learn to handle asynchronous operations and errors

---

## Resources

- **OpenLayers Documentation**: https://openlayers.org/
- **MDN Fetch API**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **OpenLayers Examples**: https://openlayers.org/en/latest/examples/

---

## Questions?

If you have any questions about the assignment, please contact your instructor or refer to the course materials.

**Good luck!**
