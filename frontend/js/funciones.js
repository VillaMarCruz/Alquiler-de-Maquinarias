const url = 'http://localhost:5000/api';

const tabla_alquileres = document.querySelector('tbody');
const notFound = document.getElementById('notFound');
const form_alquiler = document.querySelector('.form-alquiler');
const form_devolucion = document.querySelector('.form-devolucion');
const select_maquinarias = document.querySelector('.maquinarias');

const modal = new bootstrap.Modal(document.getElementById('modalFecha'));
const modalAlquiler = new bootstrap.Modal(document.getElementById('modalAlquiler'));

var idAlquiler = '';
var listAlquileres = '';
/**
 * Enlistar Alquileres en la tabla
 */

const obtenerAlquileres = async() => {
    alquileres = await fetch(url + '/alquiler')
        .then(res => res.json())
        .then(data => mostrarAlquileres(data.body))
        .catch(error => console.log(error));
    return alquileres;
}

const mostrarAlquileres = async(alquileres) => {
    if (alquileres.length > 0) {
        alquileres.forEach((alquiler) => {
            listAlquileres += `
                <tr class="text-center">
                    <td>${alquiler.cliente}</td>
                    <td>${alquiler.maquinaria._id}</td>
                    <td>${alquiler.fechaAlquiler}</td>
                    <td>${alquiler.fechaEntrega}</td>
                    <td>${alquiler.days}</td>
                    <td>$ ${alquiler.importe}</td>
                    <td>$ ${alquiler.descuento}</td>
                    <td>$ ${alquiler.garantia}</td>
                    
            `;
            if (!alquiler.fechaDevolucionReal) {
                listAlquileres += `
                    <td>$ 0</td>
                    <td>$ ${alquiler.total}</td>
                    <td value='${alquiler._id}'><a class='btnDevolver btn btn-primary'">Devolver</a></td>
                    </tr>
                `
            } else {
                listAlquileres += `
                    <td>$ ${alquiler.multa}</td>
                    <td>$ ${alquiler.total}</td>
                    <td><i class="fas fa-check"></i></td>
                    </tr>
                `
            };
        });
        tabla_alquileres.innerHTML = listAlquileres;
        notFound.innerHTML = ``;
    } else {
        notFound.innerHTML = `
            <h1 class="text-center">No hay alquileres registrados</h1>
            `
    }
};

/**
 * Enlistar Maquinarias en el combobox
 */
const mostrarMaquinaria = async() => {
    let resultados = '';
    maquinarias = await fetch(url + '/maquinaria')
        .then(response => response.json())
        .catch(error => console.log(error));

    maquinarias.body.forEach((maquinaria) => {
        resultados += `
            <option value="${maquinaria._id}">${maquinaria._id} - ${maquinaria.maquinaria}</option>
        `;
    });
    select_maquinarias.innerHTML = resultados;
};
/**
 * Llamada de los métodos
 */
mostrarMaquinaria();
obtenerAlquileres();

/**
 * Devolución de maquinarias
 */
form_devolucion.addEventListener('submit', async(e) => {
    e.preventDefault();
    let alquiler = await fetch(url + `/alquiler/${idAlquiler}`)
        .then(response => response.json())
        .catch(error => console.log(error));

    await fetch(url + `/alquiler/${idAlquiler}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cliente: alquiler.body.cliente,
                maquinaria: alquiler.body.maquinaria,
                fechaAlquiler: alquiler.body.fechaAlquiler,
                fechaEntrega: alquiler.body.fechaEntrega,
                fechaDevolucionReal: e.target.fechaDevolucion.value,
                days: alquiler.body.days,
                importe: alquiler.body.importe,
                descuento: alquiler.body.descuento,
                garantia: alquiler.body.garantia,
                total: alquiler.body.total
            })
        })
        .then(res => res.json());
    modal.hide();
    location.reload();
});

/**
 * Alquiler de maquinarias
 */
form_alquiler.addEventListener('submit', async(e) => {
    e.preventDefault();
    let newAlquiler = e.target;
    let maquinaria = await fetch(url + `/maquinaria/${newAlquiler.maquinaria.value}`)
        .then(response => response.json())
        .catch(error => console.log(error));

    await fetch(url + '/alquiler', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cliente: newAlquiler.cliente.value,
                maquinaria: maquinaria.body,
                fechaAlquiler: newAlquiler.fechaAlquiler.value,
                fechaEntrega: newAlquiler.fechaEntrega.value
            })
        })
        .then(res => res.json())
        .then(data => {
            let alquiler = [];
            alquiler.push(data.body);
            mostrarAlquileres(alquiler);
        });
    modalAlquiler.hide();
});

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e);
        }
    });
};

on(document, 'click', '.btnDevolver', e => {
    idAlquiler = e.target.parentNode.parentNode.children[10].getAttribute('value');
    modal.show();
});

on(document, 'click', '.btnAlquiler', e => {
    modalAlquiler.show();
});