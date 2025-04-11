

export const showLoginError = () => {
  Swal.fire({
    icon: 'error',
    title: 'Falló inicio de sesión',
    text: 'Email o contraseña incorrectos. Vuelve a intentarlo!',
    confirmButtonColor: ' #FF6C40',
    confirmButtonText: 'Reintentar',
  });
};

export const showIncompleteFieldsError = () => {
  Swal.fire({
    icon: 'warning',
    title: 'Campos Incompletos',
    text: 'Por favor completa todos los campos requeridos para continuar',
    confirmButtonColor: ' #FF6C40',
    confirmButtonText: 'Aceptar',
  });
};

export const showUpgradePlanAlert = () => {
  Swal.fire({
    icon: 'info',
    title: 'Pago Requerido',
    html: 'Para añadir más menús y/o platillos debes acceder al plan <span class="fw-bold text-orange">ALPUNTO+ 🚀</span>',
    confirmButtonColor: ' #FF6C40',
    confirmButtonText: 'Comprar',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    cancelButtonColor: '#F8FAFC',
    customClass: {
      cancelButton: 'alert-cancel-button'
    }
  ,
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = '/plan-purchase';
    }
  });
};

export const showLoadingError = (item) => {
    Swal.fire({
      icon: 'error',
      title: 'Error Cargando Datos',
      text: `Ha ocurrido un error al cargar ${item}`,
      confirmButtonColor: ' #FF6C40',
      confirmButtonText: 'Aceptar',
    });
  };


  export const showDeleteError = (item) => {
    Swal.fire({
      icon: 'error',
      title: 'Elemento no eliminado',
      text: `Ha ocurrido un error al eliminar ${item}`,
      confirmButtonColor: ' #FF6C40',
      confirmButtonText: 'Aceptar',
    });
  };