---
layout: none
---

{%- capture _lunr_excerpt -%}
  {{ include.doc.content | newline_to_br |
    replace:"<br />", " " |
    replace:"</p>", " " |
    replace:"</h1>", " " |
    replace:"</h2>", " " |
    replace:"</h3>", " " |
    replace:"</h4>", " " |
    replace:"</h5>", " " |
    replace:"</h6>", " "|
  strip_html | strip_newlines }}
{%- endcapture -%}

var store = [
  {%- assign first_item = true -%}

  {%- comment -%}Collections (posts + any custom collections){%- endcomment -%}
  {%- for c in site.collections -%}
    {%- assign docs = c.docs | where_exp:'doc','doc.search != false' -%}
    {%- for doc in docs -%}
      {%- if doc.title and doc.url -%}
        {%- if first_item -%}{%- assign first_item = false -%}{%- else -%},{%- endif -%}
        {%- if doc.header.teaser -%}
          {%- capture teaser -%}{{ doc.header.teaser }}{%- endcapture -%}
        {%- else -%}
          {%- assign teaser = site.teaser -%}
        {%- endif -%}
        {
          "title": {{ doc.title | jsonify }},
          "excerpt":
            {%- if site.search_full_content == true -%}
              {{ doc.content | newline_to_br |
                replace:"<br />", " " |
                replace:"</p>", " " |
                replace:"</h1>", " " |
                replace:"</h2>", " " |
                replace:"</h3>", " " |
                replace:"</h4>", " " |
                replace:"</h5>", " " |
                replace:"</h6>", " "|
              strip_html | strip_newlines | jsonify }},
            {%- else -%}
              {{ doc.content | newline_to_br |
                replace:"<br />", " " |
                replace:"</p>", " " |
                replace:"</h1>", " " |
                replace:"</h2>", " " |
                replace:"</h3>", " " |
                replace:"</h4>", " " |
                replace:"</h5>", " " |
                replace:"</h6>", " "|
              strip_html | strip_newlines | truncatewords: 50 | jsonify }},
            {%- endif -%}
          "categories": {{ doc.categories | jsonify }},
          "tags": {{ doc.tags | jsonify }},
          "url": {{ doc.url | relative_url | jsonify }},
          "teaser": {{ teaser | relative_url | jsonify }}
        }
      {%- endif -%}
    {%- endfor -%}
  {%- endfor -%}

  {%- comment -%}Pages (so _pages/ is searchable too){%- endcomment -%}
  {%- assign pages = site.pages | where_exp:'p','p.search != false' -%}
  {%- for p in pages -%}
    {%- if p.title and p.url and p.layout and p.url != "/" -%}
      {%- if first_item -%}{%- assign first_item = false -%}{%- else -%},{%- endif -%}
      {
        "title": {{ p.title | jsonify }},
        "excerpt":
          {%- if site.search_full_content == true -%}
            {{ p.content | newline_to_br |
              replace:"<br />", " " |
              replace:"</p>", " " |
              replace:"</h1>", " " |
              replace:"</h2>", " " |
              replace:"</h3>", " " |
              replace:"</h4>", " " |
              replace:"</h5>", " " |
              replace:"</h6>", " "|
            strip_html | strip_newlines | jsonify }},
          {%- else -%}
            {{ p.content | newline_to_br |
              replace:"<br />", " " |
              replace:"</p>", " " |
              replace:"</h1>", " " |
              replace:"</h2>", " " |
              replace:"</h3>", " " |
              replace:"</h4>", " " |
              replace:"</h5>", " " |
              replace:"</h6>", " "|
            strip_html | strip_newlines | truncatewords: 50 | jsonify }},
          {%- endif -%}
        "categories": {{ p.categories | jsonify }},
        "tags": {{ p.tags | jsonify }},
        "url": {{ p.url | relative_url | jsonify }},
        "teaser": {{ site.teaser | relative_url | jsonify }}
      }
    {%- endif -%}
  {%- endfor -%}
]
