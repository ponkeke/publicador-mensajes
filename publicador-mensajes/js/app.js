"use strict";

const API_URL = "https://jsonplaceholder.typicode.com/posts";
const MAX_CONTENT_LENGTH = 500;

const form = document.getElementById("post-form");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const submitButton = document.getElementById("submit-btn");
const statusMessage = document.getElementById("status");
const titleError = document.getElementById("title-error");
const contentError = document.getElementById("content-error");
const charCounter = document.getElementById("char-counter");

const resultSection = document.getElementById("result-section");
const resultId = document.getElementById("result-id");
const resultTitle = document.getElementById("result-title-value");
const resultBody = document.getElementById("result-body-value");
const resultUserId = document.getElementById("result-userid");
const resultRaw = document.getElementById("result-raw");

let isSubmitting = false;

/* ---------- Helpers de interfaz ---------- */

function showStatus(type, message) {
  statusMessage.textContent = message;
  statusMessage.classList.remove("is-hidden", "is-loading", "is-success", "is-error");
  statusMessage.classList.add(type);
}

function clearStatus() {
  statusMessage.textContent = "";
  statusMessage.classList.add("is-hidden");
  statusMessage.classList.remove("is-loading", "is-success", "is-error");
}

function setFieldError(input, errorElement, message) {
  errorElement.textContent = message;
  if (message) {
    input.setAttribute("aria-invalid", "true");
  } else {
    input.removeAttribute("aria-invalid");
  }
}

function clearValidation() {
  setFieldError(titleInput, titleError, "");
  setFieldError(contentInput, contentError, "");
  clearStatus();
}

function setLoading(loading) {
  isSubmitting = loading;
  submitButton.disabled = loading;
  submitButton.classList.toggle("is-loading", loading);
  titleInput.disabled = loading;
  contentInput.disabled = loading;
}

function updateCharCounter() {
  const length = contentInput.value.length;
  charCounter.textContent = `${length} / ${MAX_CONTENT_LENGTH} caracteres`;
  charCounter.classList.toggle("is-limit", length >= MAX_CONTENT_LENGTH);
}

/* ---------- Validación ---------- */

function validateForm() {
  clearValidation();
  let isValid = true;

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (title === "") {
    setFieldError(titleInput, titleError, "El título no puede estar vacío.");
    isValid = false;
  }

  if (content === "") {
    setFieldError(contentInput, contentError, "El contenido no puede estar vacío.");
    isValid = false;
  }

  return isValid;
}

/* ---------- Render del resultado ---------- */

function renderResult(post) {
  const returnedId = post.id !== undefined && post.id !== null ? String(post.id) : "No disponible";

  resultId.textContent = returnedId;
  resultTitle.textContent = post.title ?? "(sin título)";
  resultBody.textContent = post.body ?? "(sin contenido)";
  resultUserId.textContent = post.userId !== undefined && post.userId !== null ? String(post.userId) : "No disponible";
  resultRaw.textContent = JSON.stringify(post, null, 2);

  resultSection.hidden = false;
}

function hideResult() {
  resultSection.hidden = true;
}

/* ---------- Petición HTTP POST ---------- */

async function sendPost(title, content) {
  const newPost = {
    title: title,
    body: content,
    userId: 1
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newPost)
  });

  if (!response.ok) {
    const httpError = new Error(`El servidor respondió con estado ${response.status} ${response.statusText}.`);
    httpError.name = "HttpError";
    throw httpError;
  }

  try {
    return await response.json();
  } catch (parseError) {
    const jsonError = new Error("La respuesta del servidor no pudo interpretarse como JSON.");
    jsonError.name = "ParseError";
    throw jsonError;
  }
}

/* ---------- Manejador del formulario ---------- */

async function handleSubmit(event) {
  event.preventDefault();

  if (isSubmitting) {
    return;
  }

  if (!validateForm()) {
    showStatus("is-error", "Revisa los campos marcados antes de publicar.");
    return;
  }

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  hideResult();
  setLoading(true);
  showStatus("is-loading", "Publicando mensaje...");

  try {
    const data = await sendPost(title, content);
    renderResult(data);
    showStatus(
      "is-success",
      `Mensaje enviado correctamente. La API respondió con el ID ${data.id}. ` +
        "Recuerda que JSONPlaceholder es un servicio de prueba: no almacena los datos de forma permanente."
    );
    form.reset();
    updateCharCounter();
  } catch (error) {
    if (error.name === "HttpError") {
      showStatus("is-error", `Error del servidor: ${error.message}`);
    } else if (error.name === "ParseError") {
      showStatus("is-error", `Error al procesar la respuesta: ${error.message}`);
    } else {
      showStatus(
        "is-error",
        "No se pudo conectar con el servidor. Comprueba tu conexión a Internet e inténtalo de nuevo."
      );
    }
    console.error("Error al publicar el mensaje:", error);
  } finally {
    setLoading(false);
  }
}

/* ---------- Inicialización ---------- */

form.addEventListener("submit", handleSubmit);
contentInput.addEventListener("input", updateCharCounter);
updateCharCounter();
