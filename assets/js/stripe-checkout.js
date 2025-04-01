import STRIPE_KEYS from "./stripe-keys.js";

const $template = document.getElementById("taco-template").content,
    $tacos = document.querySelector("#tacos"),
    $fragment = document.createDocumentFragment(),
    options = {
        headers: {
            Authorization: `Bearer ${STRIPE_KEYS.secret}`
        }
    };
const fetchData = async () => {
    try {
        let [responseProducts, responsePrices] = await Promise.all([
            fetch("https://api.stripe.com/v1/products", options),
            fetch("https://api.stripe.com/v1/prices", options)
        ]);

        let products = await responseProducts.json();
        let prices = await responsePrices.json();

        console.log(prices)

        return { products: products.data || [], prices: prices.data || [] };
    } catch (error) {
        console.error("Error fetching data:", error);
        return { products: [], prices: [] };
    }
};

const renderProductos = (productos) => {
    productos.forEach((element) => {
        let $clone = document.importNode($template, true);
        $clone.firstElementChild.setAttribute("data-price", element.id_price);
        $clone.querySelector("img").src = element.images;
        $clone.querySelector("img").alt = element.name;
        $clone.querySelector("figcaption").innerHTML = `${element.name} <br> $${formatearPrecio(element.unit_amount_decimal)} ${element.currency.toUpperCase()}`;
        $fragment.appendChild($clone);
    });
    $tacos.appendChild($fragment);
};

const formatearPrecio = (precio) => {
    let stringPrecio = ""
    precio = precio.split("")
    precio[precio.length - 2] = "."
    precio[precio.length ] = "0"
    precio.forEach(item=>stringPrecio+=item)
    
    return stringPrecio;
}

const init = async () => {
    let { products, prices } = await fetchData();

    const mapPrices = new Map(prices.map(p => [p.product, p]));

    const productos = products.map(product => {
        let priceData = mapPrices.get(product.id) || {};
        return {
            id: product.id,
            description: product.description,
            images: product.images,
            name: product.name,
            id_price: priceData.id || null,
            unit_amount_decimal: priceData.unit_amount_decimal || null,
            currency: priceData.currency || null
        };
    });

    renderProductos(productos);
};

document.addEventListener("click", e => {
    if(e.target.matches(".taco *")){
        let priceId = e.target.parentElement.getAttribute("data-price");
        pagoUnico(priceId) || pagarConSubscripcion(priceId)
    }
})

const pagoUnico = (id) => {
    Stripe(STRIPE_KEYS.public).redirectToCheckout({
        lineItems: [{ price: id, quantity: 1 }],
        mode: "payment",
        successUrl: "http://127.0.0.1:5500/assets/stripe-succes.html",
        cancelUrl: "http://127.0.0.1:5500/assets/stripe-cancel.html"
    }).then(respuesta => {
        if (respuesta.error) {
            console.log("Error en pago único:", respuesta.error.message);
            $tacos.insertAdjacentHTML("afterend", respuesta.error.message);
        }
    }).catch(error => {
        console.error("Error inesperado en pago único:", error);
    });
};

const pagarConSubscripcion = (id) => {
    Stripe(STRIPE_KEYS.public).redirectToCheckout({
        lineItems: [{ price: id, quantity: 1 }],
        mode: "subscription",
        successUrl: "http://127.0.0.1:5500/assets/stripe-succes.html",
        cancelUrl: "http://127.0.0.1:5500/assets/stripe-cancel.html"
    }).then(respuesta => {
        if (respuesta.error) {
            console.log("Error en suscripción:", respuesta.error.message);
            $tacos.insertAdjacentHTML("afterend", respuesta.error.message);
        }
    }).catch(error => {
        console.error("Error inesperado en suscripción:", error);
    });
};


init();
