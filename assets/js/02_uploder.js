const $main = document.querySelector("main"),
  $files = document.getElementById("files");

/* Barra de progreso */

const progressUpload = (file) => {
  const $progress = document.createElement("progress"),
  $span = document.createElement("span");

  $progress.value = 0;
  $progress.max = 100;

  $main.insertAdjacentElement("beforeend", $progress);
  $main.insertAdjacentElement("beforeend", $span);
  
  const fileReader = new FileReader();/* Detecta los bist que van cargados y con esto podemos hacer el calculo del porcentaje de carga de cada archivo */

  fileReader.readAsDataURL(file);
  
  fileReader.addEventListener("progress", (e)=>{
    let progress = parseInt((e.loaded * 100)/e.total);
    $progress.value = progress;
    $span.innerHTML = `<b>${file.name} - ${progress}%</b>`
  });


  fileReader.addEventListener("loadend", (e)=>{
    uploader(file);
    setTimeout(()=>{
      $main.removeChild($progress);
      $main.removeChild($span);
      $files.value = "";
    },2000)
  });
};


const uploader = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    let response = await fetch("assets/uploder.php", {
      method: "POST",
      body: formData // No es necesario definir 'Content-Type'
    });

    if (!response.ok) throw new Error(`Ocurrió un error (${response.status}): ${response.statusText}`);

    console.log("Archivo subido correctamente");
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

document.addEventListener("change", (e) => {
  if (e.target === $files) {
    const files = e.target.files;

    for (const file of files) {
      progressUpload(file);
    }
  }
});
