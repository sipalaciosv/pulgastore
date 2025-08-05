document.addEventListener('DOMContentLoaded', function() {
  let usuario = JSON.parse(localStorage.getItem('usuarioPulgaStore'));
  const spanNombre = document.getElementById('usuario-nombre');

  function mostrarSaludo(usuario) {
    if (spanNombre) {
      spanNombre.textContent = usuario ? `¡Bienvenido, ${usuario.nombre} ${usuario.apellido}!` : '';
    }
  }

  if (!usuario) {
    const modalElem = document.getElementById('modalNombre');
    if (modalElem) {
      let modal = new bootstrap.Modal(modalElem, {backdrop: 'static', keyboard: false});
      modal.show();

      document.getElementById('form-nombre').onsubmit = function(e) {
        e.preventDefault();
        let nombre = document.getElementById('nombre').value.trim();
        let apellido = document.getElementById('apellido').value.trim();
        if (nombre && apellido) {
          usuario = { nombre, apellido };
          localStorage.setItem('usuarioPulgaStore', JSON.stringify(usuario));
          mostrarSaludo(usuario);
          modal.hide();
        }
      };
    }
  } else {
    mostrarSaludo(usuario);
  }
});
