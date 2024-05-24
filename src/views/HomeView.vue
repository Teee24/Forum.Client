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
</div>
</template>
