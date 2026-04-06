---
title: "Recent Projects"
permalink: /recent-projects/
layout: archive
author_profile: false
classes: wide recent-projects-layout
---

<div class="recent-projects-page">
  <p class="recent-projects-page__intro">
    A complete list of my latest projects, case studies, and technical builds.
  </p>

  <section class="recent-projects-card recent-projects-card--full" aria-labelledby="recent-projects-page-title">
    <div class="recent-projects-card__head">
      <h3 class="archive__subtitle" id="recent-projects-page-title">All Recent Projects</h3>
      <a class="recent-projects-card__view-all" href="{{ '/' | relative_url }}#recent-projects">Back Home</a>
    </div>

    {% for post in site.posts %}
      {% include archive-single.html %}
    {% endfor %}
  </section>
</div>
