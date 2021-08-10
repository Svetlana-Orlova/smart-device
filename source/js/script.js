(() => {
  const anchors = document.querySelectorAll('.banner a');

  anchors.forEach((anchor) => {
    anchor.addEventListener('click', (evt) => {
      evt.preventDefault();

      const sectionID = anchor.getAttribute('href').substr(1);

      document.getElementById(sectionID).scrollIntoView({
        behavior: 'smooth',
        section: 'start',
      });
    });
  });

  const forms = document.querySelectorAll('form');
  const inputsName = document.querySelectorAll('input[type="text"]');
  const inputsPhone = document.querySelectorAll('input[type="tel"]');
  const textareas = document.querySelectorAll('textarea');

  let isStorageSupport = true;
  let storage = '';
  let storageTel = '';
  let storageMessage = '';

  try {
    storage = localStorage.getItem('username');
    storageTel = localStorage.getItem('usertel');
    storageMessage = localStorage.getItem('message');
  } catch (err) {
    isStorageSupport = false;
  }

  if (isStorageSupport) {
    inputsName.forEach((name) => {
      name.value = storage;
    });
    inputsPhone.forEach((phone) => {
      phone.value = storageTel;
    });
    textareas.forEach((text) => {
      text.value = storageMessage;
    });
  }

  forms.forEach((form) => {
    form.addEventListener('submit', () => {
      if (isStorageSupport) {
        localStorage.setItem('username', form.querySelector('input[type="text"]').value);
        localStorage.setItem('usertel', form.querySelector('input[type="tel"]').value);
        localStorage.setItem('message', form.querySelector('textarea').value);
      }
    });
  });

  const body = document.body;
  const link = document.querySelector('.call');
  const popup = document.querySelector('#popup');
  const userName = popup.querySelector('input[type="text"]');
  const userPhone = popup.querySelector('input[type="tel"]');
  const textarea = popup.querySelector('textarea');
  const buttonClose = popup.querySelector('.close-button');

  link.addEventListener('click', (evt) => {
    evt.preventDefault();
    popup.classList.add('popup--opened');
    body.classList.add('fixed');
    userName.focus();
    if (storage) {
      userName.value = storage;
    }
    if (storageTel) {
      userPhone.value = storageTel;
    }
    if (storageMessage) {
      textarea.value = storageMessage;
    }
  });

  const closePopup = () => {
    popup.classList.remove('popup--opened');
    body.classList.remove('fixed');
  };

  buttonClose.addEventListener('click', (evt) => {
    evt.preventDefault();
    closePopup();
  });

  window.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      if (popup.classList.contains('popup--opened')) {
        evt.preventDefault();
        closePopup();
      }
    }
  });

  let overlay = false;

  document.addEventListener('mousedown', (evt) => {
    if (evt.target.classList.contains('popup')) {
      overlay = true;
    }
  });

  document.addEventListener('mouseup', (evt) => {
    if (overlay && evt.target.classList.contains('popup')) {
      evt.preventDefault();
      closePopup();
    }
    overlay = false;
  });

  window.addEventListener('DOMContentLoaded', () => {
    [].forEach.call(document.querySelectorAll('.tel'), (input) => {
      let keyCode;
      function mask (evt) {
        evt.keyCode && (keyCode = evt.keyCode);
        const pos = this.selectionStart;
        if (pos < 3) {
          evt.preventDefault();
        }
        const matrix = '+7 (___) ___ ____';
        let i = 0;
        const def = matrix.replace(/\D/g, '');
        const val = this.value.replace(/\D/g, '');
        let newValue = matrix.replace(/[_\d]/g, (a) => (i < val.length ? val.charAt(i++) || def.charAt(i) : a));
        i = newValue.indexOf('_');
        if (i !== -1) {
          i < 5 && (i = 3);
          newValue = newValue.slice(0, i);
        }
        let reg = matrix.substr(0, this.value.length).replace(/_+/g,
          (a) => (`\\d{1,${a.length}}`)).replace(/[+()]/g, '\\$&');
        reg = new RegExp(`^${reg}$`);
        if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
          this.value = newValue;
        }
        if (evt.type === 'blur' && this.value.length < 5) {
          this.value = '';
        }
      }

      input.addEventListener('input', mask, false);
      input.addEventListener('focus', mask, false);
      input.addEventListener('blur', mask, false);
      input.addEventListener('keydown', mask, false);
    });
  });
})();
