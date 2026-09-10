---
layout: page
title: Projects
permalink: /projects/
description: These projects develop experimental sensing platforms that combine photonic devices, optical interrogation, and data-driven signal processing. Across energy infrastructure, health, environmental monitoring, and smart-built-environment applications, the shared aim is to produce reliable optical measurements outside tightly controlled laboratory conditions. Where work is ongoing or unpublished, the project descriptions intentionally focus on the high-level research scope and development direction..
nav: true
nav_order: 3
display_categories: [Photonics research, Undergraduate research and prototyping mentorship]
horizontal: false
---


<!-- pages/projects.md -->
<div class="projects">
{% if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {% for category in page.display_categories %}
  <a id="{{ category }}" href=".#{{ category }}">
    <h2 class="category">{{ category }}</h2>
  </a>
  {% assign categorized_projects = site.projects | where: "category", category %}
  {% assign sorted_projects = categorized_projects | sort: "importance" %}
  <!-- Generate cards for each project -->
  {% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
  {% endfor %}

{% else %}

<!-- Display projects without categories -->

{% assign sorted_projects = site.projects | sort: "importance" %}

  <!-- Generate cards for each project -->

{% if page.horizontal %}

  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
{% endif %}
</div>


Across these projects, I work on intelligent fiber-optic sensing approaches for reliable monitoring of critical infrastructure and complex environments. Much of my work comes back to a simple question: how can optical sensing systems stay accurate, robust, and useful outside tightly controlled laboratory conditions?
I explore this by bringing together experimental photonics, practical optical interrogation, and data-driven signal processing across infrastructure, environmental, health, and smart-built-environment applications.

My recent work includes six first- and corresponding-author journal publications in 2025–2026, including four papers in IEEE journals and letters. 
Within collaborative and funded projects, I help shape research questions and contribute to experimental planning, sensing-platform design, data analysis, and publication. I have also helped develop successful proposals that secured industry funding, and conversations with sensing-technology and operations providers have helped keep the research grounded in practical deployment needs.
Alongside this work, I mentor undergraduate and postgraduate researchers through laboratory work, safety practice, prototype development, and research communication. Together, these experiences connect rigorous photonics research with real-world sensing needs.
