const $template = document.querySelector("template").content,
    $fragmento = document.createDocumentFragment(),
    $main = document.querySelector("main"),
    $loader = document.querySelector(".loader"),
    $links = document.querySelector(".links");
let $prevLink,
    $nextLink;

const pedirPokemons = async (url) => {
    try {
        let response = await fetch(url),
            json = await response.json();

        if (!response.ok) throw new Error(`Ocurrio un error (${response.status}): ${response.statusText}`);

        $prevLink = json.previous ? `<a href="${json.previous}"><i class="bi bi-arrow-left-square-fill"></i></a>` : ""; 
        $nextLink = json.next ? `<a href="${json.next}"><i class="bi bi-arrow-right-square-fill"></i></a>` : ""; 

        $links.innerHTML = $prevLink +" "+ $nextLink;

        return json.results;
    } catch (error) {
        console.error(error);
        return [];
    }finally{
        $loader.classList.add("none");
    }
}

const formatearPokemon = async () => {
    const pokemons = await pedirPokemons("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20");
    if (!pokemons || pokemons.length === 0) {
        console.error("No se obtuvieron los pokemons.");
        return;
    }

    const promesas = pokemons.map(pokemon => fetch(pokemon.url).then(res => res.json()));
    const results = await Promise.allSettled(promesas);

    return results;
};

const extraerDatosImportante = (obj) => {
    let objPokemonFormateado = [];
    obj.forEach(({ status, value }) => {
        if (status === "fulfilled") {
            const { name, sprites } = value;
            const spritesFront = sprites.front_default;
            objPokemonFormateado.push({ name, spritesFront });
        }
    });
    return objPokemonFormateado;
}

const mostrarPokemons = async () => {
    const pokemons = extraerDatosImportante(await formatearPokemon());
    
    if (pokemons.length === 0) {
        console.log("No se encontraron Pokemons para mostrar.");
        return;
    }

    pokemons.forEach(element => {
        const $clone = document.importNode($template, true);
        $clone.querySelector("img").src = element.spritesFront;
        $clone.querySelector("img").alt = element.name;
        $clone.querySelector("figcaption").innerHTML = element.name;
        $fragmento.appendChild($clone);
    });

    $main.appendChild($fragmento);
}

mostrarPokemons();
