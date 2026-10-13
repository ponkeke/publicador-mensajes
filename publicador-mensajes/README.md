# Publicador de mensajes

Miniaplicación web que permite escribir el título y el contenido de una
publicación, validarlos y enviarlos a una API REST mediante una petición HTTP
**POST** usando **Fetch** y **async/await**, para luego mostrar la respuesta del
servidor dinámicamente en el DOM.

## Objetivo

Aplicar los conceptos fundamentales de la programación web del cliente:

- Estructura semántica con **HTML5**.
- Estilos modernos y responsive con **CSS3**.
- Manipulación del **DOM** con JavaScript puro.
- Validación de formularios antes de enviar datos.
- Peticiones asíncronas con **Fetch API** y **async/await**.
- Manejo de errores con **try/catch/finally**.
- Visualización segura de datos externos usando **textContent**.

## Tecnologías utilizadas

- HTML5
- CSS3 (variables, flexbox, grid, media queries)
- JavaScript puro (sin frameworks ni librerías externas)
- Fetch API
- JSONPlaceholder (API REST de prueba)

## Estructura de archivos

```text
publicador-mensajes/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── README.md
```

- `index.html`: estructura de la interfaz (encabezado, formulario, área de
  resultado y estado).
- `css/styles.css`: estilos, estados de carga/éxito/error y diseño responsive.
- `js/app.js`: lógica de validación, petición HTTP POST y render de resultados.
- `README.md`: documentación y guía de exposición.

## Instrucciones para ejecutar la aplicación

1. Descarga o clona la carpeta `publicador-mensajes`.
2. Abre el archivo `index.html` con un navegador moderno (Chrome, Edge, Firefox
   o Safari).
   - Opción A: doble clic sobre `index.html`.
   - Opción B: si usas Visual Studio Code, instala la extensión **Live Server**,
     haz clic derecho sobre `index.html` y elige *Open with Live Server*.
3. Escribe un título y un contenido y pulsa **Publicar mensaje**.

> La aplicación necesita conexión a Internet para comunicarse con
> `https://jsonplaceholder.typicode.com/posts`.

## Flujo de funcionamiento

1. El usuario completa el formulario y pulsa **Publicar mensaje**.
2. `submit` se captura con `addEventListener` y se evita la recarga con
   `event.preventDefault()`.
3. Se valida que el título y el contenido no estén vacíos (usando `trim()`).
   Si falla, se muestran mensajes de error y **no** se realiza ninguna petición.
4. Se muestra el estado de carga, se deshabilita el botón y se evita un segundo
   envío mientras hay una petición en curso.
5. Se construye el objeto `{ title, body, userId: 1 }` y se serializa con
   `JSON.stringify()`.
6. Se envía con `fetch()` usando el método `POST` y el encabezado
   `Content-Type: application/json`.
7. Se comprueba `response.ok`; si es correcto, se procesa la respuesta con
   `await response.json()`.
8. Se muestra en el DOM el ID y los datos devueltos por la API (ocultando antes
   cualquier resultado anterior).
9. En `finally` se vuelve a habilitar el botón y se restablece el estado, tanto
   en caso de éxito como de error.

## La API utilizada y su limitación de persistencia

La aplicación usa **JSONPlaceholder** (`https://jsonplaceholder.typicode.com/posts`),
una API REST *fake* pensada para pruebas y prototipos.

Aunque el servidor responde con código `201 Created` y devuelve el objeto
enviado junto con un `id` generado, **esta API no almacena realmente las
publicaciones**. Las respuestas son simuladas y los datos no se conservan entre
peticiones ni están visibles para otros usuarios. Por eso la aplicación muestra
la respuesta del servidor, pero **no afirma** que las publicaciones se guarden
de forma permanente.

## Pasos para ejecutar las pruebas funcionales

| # | Escenario | Cómo comprobarlo | Resultado esperado |
|---|-----------|------------------|--------------------|
| 1 | Formulario vacío | Pulsar **Publicar mensaje** sin escribir nada | Se muestran errores en título y contenido; no hay petición en Network |
| 2 | Título con solo espacios | Escribir espacios en el título y un contenido válido | Error "El título no puede estar vacío."; no hay petición |
| 3 | Contenido con solo espacios | Título válido y solo espacios en el contenido | Error "El contenido no puede estar vacío."; no hay petición |
| 4 | Publicación válida | Completar ambos campos correctamente y enviar | Estado de éxito y aparición del bloque "Publicación creada" |
| 5 | Respuesta de la API | Observar el bloque de resultado | Se muestran `id`, `title`, `body` y `userId` devueltos |
| 6 | Botón deshabilitado | Enviar y observar el botón durante la petición | Botón deshabilitado con spinner y texto "Publicando mensaje..." |
| 7 | Botón rehabilitado | Esperar el fin de la petición | Botón habilitado nuevamente (gracias a `finally`) |
| 8 | Error de conexión | Desconectar Internet o usar DevTools → *Network* → *Offline* y enviar | Mensaje "No se pudo conectar con el servidor..." y el botón se rehabilita |
| 9 | Consola del navegador | Abrir DevTools (F12) → pestaña *Console* | Sin errores de sintaxis; solo posibles logs controlados en caso de fallo |
| 10 | Pestaña Network | DevTools → *Network*, enviar y seleccionar la petición `posts` | Método **POST**, encabezado `Content-Type: application/json`, cuerpo JSON con `title`, `body`, `userId`, estado **201** y respuesta con `id` |

### Cómo probar el error de conexión (escenario 8)

1. Abre DevTools con `F12`.
2. Ve a la pestaña **Network** y activa la opción **Offline**.
3. Completa el formulario y pulsa **Publicar mensaje**.
4. Deberías ver el mensaje de error de conexión y, al desactivar *Offline*, poder
   reintentar con éxito.

## Explicación para la exposición

A continuación se explican, con palabras sencillas y referencias al código real,
los conceptos que se evaluarán en la demostración oral.

### 1. ¿Qué es el DOM?

El **DOM** (*Document Object Model*) es la representación en forma de árbol de
la página HTML que el navegador construye en memoria. Gracias a él, JavaScript
puede leer y modificar los elementos de la página (textos, estilos, estados).

En `js/app.js` accedemos a los elementos con `document.getElementById(...)`:

```js
const form = document.getElementById("post-form");
const titleInput = document.getElementById("title");
const statusMessage = document.getElementById("status");
```

Y luego los modificamos, por ejemplo al actualizar el contador:

```js
charCounter.textContent = `${length} / ${MAX_CONTENT_LENGTH} caracteres`;
```

### 2. ¿Para qué sirve `addEventListener()`?

Sirve para **escuchar eventos** (clics, escritura, envío de formularios, etc.) y
ejecutar una función cuando ocurren, sin mezclar JavaScript dentro del HTML.

```js
form.addEventListener("submit", handleSubmit);
contentInput.addEventListener("input", updateCharCounter);
```

### 3. ¿Qué hace `event.preventDefault()`?

Cancela el comportamiento **por defecto** del evento. En un formulario, el
comportamiento por defecto del evento `submit` es recargar la página. Al
llamarlo, evitamos esa recarga y controlamos el envío con JavaScript.

```js
async function handleSubmit(event) {
  event.preventDefault();
  ...
}
```

### 4. ¿Qué significa que una operación sea asíncrona?

Significa que **no bloquea** el programa: se inicia y el código continúa
mientras la operación se completa en segundo plano. Una petición de red puede
tardar; no queremos que la página se congele esperándola. Por eso `fetch` es
asíncrono y lo manejamos con `async/await`.

### 5. ¿Qué es una promesa?

Una **promesa** (*Promise*) es un objeto que representa un valor que estará
disponible **en el futuro**: puede *resolverse* (éxito) o *rechazarse* (error).
`fetch()` devuelve una promesa de la respuesta HTTP.

```js
const response = await fetch(API_URL, { ... }); // fetch devuelve una promesa
```

### 6. ¿Para qué sirven `async` y `await`?

- `async` marca una función para que **siempre devuelva una promesa** y permita
  usar `await` dentro.
- `await` **pausa** la función (sin bloquear el navegador) hasta que la promesa
  se resuelva, y devuelve su resultado.

```js
async function sendPost(title, content) {
  const response = await fetch(API_URL, { ... });
  return await response.json();
}
```

Así el código asíncrono se lee como si fuera secuencial.

### 7. ¿Qué es Fetch API?

Es la interfaz nativa del navegador para **realizar peticiones HTTP** (GET, POST,
PUT, DELETE, etc.) y obtener recursos. Reemplaza al antiguo `XMLHttpRequest` y se
basa en promesas.

```js
const response = await fetch(API_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(newPost)
});
```

### 8. Diferencia entre GET y POST

- **GET**: solicita/lee datos del servidor; los parámetros viajan en la URL y no
  debería modificar nada.
- **POST**: envía datos al servidor para **crear** un recurso; los datos van en
  el cuerpo (*body*) de la petición.

En esta app usamos **POST** porque estamos enviando una nueva publicación:

```js
method: "POST"
```

### 9. ¿Para qué sirve `Content-Type: application/json`?

Es un encabezado que **le indica al servidor** en qué formato está el cuerpo de
la petición. Al poner `application/json`, avisamos que el `body` es un JSON, para
que el servidor sepa cómo interpretarlo.

```js
headers: { "Content-Type": "application/json" }
```

### 10. ¿Qué hace `JSON.stringify()`?

Convierte un **objeto de JavaScript en una cadena de texto JSON**, que es el
formato que viaja por la red.

```js
const newPost = { title, body, userId: 1 };
body: JSON.stringify(newPost)
// Resultado: '{"title":"...","body":"...","userId":1}'
```

### 11. ¿Qué hace `response.json()`?

Lee el cuerpo de la respuesta y lo **convierte de texto JSON a un objeto de
JavaScript**, devolviendo una promesa, por eso se usa con `await`.

```js
const data = await response.json();
renderResult(data);
```

### 12. ¿Qué significa `response.ok`?

Es una propiedad booleana que vale `true` cuando el **estado HTTP está entre 200
y 299** (respuesta satisfactoria) y `false` en caso contrario (por ejemplo, 404 o
500). Permite detectar errores HTTP antes de procesar el cuerpo.

```js
if (!response.ok) {
  const httpError = new Error(`... estado ${response.status} ...`);
  httpError.name = "HttpError";
  throw httpError;
}
```

### 13. ¿Para qué sirven `try/catch/finally`?

- `try`: contiene el código que puede fallar.
- `catch`: captura el error y permite mostrar un mensaje comprensible.
- `finally`: se ejecuta **siempre**, haya éxito o error; aquí restauramos el
  botón y el estado.

```js
try {
  const data = await sendPost(title, content);
  renderResult(data);
} catch (error) {
  // Diferenciamos error HTTP, de parseo y de conexión
} finally {
  setLoading(false); // siempre se rehabilitá el botón
}
```

### 14. ¿Por qué se usa `textContent` en lugar de `innerHTML`?

`innerHTML` interpreta el texto como HTML, lo que permitiría **inyectar etiquetas
o scripts maliciosos** (XSS) si el contenido proviene del usuario o de la API.
`textContent` inserta el texto **como texto plano**, sin interpretarlo, por lo que
es seguro.

```js
resultTitle.textContent = post.title;
resultBody.textContent = post.body;
// En lugar de: resultTitle.innerHTML = post.title;
```

### 15. ¿Por qué JSONPlaceholder no almacena permanentemente las publicaciones?

JSONPlaceholder es una **API de simulación** creada para aprender y hacer pruebas.
No tiene una base de datos real detrás: genera respuestas falsas y devuelve un
`id` simulado. Aunque responda con `201 Created`, los datos enviados **no se
guardan** ni permanecen después de refrescar, y nunca aparecen en las consultas
GET reales. Por eso la aplicación muestra la respuesta del servidor sin afirmar
que la publicación quedó guardada.

---

Trabajo práctico de **Ingeniería Web**.
