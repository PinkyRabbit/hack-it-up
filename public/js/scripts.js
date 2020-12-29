function addImageResponsive() {
  $(this).addClass('img-responsive');
}

(() => {
  const search = $('#search');
  const searchMenu = $('#search-menu');
  search.on('keyup', (e) => {
    const val = e.target.value;
    const url = `/search?search=${val}`;
    $.get(url, (data) => {
      const html = data
        .reduce((accum, d) => `${accum}<a href="/${d.categorySlug}/${d.articleSlug}" class="list-group-item">${d.h1}</a>`, '');
      searchMenu.html(html);
    });
  });

  $(document).ready(() => {
    $('.prevent').on('click', (e) => {
      e.preventDefault();
    });

    $('img').each(addImageResponsive);
  });
})();
