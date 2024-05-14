import { leer, escribir, jsonToObject, objectToJson, limpiar } from "./local-storage.js";
import { Anuncio } from "./anuncio.js";
import { mostrarSpinner, ocultarSpinner } from "./spinner.js";

const KEY_STORAGE = "anuncios";
let items = [];

document.addEventListener("DOMContentLoaded", onInit);

function onInit() {
    loadItems();
    escuchandoFormulario();
    escuchandoDeleteAll();
    eliminoPorId();
    escuchandoModificarPorId();
}

async function loadItems() {
    mostrarSpinner();
    let str = await leer(KEY_STORAGE);
    ocultarSpinner();

    const objetos = jsonToObject(str) || [];

    objetos.forEach(obj => {
        const model = new Anuncio(
            obj.id,
            obj.titulo,
            obj.transaccion,
            obj.descripcion,
            obj.precio,
            obj.puertas,
            obj.kms,
            obj.potencia
        );

        items.push(model);
    });

    rellenarTabla();
}


function rellenarTabla() {
    const tabla = document.getElementById("table-items");
    let tbody = tabla.getElementsByTagName('tbody')[0];

    tbody.innerHTML = '';

    const celdas = ["id", "titulo", "transaccion", "descripcion", "precio", "puertas", "kms", "potencia"];

    items.forEach((item) => {
        let nuevaFila = document.createElement("tr");
        celdas.forEach((celda) => {
            let nuevaCelda = document.createElement("td");
            nuevaCelda.textContent = item[celda];
            nuevaFila.appendChild(nuevaCelda);
        });
        tbody.appendChild(nuevaFila);
    });
}
function escuchandoFormulario() {
    const formulario = document.getElementById("form-item");
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = formulario.querySelector("#id").value;
        const model = new Anuncio(
            id || generarNuevoId(),
            formulario.querySelector("#titulo").value,
            formulario.querySelector("#transaccion").value,
            formulario.querySelector("#descripcion").value,
            formulario.querySelector("#precio").value,
            formulario.querySelector("#puertas").value,
            formulario.querySelector("#kms").value,
            formulario.querySelector("#potencia").value
        );

        const rta = model.verify();

        if (rta) {
            if (id) {
                const index = items.findIndex(item => item.id == id);
                if (index !== -1) {
                    items[index].titulo = model.titulo;
                    items[index].precio = model.precio;
                }
            } else {
                items.push(model);
            }
            const str = objectToJson(items);
            escribir(KEY_STORAGE, str);
            actualizarFormulario();
            rellenarTabla();
        }
    });
}

// function actualizarFormulario() {
//     formulario.reset();
// }

function escuchandoDeleteAll() {
    const btn = document.getElementById("btn-delete-all");
    btn.addEventListener("click", (e) => {
      if(confirm("Desea eliminar todos los items de la lista?")){
        items.splice(0, items.length) 
        limpiar(KEY_STORAGE); 
        actualizarFormulario(); 
        rellenarTabla(); 
      }
    });
  }
  

  function actualizarFormulario(model = null) {
    const form = document.getElementById("form-item");
    if (model) {
      form.querySelector("#id").value = model.id;
      form.querySelector("#titulo").value = model.titulo;
      form.querySelector("#transaccion").value = model.transaccion;
      form.querySelector("#descripcion").value = model.descripcion;
      form.querySelector("#precio").value = model.precio;
      form.querySelector("#puertas").value = model.puertas;
      form.querySelector("#kms").value = model.kms;
      form.querySelector("#potencia").value = model.potencia;
    } else {
      form.reset();
    }
  }

  function eliminoPorId(){
    const btn = document.getElementById("btn-delete");
    btn.addEventListener("click", (e) => {
      const id = document.getElementById("ID").value;
      if(confirm("Desea eliminar el ID? " + id)){
        eliminarPorId(id); 
        actualizarFormulario(); 
        rellenarTabla(); 
      }
    });
  }

  function eliminarPorId(id) {
    const index = items.findIndex(item => item.id == id);
    if (index !== -1) {
      items.splice(index, 1);
      const str = objectToJson(items);
      escribir(KEY_STORAGE, str);
    }
  }

  function generarNuevoId() {
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
    return maxId + 1;
  }


  function escuchandoModificarPorId() {
    const btnModificar = document.getElementById("btn-modifica");
    btnModificar.addEventListener("click", () => {
      const id = document.getElementById("ID").value;
      const item = buscarPorId(id); 
      if (item) {
        actualizarFormulario(item); 
      } else {
        alert("No se encontró ningún elemento con el ID proporcionado.");
      }
    });
  }


  function buscarPorId(id) {
    return items.find(item => item.id == id);
  }


