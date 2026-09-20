---
layout: page
title: Photonics Teaching Demos
permalink: /demos/
nav: true
nav_order: 12
---


Interactive demos for exploring fiber optics, optical sensing, plasmonics, and integrated photonics.

I built these interactive demos to make some of the photonics and optical-sensing concepts I work with in the lab easier to explore. They are meant to be self-guided, so students can experiment with the ideas and build intuition at their own pace.
In the lab, I use more rigorous computational models and simulations. Here, I intentionally simplify the first encounter while keeping the key physics, assumptions, and engineering trade-offs visible. Think of these demos as a starting point before diving into the full models.

<div class="demo-grid">

  <a class="demo-card" href="{{ '/demos/fbg-strain/' | relative_url }}">

    <div class="demo-card-preview">
  <img
  src="{{ '/assets/img/demos/fbg-module-preview.webp' | relative_url }}"
  alt="Teaching schematic showing FBG wavelength-encoded strain sensing, measurement performance, and railway-bridge monitoring application."
  loading="lazy"
>
</div>

    <div class="demo-card-body">

      <h3>Fiber Bragg Grating Strain Sensor</h3>

      <p>
        Explore how axial strain changes the grating period and effective
        refractive index, producing a measurable shift in the Bragg reflection.
      </p>

      <span class="demo-card-link">
        Explore demo →
      </span>

    </div>

  </a>

 <a class="demo-card" href="{{ '/demos/das-localization/' | relative_url }}">

  <div class="demo-card-preview">
    <img
      src="{{ '/assets/img/demos/das-module-preview.webp' | relative_url }}"
      alt="Animated DAS teaching schematic showing disturbance localization, measurement design trade-offs, and application-driven system design."
      loading="lazy"
    >
  </div>

  <div class="demo-card-body">

    <h3>Distributed Acoustic Sensing (DAS)</h3>

    <p>
      Explore how DAS localizes disturbances, how spatial and temporal design
      trade-offs shape the measurement, and how application requirements guide
      system design.
    </p>

    <span class="demo-card-link">
      Explore demo →
    </span>

  </div>

</a>

<a class="demo-card" href="{{ '/demos/spr-sensing/' | relative_url }}">

  <div class="demo-card-preview">
    <img
      src="{{ '/assets/img/demos/spr-module-preview.webp' | relative_url }}"
      alt="Interactive SPR teaching demo showing Kretschmann excitation, interrogation methods, sensor-design trade-offs, and affinity-biosensing kinetics."
      loading="lazy"
    >
  </div>

  <div class="demo-card-body">

    <h3>Surface Plasmon Resonance (SPR) Sensor</h3>

    <p>
      Explore SPR excitation, compare angular, wavelength, and intensity interrogation,
      investigate sensing range and sampling resolution, and connect the optical response
      to an affinity-biosensing application.
    </p>

    <span class="demo-card-link">
      Explore demo →
    </span>

  </div>

</a>

<a class="demo-card" href="{{ '/demos/das-pipeline-decision/' | relative_url }}">

  <div class="demo-card-preview">
    <img
      src="{{ '/assets/img/demos/das-pipeline-decision-preview.webp' | relative_url }}"
      alt="Interactive DAS pipeline-monitoring teaching demo showing detection thresholds, feature extraction, three-dimensional event classification, and intelligent deployment trade-offs."
      loading="lazy"
    >
  </div>

  <div class="demo-card-body">

    <h3>DAS Pipeline State Detection and Intelligent Decisions</h3>

    <p>
      Follow a pipeline disturbance from DAS measurement through filtering, detection,
      event interpretation, feature-space classification, and deployment of intelligent
      processing.
    </p>

    <span class="demo-card-link">
      Explore demo →
    </span>

  </div>

</a>
</div>

<link
  rel="stylesheet"
  href="{{ '/assets/css/demos/demo-gallery.css' | relative_url }}"
>

