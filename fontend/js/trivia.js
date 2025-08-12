
// Almacenadores
let respuestaSeleccionada = null;
let numeroIngresado = null;

// Conductores
const btnIniciarTrivia = document.getElementById('iniciarTrivia');
const triviaContainer = document.getElementById('triviaContainer');
const preguntaActual = document.getElementById('preguntaActual');
const opcionesContainer = document.getElementById('opciones');
const btnEnviar = document.getElementById('btnEnviar');
const contadorPreguntas = document.getElementById('contadorPreguntas');
const puntosObtenidos = document.getElementById('puntosObtenidos');
const resultadoFinal = document.getElementById('resultadoFinal');
const btnCerrarModal = document.getElementById('cerrarModal');
const inputTelefono =   document.getElementById('inputTelefono');
const crosselingContainer = document.getElementById('crosselingContainer');
const dataParticipante = document.getElementById('dataParticipante');
const spinnerSubmit =  document.querySelector('#spinnerSubmit');
const tituloTrivia = document.getElementById('tituloTrivia');

//Conexiones al backend
const url = "http://localhost:3000";

//Logica para inyectar el estilo en la clase segun el resultado
function mostrarToast(mensaje, tipo) {
let color = {
    success: "linear-gradient(to right, #00b09b, #96c93d)",
    error: "linear-gradient(to right, #ff5f6d, #ffc371)",
    warning: "linear-gradient(to right, #f7b733, #fc4a1a)"
  }; 

  Toastify({
    text: mensaje,
    duration: 3000,
    gravity: "center",
    position: "center",   
    style: {
      background: color[tipo] || "linear-gradient(to right, #00c6ff, #0072ff)",
    }, 
    stopOnFocus: true
  }).showToast();
}

//Funcion para capturar el usuario 
/* async function validarUsuario(ani) {
  try{
    const res = await fetch(`${API_ANI}/501/active/${ani}`, {
      method : "POST",
      headers : {'Content-Type' : 'application/json',
                  'Authorization' : `Bearer ${tokenTrivia}`
      },
    })
    const data = await res.json();
    console.log("informacion de api:", data);

    //Si no me llegan 3 parametros principales
    if (!data.status || !data.result || data.statusCode !== 201) {
      return null;
    } else {
    // Devuelvo del objeto los elementos que necesito
    return {
      ani: data.result.ANI_CLIENTE,
      triviaActiva: data.active,
      name: `${data.result.ANI_CLIENTE}` 
    };
    }

  }catch(error){
    console.error("Error interno en el servidor.", error);
    throw new Error('Fallo interno en el servidor');
  }
}  */

// Funcion para mostrar mensajes
function mensajeUsuario(usuario, numeroIngresado){

  const ingreso = `
    <section>
      <p>Ani N.º ${usuario.name}!</p>
    </section>
  `;

  //Validacion para guardar el ani en el LocalStorage
  if(usuario.triviaActiva||!usuario.triviaActiva){
    localStorage.setItem("NumeroGuardado", numeroIngresado);
  }

  if(usuario.triviaActiva){
  mostrarToast("✅ Acceso concedido: tenés trivia activa.", "success");
  document.getElementById('iniciarTrivia').classList.remove('d-none');
  document.getElementById('iniciarTrivia').disabled = false;
  inputTelefono.classList.add('d-none');
  dataParticipante.classList.remove('d-none');
    dataParticipante.innerHTML =`
      <!--Btn para cerrar el modal-->
      <span class="close-btn" id="btnCerrarInterno">&times;</span>
      ${ingreso}
      `;
  }else if(!usuario.triviaActiva){
    mostrarToast('✅Acceso concedido: No tenes trivias activas!', 'success');
    inputTelefono.classList.add('d-none');
    dataParticipante.classList.remove('d-none');
    dataParticipante.innerHTML = `
      <!--Btn para cerrar el modal-->
      <span class="close-btn" id="btnCerrarInterno">&times;</span>
        <div class="text-center position-relative">
          ${ingreso}
          <section class="alert alert-danger text-center" style="max-width: auto;" >
            <p class="mb-2">No se encontraron trivias activas vinculadas a tu usuario, por favor compra un pack para continuar respondiendo</p>
            <a class='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-75-hover' href="/packs" target='_blank' rel='noopener noreferrer'>Comprá más preguntas👈</a>
          </section>
        </div>
        `;  
  }

  //Escucha del btn Cerrar
  const btnCerrarInterno = document.getElementById('btnCerrarInterno');
  btnCerrarInterno.addEventListener('click', cerrarTrivia);
}

//Consumo el listener, guardo el resultado en una variable, lo envio para hacer las validaciones
document.getElementById('validarTelefono').addEventListener('click', async() => {
  numeroIngresado = document.getElementById('telefono').value.trim();

  if(!numeroIngresado){
    mostrarToast('⚠ Ingresá un número de teléfono.', 'warning');
    return;
  }

  try{
    const usuario = await validarUsuario(numeroIngresado);

    if(!usuario){
    mostrarToast('❌ Usuario no registrado.', 'warning');
    inputTelefono.classList.remove('d-none');
    return;
    }

    mensajeUsuario(usuario, numeroIngresado);
  }catch(error){
    console.error("Error interno en el servior.",error);
    throw new Error("Fallo interno en el servidor.");
  }
});

// Iniciar Trivia
btnIniciarTrivia.addEventListener('click', async () => {
  // Ocultar input y botón de validación del telefeno
  inputTelefono.classList.add('d-none');
  btnIniciarTrivia.classList.add('d-none');
  dataParticipante.classList.add('d-none');
  triviaContainer.classList.remove('d-none');
  await cargarPregunta();
});


//Funcion cargar pregunta
async function cargarPregunta(){
  try{
    //Consumo de la API 
/*     let url = `${API_URL_TRIVIA}/preguntas/${numeroIngresado}`;
    const res = await fetch(url, {
      method : "POST",
      headers : {'Content-Type' : 'application/json',
                  'Authorization' : `Bearer ${tokenTrivia}`
      },
      body: JSON.stringify({
            id_trivia: 501,
            ani: numeroIngresado
      })
    });
    pregunta = await res.json();
    console.log("Contenido preg:",pregunta); */

    //Guardo el contenido de pregunta, si este viene vacio o sin ID finaliza
    const preguntaData = pregunta.result.PREGUNTA;
    if (!preguntaData || !preguntaData.ID_PREGUNTA) {
      return finalizarTrivia({
        puntosFinales: pregunta.result.PUNTOS || 0,
        totalRespondido: pregunta.result.TOTAL || 0,
      });
    }

    //Objeto fictisio crossling
    pregunta.result.CROSSELING={
      mensaje:"❌Te estas quedando sin preguntas!",
      link:"/packs"
    }  

    triviaContainer.classList.remove('d-none');

    mostrarPregunta(pregunta);
  }catch(error){
    console.error(error, "Se produjo un error al cargar las preguntas");
    finalizarTrivia();
  }
};

// Mostrar pregunta
function mostrarPregunta(pregunta) {
  preguntaActual.textContent = pregunta.result.PREGUNTA.PREGUNTA;
  puntosObtenidos.textContent = `Puntos: ${pregunta.result.PUNTOS}`;
  contadorPreguntas.textContent = `Pregunta: ${pregunta.result.RESTANTE}/${pregunta.result.TOTAL}`;
  crosselingPacks(pregunta.result.RESTANTE, pregunta.result.TOTAL, pregunta.result.CROSSELING)
  respuestaSeleccionada = null;
  btnEnviar.classList.add('d-none');
  opcionesContainer.innerHTML = '';

  //Combierte en array y les asigna una clave/valor, 
  Object.entries(pregunta.result.PREGUNTA.RESPUESTAS).forEach(([letra, opcion])=> { 
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-danger opcion-btn';
    btn.textContent = ` ${opcion}`;

    btn.addEventListener('click', () => {
      respuestaSeleccionada = letra;
      document.querySelectorAll('#opciones button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      btnEnviar.classList.remove('d-none');
    });

    opcionesContainer.appendChild(btn);
  });
}

// Enviar respuesta
btnEnviar.addEventListener('click', async () => {
  try{  
    //Desactivo el btn mientras esta haciendo el envio
    btnEnviar.disabled= true;
    spinnerSubmit.classList.remove('d-none');

    //Envia respuesta a la API
/*     const url = `${API_URL_TRIVIA}/respuesta/${numeroIngresado}`;
    const res = await fetch(url, {
    method : 'POST',
    headers: {  'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenTrivia}`
     },
    body: JSON.stringify({
      id_trivia: pregunta.result.PREGUNTA.ID_TRIVIA,
      id_pregunta: pregunta.result.PREGUNTA.ID_PREGUNTA,
      respuesta: respuestaSeleccionada,
      ani: numeroIngresado
    })
  });   */
  
  const data = await res.json();
  console.log('data traida:',data)

  await cargarPregunta(data?.result?.PREGUNTA?.ID_PREGUNTA);

  }catch(error){
    console.error(error,"Error al enviar respuesta al servidor");
  } finally{
    spinnerSubmit.classList.add('d-none');
    btnEnviar.disabled = false;
  }
});

// Funcion cerrar modal
function cerrarTrivia(){
  // Mostrar input 
  inputTelefono.classList.remove('d-none');

  triviaContainer.classList.add('d-none');     
  btnIniciarTrivia.classList.add('d-none');
  dataParticipante.classList.add('d-none');  
  crosselingContainer.classList.add('d-none');
  resultadoFinal.classList.add('d-none');

  // Deshabilitar el btn trivia
  btnIniciarTrivia.disabled = false;
}

btnCerrarModal.addEventListener('click', cerrarTrivia);

// Finalizar
function finalizarTrivia({puntosFinales=0, totalRespondido=0}= {}) {

  triviaContainer.classList.add('d-none');
  tituloTrivia.classList.add('d-none');
  resultadoFinal.classList.remove('d-none');

  resultadoFinal.innerHTML = `
    <h3>Trivia finalizada 🎉</h3>
    <p class='mt-4'>Respondiste <strong> ${totalRespondido} preguntas </strong></p>
    <p>Total de puntos obtenidos en la trivia: <strong>${puntosFinales}</strong></p>
    <button class="btn btn-primary mt-3 btn-principal btn-lg" onclick="reiniciarTrivia()">Continuar Respondiendo</button>
  `;
}

// Reiniciar
function reiniciarTrivia() {
  btnIniciarTrivia.classList.add('d-none');
  resultadoFinal.classList.add('d-none');
  triviaContainer.classList.add('d-none');
  inputTelefono.classList.remove('d-none');
}


// Reanudar trivia si hay progreso guardado
window.addEventListener('DOMContentLoaded', () => {
  inputTelefono.classList.remove('d-none');

  // Deshabilitar el botón de iniciar trivia hasta validar
  btnIniciarTrivia.disabled = true;
});

//Crosseling para enviar a la seccion de PACKS
function crosselingPacks(dataCrosseling){
  if(dataCrosseling && dataCrosseling.link && dataCrosseling.mensaje){
    crosselingContainer.classList.remove('d-none');
    crosselingContainer.querySelector('p').innerHTML = `
      ${dataCrosseling.mensaje} 
      <a class='link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-75-hover' href="${dataCrosseling.link}" target='_blank' rel='noopener noreferrer'>Comprá más ahora 👈</a>
    `;
  }else {
    crosselingContainer.classList.add('d-none');
  }
}

// Usar el Numero guardado al recargar la pagina
document.addEventListener("DOMContentLoaded", () => {
  const numeroGuardado = localStorage.getItem("NumeroGuardado");
  if (numeroGuardado) {
    document.getElementById('telefono').value = numeroGuardado;
  }
});

//Flags de la URL
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
