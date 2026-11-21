const tab = document.getElementById('tab');
const tabTexto = document.getElementById('tabTexto');

function alternarMenu(abrir){
  const abierto = abrir ?? !document.body.classList.contains('abierto');
  document.body.classList.toggle('abierto', abierto);
  tab.setAttribute('aria-expanded', abierto);
  tabTexto.textContent = abierto ? 'Ocultar Juegos' : 'Desplegar Juegos';
  document.querySelector('main').inert = abierto;
  document.querySelector('nav').inert = abierto;
  (abierto ? document.getElementById('cerrar') : tab).focus();
}
tab.addEventListener('click', () => alternarMenu());
document.getElementById('cerrar').addEventListener('click', () => alternarMenu(false));
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (modal.classList.contains('ver')) cerrarModal(); else alternarMenu(false);
});

// ---------- Ventana para minijuegos ----------
const modal = document.getElementById('modal'), mTit = document.getElementById('mTitulo'), mCont = document.getElementById('mCont');
const paisaje = document.getElementById('cajon');
let quienAbrio, parar = () => {};
function abrirModal(titulo, juego, boton){
  quienAbrio = boton; mTit.textContent = titulo; juego();
  modal.classList.add('ver'); modal.scrollTop = 0; paisaje.inert = true;
  document.getElementById('mCerrar').focus();
}
function cerrarModal(){
  parar();
  modal.classList.remove('ver'); paisaje.inert = false; if (quienAbrio) quienAbrio.focus();
}
document.getElementById('mCerrar').onclick = cerrarModal;
const mezclar = lista => [...lista].sort(() => Math.random() - .5);
const $ = id => document.getElementById(id);

// ---------- Juego 1: Componentes a la orden ----------
const COSAS = [
  {e:'🛢️', n:'Aceite de motor', mal:1, c:['Hidrocarburos'], t:'Los hidrocarburos no se mezclan con el agua: forman una capa que impide que llegue oxígeno a peces y plantas.'},
  {e:'🧴', n:'Detergente', mal:1, c:['Fosfatos','Tensioactivos'], t:'Los fosfatos alimentan a las algas en exceso, y estas gastan el oxígeno del agua.'},
  {e:'🔋', n:'Pila', mal:1, c:['Plomo','Cadmio','Mercurio'], t:'Según el tipo, las pilas tienen metales pesados: son tóxicos y no desaparecen, se quedan en el agua.'},
  {e:'🍃', n:'Hoja', mal:0, c:['Celulosa','Agua'], t:'Una hoja es materia natural y se descompone sin soltar químicos dañinos.'},
  {e:'🪨', n:'Piedra', mal:0, c:['Minerales'], t:'Una piedra es inerte: no se disuelve ni reacciona con el agua.'},
  {e:'🧊', n:'Hielo', mal:0, c:['H₂O'], t:'El hielo también es H₂O (agua congelada), por eso es compatible.'}
];
function juego1(){
  mCont.innerHTML = `<p>Elige un objeto y colócalo en el charco. ¿Qué le pasa al agua?</p>
    <div class="charco" id="charco"></div><div id="res"></div><div class="fila" id="objs"></div>
    <div class="fila"><button class="btn amar" id="limpia">Limpiar charco</button></div>`;
  const charco = $('charco'), res = $('res');
  const agua = () => { charco.className = 'charco'; charco.textContent = 'H₂O '.repeat(18); res.innerHTML = ''; };
  agua();
  COSAS.forEach(o => {
    const b = document.createElement('button');
    b.className = 'btn'; b.textContent = o.e + ' ' + o.n;
    b.onclick = () => {
      charco.className = 'charco' + (o.mal ? ' mal' : '');
      charco.innerHTML = o.c.map(x => `<span class="chip ${o.mal ? 'mal' : ''}">${x}</span>`).join('') + '<span>H₂O H₂O H₂O</span>';
      res.innerHTML = `<div class="msg ${o.mal ? 'mal' : 'bien'}">${o.mal ? '❌ ¡Daña el agua!' : '✅ No daña el agua'}<br>${o.t}</div>`;
    };
    $('objs').appendChild(b);
  });
  $('limpia').onclick = agua;
}

// ---------- Juego 2: ¿Esto está mal? ----------
const FRASES = [
  ['Cerrar la llave mientras te cepillas los dientes.', 1, 'Así ahorras muchos litros de agua.'],
  ['Tirar el aceite de cocina usado por el fregadero.', 0, 'El aceite contamina el agua y tapa las tuberías.'],
  ['Regar las plantas temprano o al atardecer.', 1, 'Con menos sol, el agua se evapora menos.'],
  ['Tirar toallitas y pañuelos al inodoro.', 0, 'Tapan el drenaje y contaminan el agua.'],
  ['Reparar una llave que gotea.', 1, 'Un goteo constante desperdicia mucha agua con el tiempo.'],
  ['Lavar el coche con la manguera abierta todo el tiempo.', 0, 'Se gasta mucha más agua que con una cubeta.'],
  ['Juntar agua de lluvia para regar o limpiar.', 1, 'Es agua que se aprovecha en lugar de desperdiciarse.'],
  ['Tirar basura al río o a la coladera.', 0, 'La basura contamina el agua y daña a los seres vivos.']
];
function juego2(){
  const lista = mezclar(FRASES); let i = 0, pts = 0;
  function mostrar(){
    if (i >= lista.length){
      mCont.innerHTML = `<p style="text-align:center;font-size:1.3rem;font-weight:700">Acertaste ${pts} de ${lista.length} 🎉</p><div class="fila"><button class="btn verde" id="otra">Jugar otra vez</button></div>`;
      $('otra').onclick = juego2; return;
    }
    const [texto, bien, porque] = lista[i];
    mCont.innerHTML = `<p>Pregunta ${i + 1} de ${lista.length}</p>
      <p style="font-size:1.25rem;font-weight:700;text-align:center">“${texto}”</p>
      <div class="fila"><button class="btn verde" data-r="1">✅ Está bien</button><button class="btn rojo" data-r="0">❌ Está mal</button></div><div id="res"></div>`;
    mCont.querySelectorAll('[data-r]').forEach(b => b.onclick = () => {
      const ok = Number(b.dataset.r) === bien;
      if (ok) pts++;
      mCont.querySelectorAll('[data-r]').forEach(x => x.disabled = true);
      $('res').innerHTML = `<div class="msg ${ok ? 'bien' : 'mal'}">${ok ? '¡Correcto!' : 'Incorrecto.'} ${porque}</div><div class="fila"><button class="btn" id="sig">Siguiente</button></div>`;
      $('sig').onclick = () => { i++; mostrar(); };
    });
  }
  mostrar();
}

// ---------- Juego 3: ¡¿QUÉ HAGO?! ----------
const SITUACIONES = [
  ['Hay una llave goteando en la escuela.',
    ['Cerrarla bien', 'Avisar a un adulto del problema', 'Poner un recipiente para reutilizar el agua'],
    ['Ignorarla: es poquito', 'Abrirla más para jugar', 'Dejarla así, alguien más la arreglará']],
  ['Un vecino lava su patio con la manguera y el agua corre a la calle.',
    ['Decirle amablemente que barra primero', 'Sugerirle usar una cubeta', 'Dar el ejemplo cuidando el agua en tu casa'],
    ['Echarle más agua para ayudarle', 'Hacer lo mismo en tu casa', 'Ignorarlo']],
  ['Ves basura y aceite junto a un arroyo.',
    ['Avisar a la autoridad o a un adulto', 'Recoger la basura con ayuda de un adulto', 'Explicar a tus vecinos por qué no se debe tirar'],
    ['Tirar tu basura también', 'Echar el aceite a la coladera', 'Irte, no pasa nada']]
];
function juego3(){
  let i = 0, pts = 0;
  function mostrar(){
    if (i >= SITUACIONES.length){
      mCont.innerHTML = `<p style="text-align:center;font-size:1.3rem;font-weight:700">Elegiste bien ${pts} de ${SITUACIONES.length * 3} acciones 🎉</p><div class="fila"><button class="btn verde" id="otra">Jugar otra vez</button></div>`;
      $('otra').onclick = juego3; return;
    }
    const [situacion, ayudan, empeoran] = SITUACIONES[i];
    const opciones = mezclar([...ayudan.map(t => [t, 1]), ...empeoran.map(t => [t, 0])]);
    mCont.innerHTML = `<p style="font-size:1.2rem;font-weight:700;text-align:center">Situación ${i + 1}: ${situacion}</p>
      <p>Elige las <b>3 acciones que ayudan</b>.</p><div id="ops"></div>
      <div class="fila"><button class="btn" id="chk" disabled>Comprobar</button></div><div id="res"></div>`;
    const lista = $('ops'), chk = $('chk');
    opciones.forEach(([texto, ayuda]) => {
      const b = document.createElement('button');
      b.className = 'opc'; b.textContent = texto; b.dataset.v = ayuda;
      b.onclick = () => {
        const elegidas = lista.querySelectorAll('.sel').length;
        if (!b.classList.contains('sel') && elegidas >= 3) return;
        b.classList.toggle('sel');
        chk.disabled = lista.querySelectorAll('.sel').length !== 3;
      };
      lista.appendChild(b);
    });
    chk.onclick = () => {
      let aciertos = 0;
      lista.querySelectorAll('.opc').forEach(b => {
        const elegida = b.classList.contains('sel'), ayuda = b.dataset.v === '1';
        if (elegida && ayuda) aciertos++;
        b.disabled = true; b.classList.remove('sel');
        if (ayuda) b.classList.add('ok'); else if (elegida) b.classList.add('no');
      });
      pts += aciertos;
      $('res').innerHTML = `<div class="msg ${aciertos === 3 ? 'bien' : 'mal'}">Acertaste ${aciertos} de 3. En verde están las acciones que ayudan.</div>`;
      chk.textContent = i < SITUACIONES.length - 1 ? 'Siguiente situación' : 'Ver resultado';
      chk.onclick = () => { i++; mostrar(); };
    };
  }
  mostrar();
}

// ---------- Sol: por qué existe el ODS 6 y gráficas ----------
function grafica(id, xm, ym, rectas, puntos, ejeX, ejeY){
  const W = 320, H = 210, m = 34;
  const X = x => m + x / xm * (W - m - 12), Y = y => H - m - y / ym * (H - m - 14);
  let s = '';
  for (let k = 0; k <= 5; k++){
    const x = k * xm / 5, y = k * ym / 5;
    s += `<line x1="${X(x)}" y1="${Y(0)}" x2="${X(x)}" y2="${Y(ym)}" stroke="#d5e5f7"/><text x="${X(x)}" y="${H - m + 13}" font-size="9" text-anchor="middle">${+x.toFixed(1)}</text>`;
    s += `<line x1="${X(0)}" y1="${Y(y)}" x2="${X(xm)}" y2="${Y(y)}" stroke="#d5e5f7"/><text x="${m - 4}" y="${Y(y) + 3}" font-size="9" text-anchor="end">${+y.toFixed(1)}</text>`;
  }
  s += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(xm)}" y2="${Y(0)}" stroke="#0b2f6b" stroke-width="2"/><line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(ym)}" stroke="#0b2f6b" stroke-width="2"/>`;
  rectas.forEach(r => {
    const yFin = r.m * xm + r.b;
    s += `<line x1="${X(0)}" y1="${Y(r.b)}" x2="${X(xm)}" y2="${Y(yFin)}" stroke="${r.c}" stroke-width="3"/>`;
    if (r.n) s += `<text x="${X(xm) - 4}" y="${Y(yFin) - 5}" font-size="12" font-weight="700" fill="${r.c}" text-anchor="end">${r.n}</text>`;
  });
  puntos.forEach(p => s += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="4.5" fill="#FF1A1A" stroke="#fff"/>`);
  s += `<text x="${W - 12}" y="${H - 3}" font-size="10" text-anchor="end">${ejeX}</text><text x="${m}" y="9" font-size="10">${ejeY}</text>`;
  $(id).innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfica">${s}</svg>`;
}
function info(){
  mCont.innerHTML = `<p>El ODS 6 es uno de los 17 Objetivos de Desarrollo Sostenible que los países de la ONU acordaron en 2015 para lograrse en 2030. Se creó porque millones de personas en el mundo todavía no tienen agua potable segura ni baños y servicios de higiene adecuados, y porque el agua contaminada o desperdiciada afecta la salud, los ríos y los seres vivos.</p>
    <p>Su meta es que todas las personas tengan agua limpia y saneamiento, y que cuidemos el agua y sus ecosistemas. Estas gráficas muestran problemas del agua con matemáticas (los valores son ejemplos para practicar).</p>
    <h3>1. Recta en el plano cartesiano</h3><div class="graf" id="g1"></div>
    <p>Una llave que gotea pierde 10 litros por día (ejemplo). La recta y = 10x muestra los litros perdidos (y) después de x días: en 5 días se pierden 50 litros.</p>
    <h3>2. Rectas paralelas y perpendiculares</h3><div class="graf" id="g2"></div>
    <p>A y B son paralelas: tienen la misma pendiente (2), como dos colonias cuyo consumo crece al mismo ritmo aunque una empiece con más. C es perpendicular a ellas: su pendiente es −1/2, porque 2 × (−1/2) = −1.</p>
    <h3>3. Modelos lineales</h3><div class="graf" id="g3"></div>
    <p>Un tanque con 100 litros tiene una fuga de 8 litros por hora. El modelo y = −8x + 100 da los litros que quedan después de x horas: en 5 horas quedan 60 litros y se vacía en 12.5 horas.</p>`;
  grafica('g1', 10, 100, [{m:10, b:0, c:'#2F6FE0'}], [[2,20],[5,50]], 'días', 'litros');
  grafica('g2', 10, 30, [{m:2, b:2, c:'#2F6FE0', n:'A'}, {m:2, b:8, c:'#178A3A', n:'B'}, {m:-0.5, b:25, c:'#FF1A1A', n:'C'}], [], 'x', 'y');
  grafica('g3', 10, 100, [{m:-8, b:100, c:'#7B3FE4'}], [[0,100],[5,60],[10,20]], 'horas', 'litros');
}

// ---------- Juego 4: Recorre la casa ----------
const LUGARES = [
  ['🚿', 'Baño', 'La regadera gasta alrededor de 9 litros por minuto (ejemplo): un baño de 5 minutos usa mucho menos que uno de 15. Cierra la regadera mientras te enjabonas. Para saber si el escusado tiene fuga, echa unas gotas de colorante en el tanque: si el color aparece en la taza sin jalar, hay fuga.', 'Báñate en 5 minutos y avisa en casa si ves una fuga.'],
  ['🍳', 'Cocina', 'Lavar trastes con la llave abierta gasta mucho más que enjabonarlos en una tina y enjuagar rápido. El aceite usado nunca va al fregadero: un solo litro puede contaminar cientos o miles de litros de agua. Se guarda en una botella y se lleva a un centro de acopio.', 'Junta el aceite usado en una botella y pide que lo lleven a un centro de acopio.'],
  ['🌳', 'Jardín', 'Si riegas temprano o al atardecer, el sol evapora menos agua. Una cubeta o regadera gasta menos que una manguera abierta, y el agua de lluvia que juntas sirve para regar sin gastar agua potable.', 'Ayuda a regar con cubeta en horas frescas y junta agua de lluvia.'],
  ['🧺', 'Patio y lavandería', 'La lavadora ahorra agua cuando se usa llena. Para limpiar el patio conviene barrer primero y trapear con una cubeta, en lugar de lavarlo con la manguera. El agua del enjuague se puede reutilizar para el escusado.', 'Barre en lugar de usar manguera y reutiliza el agua del enjuague.'],
  ['🏘️', 'Calle y arroyo', 'La coladera no es un basurero: lo que cae va a ríos y arroyos y contamina el agua de los seres vivos. Si ves una fuga en la calle o en tu escuela, avisa a un adulto para que reporte a la autoridad del agua de tu localidad.', 'Avisa de las fugas y no tires basura en la calle ni en la coladera.']
];
function juego4(){
  const vistos = new Set();
  mCont.innerHTML = `<p>Recorre la casa y sus alrededores. Toca cada lugar para descubrir cómo cuidar el agua ahí.</p><div class="rejilla" id="rej"></div><div id="res"></div><p id="prog" style="text-align:center;font-weight:700">Lugares visitados: 0 de ${LUGARES.length}</p><div id="fin"></div>`;
  LUGARES.forEach(([e, n, txt, mision], i) => {
    const b = document.createElement('button'); b.className = 'lugar'; b.innerHTML = `<span style="font-size:1.8rem">${e}</span><br>${n}`;
    b.onclick = () => {
      vistos.add(i); b.classList.add('visto');
      $('res').innerHTML = `<div class="ficha"><b>${e} ${n}</b>${txt}<br><br>👉 <b style="display:inline">Tu misión:</b> ${mision}</div>`;
      $('prog').textContent = `Lugares visitados: ${vistos.size} de ${LUGARES.length}`;
      if (vistos.size === LUGARES.length) $('fin').innerHTML = `<div class="msg bien">¡Recorriste todo! Ya sabes cómo cuidar el agua en cada rincón. 🎉</div><div class="fila"><button class="btn verde" id="otra">Recorrer otra vez</button></div>`, $('otra').onclick = juego4;
    };
    $('rej').appendChild(b);
  });
}

// ---------- Juego 5: Agua segura paso a paso ----------
const PASOS = [
  {t: 'Si el agua se ve sucia', o: [['Dejarla reposar y colarla con una tela limpia', 'Así se quitan la tierra y las basuritas. Pero ojo: los microbios son tan pequeños que siguen ahí aunque el agua se vea más clara.', '🦠 🦠 🦠', '#CFE0EE']]},
  {t: 'Eliminar los microbios (elige una forma)', o: [
    ['Hervirla 1 minuto (con ayuda de un adulto)', 'Hervir mata los microbios. En lugares muy altos se hierve más tiempo. Ambas formas funcionan: no hace falta usar las dos.', '✨', '#BFEFFF'],
    ['Ponerle cloro: 2 gotas por litro y esperar 30 minutos', 'Se usa cloro de casa sin aroma ni aditivos, siempre con un adulto. Hay que mezclar bien y esperar antes de beber. Ambas formas funcionan: no hace falta usar las dos.', '✨', '#BFEFFF']]},
  {t: 'Guardarla bien', o: [['En un recipiente limpio y con tapa', 'Así no se vuelve a contaminar. Y antes de servirla, lávate las manos con agua y jabón: la higiene también es parte del ODS 6.', '✅ Agua segura', '#9FE3FF']]}
];
function juego5(){
  mCont.innerHTML = `<p>Prepara agua para beber siguiendo los pasos con un adulto. En cada paso descubrirás <b>por qué</b> se hace. (Esto es útil cuando no se sabe si el agua es segura; si tienes agua potable, no hace falta.)</p><div class="vaso" id="vaso">🦠 🌱 🦠</div><div id="ops"></div><div id="res"></div>`;
  const vaso = $('vaso');
  (function paso(i){
    $('ops').innerHTML = `<h3>Paso ${i + 1}: ${PASOS[i].t}</h3>`;
    PASOS[i].o.forEach(([txt, info, v, bg]) => {
      const b = document.createElement('button'); b.className = 'opc'; b.textContent = txt;
      b.onclick = () => {
        vaso.textContent = v; vaso.style.background = bg; $('res').innerHTML = `<div class="ficha">${info}</div>`;
        if (i + 1 < PASOS.length) return paso(i + 1);
        $('ops').innerHTML = ''; $('res').innerHTML += `<div class="msg bien">¡Agua lista para beber! Recuerda: el agua que se ve limpia puede tener microbios, por eso se desinfecta.</div><div class="fila"><button class="btn verde" id="otra">Practicar otra vez</button></div>`; $('otra').onclick = juego5;
      };
      $('ops').appendChild(b);
    });
  })(0);
}

// ---------- Juego 6: Presupuesto de agua ----------
const DIA = [
  ['Bañarte', ['Regadera de 5 min', 45], ['Regadera de 15 min', 135]],
  ['Cepillarte los dientes', ['Cerrar la llave', 2], ['Llave abierta', 12]],
  ['Lavar trastes', ['En tina con jabón', 20], ['Llave abierta todo el rato', 60]],
  ['Regar las plantas', ['Regadera por la tarde', 10], ['Manguera abierta', 40]],
  ['Lavar el coche', ['Con cubeta', 20], ['Con manguera', 100]]
];
function juego6(){
  const sel = [];
  mCont.innerHTML = `<p>Tu <b>meta del día es gastar máximo 120 litros</b> en estas 5 actividades. Elige cómo harás cada una (los litros son ejemplos).</p><div id="ops"></div><div class="fila"><button class="btn" id="chk" disabled>Ver mi día</button></div><div id="res"></div>`;
  DIA.forEach(([act, ...ops], i) => {
    const d = document.createElement('div'); d.innerHTML = `<h3>${act}</h3>`;
    ops.forEach(([txt, l], k) => {
      const b = document.createElement('button'); b.className = 'opc'; b.textContent = `${txt}`;
      b.onclick = () => { sel[i] = l; d.querySelectorAll('.opc').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); $('chk').disabled = sel.filter(Boolean).length < DIA.length; };
      d.appendChild(b);
    });
    $('ops').appendChild(d);
  });
  $('chk').onclick = () => {
    const total = sel.reduce((a, b) => a + b, 0), minimo = DIA.reduce((a, d) => a + d[1][1], 0);
    $('res').innerHTML = `<div class="msg ${total <= 120 ? 'bien' : 'mal'}">${total <= 120 ? '✅ ¡Meta cumplida!' : '❌ Te pasaste de la meta.'} Gastaste ${total} litros. Lo mínimo posible era ${minimo} litros: pequeños cambios ahorran mucha agua.</div><div class="fila"><button class="btn verde" id="otra">Jugar otra vez</button></div>`;
    $('chk').disabled = true; $('otra').onclick = juego6;
  };
}

// ---------- Juego 7 (difícil): Memoria del agua ----------
const PAREJAS = [['🚰 Llave que gotea', '🔧 Repararla'], ['🛢️ Aceite usado', '♻️ Centro de acopio'], ['🌧️ Lluvia', '🪣 Juntarla en cubeta'], ['🚿 Baño largo', '⏱️ Baño de 5 min'], ['🗑️ Basura en el río', '🧹 Ponerla en su bote'], ['🌱 Plantas sedientas', '🌅 Regar al atardecer']];
function juego7(){
  const cartas = mezclar(PAREJAS.flatMap(([a, b], k) => [[a, k], [b, k]]));
  let abiertas = [], intentos = 0, hechas = 0, bloq = false;
  mCont.innerHTML = `<p>Une cada <b>problema</b> con su <b>solución</b>. Intentos: <span id="int">0</span></p><div class="rejilla" id="rej"></div><div id="res"></div>`;
  cartas.forEach(([txt, k]) => {
    const b = document.createElement('button'); b.className = 'carta'; b.textContent = '💧';
    b.onclick = () => {
      if (bloq || b.classList.contains('v') || b.classList.contains('ok')) return;
      b.classList.add('v'); b.textContent = txt; abiertas.push([b, k, txt]);
      if (abiertas.length < 2) return;
      $('int').textContent = ++intentos; const [[b1, k1], [b2, k2]] = abiertas;
      if (k1 === k2){
        [b1, b2].forEach(x => { x.classList.remove('v'); x.classList.add('ok'); });
        $('res').innerHTML = `<div class="msg bien">¡Pareja! ${PAREJAS[k1][0]} → ${PAREJAS[k1][1]}</div>`; abiertas = [];
        if (++hechas === PAREJAS.length) $('res').innerHTML += `<p style="text-align:center;font-weight:700">¡Lo lograste en ${intentos} intentos! 🎉</p><div class="fila"><button class="btn verde" id="otra">Jugar otra vez</button></div>`, $('otra').onclick = juego7;
      } else {
        bloq = true;
        setTimeout(() => { [b1, b2].forEach(x => { x.classList.remove('v'); x.textContent = '💧'; }); abiertas = []; bloq = false; }, 900);
      }
    };
    $('rej').appendChild(b);
  });
}

// ---------- Juego 8 (difícil): El viaje del agua ----------
const VIAJE = ['🏔️ Captación: se recoge agua de ríos, presas o pozos', '🏭 Potabilización: se limpia para que se pueda beber', '🚚 Distribución: llega por tuberías a las casas', '🚿 Uso: la usamos en casa, cuidándola', '🕳️ Drenaje: el agua usada sale por las tuberías', '🌊 Tratamiento: se limpia antes de volver a la naturaleza'];
function juego8(){
  let paso = 0, errores = 0;
  mCont.innerHTML = `<p>Ordena el recorrido del agua. Toca los pasos en el orden correcto.</p><p id="est" style="font-weight:700;text-align:center">Elige el paso 1 de ${VIAJE.length}</p><div id="ops"></div><div id="res"></div>`;
  mezclar(VIAJE.map((t, k) => [t, k])).forEach(([t, k]) => {
    const b = document.createElement('button'); b.className = 'opc'; b.textContent = t;
    b.onclick = () => {
      if (k !== paso){ errores++; $('res').innerHTML = '<div class="msg mal">Todavía no es ese. Piensa qué pasa primero.</div>'; return; }
      b.classList.add('ok'); b.disabled = true; paso++; $('res').innerHTML = '';
      if (paso < VIAJE.length) $('est').textContent = `Elige el paso ${paso + 1} de ${VIAJE.length}`;
      else { $('est').textContent = ''; $('res').innerHTML = `<div class="msg ${errores < 3 ? 'bien' : 'mal'}">¡Completo! Con ${errores} errores. Sin saneamiento y tratamiento, el agua sucia vuelve a ríos y personas: por eso el ODS 6 incluye ambos.</div><div class="fila"><button class="btn verde" id="otra">Jugar otra vez</button></div>`; $('otra').onclick = juego8; }
    };
    $('ops').appendChild(b);
  });
}

// ---------- Juego 9 (difícil): Alcalde del agua ----------
const IND = [['💧', 'Agua potable'], ['🚽', 'Saneamiento'], ['🏭', 'Calidad del agua'], ['⏳', 'Uso eficiente'], ['🏞️', 'Ecosistemas']];
const EVENTOS = [
  ['Llegan más familias al pueblo y la red de agua ya no alcanza.', [
    ['Perforar pozos sin límite', [15, 0, -5, -15, -15], 'Sacar más agua de la que la naturaleza recupera agota los acuíferos. El ODS 6 pide usar el agua con eficiencia y extraerla de forma sostenible.'],
    ['Reparar las fugas de la red e instalar medidores', [10, 0, 0, 15, 0], 'Las tuberías con fugas pierden mucha agua antes de llegar a las casas. Repararlas rinde más que buscar agua nueva.'],
    ['Racionar el agua sin avisar a nadie', [-5, -5, 0, 5, 0], 'Las comunidades deben participar e informarse sobre las decisiones de su agua (meta de participación local).']]],
  ['Una fábrica descarga aguas sucias en el arroyo.', [
    ['Exigirle una planta de tratamiento y vigilar que la use', [0, 0, 18, 0, 8], 'La meta de calidad del agua pide reducir la contaminación y tratar las aguas residuales.'],
    ['Permitirlo para no perder empleos', [0, -5, -20, 0, -15], 'El agua contaminada enferma a las personas y mata a los seres vivos del río.'],
    ['Poner un letrero de “prohibido contaminar”', [0, 0, 3, 0, 0], 'Sin vigilancia ni tratamiento, un letrero no limpia el agua.']]],
  ['La escuela no tiene baños que funcionen ni lavamanos.', [
    ['Construir baños y lavamanos con agua y jabón', [0, 18, 3, 0, 0], 'La meta de saneamiento e higiene busca baños limpios y lavado de manos para todos, también en escuelas.'],
    ['Solo comprar garrafones para tomar', [5, -8, 0, 0, 0], 'El agua para beber ayuda, pero sin baños ni lavamanos siguen las enfermedades.'],
    ['Pintar la escuela', [0, 0, 0, 0, 0], 'Se ve bonita, pero no resuelve el problema del saneamiento.']]],
  ['Una sequía baja el nivel del río.', [
    ['Campañas de ahorro y riego por goteo en el campo', [4, 0, 0, 15, 3], 'Regar por goteo gasta mucha menos agua que inundar los cultivos.'],
    ['Desviar todo el río hacia el pueblo', [10, 0, -5, 0, -20], 'Quitarle toda el agua a un río destruye su ecosistema y a quienes viven río abajo.'],
    ['Esperar a que llueva', [-8, -3, 0, -5, -3], 'Sin acciones, la sequía empeora todo.']]],
  ['El drenaje del pueblo desemboca directo en el río, sin limpiar.', [
    ['Construir una planta de tratamiento de aguas residuales', [0, 8, 18, 0, 8], 'Reducir a la mitad las aguas residuales sin tratar es una de las metas del ODS 6.'],
    ['Alargar el tubo para soltar el agua más lejos', [0, 0, -5, 0, -10], 'Solo cambia el problema de lugar: sigue contaminando.'],
    ['Usar esa agua sin tratar para regar cultivos', [0, -5, -10, 5, -5], 'Puede llevar microbios a los alimentos y al suelo.']]],
  ['Barrios, campo y fábricas pelean por el reparto del agua.', [
    ['Crear un comité con vecinos, campesinos y autoridades', [6, 4, 4, 6, 4], 'La gestión integrada del agua y la participación de la comunidad ayudan a repartirla mejor.'],
    ['Que decida el alcalde solo', [-3, 0, 0, -3, 0], 'Sin participar a la comunidad, es más difícil que todos acepten el reparto.'],
    ['Que cada quien tome toda el agua que pueda', [-5, 0, -3, -10, -8], 'Sin acuerdos, el agua se desperdicia y se acaba más rápido.']]]
];
function juego9(){
  let r = 0, v = [50, 50, 50, 50, 50];
  const barras = () => IND.map(([e, n], k) => `<div style="display:flex;align-items:center;gap:8px;margin:4px 0;font-size:.8rem;font-weight:700"><span style="width:130px">${e} ${n}</span><div class="barra" style="flex:1"><i style="width:${v[k]}%;background:${v[k] < 30 ? '#FF1A1A' : v[k] < 55 ? '#E6A800' : '#178A3A'}"></i></div><span style="width:26px;text-align:right">${v[k]}</span></div>`).join('');
  const fin = (ok, txt) => {
    mCont.innerHTML = `<p style="text-align:center;font-size:1.3rem;font-weight:700">${ok ? '🏛️ ¡Eres un gran alcalde del agua!' : '⚠️ El pueblo no lo logró'}</p>${barras()}<div class="msg ${ok ? 'bien' : 'mal'}">${txt}</div><div class="fila"><button class="btn verde" id="otra">Jugar otra vez</button></div>`;
    $('otra').onclick = juego9;
  };
  function mostrar(){
    if (r >= EVENTOS.length){
      const bajos = IND.filter((_, k) => v[k] < 55).map(x => x[1]);
      return fin(!bajos.length, bajos.length ? `Te faltó cuidar: ${bajos.join(', ')}. El ODS 6 tiene metas conectadas y todas importan al mismo tiempo.` : 'Equilibraste agua potable, saneamiento, calidad, eficiencia y ecosistemas. ¡Eso es el ODS 6!');
    }
    const [situacion, ops] = EVENTOS[r];
    mCont.innerHTML = `<p>Eres el alcalde de Villa Arroyo. <b>Meta: que las 5 barras terminen en 55 o más</b> después de 6 decisiones. Cada ronda todo baja 2 por el crecimiento del pueblo, y si una barra llega a 0 hay crisis.</p>${barras()}
      <p style="font-size:1.1rem;font-weight:700;text-align:center">Ronda ${r + 1} de ${EVENTOS.length}: ${situacion}</p><div id="ops"></div><div id="res"></div>`;
    mezclar(ops).forEach(([txt, ef, porque]) => {
      const b = document.createElement('button'); b.className = 'opc'; b.textContent = txt;
      b.onclick = () => {
        $('ops').querySelectorAll('.opc').forEach(x => x.disabled = true); b.classList.add('sel');
        v = v.map((x, k) => Math.max(0, Math.min(100, x + ef[k] - 2)));
        const cambios = ef.map((d, k) => d ? `${IND[k][0]}${d > 0 ? '+' : ''}${d}` : '').filter(Boolean).join(' ');
        const crisis = v.findIndex(x => x <= 0);
        $('res').innerHTML = `<div class="msg ${ef.reduce((a, d) => a + d, 0) > 10 ? 'bien' : 'mal'}">${porque}<br>${cambios || 'Sin cambios'} (y −2 en todo)</div><div class="fila"><button class="btn" id="sig">${crisis >= 0 ? 'Ver qué pasó' : r < EVENTOS.length - 1 ? 'Siguiente ronda' : 'Ver resultado'}</button></div>`;
        $('sig').onclick = () => { if (crisis >= 0) return fin(false, `¡Crisis! ${IND[crisis][1]} llegó a 0. Cuando se descuida una parte del agua, todo el pueblo sufre.`); r++; mostrar(); };
      };
      $('ops').appendChild(b);
    });
  }
  mostrar();
}

const JUEGOS = {1: juego1, 2: juego2, 3: juego3, 4: juego4, 5: juego5, 6: juego6, 7: juego7, 8: juego8, 9: juego9};
document.querySelectorAll('.nube-btn').forEach(b => b.addEventListener('click', () => {
  abrirModal(b.dataset.nombre, JUEGOS[b.dataset.j], b);
}));
$('sol').addEventListener('click', e => abrirModal('¿Por qué existe el ODS 6?', info, e.currentTarget));

// Gotas flotantes de fondo
const escena = document.getElementById('escena');
for (let i = 0; i < 8; i++){
  const g = document.createElement('i');
  g.className = 'gota';
  g.style.cssText = `left:${Math.random()*96}%;--s:${14+Math.random()*22}px;--d:${12+Math.random()*14}s;--r:-${Math.random()*20}s`;
  escena.appendChild(g);
}
