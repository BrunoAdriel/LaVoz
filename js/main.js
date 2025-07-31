//Inicio de la funcionalidad de la pagina 
const cardsContainer = document.getElementById('cardsContainer');
const votoModal = document.getElementById('votoModal');
const cerrarModal = document.getElementById('cerrarModal');
const seccionOpciones = document.getElementById('seccionOpciones');
const seccionFormulario = document.getElementById('seccionFormulario');
const voteForm = document.getElementById('voteForm');
//const tokenLand = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtaXNzaW9ucyI6WyJ3YWxsZXQ6dXNlciJdLCJ1c2VybmFtZSI6ImpvaG4gRG9lIiwiYWRtaW4iOiJ1c2VyIiwic291cmNlIjoiQVJHIiwiaWF0IjoxNjc2MzE0MTI5fQ.y-8YlrmsjFUl7kaE7DF1uwuyX4rfaZefyFQIRSj95Ck";

let participante = "" ;
let nombreParticipante = ""; 
let opcionElegida = "";
let votosSeleccionados = null;
let idMedioPago = null;
  
//Array de data que envio a la DB 
const dataRecived = {
    participantes : [
      {name : "Agustina", team : "Lali", idParticipante : 1, img : "img/agustina.jpg", teamImg : "img/logovozarg.png"},
      {name : "Florencio", team : "Luck Ra", idParticipante : 2, img : "img/florencio.jpg", teamImg : "img/logovozarg.png"},
      {name : "Laura", team : "Miranda", idParticipante : 3, img : "img/laura.jpg", teamImg : "img/logovozarg.png"},
      {name : "Santi", team : "Soledad", idParticipante : 4, img : "img/santi.jpg", teamImg : "img/logovozarg.png"},
      {name : "Benja", team : "Lali", idParticipante : 5, img : "img/benja.jpg", teamImg : "img/logovozarg.png"},
      {name : "Valen", team : "Luck Ra", idParticipante : 6, img : "img/valen.jpg", teamImg : "img/logovozarg.png"},
      {name : "Mariale", team : "Miranda", idParticipante : 7, img : "img/mariale.jpg", teamImg : "img/logovozarg.png"},
    ],
    items : [
      { item_cant : 50, item_price : "10.00"},
      { item_cant : 100, item_price : "20.00"}
    ],
    carrier : [
      {name : "claro", id : 1},
      {name : "personal", id : 2},
      {name : "movistar", id : 3},
    ],
    plataforma : [
      {name : "Mercado Pago", id : 1},//, url : "https://restito.playtown.com.ar:3000/wallet/pay/create_checkout"},
      {name : "Pago360", id : 2},//, url : "https://restito.playtown.com.ar:3000/wallet/pay/create_checkout360"},
      {name : "Mensaje de Texto", id : 3}//, url : "https://externos.playtown.com.ar/amordinero/sms.php"}
    ],
    idproducto: 355
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

// Ejecutar al cargar la página
crearCard(dataRecived.participantes);

//inyecto los btn de pago

const medioPago = document.getElementById("medioPago");

function crearBtn(plataforma){
  medioPago.innerHTML = plataforma.map(plat => `
    <button class="btn btn-outline-primary option-btn btn-principal" data-option="${plat.name}" data-id="${plat.id}">${plat.name}</button>
    `).join('');
  };

crearBtn(dataRecived.plataforma);

//Inyectar los btn de los votos ${}

const opcionVotos = document.getElementById("opcionVotos");

function crearOpcionVotos(items){
  opcionVotos.innerHTML = items.map(vt => `
    <button type="button" class="btn btn-outline-light select-option m-1" data-votos="${vt.item_cant}">${vt.item_cant} Votos</button>
    `).join('');
};

crearOpcionVotos(dataRecived.items);

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
    window.location.href = ""//"https://externos.playtown.com.ar/amordinero/sms.php";
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

    // Scroll suave hacia el botón de pago
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
/* function plataformaData(nombre){
  return dataRecived.plataforma.find(p => p.name === nombre)
};
 */
// Función para enviar los datos al backend
async function enviarPago(datos, metodoPago) {
    /* const plataformaSeleccionada = plataformaData(metodoPago); */

    //Si el metodoPago elegido tiene distinta URL al seleccionado
    if(!plataformaSeleccionada || !plataformaSeleccionada.url){
    document.getElementById("formErrors").innerText = "Método de pago no válido.";
    document.getElementById("loadingSpinner").classList.add("hidden");
    return;
  }
  const url = plataformaSeleccionada.url;

  try {
/*     const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenLand}`
      },
      body: JSON.stringify(datos)
    });
    
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
 */
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

          if (metodoPago === "Mercado Pago") {
            document.getElementById("pagoFinal").classList.remove("hidden");
            document.getElementById("botonPagar").classList.remove("d-none");

            // document.getElementById("botonPagar").onclick = () => {
            //   window.location.href = redireccion;
            // };
            //window.location.href = redireccion;
          } else {
            //window.location.href = redireccion;
          }
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
