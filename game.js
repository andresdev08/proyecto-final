/* game.js
   Versión corregida — conversión completa Java -> JavaScript
   Mantiene textos y lógica del Java original, nombres unificados.
*/

/* ---------------------------
   Estado global (equivalente a las variables estáticas en Java)
   --------------------------- */
const MAX_REGISTRO = 20;
let registro = new Array(MAX_REGISTRO).fill(null).map(() => [null, null]); // matriz 20x2
let contadorJugadores = 0;

let jugadorActual = "";
let resultadoActual = "";
let partidaRegistrada = false;

/* ---------------------------
   Elementos del DOM
   --------------------------- */
const outputInner = document.getElementById("output-inner");
const optionsArea = document.getElementById("options");
const optionTemplate = document.getElementById("option-template");

/* Sidebar buttons (index.html) */
const btnNew = document.getElementById("btn-new");
const btnCredits = document.getElementById("btn-credits");
const btnAbout = document.getElementById("btn-about");
const btnHow = document.getElementById("btn-how");
const btnRegistry = document.getElementById("btn-registry");

/* Añadir listeners */
btnNew && btnNew.addEventListener("click", iniciarPartida);
btnCredits && btnCredits.addEventListener("click", creditos);
btnAbout && btnAbout.addEventListener("click", sobreElJuego);
btnHow && btnHow.addEventListener("click", comoJugar);
btnRegistry && btnRegistry.addEventListener("click", verRegistro);

/* ---------------------------
   Helpers: mostrar texto y opciones
   --------------------------- */
function mostrarTexto(html) {
  outputInner.innerHTML = html;
  // Llevar enfoque al contenedor para que el usuario vea el inicio del texto
  outputInner.parentElement && (outputInner.parentElement.scrollTop = 0);
}

function clearOptions() {
  optionsArea.innerHTML = "";
}

function crearOpcion(texto, accion) {
  // Usa la plantilla option-template para mantener estilos consistentes
  if (!optionTemplate) {
    // fallback: crear botón manualmente
    const btn = document.createElement("button");
    btn.className = "btn option-btn";
    btn.textContent = texto;
    btn.addEventListener("click", accion);
    optionsArea.appendChild(btn);
    return;
  }
  const tpl = optionTemplate.content.cloneNode(true);
  const btn = tpl.querySelector("button");
  btn.textContent = texto;
  btn.addEventListener("click", accion);
  optionsArea.appendChild(tpl);
}

function mostrarOpciones(arrayOpciones) {
  clearOptions();
  arrayOpciones.forEach(op => crearOpcion(op.texto, op.accion));
}

/* ---------------------------
   MENÚ (equivalente al main Java)
   --------------------------- */
function menuPrincipal() {
  mostrarTexto(`
╔══════════════════════════════════════════════════╗<br>
   🔒 Bienvenido a ESCAPE ROOM POLI 🔑<br>
╚══════════════════════════════════════════════════╝<br><br>
✨ MENÚ PRINCIPAL ✨<br>
Presiona una opción para continuar.
  `);

  mostrarOpciones([
    { texto: "1️ Crear una nueva partida", accion: iniciarPartida },
    { texto: "2️ Ver los créditos", accion: creditos },
    { texto: "3️ Saber de qué se trata el juego", accion: sobreElJuego },
    { texto: "4️ Ver las instrucciones", accion: comoJugar },
    { texto: "5️ Salir (mostrar mensaje)", accion: () => {
        mostrarTexto("👋 Gracias por jugar ESCAPE ROOM POLI. ¡Hasta la próxima aventura!");
        clearOptions();
      }
    },
    { texto: "6️ Ver el registro de jugadores", accion: verRegistro }
  ]);
}

/* ---------------------------
   CRÉDITOS, SOBRE, CÓMO JUGAR
   --------------------------- */
function creditos() {
  mostrarTexto(`🎓 CRÉDITOS 🎓<br>
Universidad: Politécnico Grancolombiano<br>
Estudiante: Juan Andrés Durán Cancelado<br>
Docente: Edna Lucero Triana Salgado<br><br>
1️ Para Volver al menú principal`);
  mostrarOpciones([
    { texto: "Volver al menú", accion: menuPrincipal }
  ]);
}

function comoJugar() {
  mostrarTexto(`
╔════════════════════════════════════════════════════╗<br>
🕹️ CÓMO JUGAR 🕹️<br>
1. Lee atentamente la historia y las opciones en pantalla.<br>
2. En la web: haz clic en el botón correspondiente a tu elección.<br>
3. Cada decisión cambia el rumbo de la aventura.<br>
4. Algunas elecciones llevan a la victoria y otras al fracaso.<br>
5. Si eliges algo inválido, la partida puede terminar.<br>
6. Explora todas las rutas... ¡y diviértete!<br>
╚════════════════════════════════════════════════════╝
  `);
  mostrarOpciones([
    { texto: "Volver al menú", accion: menuPrincipal }
  ]);
}

function sobreElJuego() {
  mostrarTexto(`
╔════════════════════════════════════════════════════╗<br>
📖 SOBRE EL JUEGO 📖<br>
Escape Room Poli es una aventura de texto ambientada<br>
en una antigua pirámide misteriosa. Tu misión es escapar<br>
tomando decisiones correctas y resolviendo acertijos.<br>
Cada elección te acerca a la victoria... o a la derrota.<br>
Piensa bien, porque un error puede dejarte atrapado.<br>
╚════════════════════════════════════════════════════╝
  `);
  mostrarOpciones([
    { texto: "Volver al menú", accion: menuPrincipal }
  ]);
}

/* ---------------------------
   INICIAR PARTIDA: pedir nombre y mostrar puertas
   --------------------------- */
function iniciarPartida() {
  const nombre = window.prompt("👤 Ingresa tu nombre, aventurero:", "");
  jugadorActual = (nombre === null) ? "JugadorAnonimo" : nombre.trim() || "JugadorAnonimo";

  // Reiniciar estado de la partida
  resultadoActual = "";
  partidaRegistrada = false;

  mostrarTexto(`
╔════════════════════════════════════════════════════╗<br>
🏺 Aquí comienza tu aventura...<br>
🏜️ Estás atrapado en una antigua PIRÁMIDE,<br>
🔑 Tu misión es encontrar el tesoro y reunir las llaves<br>
🚪 Solo así podrás salir del templo.<br>
╚════════════════════════════════════════════════════╝<br><br>

╔═══════════════════════════════════════╗<br>
🏺 Apareces en una habitación polvorienta...<br>
🚪 Frente a ti se alzan dos puertas antiguas,<br>
⚖️ Debes elegir sabiamente cuál cruzar...<br>
╚═══════════════════════════════════════╝<br><br>

╔════════════════════════════════════════════════════╗<br>
🚪 Te encuentras frente a dos grandes puertas...<br>
   (1) Cruzar la primera puerta<br>
   (2) Cruzar la segunda puerta<br>
╚════════════════════════════════════════════════════╝
  `);

  mostrarOpciones([
    { texto: "1) Cruzar la primera puerta", accion: primerapuerta },
    { texto: "2) Cruzar la segunda puerta", accion: segundapuerta },
    { texto: "Volver al menú", accion: menuPrincipal }
  ]);
}

/* ---------------------------
   PRIMERA PUERTA (lógica completa adaptada)
   --------------------------- */
function primerapuerta() {
  mostrarTexto(`
╔════════════════════════════════════════════════════════════╗<br>
🔒 Entras a la PRIMERA puerta... la entrada se cierra tras de ti.<br>
⚠️ Los muros comienzan a moverse y a cerrarse lentamente...<br>
🧩 ¡Debes resolver el siguiente ACERTIJO para poder continuar! <br>
Cuánto es? 5*7<br>
╚════════════════════════════════════════════════════════════╝
  `);

  mostrarOpciones([
    { texto: "Responder 35", accion: () => primerapuerta_acertijoRespuesta(35) },
    { texto: "Responder otro número (30)", accion: () => primerapuerta_acertijoRespuesta(30) },
    { texto: "No sé / Volver", accion: () => {
        resultadoActual = "Fuera de juego (acertijo no resuelto)";
        registrarPartida();
        mostrarOpciones([
          { texto: "Volver al menú", accion: menuPrincipal }
        ]);
      }
    }
  ]);
}

function primerapuerta_acertijoRespuesta(valor) {
  if (valor === 35) {
    mostrarTexto(`
╔══════════════════════════════════════════════════════════╗<br>
🎉 ¡Lo lograste! Has resuelto el desafío...<br>
🚪 Frente a ti aparece una nueva PUERTA misteriosa,<br>
✨ brillando como si te invitara a continuar con tu aventura.<br>
╚══════════════════════════════════════════════════════════╝

══════════════════════════════════════════════════════<br>
🔦 Entras en la habitación y la puerta se cierra detrás de ti...<br>
🪓 Frente a tus ojos, sobre una balanza antigua, descansan dos objetos.<br>
   🔮 Un objeto reluciente y enigmático, con un extraño brillo...<br>
   🧸 Un oso de peluche viejo, con una mirada curiosa...<br>
⚖️ La balanza solo te permite elegir UNO... tu destino depende de ello.<br>
══════════════════════════════════════════════════════<br>
👉 Ingresa 1 para tomar el objeto reluciente<br>
👉 Ingresa 2 para tomar el oso de peluche
    `);

    mostrarOpciones([
      {
        texto: "1) Tomar el objeto reluciente",
        accion: () => {
          resultadoActual = "Fuera de juego (trampa del objeto)";
          mostrarTexto(`⚠️ Al tocar el objeto se activa un mecanismo antiguo que te deja aturdido.<br>😵 Quedas fuera de la partida y debes descansar antes de intentar otra vez.`);
          registrarPartida();
          mostrarOpciones([
            { texto: "Volver al menú", accion: menuPrincipal },
            { texto: "Intentar otra vez la primera puerta", accion: primerapuerta }
          ]);
        }
      },
      {
        texto: "2) Tomar el oso de peluche",
        accion: () => {
          mostrarTexto(`
🧸 Tomas el viejo oso de peluche y notas algo curioso en su interior...<br>
🧭 Una brújula oculta aparece, apuntando firmemente hacia una pared.<br>
🧱 Te acercas, presionas un ladrillo suelto y... ¡una entrada secreta se abre ante ti!<br><br>

╔════════════════════════════════════════════════════╗<br>
🪨 Apenas entras, ves una estatua antigua en el centro de la sala.<br>
🙈 No le das importancia y le das la espalda... pero de pronto...<br>
⚠️ La estatua parece cobrar movimiento y se aproxima con intención.<br><br>
👊 Logras reaccionar a tiempo y te preparas para actuar...<br>
⚔️ ¿Cómo reaccionarás?<br>
   (1) Intentar un empujón firme<br>
   (2) Intentar una patada para desequilibrarla<br>
╚════════════════════════════════════════════════════╝
          `);

          mostrarOpciones([
            {
              texto: "1) Empujón firme",
              accion: () => {
                resultadoActual = "Fuera de juego (lesión al empujar)";
                mostrarTexto(`👊 Aciertas un empujón, pero tu mano queda lastimada por el esfuerzo.<br>😖 Quedas debilitado y no puedes continuar, la aventura termina por ahora.`);
                registrarPartida();
                mostrarOpciones([
                  { texto: "Volver al menú", accion: menuPrincipal },
                  { texto: "Intentar otra vez la primera puerta", accion: primerapuerta }
                ]);
              }
            },
            {
              texto: "2) Patada para desequilibrarla",
              accion: () => {
                mostrarTexto(`
🦵 Logras desequilibrar la estatua y esta cae al suelo...<br>
⚠️ Pero no se apaga por completo: se arrastra lentamente hacia ti.<br><br>
⚔️ ¿Qué harás ahora?<br>
   (1) Empujarla con todas tus fuerzas<br>
   (2) Intentar desactivar su mecanismo con un movimiento certero
                `);

                mostrarOpciones([
                  {
                    texto: "1) Empujarla con todas tus fuerzas",
                    accion: () => {
                      mostrarTexto(`
╔══════════════════════════════════════════════════════════════════════════════╗<br>
💥 Con un gran empujón, la estatua se desploma y sus piezas se quedan esparcidas.<br>
✨ ¡Has logrado detenerla!<br>
╚══════════════════════════════════════════════════════════════════════════════╝<br><br>

🔎 Entre los restos de la estatua detectas un dispositivo antiguo con dos cargas y una llave oxidada...<br>
👀 Alrededor de la habitación, tu mirada se detiene en una cerradura incrustada en la pared.<br>
🗝️ Con manos temblorosas usas la llave... y la pared se abre revelando un pasadizo secreto.<br>
🎯 Entras en una sala de precisión, donde una voz antigua resuena en el aire:<br>
🗣️ 'Tienes que derribar 3 jarrones... solo así podrás avanzar.'<br>
                      `);

                      mostrarOpciones([
  {
    texto: "Continuar (ver jarrones)",
    accion: () => {
      mostrarTexto(`
🎯 Frente a ti se alinean 3 jarrones antiguos, iluminados por una luz suave...<br>
🗣️ La voz susurra: 'Elige bien, solo tienes 2 cargas...'<br><br>
¿Qué harás ahora?<br>
   (1) Usar una carga para romper un jarrón.<br>
   (2) Intentar un tiro rebotado para romper 2 jarrones a la vez.<br>
   (3) Guardar las cargas y buscar otra salida...
      `);

      mostrarOpciones([
        {
          texto: "1) Usar una carga para romper un jarrón",
          accion: () => {
            resultadoActual = "Fuera de juego (gas somnífero)";
            mostrarTexto(`🏺 Rompes un jarrón, pero te quedas sin una de las cargas...<br>⚠️ Un mecanismo libera un gas somnífero y te deja aturdido.<br>😴 Quedas fuera de la partida.`);
            registrarPartida();
            mostrarOpciones([
              { texto: "Volver al menú", accion: menuPrincipal },
              { texto: "Intentar otra vez la primera puerta", accion: primerapuerta }
            ]);
          }
        },
        {
          texto: "2) Tiro rebotado para romper 2 jarrones",
          accion: () => {
            mostrarTexto(`🏺 Con una buena técnica rompes dos jarrones con una carga...<br>🌪️ El polvo se levanta en la sala...<br>🗿 Desde las sombras, el faraón de la cámara despierta y avanza lentamente...<br><br>¿Qué harás ahora?<br>   (1) Romper el último jarrón<br>   (2) Usar la carga restante para distraer al guardián`);
            mostrarOpciones([
              {
                texto: "1) Romper el último jarrón",
                accion: () => {
                  resultadoActual = "Victoria (escapó con éxito)";
                  mostrarTexto(`
╔════════════════════════════════════════════════════╗<br>
🚪 Logras abrir una puerta y corres hacia la salida...<br>
🤕 El guardián te alcanza por un momento y quedas magullado, pero llegas a escapar.<br>
🎉 Finalmente, ¡escapas con vida y con muchas historias que contar!<br>
🎊✨🥳 ¡Has superado el desafío! 🥳✨🎊<br>
╚════════════════════════════════════════════════════╝
                  `);
                  registrarPartida();
                  mostrarOpciones([
                    { texto: "Volver al menú", accion: menuPrincipal },
                    { texto: "Ver registro", accion: verRegistro }
                  ]);
                }
              },
              {
                texto: "2) Usar la carga restante para distraer al guardián",
                accion: () => {
                  resultadoActual = "Empate (ambos inmóviles)";
                  mostrarTexto(`🔫 Usas la carga restante y logras retrasar al guardián...<br>🌪️ En el forcejeo, ambos quedan fuera de combate.<br>😞 Tu aventura termina, pero el guardián también queda inmóvil.`);
                  registrarPartida();
                  mostrarOpciones([
                    { texto: "Volver al menú", accion: menuPrincipal },
                    { texto: "Ver registro", accion: verRegistro }
                  ]);
                }
              },
              { texto: "Volver", accion: () => primerapuerta() }
            ]);
          }
        },
        {
          texto: "3) Guardar las cargas y buscar otra salida",
          accion: () => {
            mostrarTexto(`🗿 Decides no usar las cargas...<br>👀 El guardián despierta y se acerca. Tienes una última oportunidad:<br>   (1) Intentar una distracción<br>   (2) Mantenerte oculto y esperar`);
            mostrarOpciones([
              {
                texto: "1) Intentar una distracción",
                accion: () => {
                  mostrarTexto(`🎭 Haces una distracción ingeniosa y el guardián duda...<br>🧩 Para continuar debes resolver un enigma:<br><br>❓ 'Tiene cuatro patas por la mañana, dos patas al mediodía, y tres patas por la tarde...' <br>   (1) El perro<br>   (2) El humano<br>   (3) El pulpo`);
                  mostrarOpciones([
                    {
                      texto: "1) El perro",
                      accion: () => {
                        resultadoActual = "Fuera de juego (respuesta incorrecta)";
                        mostrarTexto(`╔════════════════════════════════════════════════════╗<br>❌ Has elegido mal...<br>😞 El guardián detecta el error y tu aventura termina aquí.<br>╚════════════════════════════════════════════════════╝`);
                        registrarPartida();
                        mostrarOpciones([{ texto: "Volver al menú", accion: menuPrincipal }]);
                      }
                    },
                    {
                      texto: "2) El humano",
                      accion: () => {
                        resultadoActual = "Victoria (resolvió el enigma)";
                        mostrarTexto(`╔════════════════════════════════════════════════════╗<br>🧩 ¡Has logrado descifrar el enigma!<br>✨ Aprovechas la confusión y te escabulles hacia la salida.<br>🎉 ¡Has sobrevivido al desafío y alcanzado la victoria!<br>╚════════════════════════════════════════════════════╝`);
                        registrarPartida();
                        mostrarOpciones([
                          { texto: "Volver al menú", accion: menuPrincipal },
                          { texto: "Ver registro", accion: verRegistro }
                        ]);
                      }
                    },
                    {
                      texto: "3) El pulpo",
                      accion: () => {
                        resultadoActual = "Fuera de juego (respuesta incorrecta)";
                        mostrarTexto(`╔════════════════════════════════════════════════════╗<br>❌ Has elegido mal...<br>😞 El guardián detecta el error y tu aventura termina aquí.<br>╚════════════════════════════════════════════════════╝`);
                        registrarPartida();
                        mostrarOpciones([{ texto: "Volver al menú", accion: menuPrincipal }]);
                      }
                    },
                    { texto: "Volver", accion: () => primerapuerta() }
                  ]);
                }
              },
              {
                texto: "2) Mantenerte oculto y esperar",
                accion: () => {
                  resultadoActual = "Fuera de juego (esperó demasiado)";
                  mostrarTexto(`⏳ Esperas y el guardián llama a sus aliados...<br>😔 Acabas siendo superado por los eventos y la partida termina.`);
                  registrarPartida();
                  mostrarOpciones([{ texto: "Volver al menú", accion: menuPrincipal }]);
                }
              },
              { texto: "Volver", accion: () => primerapuerta() }
            ]);
          }
        }
      ]);
    }
  }
]);
                      }
                    },
                    {
                      texto: "2) Intentar desactivar su mecanismo con un movimiento certero",
                      accion: () => {
                        resultadoActual = "Fuera de juego (maneobra fallida)";
                        mostrarTexto(`😵 Intentaste una maniobra arriesgada pero fallaste.<br>😖 Te lastimas y quedas fuera de la aventura.`);
                        registrarPartida();
                        mostrarOpciones([
                          { texto: "Volver al menú", accion: menuPrincipal },
                          { texto: "Intentar otra vez la primera puerta", accion: primerapuerta }
                        ]);
                      }
                    },
                    { texto: "Volver", accion: () => primerapuerta() }
                  ]);
              }
            }
          ]);
        }
      }
    ]);
  } else {
    // fallo en el acertijo inicial
    resultadoActual = "Fuera de juego (acertijo no resuelto)";
    mostrarTexto("!Has muerto!<br><br>😔 No resolviste el acertijo y la sala te deja fuera de la partida.");
    registrarPartida();
    mostrarOpciones([
      { texto: "Volver al menú", accion: menuPrincipal },
      { texto: "Intentar otra vez la primera puerta", accion: primerapuerta }
    ]);
  }
}


/* ---------------------------
   SEGUNDA PUERTA (lógica completa adaptada)
   --------------------------- */
function segundapuerta() {
  mostrarTexto(`
╔════════════════════════════════════════════════════════════╗<br>
⚠️ Al abrir la SEGUNDA puerta, un personaje anciano aparece...<br>
🔑 Te ofrece la llave para la siguiente habitación o...<br>
🧩 Resolver un ACERTIJO que te llevará más cerca de la salida.<br>
⚠️ Pero cuidado: si fallas, podrías quedar atrapado.<br>
╚════════════════════════════════════════════════════════════╝<br><br>

(1) Tomar llave <br>(2) Resolver el acertijo
  `);

  mostrarOpciones([
    { texto: "1) Tomar llave", accion: segundapuerta_tomarLlave },
    { texto: "2) Resolver el acertijo", accion: segundapuerta_resolverAcertijo },
    { texto: "Volver al menú", accion: menuPrincipal }
  ]);
}

function segundapuerta_tomarLlave() {
  mostrarTexto(`
╔════════════════════════════════════════════════════╗<br>
🗝️ Tomas la llave misteriosa...<br>
De pronto, el suelo tiembla y las paredes se transforman.<br>
🥊 Te encuentras en un ring antiguo rodeado de antorchas.<br>
⚠️ Un guardián esquelético se para frente a ti, listo para un reto.<br>
╚════════════════════════════════════════════════════╝<br><br>

🥊 El guardián se pone en guardia frente a ti...<br>
⚔️ ¿Cómo actuarás?<br>
   (1) Avanzar con fuerza 💥<br>
   (2) Esperar la oportunidad ⏳
  `);

  mostrarOpciones([
    {
      texto: "1) Avanzar con fuerza",
      accion: () => {
        resultadoActual = "Fuera de juego (lesión por atacar)";
        mostrarTexto(`👊 Intentas un golpe fuerte pero te lastimas en el intento...<br>😖 Quedas fuera de la partida por la lesión.`);
        registrarPartida();
        mostrarOpciones([{ texto: "Volver al menú", accion: menuPrincipal }]);
      },
    },
    {
      texto: "2) Esperar la oportunidad",
      accion: () => {
        mostrarTexto(`
⏳ Esperas pacientemente y aprovechas el momento...<br>
👊 Logras desarmar al guardián y entre sus restos cae una llave brillante.<br><br>

╔════════════════════════════════════════════════════╗<br>
👀 Entre los sacos alrededor notas algo extraño...<br>
🔒 Una escotilla oculta aparece con una cerradura misteriosa.<br>
✨ Logras abrirla y descubres la SALA DEL TESORO.<br>
💰 Tomas todo lo que puedes, pero debes decidir con sabiduría:<br>
   (1) Llevar solo una parte del tesoro junto con una brújula que señala la salida<br>
   (2) Llevar TODO el tesoro, pero perder la referencia hacia la salida...<br>
╚════════════════════════════════════════════════════╝
        `);

        mostrarOpciones([
          {
            texto: "1) Llevar parte + brújula",
            accion: () => {
              mostrarTexto(`¡No cantes victoria aún!<br>📚 Sigues el camino marcado por la brújula y descubres un viejo PUZZLE escondido entre las piedras.<br>🧩 Con paciencia lo armas pieza por pieza... hasta que un enigma aparece frente a ti.<br><br>❓ El enigma pregunta sobre la sintaxis de un SWITCH en Java:<br>   ¿Con qué se cierra un 'case' para que no se ejecute todo?<br>   (1) break;<br>   (2) stop;<br>   (3) end;`);

              mostrarOpciones([
                {
                  texto: "1) break;",
                  accion: () => {
                    resultadoActual = "Victoria (escapó con tesoro parcial)";
                    mostrarTexto(`
╔════════════════════════════════════════════════════╗<br>
✅ ¡Respuesta correcta!<br>
🎉 Has logrado encontrar la salida,<br>
🤴 el anciano te bendice por tu sabiduría.<br>
🥳✨ ¡Victoria alcanzada! ✨🥳<br>
╚════════════════════════════════════════════════════╝
<br>
🚪 Una puerta secreta se abre ante ti... justo cuando una jauría de sabuesos irrumpe en la sala.<br>
🐕 Gruñen con furia, bloqueando tu salida mientras se abalanzan hacia ti.<br>
💰 Debes tomar una decisión difícil en este instante:
                    `);

                    mostrarOpciones([
                      {
                        texto: "👉 Dejar 25% del tesoro y escapar con vida",
                        accion: () => {
                          resultadoActual = "Victoria (escapó con tesoro parcial)";
                          mostrarTexto(`🎉✨ ¡FELICIDADES! ✨🎉<br>🚪 Has escapado de la pirámide en una sola pieza...<br>💰 Llevas contigo un tesoro suficiente para vivir muchos años con tranquilidad.<br>🎊 ¡Has superado el ESCAPE ROOM POLI con éxito! 🎊`);
                          registrarPartida();
                          mostrarOpciones([
                            { texto: "Volver al menú", accion: menuPrincipal },
                            { texto: "Ver registro", accion: verRegistro },
                          ]);
                        },
                      },
                      {
                        texto: "👉 Conservar 25% y pagar con un brazo",
                        accion: () => {
                          resultadoActual = "Victoria con lesión (escapó lastimado)";
                          mostrarTexto(`🎉✨ ¡FELICIDADES! ✨🎉<br>🚪 Has escapado de la pirámide, aunque no saliste ileso...<br>💰 Conservaste tu tesoro, suficiente para vivir muchos años con riqueza.<br>🩸 Sin embargo, en tu huida los sabuesos lograron arrancarte un brazo.<br>🎊 ¡Has superado el ESCAPE ROOM POLI, aunque marcado para siempre! 🎊`);
                          registrarPartida();
                          mostrarOpciones([
                            { texto: "Volver al menú", accion: menuPrincipal },
                            { texto: "Ver registro", accion: verRegistro },
                          ]);
                        },
                      },
                    ]);
                  },
                },
                {
                  texto: "2) stop;",
                  accion: () => {
                    resultadoActual = "Fuera de juego (respuesta errónea)";
                    mostrarTexto(`╔════════════════════════════════════════════════════╗<br>❌ Respuesta incorrecta...<br>😱 El anciano se enfurece con tu ignorancia en Java.<br>💀 Una maldición cae sobre ti y tu aventura termina aquí.<br>╚════════════════════════════════════════════════════╝`);
                    registrarPartida();
                    mostrarOpciones([{ texto: "Volver al menú", accion: menuPrincipal }]);
                  },
                },
                {
                  texto: "3) end;",
                  accion: () => {
                    resultadoActual = "Fuera de juego (respuesta errónea)";
                    mostrarTexto(`╔════════════════════════════════════════════════════╗<br>❌ Respuesta incorrecta...<br>😱 El anciano se enfurece con tu ignorancia en Java.<br>💀 Una maldición cae sobre ti y tu aventura termina aquí.<br>╚════════════════════════════════════════════════════╝`);
                    registrarPartida();
                    mostrarOpciones([{ texto: "Volver al menú", accion: menuPrincipal }]);
                  },
                },
              ]);
            },
          },
          {
            texto: "2) Llevar TODO el tesoro",
            accion: () => {
              resultadoActual = "Fuera de juego (perdió orientación)";
              mostrarTexto(`🚶‍♂️ Sales con todo el tesoro, pero sin brújula ni dirección...<br>🤔 Al perder la orientación, acabas atrapado en un corredor sin salida y la aventura termina por ahora.`);
              registrarPartida();
              mostrarOpciones([{ texto: "Volver al menú", accion: menuPrincipal }]);
            },
          },
        ]);
      },
    },
  ]);
}

/* ---------------------------
   Resolver acertijo segunda puerta (variante 'resolverAcertijo')
   --------------------------- */
function segundapuerta_resolverAcertijo() {
  mostrarTexto(`
╔════════════════════════════════════════════════════╗<br>
🧩 El anciano te desafía con un enigma milenario...<br>
❓ "Vuelo sin alas, lloro sin ojos,<br>    siempre me ves en el cielo y desaparezco con el sol."<br>
⚔️ ¿Cuál es tu respuesta?<br>
   (1) Una nube ☁️<br>
   (2) El viento 🌪️<br>
   (3) La sombra 🌑<br>
╚════════════════════════════════════════════════════╝
  `);

  mostrarOpciones([
    { texto: "1) Una nube ☁️", accion: () => {
        mostrarTexto(`✅ ¡Respuesta correcta!<br>☁️ La nube se disipa y el anciano se muestra complacido...<br>🚪 Una puerta secreta se abre frente a ti, invitándote a continuar.<br><br>¡No cantes victoria aun!<br>📚 Nuevamente tu conocimiento es puesto a prueba...<br>🤔 Esta vez te preguntan sobre la sintaxis de un SWITCH en Java.<br>❓ ¿Con qué se cierra un 'case' para que no se ejecute todo?<br>   (1) break;<br>   (2) stop;<br>   (3) end;`);
        mostrarOpciones([
          { texto: "1) break;", accion: () => {
              resultadoActual = "Victoria (respuestas correctas)";
              mostrarTexto(`✅ ¡Respuesta correcta!<br>🎉 Has completado el reto y encuentras la salida.<br>🥳✨ ¡Victoria alcanzada! ✨🥳`);
              registrarPartida();
              mostrarOpciones([{ texto: "Volver al menú", accion: menuPrincipal }]);
            }
          },
          { texto: "2) stop;", accion: () => {
              resultadoActual = "Fuera de juego (respuesta errónea)";
              mostrarTexto(`❌ Respuesta incorrecta...<br>😱 El anciano se enfurece con tu ignorancia en Java.<br>💀 Una maldición cae sobre ti y tu aventura termina aquí.`);
              registrarPartida();
              mostrarOpciones([{ texto: "Volver al menú", accion: menuPrincipal }]);
            }
          },
          { texto: "3) end;", accion: () => {
              resultadoActual = "Fuera de juego (respuesta errónea)";
              mostrarTexto(`❌ Respuesta incorrecta...<br>😱 El anciano se enfurece con tu ignorancia en Java.<br>💀 Una maldición cae sobre ti y tu aventura termina aquí.`);
              registrarPartida();
              mostrarOpciones([{ texto: "Volver al menú", accion: menuPrincipal }]);
            }
          }
        ]);
      }
    },
    { texto: "2) El viento 🌪️", accion: () => {
        resultadoActual = "Fuera de juego (acertijo fallido)";
        mostrarTexto(`❌ Has fallado...<br>⚠️ El anciano activa un mecanismo que te deja atrapado.<br>😔 Quedas fuera de la partida por ahora.`);
        registrarPartida();
        mostrarOpciones([{ texto: "Volver al menú", accion: menuPrincipal }]);
      }
    },
    { texto: "3) La sombra 🌑", accion: () => {
        resultadoActual = "Fuera de juego (acertijo fallido)";
        mostrarTexto(`❌ Has fallado...<br>⚠️ El anciano activa un mecanismo que te deja atrapado.<br>😔 Quedas fuera de la partida por ahora.`);
        registrarPartida();
        mostrarOpciones([{ texto: "Volver al menú", accion: menuPrincipal }]);
      }
    },
    { texto: "Volver", accion: () => segundapuerta() }
  ]);
}

/* ---------------------------
   Registrar partida (matriz 20x2 equivalente)
   --------------------------- */
function registrarPartida() {
  if (jugadorActual !== "" && !partidaRegistrada) {
    if (!resultadoActual || resultadoActual.trim() === "") {
      resultadoActual = "Partida finalizada";
    }
    if (contadorJugadores < registro.length) {
      registro[contadorJugadores][0] = jugadorActual;
      registro[contadorJugadores][1] = resultadoActual;
      contadorJugadores++;
    } else {
      // si se llena el registro, no agregamos (igual que versión Java original)
    }
    partidaRegistrada = true;
  }
}

/* ---------------------------
   Mostrar registro (igual que verRegistro en Java)
   --------------------------- */
function verRegistro() {
  if (contadorJugadores === 0) {
    mostrarTexto("📜 REGISTRO DE JUGADORES 📜<br><br>⚠️ No hay jugadores registrados aún.");
    mostrarOpciones([{ texto: "Volver al menú", accion: menuPrincipal }]);
    return;
  }
  let html = "📜 REGISTRO DE JUGADORES 📜<br><br>";
  for (let i = 0; i < contadorJugadores; i++) {
    const nombre = registro[i][0] || "Anon";
    const res = registro[i][1] || "Partida finalizada";
    html += `${i + 1}. ${nombre} - ${res}<br>`;
  }
  mostrarTexto(html);
  mostrarOpciones([{ texto: "Volver al menú", accion: menuPrincipal }]);
}

/* ---------------------------
   Inicializar menú al cargar
   --------------------------- */
menuPrincipal();
