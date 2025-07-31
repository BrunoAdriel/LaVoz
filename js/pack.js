const dataRecived = {
  pack : [],
    carrier : [
      {name : "MOVISTAR", id : 1},
      {name : "PERSONAL", id : 2},
      {name : "CLARO", id : 3},
    ],
    plataforma : [
      {name : "Mercado Pago", id : 1},//, url : "https://restito.playtown.com.ar:3000/wallet/pay/create_checkout"},
      {name : "Pago360", id : 2},//, url : "https://restito.playtown.com.ar:3000/wallet/pay/create_checkout360"},
      {name : "Mensaje de Texto", id : 3}//, url : "https://externos.playtown.com.ar/amordinero/sms.php"}
    ],
      id_producto: 501,
      id_trivia: 501
}

//Conductores
const cardsContainer =document.getElementById("cardsContainer");
const medioPago = document.getElementById("medioPago");
const seccionCard = document.getElementById('seccionCard');
const seccionPago = document.getElementById('seccionPago');
const seccionFormulario = document.getElementById('seccionFormulario');
const cerrarModalPago = document.getElementById('cerrarModalPago');
const cerrarModalForm = document.getElementById('cerrarModalForm');
//const tokenPack = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtaXNzaW9ucyI6WyJ0cml2aWE6dXNlciJdLCJ1c2VybmFtZSI6ImpvaG4gRG9lIiwiYWRtaW4iOiJ1c2VyIiwic291cmNlIjoiQVJHIiwiaWF0IjoxNjc2MzE0MTI5fQ.BTqqGUuKsnG6GjEnfzvH_4ZDxV7CzavCEPi_QgINRss";
//const tokenLand = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtaXNzaW9ucyI6WyJ3YWxsZXQ6dXNlciJdLCJ1c2VybmFtZSI6ImpvaG4gRG9lIiwiYWRtaW4iOiJ1c2VyIiwic291cmNlIjoiQVJHIiwiaWF0IjoxNjc2MzE0MTI5fQ.y-8YlrmsjFUl7kaE7DF1uwuyX4rfaZefyFQIRSj95Ck";

//Variables
let packSeleccionado = null;
let plataformaSeleccionada = null;
let idMedioPago = null;
let opcionElegida = "";

/* async function ObtenerPacks(){
  try{
    //Consumo los datos de la API para obtener los packs
    const res = await fetch('https://restito.playtown.com.ar:3000/wallet/trivia/package', { 
    method: "GET",
    headers:{
        "Authorization": `Bearer ${tokenPack}`,
        "Content-Type": "application/json"
      }
  });
  const data = await res.json();
 
 const packs = data.result || [];
 
  dataRecived.pack = packs;
  return packs;

  }catch(error){
    console.error("Error al obtener los packs de pregunta", error);
    return;
  }
} */


async function CrearCards(){
    try {
    const packs = await ObtenerPacks(); 
    cardsContainer.innerHTML = "";

    packs.forEach(p=>{
    //Inyecto las cards
    const cardHTMT =`
    <div class="col">
      <div class="card card-custom" id="card-${p.ID_ITEM}">
        <section class="header-custom">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA24Z-JDbwSxxVtbqy07-Sq7nulnXMN5YcgA&s" alt="${p.ITEM}" class="card-img-top"/>
          <h5 class="card-title">${p.ITEM}</h5>
        </section>
        <section class="card-body d-none">
          <p class="card-text">${p.DESCRIPCION}</p>
          <p class="card-text"><small>Valor: $${p.ITEM_PRICE}</small></p>
          <p hidden>${p.ITEM_CANT}</p>
            <section class="card-footer d-flex justify-content-center">
              <button class="btn btn-compra btn-principal btn-outline-primary mt-3" id-data-pack="${p.ID_ITEM}" >Comprar preguntas</button>
            </section>
        </section>
      </div>
    </div>
    `;
    cardsContainer.innerHTML += cardHTMT;
    });

  /* Codigo para que se vea todo el contenido de la CARD */
  document.querySelectorAll(".card-body").forEach(body => {
    body.classList.remove("d-none");
  });

    //Agregar eventos en los btn
    setTimeout(() => {
      document.querySelectorAll(".btn-compra").forEach(btn => {
        btn.addEventListener("click", (e) => {
          seccionCard.classList.add("d-none");
          seccionPago.classList.remove("d-none");

          // Inyectar botones de pago
          const packID = parseInt(e.target.getAttribute('id-data-pack'), 10);
          const item = dataRecived.pack.find(p => p.ID_ITEM=== packID);
          //Capturo los elementos para enviar
            if (item) {
              packSeleccionado = {
                id_ITEM: item.ID_ITEM,
                ITEM_PRICE: item.ITEM_PRICE,
                ITEM_CANT: item.ITEM_CANT 
              };
            }
          crearBtn(dataRecived.plataforma);
        });
      });
    }, 0);

} catch (error) {
    console.error("Error al cargar packs:", error);
    cardsContainer.innerHTML = `<div class="alert alert-danger">No se pudieron cargar los packs.</div>`;
  }
}

CrearCards();

//inyecto los btn de pago
function crearBtn(plataforma) {
  medioPago.innerHTML = plataforma.map(plat => `
    <button class="btn btn-outline-primary option-btn btn-principal m-2" data-option="${plat.name}" data-id="${plat.id}">${plat.name}</button>
  `).join('');

    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const opcion = e.target.getAttribute('data-option');
        const id = parseInt(e.target.getAttribute('data-id'), 10);

/*         if (opcion === "Mensaje de Texto") {
          window.location.href = "https://externos.playtown.com.ar/amordinero/sms.php";
          console.log("Redireccion:", window.location.href)
          return;
        } */

// Guardar selección
    window.opcionElegida = opcion;
    window.idMedioPago = id;

    // Modificar el contenido del H4 resumen
    const resumenVoto = document.getElementById("resumenVoto");
    if (resumenVoto && packSeleccionado && opcion) {
      resumenVoto.innerText = `Comprar pack de ${packSeleccionado.ITEM_CANT} preguntas con ${opcion}`;
    }

    // Ocultar sección de pago, mostrar formulario
    document.getElementById('seccionPago').classList.add('d-none');
    document.getElementById('seccionFormulario').classList.remove('d-none');
      });
    });
}

//Inyecto las operadoras

function cargarOperadoras(carriers) {
  const selectOperadora = document.getElementById('operadora');

  carriers.forEach(carrier => {
    const option = document.createElement('option');
    option.value = carrier.id;
    option.textContent = carrier.name.charAt(0).toUpperCase() + carrier.name.slice(1); 
    selectOperadora.appendChild(option);
  });
};

cargarOperadoras(dataRecived.carrier);


//funcion cerrar modal
function manejarCerrarModal(e) {
  const id = e.target.id;

  if (id === "cerrarModalForm") {
    seccionFormulario.classList.add("d-none");
    seccionPago.classList.remove("d-none");
  } else if (id === "cerrarModalPago") {
    seccionPago.classList.add("d-none");
    seccionCard.classList.remove("d-none");
  }
}
// Listeners
cerrarModalForm.addEventListener("click", manejarCerrarModal);
cerrarModalPago.addEventListener("click", manejarCerrarModal);


//Restricciones de letras y caracteres especiales del imput telefono 
const telefonoInput = document.getElementById('telefono');

telefonoInput.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/[^\d]/g, '');
});

// Enviar formulario
const voteForm = document.getElementById('voteForm');
voteForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const telefono = document.getElementById('telefono').value.trim();
  const email = document.getElementById('email').value.trim();
  const operadora = parseInt(document.getElementById('operadora').value, 10);

  const telefonoRegex = /^[0-9]{10,15}$/;
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  if (!telefonoRegex.test(telefono)) {
    document.getElementById('formErrors').innerText = "Número inválido.";
    return;
  }

  if (!emailRegex.test(email)) {
    document.getElementById('formErrors').innerText = "Email inválido.";
    return;
  }

  if (!operadora || operadora === "Seleccioná") {
    document.getElementById('formErrors').innerText = "Elegí una operadora.";
    return;
  }

  //al clickear el btn, se va y aparece el spinner
  document.getElementById('btnEnviar').classList.add('d-none');
  document.getElementById('postSubmit').classList.remove('d-none');
 

  // Datos a enviar
  const datos = { 
    id_plataforma: window.idMedioPago, 
    id_trivia: dataRecived.id_trivia,
    id_item: packSeleccionado.id_ITEM,
    item_cant: packSeleccionado.ITEM_CANT,
    item_price: packSeleccionado.ITEM_PRICE,
    ani: telefono,
    email: email,
    id_carrier: operadora,
    id_producto: dataRecived.id_producto
  };

  await enviarPago(datos, window.opcionElegida);
});

//Mostrar el Toast segun el estado
function mostrarToast(mensaje, tipo) {
  let color = {
    success: "linear-gradient(to right, #00b09b, #96c93d)",
    error: "linear-gradient(to right, #d32f2f, #ff5252)",
    warning: "linear-gradient(to right, #f7b733, #fc4a1a)"
  }; 

  Toastify({
    text: mensaje,
    style : { background: color[tipo] }|| "linear-gradient(to right, #00c6ff, #0072ff)",
    duration: 3000,
    gravity: "center",
    position: "center",
    close: true
  }).showToast();
};

//Extrae el valor de los parametros de la URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const flag = urlParams.get('flag');

//Selecciona segun la operacion
if (flag === 'success') {
  mostrarToast("Operación exitosa", "success");
} else if (flag === 'failure' || flag === 'fail') {
  mostrarToast("Ocurrió un error", "error");
} else if (flag === 'pendding') {
  mostrarToast("Tu operación está pendiente", "warning");
}

//Funcion para capturar la informacion de la plataforma
function plataformaData(nombre){
  return dataRecived.plataforma.find(p => p.name === nombre)
};

// Función para enviar los datos al backend
async function enviarPago(datos, metodoPago) {  
/*     const plataformaSeleccionada = plataformaData(metodoPago); */

    //Si el metodoPago elegido tiene distinta URL al seleccionado
    if(!plataformaSeleccionada || !plataformaSeleccionada.url){
    document.getElementById("formErrors").innerText = "Método de pago no válido.";
    return;
  }
/*   const url = plataformaSeleccionada.url; */

  try {
/*     const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenLand}`
      },
      body: JSON.stringify(datos)
    });
    console.log("Datos enviados:", datos);
    
    const contentType = response.headers.get("Content-Type") || ""; */

    if (!response.ok) {
/*       const errorText = await response.text(); */
      console.error("Error HTTP:", response.status, errorText);
      document.getElementById("formErrors").innerText = `Error del servidor (${response.status})`;
      mostrarToast("Ocurrió un Error el procesar tu pago", "error");
      return;
    }

    if (contentType.includes("application/json")) {
/*       const data = await response.json(); */
      console.log("Respuesta JSON:", data);

      if (data.status && data.result) {
/*         const redireccion = data.result.init_point || data.result.checkout_url; */
        console.log("Redireccion",redireccion)

        mostrarToast("Formulario enviado correctamente", "success");

       /*  window.location.href = redireccion; */

      }
    } else {
      const errorText = await response.text();
      document.getElementById("formErrors").innerText = "Respuesta inesperada del servidor.";
      mostrarToast("Respuesta inesperada del servidor", "warning");
    }
  } catch (error) {
    console.error("Error en fetch:", error);
    document.getElementById("formErrors").innerText = "Error de conexión con el servidor.";
    document.getElementById("postSubmit").classList.add("hidden"); 
    mostrarToast("Error en la coneccion del servidor", "error");
  }
}
