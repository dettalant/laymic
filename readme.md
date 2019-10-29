laymic - overlay comic viewer
=======================

[日本語版readmeはこちら](./readme_ja.md)

**commonjs `Laymic` class example**

```javascript
const { Laymic } = require("laymic"); 

const pages = [
  "page0.png",
  "page1.png",
  "page2.png",
  "page3.png",
  "page4.png"
];

const laymic = new Laymic(pages, {
  pageWidth: 690,
  pageHeight: 976,
})

el.addEventListener("click", () => {
  laymic.open();
})
```

**iife `LaymicApplicator` class example**

```html
<!-- viewer1 -->
<div class="laymic_template" data-viewer-id="laymic0">
  <img data-src="page0.png">
  <img data-src="page1.png">
  <img data-src="page2.png">
</div>
<button class="laymic_opener" type="button" data-for="laymic0">
  open viewer1
</button>

<!-- viewer2 -->
<div class="laymic_template" data-viewer-id="laymic1">
  <img data-src="page0.png">
  <img data-src="page1.png">
  <img data-src="page2.png">
</div>
<button class="laymic_opener" type="button" data-for="laymic1">
  open viewer2
</button>

<script src="laymic.iife.min.js"></script>
<script>
const applicator = new laymic.LaymicApplicator(".laymic_template", {
  pageWidth: 690,
  pageHeight: 976,
})
</script>
```
