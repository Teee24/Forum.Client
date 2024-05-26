<script setup>

import { ref, onMounted } from 'vue'

const response = ref([])
const allData=ref([]) 
async function fetchData() {
  const res = await fetch(`https://localhost:7177/api/Forum/Get`)
  const data = await res.json()
  response.value = data
  allData.value = response.value['returnData']
}



onMounted(async () => {
  await fetchData()
})
</script>

<template>
  <div class="container-xxl">
    <!-- 上 -->
    <div class="row g-3">
  <div class="col-auto">
    <button type="button" class="btn btn-primary">新增貼文</button>
  </div>
  <div class="col-auto ms-auto">
    <div class="row g-3">
      <div class="col-auto">
        <select class="form-select" aria-label="Default select example">
          <option value="1">國際</option>
          <option value="2">娛樂</option>
          <option value="3">商業</option>
          <option selected value="4">全部</option>
        </select>
      </div>
      <div class="col-auto">
        <button type="button" class="btn btn-primary">查詢</button>
      </div>
    </div>
  </div>
</div>


    <hr />
    <!-- 中 -->
    <table class="table table-hover">
      <thead>
        <tr class="table-primary text-center">
          <!--流水號postId -->
          <th>編號</th>
          <th>分類</th>
          <th>標題</th>
          <th>內容</th>
          <th>發佈時間</th>
          <th>發佈者</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr class="text-center" v-for="(dataitem, index) in allData" :key="index">
          <td>{{ index+1 }}</td>
          <td>{{ dataitem['category'] }}</td>
          <td>{{ dataitem['title'] }}</td>
          <td>{{ dataitem['detail'] }}</td>
          <td>{{ dataitem['postDate'] }}</td>
          <td>{{ dataitem['publisher'] }}</td>
          <td><button  type="button" class="btn btn-info mr-3 mb-2">修改</button> <button type="button" class="btn btn-info">刪除</button></td>

        </tr>
      </tbody>
    </table>




  </div>
</template>
