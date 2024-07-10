const checkTrailingZeros = (price) => {
  const formattedPrice = parceFloat(price).toString();
  return formattedPrice;
};

const truncateName = (name, maxLength) => {
  return name.length > maxLength ? name.slice(0, maxLength - 3) + "..." : name;
};

const createProductCard = (product) => {
  const card = document.createElement("div");
  card.classList.add("product-card");

  const image = document.createElement("img");
  image.src = product.imageUrl;
  image.alt = product.name;
  image.classList.add("product-image");

  const name = document.createElement("h3");
  name.textContent = product.name;
  name.classList.add("product-name");

  const brand = document.createElement("p");
  brand.textContent = product.brand;
  brand.classList.add("product-brand");

  const price = document.createElement("p");
  price.textContent = `€${product.price}`;
  price.classList.add("product-price");

  card.appendChild(image);
  card.appendChild(name);
  card.appendChild(brand);
  card.appendChild(price);

  return card;
};

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
    const products = response.data.products.products.slice(0, 3); // Get the first 3 products

    const carousel = document.getElementById("carousel");
    products.forEach((product) => {
      const productCard = createProductCard(product);
      carousel.appendChild(productCard);
    });
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
