export default {
  methods: {
    bloquear (e) {
      // 46 - Delete
      // 8 - Backspace
      // 9 - Tab
      // 27 - Escape
      // 13 - Enter
      let code = e.keyCode || e.charCode;
      if ([27, 9, 13].indexOf(code) !== -1) {
        let btnCancel = document.querySelector('#md-btn-confirm-selected-cancel');
        let btnOk = document.querySelector('#md-btn-confirm-selected-ok');
        let select = document.activeElement;
        if (code === 9) {
          console.log('select.class', select, select.classList.contains('md-button-confirm'));
          if (select.id !== 'md-btn-confirm-selected-cancel') {
            setTimeout(function () {
              btnOk.classList.remove('md-focused');
              btnCancel.classList.add('md-focused');
              btnCancel.focus();
            }, 10);
          } else {
            setTimeout(function () {
              btnCancel.classList.remove('md-focused');
              btnOk.classList.add('md-focused');
              btnOk.focus();
            }, 10);
          }
        }
        if (code === 27) {
          btnCancel.click();
        }
        if (code === 13) {
          if (select.id === 'md-btn-confirm-selected-ok') {
            btnOk.click();
          } else {
            if (select.id === 'md-btn-confirm-selected-cancel') {
              btnCancel.click();
            } else {
              e.preventDefault();
            }
          }
        }
        return false;
      } else {
        e.preventDefault();
      }
    }
  }
};
