import { cargarContenido } from "./00_sitio.js";

const getHeaderAndFooter = () => {
    return document.querySelectorAll("div[data-include]");
}

const [$header, $footer] = getHeaderAndFooter();

const showMenu = async () => {    
    try {
        let response = await fetch($header.dataset['include']),
        text = await response.text();

        if(!response.ok) throw new Error(`Ocurrio un error (${respuesta.status}): ${respuesta.statusText}`);

        $header.outerHTML = text;
    } catch (error) {
        $header.textContent = error;
    }
}

const showFooter = async () => {    
    try {
        let response = await fetch($footer.dataset['include']),
        text = await response.text();

        if(!response.ok) throw new Error(`Ocurrio un error (${respuesta.status}): ${respuesta.statusText}`);

        $footer.outerHTML = text;
    } catch (error) {
        $footer.textContent = error;
    }
}

showMenu();
document.addEventListener("click", e => {
    if(e.target.matches(".menu a")){
        e.preventDefault();

        cargarContenido(e.target)
    }
});
showFooter();
