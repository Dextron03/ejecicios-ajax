const $input = document.getElementById("search"),
    $template = document.getElementById("show-template").content,
    $fragmento = document.createDocumentFragment(),
    $show = document.getElementById("shows"),
    $loader = document.getElementById("loader-container");

const extraerDataInput = (input) => input.value.trim();

const consultarApi = async (show) => {
    $loader.classList.remove("none");
    try {
        let response = await fetch(`https://api.tvmaze.com/search/shows?q=${show}`),
        json = await response.json();

        if (!response.ok) throw new Error(`Ocurrió un error (${response.status}): ${response.statusText}`);

        const mapShows = new Map(json.map(s => [s.show.id, {
            name: s.show.name,
            image: s.show.image?.original || "",
            summary: s.show.summary || "Sin descripción disponible",
            url: s.show.url
        }]));

        $show.innerHTML = "";

        mapShows.forEach(s => {
            const $clone = document.importNode($template, true);
            $clone.querySelector("h3").innerHTML = s.name;
            $clone.querySelector("div").innerHTML = s.summary;
            $clone.querySelector("img").src = s.image;
            $clone.querySelector("img").alt = s.name;
            $clone.querySelector("a").textContent = "Ver más";
            $clone.querySelector("a").href = s.url;
            $clone.querySelector("a").target = "_blank";
            $fragmento.appendChild($clone);
        });
        $show.appendChild($fragmento);

    } catch (error) {
        console.error(error);
    } finally {
        $loader.classList.add("none");
    }
}

document.addEventListener("change", e => {
    if (e.target === $input) {
        const query = extraerDataInput(e.target);
        if (query !== "") {
            consultarApi(query);
        } else {
            console.log("No debes dejar el campo vacío.");
        }
    }
});
