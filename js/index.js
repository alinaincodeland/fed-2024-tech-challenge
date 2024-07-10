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

const endpoint = "https://api.nosto.com/v1/graphql";

// Fetch request
fetch(endpoint, {
  method: "POST",
  headers: headers,
  body: query,
})
  .then((response) => response.json())
  .then((response) => {
    console.log(JSON.stringify(response, null, 2));
    $("#carousel").slick({
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 2,
      variableWidth: true,
      draggable: false,
      responsive: [
        {
          breakpoint: 955,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            arrows: false,
            draggable: true,
          },
        },
      ],
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

const checkTrailingZeros = (price) => {
  const formattedPrice = parceFloat(price).toString();
  return formattedPrice;
};

const truncateName = (name, maxLength) => {
  return name.length > maxLength ? name.slice(0, maxLength - 3) + "..." : name;
};
