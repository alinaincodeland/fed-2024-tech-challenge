const query = `
  query {
    products(limit: 50) {
      products {
        name
        price
        listPrice
        brand
        imageUrl
        alternateImageUrls
        url
        scores {
          week {
            views
            buys
          }
        }
      }
    }
  }
`;

// Set up the request headers
const headers = {
  "Content-Type": "application/graphql",
  Authorization:
    "Basic " +
    btoa(
      ":" + "F7k5O1PHyzjwbjQF8Z6UvvZGuu90l3M5WR8Lp8gNoP8nwEQ6zpavKNVUajlZrX6x"
    ),
};

// Define the endpoint
const endpoint = "https://api.nosto.com/v1/graphql";

// Make the fetch request
fetch(endpoint, {
  method: "POST",
  headers: headers,
  body: query,
})
  .then((response) => response.json())
  .then((data) => {
    console.log(JSON.stringify(data, null, 2)); // Pretty-print the JSON response
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
