/* AJAX: (Asynchronus JavaScroipt & XML) Es un mecanismo que tiene js para trabajar con la asincronia y hacer
 peticiones al lado del servidor */

/* Estados de una peticion asincrona:
     READY STATE UNINITILIZED (0) se ha creado el objeto pero no se ha llamado al metodo open.
     READY STATE LOADING (1) se ha llamado al metodo open pero no al metodo send.
     READY STATE LOADED (2) se ha llamado al metodo send pero no se ha recibido respuesta.
     READY STATE INTERACTIVE (3) se ha recibido respuesta pero no se ha completado.
     READY STATE COMPLETE (4) se ha completado la peticion y se ha recibido la respuesta. */

/* Los códigos de estado de respuesta HTTP indican si se ha completado satisfactoriamente una solicitud HTTP específica. Las respuestas se agrupan en cinco clases:

Respuestas informativas (100–199),
Respuestas satisfactorias (200–299),
Redirecciones (300–399),
Errores de los clientes (400–499),
y errores de los servidores (500–599). 
ver mas: https://developer.mozilla.org/es/docs/Web/HTTP/Status 
*/


(()=>{
    const $fecth = document.getElementById("fetch"),
        $fragment = document.createDocumentFragment();

    fetch("https://jsonplaceholder.typicode.com/users")
    .then((res)=> res.ok ? res.json() : Promise.reject(res)) // Si la respuesta es correcta, devuelve el json, sino rechaza la promesa.
        // Promise.reject(res) es para que el catch se ejecute.
    .then((json)=>{ // Recibe el resultado de la promesa anterior.
        json.forEach(user => {
            const $li = document.createElement("li");
            $li.innerText = `${user.name} -- ${user.email} -- ${user.phone}`;
            $fragment.appendChild($li);
        });

        $fecth.appendChild($fragment);
    })
    .catch((err)=>{
        $fecth.innerHTML = `<h1>Error (${err.status})</h1>`;
        console.log("Error");
        console.log(err);
    })
    .finally(()=>{
        console.log("Esto se ejecutara siempre");
    });
})(); 

(()=>{
    const $fecthAsync = document.getElementById("fetch-async"),
        $fragment = document.createDocumentFragment();

    const getData = async () =>{
        try {
            let respuesta = await fetch("https://jsonplaceholder.typicode.com/users"),
            json = await respuesta.json(); 

            /* if(!respuesta.ok) throw new Error("Ocurrio un error al solicitar los datos.") */
            if(!respuesta.ok) throw new Error(`Ocurrio un error (${respuesta.status}): ${respuesta.statusText}`)

            json.forEach(user => {
                const $li = document.createElement("li");
                $li.innerText = `${user.name} -- ${user.email} -- ${user.phone}`;
                $fragment.appendChild($li);
            });
    
            $fecthAsync.appendChild($fragment);

/*             console.log(json)
            console.log(respuesta)
 */
        } catch (error) {
            console.log(`${error}`)
            
        } finally {
/*             console.log("Esto se ejecutara siempre, try...catch");
 */        }
    }


    getData();

})();

(()=>{
    const $axios = document.getElementById("axios"),
        $fragment = document.createDocumentFragment();

    axios.get("https://jsonplaceholder.typicode.com/users")
    .then((respuesta)=>{

        respuesta.data.forEach(user => {
            const $li = document.createElement("li");
            $li.innerText = `${user.name} -- ${user.email} -- ${user.phone}`;
            $fragment.appendChild($li);
        });

        $axios.appendChild($fragment);
    })
    .catch((error=>{
        console.log("Estamos en el catch",error.response)
    }))
    .finally(()=>{
/*         console.log("Esto se ejecutara independientemente el resultado de axios.")
 */    });

})();

(()=>{
    const $axiosAsync = document.getElementById("axios-async"),
        $fragment = document.createDocumentFragment();

    const getData = async () =>{
        try {
            let respuesta = await axios.get("https://jsonplaceholder.typicode.com/users"),
                json = await respuesta.data;
            json.forEach(user => {
                const $li = document.createElement("li");
                $li.innerText = `${user.name} -- ${user.email} -- ${user.phone}`;
                $fragment.appendChild($li);
            });
    
            $axiosAsync.appendChild($fragment);

        } catch (error) {
            console.log("Estamos en el catch",error.response)
        } finally {
            console.log("Esto se ejecutara independientemente el resultado de axios-async.")
        }
    }
    getData();

})();

