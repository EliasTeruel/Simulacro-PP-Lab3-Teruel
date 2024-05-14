class Anuncio {
    constructor(id, titulo, transaccion, descripcion, precio, puertas, kms, potencia) {
      this.id = id;
      this.titulo = titulo;
      this.transaccion = transaccion;
      this.descripcion = descripcion;
      this.precio = +precio;
      this.puertas = puertas;
      this.kms = kms;
      this.potencia = potencia;
  
    }
    verify() {  
      if (this.titulo.trim() == "") {
        return { success: false, rta: "El título no puede estar vacío." };
      } else if(this.precio <= 0){
        return { success: false, rta: "El precio debe ser mayor que 0" };
        }else{
          return { success: true, rta: "Ingreso valido" };
        }
      } 
    }
    export { Anuncio };
    
  
  