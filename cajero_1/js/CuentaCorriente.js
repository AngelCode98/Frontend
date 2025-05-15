import { Cuenta } from './Cuenta.js';

export class CuentaCorriente extends Cuenta {
    constructor(numero, saldo = 0, sobregiro = 500000) {
        super(numero, saldo);
        this.sobregiro = sobregiro;
    }

    realizarRetiro(monto) {
        if (this.saldo + this.sobregiro >= monto) {
            this.saldo -= monto;
            this.registrarMovimiento('Retiro', monto);
            return true;
        }
        return false; // Fondos insuficientes
    }

    realizarConsignacion(monto) {
        this.saldo += monto;
        this.registrarMovimiento('Consignacion', monto);
    }

    realizarTransferencia(destino, monto) {
        if (this.saldo + this.sobregiro >= monto) {
            this.saldo -= monto;
            this.registrarMovimiento('Transferencia Enviada', monto);
            destino.realizarConsignacion(monto);
            destino.registrarMovimiento('Transferencia Recibida', monto);
            return true;
        }
        return false; // Fondos insuficientes
    }
}
