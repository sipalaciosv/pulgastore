function esCorreoValido(correo) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}

function mostrarFechaHora() {
    const fecha = new Date();
    const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    const diaSemana = diasSemana[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');
    
    const mensaje = `Hoy es <b>${diaSemana} ${dia} de ${mes} de ${anio}</b> y son las <b>${hora}:${minutos}:${segundos}</b> horas.`;
    const contenedor = document.getElementById("fechahora");
    if (contenedor) contenedor.innerHTML = mensaje;
  }
  
  function validar(event) {
    event.preventDefault(); 
  
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();
    const origen = document.getElementById("origen") ? document.getElementById("origen").value.trim() : '';
  
    const errorContenedor = document.getElementById("mensaje-error");
  
    let errores = [];
    if (!nombre) errores.push("Debes ingresar tu nombre.");
    if (!correo) {
      errores.push("Debes ingresar tu correo electrónico.");
    } else if (!esCorreoValido(correo)) {
      errores.push("El correo electrónico ingresado no es válido.");
    }
    if (!mensaje) errores.push("Debes ingresar tu mensaje.");
    if (!origen) errores.push("Debes seleccionar cómo nos conociste.");
  
    if (errores.length > 0) {
      errorContenedor.innerHTML = errores.join("<br>");
      errorContenedor.style.display = "block";
      errorContenedor.className = "alert alert-danger text-center mb-3";
    } else {
      errorContenedor.style.display = "none";
      alert("Formulario enviado correctamente. ¡Gracias por contactarnos!");
      event.target.reset();
    }
  }
  document.addEventListener('DOMContentLoaded', function() {
    mostrarFechaHora();
  
    const form = document.getElementById("form-contacto");
    if (form) {
      form.addEventListener("submit", validar);
    }
  });
  $(document).ready(function(){
  if ($('.testimonios-slider').length) {
    $('.testimonios-slider').slick({
      dots: true,
      arrows: true,
      autoplay: true,
      autoplaySpeed: 4000,
      adaptiveHeight: true
    });
  }

  
  if (window.Fancybox) {
    Fancybox.bind('[data-fancybox="galeria"]', {});
  }
});
