// XMLHttpRequest -> This is a built-in class (provided by JavaScript)
// Types of requests or msgs from the backend: GET, POST, PUT, DELETE
// - GET ('GET', URL); URL = Uniform Resource Locator
// - POST 
// - PUT 
// - DELETE 
// Status Code starts with 4 or 5 (400, 404, 500) = failed means it's our problem and the backend crash. 
// Status Code starts with 2 (200, 201, 204) = succeeded
// List of all the backend which are supported is the backend API -> application programming interface. 
// The backend can response with different types of data -> text, JSON, HTML, Images
// JSON.parse() converts the JSON into JavaScript's objects- This allows us to send JavaScript objects across the internet, to the backend.



const xhr = new XMLHttpRequest();

// Parameter 'load' 
xhr.addEventListener('load', () => {
    console.log(xhr.response); // The response is a string.
});

// Supported URL paths = Backend API - Application Programming Interface
xhr.open('GET', 'https://supersimplebackend.dev/products/first'); // URL path - "/products/first"
// xhr.send() -> asynchronous code
xhr.send();

// We can send other requests to the backend using URL Paths,
// Line 20 the URL Path is "products/first". 

