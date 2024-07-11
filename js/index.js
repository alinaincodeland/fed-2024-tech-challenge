// Truncate long product names
const truncateName = (name, maxLength) => {
  return name.length > maxLength ? name.slice(0, maxLength - 3) + "..." : name;
};

// Remove trailing zeroes
const removeTrailingZeros = (price) => {
  return price.includes(".00") ? price.split(".00")[0] : price;
};

// Create product card
const createProductCard = (
  product,
  isMostViewed = false,
  isBestSeller = false
) => {
  const card = document.createElement("div");
  card.classList.add("product-card");

  const image = document.createElement("img");
  image.src = product.imageUrl;
  image.alt = product.name;
  image.classList.add("product-image");

  // Add product image click event
  image.addEventListener("click", () => {
    window.location.href = product.url;
  });

  if (isMostViewed) {
    const mostViewed = document.createElement("h5");
    mostViewed.textContent = "Most Viewed!";
    mostViewed.classList.add("most-viewed");
    card.appendChild(mostViewed);
  }

  card.appendChild(image);

  if (!isBestSeller) {
    const brand = document.createElement("h3");
    brand.textContent = product.brand;
    brand.classList.add("product-brand");

    const name = document.createElement("p");
    name.textContent = truncateName(product.name, 20);
    name.classList.add("product-name");

    const price = document.createElement("h3");
    price.textContent = `€${product.price}`;
    price.classList.add("product-price");

    card.appendChild(brand);
    card.appendChild(name);
    card.appendChild(price);
  }

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

// Setup headers
const headers = {
  "Content-Type": "application/graphql",
  Authorization:
    "Basic " +
    btoa(
      ":" + "F7k5O1PHyzjwbjQF8Z6UvvZGuu90l3M5WR8Lp8gNoP8nwEQ6zpavKNVUajlZrX6x"
    ),
};

const endpoint = "https://api.nosto.com/v1/graphql";

// Setup fetch request
fetch(endpoint, {
  method: "POST",
  headers: headers,
  body: query,
})
  .then((response) => response.json())
  // .then((data) => {
  //   console.log(JSON.stringify(data, null, 2));
  // })
  .then((response) => {
    const products = response.data.products.products;

    let mostViewedProduct = null;
    let bestSellerProduct = null;
    let maxViews = 0;
    let maxBuys = 0;

    products.forEach((product) => {
      if (product.scores.week.views > maxViews) {
        maxViews = product.scores.week.views;
        mostViewedProduct = product;
      }
      if (product.scores.week.buys > maxBuys) {
        maxBuys = product.scores.week.buys;
        bestSellerProduct = product;
      }
    });

    // Add most viewed product to the beginning of the carousel
    products.splice(products.indexOf(mostViewedProduct), 1);
    products.unshift(mostViewedProduct);

    // Display best seller this week
    if (bestSellerProduct) {
      const isMostViewed = bestSellerProduct === mostViewedProduct;

      const bestSellerCard = createProductCard(
        bestSellerProduct,
        isMostViewed,
        true
      );
      document.getElementById("best-seller").appendChild(bestSellerCard);
    }

    // Display carousel
    const carouselProducts = products.filter(
      (product) => product !== bestSellerProduct
    );

    const carousel = document.getElementById("carousel");

    carouselProducts.forEach((product) => {
      const isMostViewed = product === mostViewedProduct;
      const productCard = createProductCard(product, isMostViewed, false);
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
