

//Valida si existe la fecha

const moment = require("moment");

//si esta funcion regresa false, ese campo no es correcto, la validacion falla
const isDate = (value) => {

    if( !value ){ //si no existe el value(diferente! de value)
        return false;
    }

    //Valida la fecha con momment este indicará si es una fecha correcta o no
    const fecha = moment(value);

    if(fecha.isValid()){//si la fecha es valida retorna true
        return true;
    }else{ //si la fecha no es valida retorna false
        return false;
    }
   
}

module.exports = {
    isDate
}
