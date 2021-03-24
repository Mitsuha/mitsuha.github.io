---
title: Link
date: 2021-03-24 16:48:15
---
<% css('./styles.styl') %>
# 嗨！

<!-- 我是一个 Programmer，ACG lovers，Golang、Dart、Rust 的使用者。宇宙的星尘，~~人间的 five~~。很高兴认识你，我会在这里发布我的所知所想以及对世界的看法。欢迎关注 -->

这里是一些很厉害的人。如果你有空，推荐去看看

<div class="card-wallet">
  {% for link in site.data.links %}
    <div class="business-card">
      <div class="avatar">
        <img src="{{ link.avatar }}" alt="">
      </div>
      <div class="introduction">
        <p class="name">{{ link.name }}</p>
        <p class="stack">{{ link.stack }}</p>
        <p class="description">{{ link.description }}</p>
      </div>
    </div>
  {% endfor %}
</div>