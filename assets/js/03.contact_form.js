const $form = document.querySelector(".contact-form"),
  $loader = document.querySelector(".contact-form-loader"),
  $messageResponse = document.querySelector(".contact-form-response"),
  $buttomSubmit = document.getElementById("btn-enviar");

document.addEventListener("submit", async (e) => {
  if (e.target === $form) {
    e.preventDefault();

    const formData = new FormData($form);

    $loader.classList.remove("none");
    $buttomSubmit.disabled = true;

    let json;

    try {
      let response = await fetch("https://formsubmit.co/ajax/brailyrs03@gmail.com", {
        method: "POST",
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Ocurrió un error (${response.status}): ${response.statusText}`);
      }

      json = await response.json();

    } catch (error) {
      console.error('Error:', error);
    } finally {
      $loader.classList.add("none");
      $messageResponse.classList.remove("none");
      
      // Validación para evitar error en json.message
      if (json && json.message) {
        $messageResponse.textContent = json.message;
      } else {
        $messageResponse.textContent = "Ocurrió un error al enviar el formulario.";
      }

      setTimeout(() => {
        $messageResponse.classList.add("none");
        $buttomSubmit.disabled = false;
        $form.reset();
      }, 3000);
    }
  }
});
