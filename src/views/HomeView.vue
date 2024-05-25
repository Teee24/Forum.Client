<script setup>
import {ref,onMounted} from 'vue'

const allData = ref([])
async function fetchData() {
  const res = await fetch(
    `https://localhost:7177/api/Forum/Get`
  )
  const data = await res.json()
  allData.value = data
}
onMounted(async()=>{
  await fetchData()
})

</script>

<template>
  <!-- 整包資料 -->
<div class="">
  <ul class="nav">
  <li class="nav-item">
    <a class="nav-link active" aria-current="page" href="#">全部</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">國際</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">科技</a>
  </li>
  <li class="nav-item">
    <a class="nav-link " >娛樂</a>
  </li>
</ul>
<div class="list-group list-group-flush">
  <a href="#" class="list-group-item list-group-item-action active" aria-current="true">
    <div class="d-flex w-100 justify-content-between">
      <p class="mb-1">Publisher</p>
      <small>Date</small>
    </div>
    <h5 class="mb-1">Title</h5>
    <small>Detail...</small>
    <br>
    <div><h5 class="badge rounded-pill bg-secondary">Category</h5></div>
    
  </a>
  <hr>
  <a href="#" class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">List group item heading</h5>
      <small class="text-muted">3 days ago</small>
    </div>
    <p class="mb-1">Some placeholder content in a paragraph.</p>
    <small class="text-muted">And some muted small print.</small>
  </a>
  <a href="#" class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">List group item heading</h5>
      <small class="text-muted">3 days ago</small>
    </div>
    <p class="mb-1">Some placeholder content in a paragraph.</p>
    <small class="text-muted">And some muted small print.</small>
  </a>
</div>
</div>
</template>
