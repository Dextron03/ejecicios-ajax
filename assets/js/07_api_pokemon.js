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

        $prevLink = json.previous 
        ? `<a id="prev-link" class="btn-nav" href="${json.previous}"><i class="bi bi-arrow-left-square-fill"></i></a>` 
        : "";

        $nextLink = json.next 
        ? `<a id="next-link" class="btn-nav" href="${json.next}"><i class="bi bi-arrow-right-square-fill"></i></a>` 
        : "";

        $links.innerHTML = $prevLink +" "+ $nextLink;

        return json.results;
    } catch (error) {
        console.error(error);
        return [];
    }finally{
        $loader.classList.add("none");
    }
}

const formatearPokemon = async (url) => {
    const pokemons = await pedirPokemons(url);
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

const mostrarPokemons = async (url) => {
    const pokemons = extraerDatosImportante(await formatearPokemon(url));

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

const pasarDeSeccion = () => {
    document.addEventListener("click", e=>{
        const $link = e.target.closest("a"); // esto detecta el <a> aunque hayas hecho clic en el <i>

        if ($link && $link.matches("#next-link")) {
            e.preventDefault();
            $main.innerHTML="";
            mostrarPokemons($link.href);
        }
        if ($link && $link.matches("#prev-link")) {
            e.preventDefault();
            $main.innerHTML="";
            mostrarPokemons($link.href);
        }
    })
}
document.addEventListener("DOMContentLoaded", ()=>{
    pasarDeSeccion();
    mostrarPokemons("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20");
})
