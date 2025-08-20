//Inicio de la funcionalidad de la pagina 
const cardsContainer = document.getElementById('cardsContainer');
const votoModal = document.getElementById('votoModal');
const cerrarModal = document.getElementById('cerrarModal');
const seccionOpciones = document.getElementById('seccionOpciones');
const seccionFormulario = document.getElementById('seccionFormulario');
const voteForm = document.getElementById('voteForm');

let participante = "" ;
let nombreParticipante = ""; 
let opcionElegida = "";
let votosSeleccionados = null;
let idMedioPago = null;

//Conexiones al backend
const url = "https://la-voz.vercel.app";

async function fetchData() {

  try {
    const response = await fetch(`${url}/apis/landing`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error('Error al obtener los datos de Packs');
    }

    Object.assign(dataRecived, data.result);
    crearCard(dataRecived.participantes);
    crearBtn(dataRecived.plataforma);
    crearOpcionVotos(dataRecived.items);
    cargarOperadoras(dataRecived.carrier);

  } catch (error) {
    console.error(error);
    return null;
  }
};
fetchData();

//Array de data que envio a la DB 
const dataRecived = {
  participantes: [],
  items: [],
  carrier: [],
  plataforma: [],
  idproducto: null
};

//Inyeccion de las cards con los participantes
const cardPart = document.getElementById("cardPart");

function crearCard(participantes){
  cardPart.innerHTML = participantes.map( part => `
        <div class="col">
      <div class="card text-center custom-card votar-card" data-participante="${part.name}" data-id="${part.idParticipante}">
        <section class="image-container">
          <section class="containerLogoTeam">
            <img class="logoTeam" src="${part.teamImg}" alt="Imagen representativa de cada participante"/>
          </section>
          <img src="${part.img}" class="card-img-top" alt="Imagen del Participante" />
          <h5 class="card-title card-title-bottom">${part.name}</h5>
        </section>
        <div class="card-body">
          <button class="btn btn-primary votar-btn btn-principal">VOTAR</button>
        </div>
      </div>
    </div>
  `).join('');
};

//inyecto los btn de pago

const medioPago = document.getElementById("medioPago");

function crearBtn(plataforma){
  medioPago.innerHTML = plataforma.map(plat => `
    <button class="btn btn-outline-primary option-btn btn-principal" data-option="${plat.name}" data-id="${plat.id_plataforma}">${plat.name}</button>
    `).join('');
  };

//Inyectar los btn de los votos ${}

const opcionVotos = document.getElementById("opcionVotos");

function crearOpcionVotos(items){
  opcionVotos.innerHTML = items.map(vt => `
    <button type="button" class="btn btn-outline-light select-option m-1" data-votos="${vt.item_cant}">${vt.item_cant} Votos</button>
    `).join('');
};



//Inyecto las operadoras

function cargarOperadoras(carriers) {
  const selectOperadora = document.getElementById('operadora');

  carriers.forEach(carrier => {
    const option = document.createElement('option');
    option.value = carrier.id_carrier;
    option.textContent = carrier.name.charAt(0).toUpperCase() + carrier.name.slice(1); 
    selectOperadora.appendChild(option);
  });
};

// Escucha la accion del btn, abre la primera seccion del modal y captura el nombre del participante con su id
cardPart.addEventListener('click', (e) => {
  const card = e.target.closest('.votar-card');

  if (card) {
    participante = card.getAttribute('data-id');
    nombreParticipante = card.getAttribute('data-participante');
      //inserto el nombre del párticipante en los textos donde sea necesario
    document.getElementById('votarPart').textContent = `Votá por ${nombreParticipante}`;
    document.getElementById('resumenVoto').textContent = `Votar por ${nombreParticipante} con [Medio]`;
    cardsContainer.classList.add('hidden');
    votoModal.classList.remove('hidden');
    seccionOpciones.classList.remove('hidden');
    seccionFormulario.classList.add('hidden');
    document.getElementById('formErrors').innerText = "";
  }
});

// Capturar el id metodo de pago y su id (accion igual que en el participante)
medioPago.addEventListener('click', (e) => {
  if (e.target.classList.contains('option-btn')) {
    opcionElegida = e.target.getAttribute('data-option');
    idMedioPago = parseInt(e.target.getAttribute("data-id"), 10);

  //Si es mensaje de texto te redirecciona a la URL
  if (opcionElegida === "Mensaje de Texto") {
    window.location.href = ""
    return;
  }

  // Reemplaza el texto con lo que viene del array
    document.getElementById('resumenVoto').textContent = `Votar por ${nombreParticipante} con ${opcionElegida}`;

  // Cierra la primera seccion del modal, abre la segunda e inicializa el form con los datos vacios
    seccionOpciones.classList.add('hidden');
    seccionFormulario.classList.remove('hidden');
    voteForm.reset();
    votosSeleccionados = null;
    document.querySelector('.after-submit').classList.add('hidden');
    document.getElementById('formErrors').innerText = "";

    // Scroll hacia el botón de pago
      setTimeout(() => {
        document.getElementById("voteForm").scrollIntoView({ behavior: "smooth", block: "center" });
      },0);
  }
});

// Cerrar modal
  cerrarModal.addEventListener('click', () => {
    votoModal.classList.add('hidden');
    cardsContainer.classList.remove('hidden');

// Resetear secciones para poder votar nuevamente
  seccionOpciones.classList.remove('hidden');
  seccionFormulario.classList.add('hidden');
  
  // Resetear formulario y mensajes
  voteForm.reset();
  document.getElementById('formErrors').innerText = "";
  document.querySelector('.after-submit').classList.add('hidden');
  document.getElementById('loadingSpinner').classList.add('hidden');
  document.getElementById('pagoFinal').classList.add('hidden');
  document.getElementById('btnEnviar').classList.remove('d-none');

  // Limpiar selección de votos
  votosSeleccionados = null;
  document.querySelectorAll('.select-option').forEach(b => b.classList.remove('selected'));

  // Limpiar nombre del participante
  document.getElementById('votarPart').textContent = "Votá por [nombreParticipante]";
  document.getElementById('resumenVoto').textContent = "Votar por [nombreParticipante] con [Medio]";
});


  // Selección de cantidad de votos
opcionVotos.addEventListener("click", (e) => {
  if (e.target.classList.contains("select-option")) {
    document.querySelectorAll(".select-option").forEach(b => b.classList.remove("selected"));
    e.target.classList.add("selected");
    votosSeleccionados = parseInt(e.target.getAttribute("data-votos"), 10);
  }
});

//Restricciones de letras y caracteres especiales del imput telefono 
const telefonoInput = document.getElementById('telefono');

telefonoInput.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/[^\d]/g, '');
});


// Enviar formulario
  voteForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    document.getElementById('formErrors').innerText = "";

    //Capturo el contenido y lo guardo en una constante
    const telefono = document.getElementById('telefono').value.trim();
    const email = document.getElementById('email').value.trim();
    const operadora = parseInt(document.getElementById('operadora').value,10);

    // Validaciones del formulario con sus respectivos mensajes de error
    if (!votosSeleccionados) {
      document.getElementById('formErrors').innerText = "Seleccioná una cantidad de votos.";
      return;
    }

    const telefonoRegex = /^[0-9]{10,15}$/;
    if (!telefonoRegex.test(telefono)) {
      document.getElementById('formErrors').innerText = "Ingresá un número de celular válido (sin letras ni espacios).";
      return;
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      document.getElementById('formErrors').innerText = "Ingresá un email válido.";
      return;
    }

    if (!operadora) {
      document.getElementById('formErrors').innerText = "Seleccioná una operadora.";
      return;
    }

    // Mostrar spinner
    document.getElementById("btnEnviar").classList.add("d-none");
    const postSubmit = document.getElementById("postSubmit");
    postSubmit.classList.remove("hidden");
    document.getElementById("loadingSpinner").classList.remove("hidden");

    //Datos del cliente que se envian a la BD
    const datos = { 
      id_candidato: participante, 
      id_plataforma: idMedioPago, 
      item_cant: Number(votosSeleccionados),
      item_price: calcularPrecio(Number(votosSeleccionados)).toFixed(2),
      ani: telefono, 
      email, 
      id_carrier: operadora,
      id_producto: Number(dataRecived.idproducto)
    };

    await enviarPago(datos, opcionElegida);
});
  
//Funcion para agregarle precio dependiendo al opcion elegida
  function calcularPrecio(cant) {
  if (cant === 50) return 10.00;
  if (cant === 100) return 20.00;
}

//Extrae el valor de los parametros de la URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const flag = urlParams.get('flag');

//Selecciona segun la operacion
  if (flag === 'success') {
    Toastify({
      text: "Operación exitosa",
      backgroundColor: "green",
      duration: 3000,
      gravity: "top",
      position: "center",
      close: true
    }).showToast();
  } else if (flag === 'failure' || flag === 'fail') {
    Toastify({
      text: "Ocurrió un error",
      backgroundColor: "red",
      duration: 3000,
      gravity: "top",
      position: "center",
      close: true
    }).showToast();
  } else if (flag === 'pendding') {
    Toastify({
      text: "Tu operación está pendiente",
      backgroundColor: "orange",
      duration: 3000,
      gravity: "top",
      position: "center",
      close: true
    }).showToast();
  }

//Funcion para capturar la informacion de la plataforma
function plataformaData(nombre){
  return dataRecived.plataforma.find(p => p.name === nombre)
};

// Función para enviar los datos al backend
async function enviarPago(datos, metodoPago) {
    const plataformaSeleccionada = plataformaData(metodoPago); 

    //Si el metodoPago elegido tiene distinta URL al seleccionado
    if(!plataformaSeleccionada){
    document.getElementById("formErrors").innerText = "Método de pago no válido.";
    document.getElementById("loadingSpinner").classList.add("hidden");
    return;
  }

  try {
    const response = await fetch(`${url}/landing`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(datos)
    });
      console.log("Datos enviados:", datos);
    
      //Mostrar el Toast segun el estado
      function mostrarToast(mensaje, color) {
        Toastify({
          text: mensaje,
          backgroundColor: color,
          duration: 4000,
          gravity: "top",
          position: "center",
          close: true
        }).showToast();
      };

    const contentType = response.headers.get("Content-Type") || "";

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error HTTP:", response.status, errorText);
      document.getElementById("formErrors").innerText = `Error del servidor (${response.status})`;
      document.getElementById("loadingSpinner").classList.add("hidden");
      mostrarToast("Ocurrió un Error el procesar tu pago", "red");
      return;
    }

    document.getElementById("loadingSpinner").classList.add("hidden");
    if (contentType.includes("application/json")) {
      const data = await response.json();
      console.log("Respuesta JSON:", data);

      if (data.status && data.result) {
        const redireccion = data.result.init_point || data.result.checkout_url;

        mostrarToast("Formulario enviado correctamente", "green");

/*           if (metodoPago === "Mercado Pago") {
            document.getElementById("pagoFinal").classList.remove("hidden");
            document.getElementById("botonPagar").classList.remove("d-none");

            document.getElementById("botonPagar").onclick = () => {
              window.location.href = redireccion;
            };
            window.location.href = redireccion;
          } else {
            window.location.href = redireccion;
          } */
      }
    } else {
      const errorText = await response.text();
      document.getElementById("formErrors").innerText = "Respuesta inesperada del servidor.";
      mostrarToast("Respuesta inesperada del servidor", "orange");
    }
  } catch (error) {
    console.error("Error en fetch:", error);
    document.getElementById("formErrors").innerText = "Error de conexión con el servidor.";
    document.getElementById("loadingSpinner").classList.add("hidden");
    mostrarToast("Error en la coneccion del servidor", "red");
  }
}
