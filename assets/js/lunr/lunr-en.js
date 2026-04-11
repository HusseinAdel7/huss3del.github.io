---
layout: none
---

var idx = lunr(function () {
  this.field('title')
  this.field('excerpt')
  this.field('categories')
  this.field('tags')
  this.ref('id')

  this.pipeline.remove(lunr.trimmer)

  for (var item in store) {
    this.add({
      title: store[item].title,
      excerpt: store[item].excerpt,
      categories: store[item].categories,
      tags: store[item].tags,
      id: item
    })
  }
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getDirectAnswers(query) {
  var q = (query || '').toLowerCase().trim();
  if (!q) return [];

  var answers = [];

  var hasName = /(name|my name|who am i|الاسم|اسمك)/.test(q);
  var hasPhone = /(phone|mobile|number|tel|whatsapp|واتساب|رقم|تليفون|هاتف)/.test(q);
  var hasEmail = /(email|mail|gmail|الايميل|البريد)/.test(q);
  var hasLocation = /(location|address|where|city|country|العنوان|الموقع|مكان)/.test(q);

  if (hasName) {
    answers.push('My name is Hussein Adel.');
  }
  if (hasPhone) {
    answers.push('My phone number is +201098018628.');
  }
  if (hasEmail) {
    answers.push('My email is husseinadelhhh@gmail.com.');
  }
  if (hasLocation) {
    answers.push('My location is Cairo, Egypt.');
  }

  return answers;
}

function renderDirectAnswers(resultdiv, query) {
  var answers = getDirectAnswers(query);
  if (!answers.length) return;

  var html = '<div class="list__item">' +
    '<article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">' +
    '<h2 class="archive__item-title" itemprop="headline">Direct Answer</h2>' +
    '<p class="archive__item-excerpt" itemprop="description">' + escapeHtml(answers.join(' ')) + '</p>' +
    '</article>' +
    '</div>';

  resultdiv.append(html);
}

$(document).ready(function() {
  $('input#search').on('keyup', function () {
    var resultdiv = $('#results');
    var query = $(this).val().toLowerCase();
    if (!query.trim()) {
      resultdiv.empty();
      return;
    }
    var result =
      idx.query(function (q) {
        query.split(lunr.tokenizer.separator).forEach(function (term) {
          q.term(term, { boost: 100 })
          if(query.lastIndexOf(" ") != query.length-1){
            q.term(term, {  usePipeline: false, wildcard: lunr.Query.wildcard.TRAILING, boost: 10 })
          }
          if (term != ""){
            q.term(term, {  usePipeline: false, editDistance: 1, boost: 1 })
          }
        })
      });
    resultdiv.empty();
    renderDirectAnswers(resultdiv, query);
    var visibleCount = 0;
    for (var item in result) {
      var ref = result[item].ref;
      if (!store[ref] || store[ref].url === '/search-data/' || store[ref].url === '{{ "/search-data/" | relative_url }}') {
        continue;
      }
      visibleCount += 1;
      if(store[ref].teaser){
        var searchitem =
          '<div class="list__item">'+
            '<article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">'+
              '<h2 class="archive__item-title" itemprop="headline">'+
                '<a href="'+store[ref].url+'" rel="permalink">'+store[ref].title+'</a>'+
              '</h2>'+
              '<div class="archive__item-teaser">'+
                '<img src="'+store[ref].teaser+'" alt="">'+
              '</div>'+
              '<p class="archive__item-excerpt" itemprop="description">'+store[ref].excerpt.split(" ").splice(0,20).join(" ")+'...</p>'+
            '</article>'+
          '</div>';
      }
      else{
    	  var searchitem =
          '<div class="list__item">'+
            '<article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">'+
              '<h2 class="archive__item-title" itemprop="headline">'+
                '<a href="'+store[ref].url+'" rel="permalink">'+store[ref].title+'</a>'+
              '</h2>'+
              '<p class="archive__item-excerpt" itemprop="description">'+store[ref].excerpt.split(" ").splice(0,20).join(" ")+'...</p>'+
            '</article>'+
          '</div>';
      }
      resultdiv.append(searchitem);
    }
    resultdiv.prepend('<p class="results__found">'+visibleCount+' {{ site.data.ui-text[site.locale].results_found | default: "Result(s) found" }}</p>');
  });
});
