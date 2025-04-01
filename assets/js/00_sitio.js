
const $enlaces = document.querySelectorAll("a"),
        $main = document.querySelector("main[class='container']");

const colocarData = ($selector) => {
    $selector.forEach(element=>{
        element.setAttribute(`data-${element.textContent.toLowerCase()}`,"")
    })
}

export const cargarContenido = async (target) => {

    try {
        let response = await fetch(`${target.href}`),
            htmlContent = await response.text();

        if(!response.ok) throw new Error(`Ocurrio un error (${response.status}): ${response.statusText}`);

        $main.innerHTML = htmlContent;

    } catch (error) {
        console.log(error);
        $main.innerHTML = `<h2> ${error} </h2> `;
    }
}

colocarData($enlaces);

document.addEventListener("click", e => {
    if(e.target.matches(".menu a")){
        e.preventDefault();

        cargarContenido(e.target)
    }
});