document.addEventListener("submit", async (e) => {
  if (e.target === document.querySelector(".contact-form")) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const loader = document.querySelector(".contact-form-loader");
    const messageResponse = document.querySelector(".contact-form-response");
    const buttonSubmit = document.getElementById("btn-enviar");

    loader.classList.remove("none");
    buttonSubmit.disabled = true;

    try {
      const response = await fetch("assets/send_mail.php", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
/*         mode:"cors" El intercambio de recursos de origen cruzado o CORS es un mecanismo que permite que se puedan solicitar recursos restringidos en una página web desde un dominio diferente del dominio que sirvió el primer recurso.​
 */      });

      if (!response.ok) {
        throw new Error(`Error (${response.status}): ${response.statusText}`);
      }

      const json = await response.json();
      messageResponse.textContent = json.message || "Error al procesar la solicitud.";
    } catch (error) {
      console.error("Error:", error);
      messageResponse.textContent = "Ocurrió un error al enviar el formulario.";
    } finally {
      loader.classList.add("none");
      messageResponse.classList.remove("none");

      setTimeout(() => {
        messageResponse.classList.add("none");
        buttonSubmit.disabled = false;
        e.target.reset();
      }, 3000);
    }
  }
});
