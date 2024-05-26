<script setup>
import { ref, onMounted } from 'vue'

const response = ref([])
const allData = ref([])
async function fetchData() {
  const res = await fetch(`https://localhost:7177/api/Forum/Get`)
  const data = await res.json()
  response.value = data
  allData.value = response.value['returnData']
}

//TODO: 新增貼文
// 貼文欄位
// const entity = [category:'',
// detail:'',
// postDate:''
// postId:''
// publisher:''
// title:'']

async function created() {
  // Simple POST request with a JSON body using fetch
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Vue POST Request Example" })
  };
  fetch("https://localhost:7177/api/Forum/Insert", requestOptions)
    .then(response => response.json())
    .then(data => (this.postId = data.id));
}

// TODO: 刪除貼文
async function deletePost(postId) {
    // Simple DELETE request with fetch
    fetch('https://localhost:7177/api/Forum/Delete/'+postId, { method: 'DELETE' })
    .then(() => this.status = 'Delete successful');
  
}


onMounted(async () => {
  await fetchData()
})
</script>

<template>
  <!--TODO:顯示貼文-->
  <div class="container-xxl">
    <!-- 上 -->
    <div class="row g-3">
      <div class="col-auto">
        <button
          @click="addPostPage"
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          data-bs-whatever="@fat"
        >
          新增貼文
        </button>
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
          <td>{{ index + 1 }}</td>
          <td>{{ dataitem['category'] }}</td>
          <td>{{ dataitem['title'] }}</td>
          <td>{{ dataitem['detail'] }}</td>
          <td>{{ dataitem['postDate'] }}</td>
          <td>{{ dataitem['publisher'] }}</td>
          <td>
            <button  @click="modifyPost(dataitem['postId'])" type="button"  class="btn btn-info mr-3 mb-2">修改</button>
            <button  @click="deletePost(dataitem['postId'])" type="button"  class="btn btn-info">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!--TODO:新增貼文-->
  <!--新增貼文Modal-->
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">New message</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="recipient-name" class="col-form-label">Recipient:</label>
              <input type="text" class="form-control" id="recipient-name" />
            </div>
            <div class="mb-3">
              <label for="message-text" class="col-form-label">Message:</label>
              <textarea class="form-control" id="message-text"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Send message</button>
        </div>
      </div>
    </div>
  </div>
</template>
