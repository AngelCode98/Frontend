import { Cliente } from './Cliente.js';
import { CuentaCorriente } from './CuentaCorriente.js';
import { CuentaAhorros } from './CuentaAhorros.js';

console.log("Se está ejecutando.");

// Estado
let clientes = [];
let currentUser = null;
let loginAttempts = 0;
const maxLoginAttempts = 3;

// Elementos UI login
const loginDiv = document.getElementById('login');
const cajeroDiv = document.getElementById('cajero');
const loginMessage = document.getElementById('loginMessage');
const identificacionInput = document.getElementById('identificacion');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const showRegisterBtn = document.getElementById('showRegisterBtn');

// Formulario de registro
const registerForm = document.getElementById('registerForm');
const regNombre = document.getElementById('regNombre');
const regApellido = document.getElementById('regApellido');
const regDireccion = document.getElementById('regDireccion');
const regIdentificacion = document.getElementById('regIdentificacion');
const regPassword = document.getElementById('regPassword');
const regTipoCuenta = document.getElementById('regTipoCuenta');
const registerBtn = document.getElementById('registerBtn');
const cancelRegisterBtn = document.getElementById('cancelRegisterBtn');
const registerMessage = document.getElementById('registerMessage');

// Cajero UI
const consignarBtn = document.getElementById('consignarBtn');
const retirarBtn = document.getElementById('retirarBtn');
const transferirBtn = document.getElementById('transferirBtn');
const consultarSaldoBtn = document.getElementById('consultarSaldoBtn');
const consultarMovimientosBtn = document.getElementById('consultarMovimientosBtn');
const logoutBtn = document.getElementById('logoutBtn');

const operationForm = document.getElementById('operationForm');
const saldoDisplay = document.getElementById('saldoDisplay');
const movimientosList = document.getElementById('movimientosList');

// Listeners
loginBtn.addEventListener('click', login);
showRegisterBtn.addEventListener('click', showRegisterForm);
cancelRegisterBtn.addEventListener('click', cancelRegister);
registerBtn.addEventListener('click', registerUser);
logoutBtn.addEventListener('click', logout);

consignarBtn.addEventListener('click', () => showOperationForm('consignar'));
retirarBtn.addEventListener('click', () => showOperationForm('retirar'));
transferirBtn.addEventListener('click', () => showOperationForm('transferir'));
consultarSaldoBtn.addEventListener('click', mostrarSaldo);
consultarMovimientosBtn.addEventListener('click', mostrarMovimientos);

// Funciones de login e interfaz
function login() {
    const identificacion = identificacionInput.value.trim();
    const password = passwordInput.value; // Obtener la contraseña ingresada

    // Validar que se haya ingresado un número de identificación
    if (!identificacion) {
        loginMessage.textContent = 'Por favor, ingrese número de identificación';
        return;
    }

    // Buscar el cliente por identificación
    const cliente = clientes.find(c => c.identificacion === identificacion);
    
    // Validar que el cliente exista
    if (!cliente) {
        loginAttempts++;
        if (loginAttempts >= maxLoginAttempts) {
            loginMessage.textContent = 'Número máximo de intentos alcanzado. Intente más tarde.';
            loginBtn.disabled = true;
            return;
        }
        loginMessage.textContent = `Usuario no encontrado. Intentos restantes: ${maxLoginAttempts - loginAttempts}`;
        return;
    }

    // Validar que la contraseña ingresada coincida con la almacenada
    if (cliente.password !== password) {
        loginAttempts++;
        if (loginAttempts >= maxLoginAttempts) {
            loginMessage.textContent = 'Número máximo de intentos alcanzado. Intente más tarde.';
            loginBtn.disabled = true;
            return;
        }
        loginMessage.textContent = `Contraseña incorrecta. Intentos restantes: ${maxLoginAttempts - loginAttempts}`;
        return;
    }

    // Si la identificación y la contraseña son correctas
    currentUser  = cliente;
    loginMessage.textContent = '';
    loginDiv.classList.add('hidden');
    registerForm.classList.add('hidden');
    cajeroDiv.classList.remove('hidden');
    limpiarCamposLogin();
    saldoDisplay.textContent = '';
    movimientosList.classList.add('hidden');
    operationForm.classList.add('hidden');
    showPopup(`Bienvenido ${currentUser .nombre} ${currentUser .apellido}!`);
}


function logout() {
    currentUser = null;
    loginAttempts = 0;
    loginBtn.disabled = false;
    loginDiv.classList.remove('hidden');
    cajeroDiv.classList.add('hidden');
    registerForm.classList.add('hidden');
    loginMessage.textContent = '';
    registerMessage.textContent = '';
    saldoDisplay.textContent = '';
    movimientosList.classList.add('hidden');
    operationForm.classList.add('hidden');
    limpiarCamposLogin();
}

function limpiarCamposLogin() {
    identificacionInput.value = '';
    passwordInput.value = '';
}

// Funciones registro usuario
function showRegisterForm() {
    registerMessage.textContent = '';
    loginMessage.textContent = '';
    limpiarCamposRegistro();
    loginDiv.classList.add('hidden');
    cajeroDiv.classList.add('hidden');
    registerForm.classList.remove('hidden');
}

function cancelRegister() {
    registerMessage.textContent = '';
    limpiarCamposRegistro();
    registerForm.classList.add('hidden');
    loginDiv.classList.remove('hidden');
}

function limpiarCamposRegistro() {
    regNombre.value = '';
    regApellido.value = '';
    regDireccion.value = '';
    regIdentificacion.value = '';
    regPassword.value = '';
    regTipoCuenta.value = '';
}

// Registro de usuario
function registerUser () {
    registerMessage.textContent = '';
    const nombre = regNombre.value.trim();
    const apellido = regApellido.value.trim();
    const direccion = regDireccion.value.trim();
    const identificacion = regIdentificacion.value.trim();
    const password = regPassword.value;
    const tipoCuenta = regTipoCuenta.value;

    if (!nombre) {
        registerMessage.textContent = 'Nombre es obligatorio.';
        return;
    }
    if (!apellido) {
        registerMessage.textContent = 'Apellido es obligatorio.';
        return;
    }
    if (!direccion) {
        registerMessage.textContent = 'Dirección es obligatoria.';
        return;
    }
    if (!identificacion) {
        registerMessage.textContent = 'Identificación es obligatoria.';
        return;
    }
    if (clientes.some(c => c.identificacion === identificacion)) {
        registerMessage.textContent = 'Identificación ya registrada. Intente iniciar sesión.';
        return;
    }
    if (!password) {
        registerMessage.textContent = 'Contraseña es obligatoria.';
        return;
    }
    if (password.length < 3) { // Cambia a 8 caracteres para mayor seguridad
        registerMessage.textContent = 'La contraseña debe tener al menos 3 caracteres.';
        return;
    }

    let clienteNuevo;
    if (tipoCuenta === '1') {
        const numeroCuenta = generarNumeroCuenta();
        const cuenta = new CuentaCorriente(numeroCuenta);
        clienteNuevo = new Cliente(nombre, apellido, direccion, identificacion, password); // Aquí se pasa la contraseña
        clienteNuevo.cuenta = cuenta;
    } else {
        const numeroCuenta = generarNumeroCuenta();
        const cuenta = new CuentaAhorros(numeroCuenta);
        clienteNuevo = new Cliente(nombre, apellido, direccion, identificacion, password); // Aquí se pasa la contraseña
        clienteNuevo.cuenta = cuenta;
    }
    clientes.push(clienteNuevo);
    showPopup(`Usuario registrado con éxito. Su número de cuenta es: ${clienteNuevo.cuenta.numero}`);
    cancelRegister();
}


function generarNumeroCuenta() {
    return Math.floor(100000000 + Math.random() * 900000000).toString();
}

// Mostrar formulario de operación según tipo
function showOperationForm(tipo) {
    if (!currentUser) {
        showPopup('Debe iniciar sesión.');
        return;
    }
    operationForm.innerHTML = '';
    saldoDisplay.textContent = '';
    movimientosList.classList.add('hidden');
    operationForm.classList.remove('hidden');

    if (tipo === 'consignar' || tipo === 'retirar') {
        const label = document.createElement('label');
        label.textContent = 'Monto:';
        label.style.display = 'block';
        label.style.marginBottom = '8px';

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0.01';
        input.step = '0.01';
        input.placeholder = 'Ingrese monto';
        input.style.marginBottom = '15px';
        input.id = 'montoInput';

        const btn = document.createElement('button');
        btn.textContent = tipo === 'consignar' ? 'Consignar' : 'Retirar';

        btn.addEventListener('click', () => {
            const val = parseFloat(input.value);
            if (isNaN(val) || val <= 0) {
                showPopup('Monto inválido.');
                return;
            }
            if (tipo === 'consignar') consignar(val);
            else retirar(val);
            operationForm.classList.add('hidden');
        });

        operationForm.appendChild(label);
        operationForm.appendChild(input);
        operationForm.appendChild(btn);
    } else if (tipo === 'transferir') {
        const labelId = document.createElement('label');
        labelId.textContent = 'Identificación destinatario:';
        labelId.style.display = 'block';
        labelId.style.marginBottom = '8px';

        const inputId = document.createElement('input');
        inputId.type = 'text';
        inputId.placeholder = 'Ingrese ID destinatario';
        inputId.style.marginBottom = '15px';
        inputId.id = 'destinoIdInput';

        const labelMonto = document.createElement('label');
        labelMonto.textContent = 'Monto:';
        labelMonto.style.display = 'block';
        labelMonto.style.marginBottom = '8px';

        const inputMonto = document.createElement('input');
        inputMonto.type = 'number';
        inputMonto.min = '0.01';
        inputMonto.step = '0.01';
        inputMonto.placeholder = 'Ingrese monto';
        inputMonto.style.marginBottom = '15px';
        inputMonto.id = 'montoTransferirInput';

        const btn = document.createElement('button');
        btn.textContent = 'Transferir';

        btn.addEventListener('click', () => {
            const destinoId = inputId.value.trim();
            const monto = parseFloat(inputMonto.value);
            if (!destinoId) {
                showPopup('Destinatario inválido.');
                return;
            }
            if (destinoId === currentUser.identificacion) {
                showPopup('No puede transferirse a sí mismo.');
                return;
            }
            if (isNaN(monto) || monto <= 0) {
                showPopup('Monto inválido.');
                return;
            }
            transferir(destinoId, monto);
            operationForm.classList.add('hidden');
        });

        operationForm.appendChild(labelId);
        operationForm.appendChild(inputId);
        operationForm.appendChild(labelMonto);
        operationForm.appendChild(inputMonto);
        operationForm.appendChild(btn);
    }
}

// Funciones operación bancarias
function consignar(monto) {
    if (!currentUser) {
        showPopup('Debe iniciar sesión.');
        return;
    }
    currentUser.cuenta.realizarConsignacion(monto);
    saldoDisplay.textContent = `Consignación exitosa. Nuevo saldo: \ $\ ${currentUser.cuenta.consultarSaldo().toFixed(2)}\ `;
}

function retirar(monto) {
    if (!currentUser) {
        showPopup('Debe iniciar sesión.');
        return;
    }
    const exito = currentUser.cuenta.realizarRetiro(monto);
    if (exito) {
        saldoDisplay.textContent = `Retiro exitoso. Nuevo saldo: \ $\ ${currentUser.cuenta.consultarSaldo().toFixed(2)}\ `;
    } else {
        showPopup('Fondos insuficientes o límite de sobregiro excedido.');
    }
}

function transferir(destinoId, monto) {
    if (!currentUser) {
        showPopup('Debe iniciar sesión.');
        return;
    }
    const clienteDestino = clientes.find(c => c.identificacion === destinoId);
    if (!clienteDestino) {
        showPopup('Cliente destinatario no encontrado.');
        return;
    }
    const exito = currentUser.cuenta.realizarTransferencia(clienteDestino.cuenta, monto);
    if (exito) {
        saldoDisplay.textContent = `Transferencia exitosa. Monto: \ $\ ${monto.toFixed(2)} a la cuenta con ID: \ ${clienteDestino.identificacion}.\ `;
    } else {
        showPopup('Fondos insuficientes para realizar la transferencia.');
    }
}

function mostrarSaldo() {
    if (!currentUser) {
        showPopup('Debe iniciar sesión.');
        return;
    }
    saldoDisplay.textContent = `Su saldo actual es: \ $\ ${currentUser.cuenta.consultarSaldo().toFixed(2)}\ `;
    operationForm.classList.add('hidden');
    movimientosList.classList.add('hidden');
}

function mostrarMovimientos() {
    if (!currentUser) {
        showPopup('Debe iniciar sesión.');
        return;
    }
    const movimientos = currentUser.cuenta.consultarMovimientos();
    if (!movimientos.length) {
        showPopup('No hay movimientos registrados.');
        return;
    }
    movimientosList.innerHTML = '';
    movimientosList.classList.remove('hidden');
    operationForm.classList.add('hidden');
    saldoDisplay.textContent = '';

    // Crear tabla si no existe
    let tabla = movimientosList.querySelector('table');
    if (!tabla) {
        tabla = document.createElement('table');
        tabla.style.width = '100%';
        tabla.style.borderCollapse = 'collapse';
        tabla.style.color = '#00fff7';
        tabla.style.textAlign = 'left';

        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        ['Tipo', 'Monto', 'Fecha'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            th.style.borderBottom = '2px solid #00fff7';
            th.style.padding = '6px';
            tr.appendChild(th);
        });
        thead.appendChild(tr);
        tabla.appendChild(thead);

        const tbody = document.createElement('tbody');
        tabla.appendChild(tbody);

        movimientosList.appendChild(tabla);
    }
    const tbody = tabla.querySelector('tbody');
    tbody.innerHTML = '';

    movimientos.forEach(mov => {
        const tr = document.createElement('tr');
        ['tipo', 'monto', 'fecha'].forEach(field => {
            const td = document.createElement('td');
            td.style.padding = '6px 8px';
            td.style.borderBottom = '1px solid #00fff7aa';
            if (field === 'monto') td.textContent = `$\ ${mov.monto.toFixed(2)}\ `;
            else if (field === 'fecha') td.textContent = new Date(mov.fecha).toLocaleString();
            else td.textContent = mov.tipo;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

const popupMessage = document.getElementById('popupMessage');

function showPopup(message, type = 'success', duration = 3000) {
    popupMessage.textContent = message;
    popupMessage.className = ''; // Limpiar clases anteriores
    popupMessage.classList.add('show');
    if (type === 'error') {
        popupMessage.classList.add('error');
    }
    // Remover el popup después de duration milisegundos
    setTimeout(() => {
        popupMessage.classList.remove('show', 'error');
        popupMessage.textContent = '';
    }, duration);
}
