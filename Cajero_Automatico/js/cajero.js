function cajeroAutomatico() {
    let tipoTarjeta;
    let numeroCuenta;
    let contrasena;
    let operacion;
    let intentos;

//  ***************** SELECCIONAR TIPO DE TARJETA
    intentos = 0;
    do {
        tipoTarjeta = prompt("Selecciona el tipo de tarjeta:\n1. Crédito\n2. Débito");
        if (tipoTarjeta !== "1" && tipoTarjeta !== "2") {
            alert("Opción inválida. Por favor, selecciona 1 o 2.");
        }
        intentos++;
        if (intentos >= 3) {
            alert("Transacción errada, intente nuevamente.");
            return;
        }
    } while (tipoTarjeta !== "1" && tipoTarjeta !== "2");

// ******************** NÚMERO DE CUENTA, TIENE QUE SER DE 10 DÍGITOS
    intentos = 0;
    do {
        numeroCuenta = prompt("Ingresa el número de cuenta (debe tener 10 dígitos):");
        if (numeroCuenta.length !== 10 || isNaN(numeroCuenta)) {
            alert("Número de cuenta inválido. Debe ser un número de 10 dígitos.");
        }
        intentos++;
        if (intentos >= 3) {
            alert("Transacción errada, intente nuevamente.");
            return;
        }
    } while (numeroCuenta.length !== 10 || isNaN(numeroCuenta));

// INGRESAR LA CONTRASEÑA, TIENE QUE SER DE 4 DÍGITOS.
    intentos = 0;
    do {
        contrasena = prompt("Ingresa la contraseña (debe tener 4 dígitos):");
        if (contrasena.length !== 4 || isNaN(contrasena)) {
            alert("Contraseña incorrecta. Recuerda que debe tener 4 dígitos.");
        }
        intentos++;
        if (intentos >= 3) {
            alert("Transacción errada, intente nuevamente.");
            return;
        }
    } while (contrasena.length !== 4 || isNaN(contrasena));

// ***************** SELECCIONAR LA OPCIÓN DE LA TRANSACCIÓN A REALIZAR.
    intentos = 0;
    do {
        operacion = prompt("Selecciona una opción:\n1. Retirar\n2. Consignar\n3. Consultar saldo");
        if (operacion !== "1" && operacion !== "2" && operacion !== "3") {
            alert("Opción inválida. Por favor, selecciona 1, 2 o 3.");
        }
        intentos++;
        if (intentos >= 3) {
            alert("Transacción errada, intente nuevamente.");
            return;
        }
    } while (operacion !== "1" && operacion !== "2" && operacion !== "3");

// ********************** OPCIÓN DE 1.RETIRAR
    if (operacion === "1") {
        let montoRetiro = prompt("Ingresa el monto a retirar:");
        alert("Has retirado $" + montoRetiro + "\nMuchas gracias, vuelva pronto.");

// ********************* OPCIÓN DE CONSIGNAR
    } else if (operacion === "2") {
        let tipoTarjetaDestino;
        intentos = 0;
        do {
            tipoTarjetaDestino = prompt("Selecciona el tipo de tarjeta del destino:\n1. Crédito\n2. Débito");
            if (tipoTarjetaDestino !== "1" && tipoTarjetaDestino !== "2") {
                alert("Opción inválida. Por favor, selecciona 1 o 2.");
            }
            intentos++;
            if (intentos >= 3) {
                alert("Transacción errada, intente nuevamente.");
                return;
            }
        } while (tipoTarjetaDestino !== "1" && tipoTarjetaDestino !== "2");

        let numeroCuentaDestino = prompt("Ingresa el número de cuenta destino:");
        let montoConsignar = prompt("Ingresa el monto a consignar:");
        alert("Has consignado $" + montoConsignar + " a la cuenta " + numeroCuentaDestino);

// *********** OPCIÓN 3 DE CONSULAR SALDO.
    } else if (operacion === "3") {
        let saldo = Math.floor(Math.random() * (10000000 - 1000000 + 1)) + 1000000;
        alert("Tu saldo actual es de $" + saldo);

    }
}

cajeroAutomatico();
