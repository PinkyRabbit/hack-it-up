/* eslint-disable consistent-return, func-names, no-unused-vars */
const inputOptions = {
  h1: [3, 30],
  title: [3, 300],
  keywords: [0, 300],
  description: [0, 300],
};

function logOnError(error) {
  // eslint-disable-next-line no-console
  console.error(error);
}

function inputRemoveGreen(el) {
  if (el.hasClass('has-success')) {
    el.removeClass('has-success');
    el.find('.glyphicon-ok').remove();
  }
}

function inputMakeRed(el) {
  if (!el.hasClass('has-error')) {
    el.addClass('has-error');
    el
      .find('.input-group')
      .append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
  }
}

function inputRemoveRed(el) {
  if (el.hasClass('has-error')) {
    el.removeClass('has-error');
    el.find('.glyphicon-remove').remove();
  }
}

function inputMakeGreen(el) {
  if (!el.hasClass('has-success')) {
    el.addClass('has-success');
    el
      .find('.input-group')
      .append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');
  }
}

function validateInput(name) {
  const el = $(`#${name}`);
  if (!el) {
    return false;
  }
  const value = el.find('input').val();
  const [min, max] = inputOptions[name];
  if (value.length > max) {
    inputRemoveGreen(el);
    inputMakeRed(el);
    return true;
  }

  if (value.length > min) {
    inputRemoveRed(el);
    inputMakeGreen(el);
    return true;
  }

  inputRemoveGreen(el);
  inputRemoveRed(el);
}

let timestamp = Date.now();
const delay = 1000;
function delayedInputValidation(name) {
  const el = $(`#${name}`);
  if (!el) {
    return false;
  }
  validateInput(name);

  $(el).on('keyup', () => {
    const timer = setTimeout(() => {
      if (Date.now() - timestamp >= delay) {
        validateInput(name);
        clearTimeout(timer);
      }
    }, delay);
    timestamp = Date.now();
  });
}

function setCategoryColor(select, value) {
  if (value) {
    select.addClass('input-success');
  } else {
    select.removeClass('input-success');
  }
}

function selectCategory() {
  const el = $('#category');
  const value = el.data('base-value');
  const select = el.find('select');
  select.val(value).change();
  setCategoryColor(select, value);
  select.on('change', function () {
    const newValue = $(this).val();
    setCategoryColor(select, newValue);
  });
}

function addEditor() {
  const editorSettings = {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [2, 3, false] }],
        ['font', 'size'],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        ['link', 'image', 'code', 'code-block'],
      ],
    },
  };

  const container = document.getElementById('editor');
  const editor = new Quill(container, editorSettings);
  return editor;
}

function bidTagRemove(el) {
  el.on('click', function () {
    $(this).remove();
  });
}

function selectTag(tagName) {
  $('#tags-list').innerHTML = '';
  $('#tags-area').append(`
    <span class="tag-wrapper" onclick="function(){ $(this).remove(); }">
      <input class="form-control" autocomplete="off" name="tags" type="hidden" value="${tagName}" />
      <span class="label label-info">
        <span class="glyphicon glyphicon-tag" area-hidden="true"></span> ${tagName} 
      </span>
    </span>
  `);
}

function createATag(tagName) {
  $.ajax({
    type: 'POST',
    url: '/admin/tags',
    data: { tagName },
    dataType: 'json',
    success: (data) => {
      selectTag(tagName);
    },
    error: logOnError,
  });
  $('#tag').val('');
}

function searchTag(val) {
  if (val.length < 2) {
    return false;
  }
  const tagsList = $('#tags-list');
  tagsList.innerHTML = '';

  $.ajax({
    type: 'GET',
    url: `/admin/tags/search?search=${val}`,
    success: (response) => {
      const { data } = response;
      data.forEach(({ name: tag }) => {
        tagsList.append(`<a class="list-group-item" href="#" onclick="selectTag('${tag}')">${tag}</a>`);
      });
    },
    error: logOnError,
  });
}

function initTags() {
  const tagInput = $('#tag');
  $('#create-tag').on('click', () => createATag(tagInput.val()));
  tagInput.on('keyup', () => {
    const timer = setTimeout(() => {
      if (Date.now() - timestamp >= delay) {
        searchTag(tagInput.val());
        clearTimeout(timer);
      }
    }, delay);
    timestamp = Date.now();
  });

  $('.tag-wrapper').each(function () {
    const el = $(this);
    bidTagRemove(el);
  });
}

function onImageSelect() {
  if (this.files && this.files[0]) {
    const [file] = this.files;
    if (!file.type.match(/image.*/)) {
      return false;
    }
    const reader = new FileReader();

    reader.onload = () => {
      // $('#img-preview').attr('src', reader.result);
      $('#img-spinner').attr('style', '');
      $('#img-preview').attr('style', 'display:none');
      $('#send-image-form').submit();
    };

    reader.readAsDataURL(file);
  }
}

function initImage() {
  $('#img-button').on('click', () => {
    $('#image-file').trigger('click');
  });

  $('#image-file').change(onImageSelect);
}

function save(editor) {
  const content = editor.container.firstChild.innerHTML;
  const form = $('#edit-article-form').serializeArray();
  $.each(form, (i) => {
    if (form[i].name === 'content') {
      form.splice(i, 1);
      return false;
    }
  });
  const id = $('#_id').val();
  form.push({ name: 'content', value: content });
  $.ajax({
    type: 'PUT',
    url: `/admin/article/${id}`,
    data: form,
    dataType: 'json',
    success: () => {
      // eslint-disable-next-line no-console
      console.log(`Autosave ${(new Date()).toLocaleString()}`);
    },
    error: logOnError,
  });
}

function autosave(editor) {
  setInterval(() => save(editor), 6000);
}

document.addEventListener('DOMContentLoaded', () => {
  const inputs = Object.keys(inputOptions);
  inputs.forEach((name) => delayedInputValidation(name));
  selectCategory();
  initTags();
  initImage();
  const editor = addEditor();
  autosave(editor);
  $('#edit-article-form').on('submit', (e) => {
    const content = editor.container.firstChild.innerHTML;
    $('#content-input').val(content);
  });
});
