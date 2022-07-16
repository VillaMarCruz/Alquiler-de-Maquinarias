const daysCalculate = (fechaInicial, fechaFinal) => {
    fechaInicial = new Date(fechaInicial);
    fechaFinal = new Date(fechaFinal);
    let year = 1000 * 60 * 60 * 24;

    f1 = fechaInicial.getTime();
    f2 = fechaFinal.getTime();

    let day = (f2 - f1) / year;

    return day;
};

const importeCalculate = (maquinaria, days) => maquinaria.tarifa * days;

const descuentoCalculate = (importe, days) => {
    let descuento = 0;
    if (days > 7) {
        descuento = importe * 0.10;
    };
    return descuento;
};

const garantiaCalculate = (importe) => importe * 0.10;

const multaCalculate = (importe) => importe + (importe * 0.05);

const totalCalculate = (importe, descuento, multa) => {
    if (!multa) {
        return importe - descuento;
    } else {
        return importe + multa;
    }
};

module.exports.AlquilerUtils = {
    daysCalculate,
    importeCalculate,
    descuentoCalculate,
    garantiaCalculate,
    multaCalculate,
    totalCalculate
}