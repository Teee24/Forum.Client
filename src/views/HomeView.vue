<script setup>
import { ref, onMounted, computed } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Modal } from 'bootstrap'

// TODO: 顯示貼文
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
const post = ref({ category: '', detail: '', postDate: '', postId: '', publisher: '', title: '' })

const exampleModal = ref(null)
const modal = ref(null)

const onSubmit = async () => {
  const newPost = {
    category: post.value.category,
    title: post.value.title,
    detail: post.value.detail,
    publisher: post.value.publisher
  }

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost)
  }
  console.log(requestOptions)
  const addpost = await fetch('https://localhost:7177/api/Forum/Insert', requestOptions)
  const response = await addpost.json()

  // 刷新頁面
  fetchData()

  // TODO: 關閉modal
  modal.value.hide()
}

// TODO: 修改貼文
const modifyModal = ref(null)
// 先拿到單筆資料
const postinfo = ref([])
async function fetchPost(postId) {
  const data = await fetch(`https://localhost:7177/api/Forum/GetById/` + postId)
  const originpost = await data.json()
  postinfo.value = originpost['returnData']
  console.log(postinfo.value)
}

// 修改的資料
const  modifyPost=async(postId) =>{

  console.log(postId)
  const updatepost = {
    category: postinfo.value.category,
    title: postinfo.value.title,
    detail: postinfo.value.detail,
    publisher: postinfo.value.publisher,
    postId:postinfo.value.postId
  }

  console.log(updatepost)
  const requestOption = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatepost)
  }
  console.log(requestOption)
  const updatedata = await fetch(`https://localhost:7177/api/Forum/Update`,requestOption)
  const afterupdate = await updatedata.json()
  const result = afterupdate['returnMessage']
  console.log(result)
    // 刷新頁面
    fetchData()
    // TODO: 關閉modal
    modal.value.hide()
}

// TODO: 刪除貼文
const deletePost = async (postId) => {
  // Simple DELETE request with fetch
  const request = await fetch('https://localhost:7177/api/Forum/Delete/' + postId, {
    method: 'DELETE'
  })
  fetchData()
}

// init 在setup之前
onMounted(async () => {
  await fetchData()

  // 先實例化
  modal.value = new Modal(exampleModal.value)
    modal.value = new Modal(modifyModal.value)
  console.log(modal)
})
</script>

<template>
  <!--TODO:顯示貼文-->
  <div class="container-xxl">
    <!-- 上 -->
    <div class="row g-3">
      <div class="col-auto">
        <button
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
              <option selected value="0">全部</option>
              <option value="國際">國際</option>
              <option value="娛樂">娛樂</option>
              <option value="商業">商業</option>
              <option value="科技">科技</option>
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
            <button
              @click="fetchPost(dataitem['postId'])"
              type="button"
              class="btn btn-info mr-3 mb-2"
              data-bs-toggle="modal"
              data-bs-target="#modifyModal"
              data-bs-whatever="@fat"
            >
              修改
            </button>
            <button @click="deletePost(dataitem['postId'])" type="button" class="btn btn-info">
              刪除
            </button>
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
    ref="exampleModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">新增貼文</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label for="selected" class="col-form-label">分類:</label>
              <select
                v-model="post.category"
                class="form-select"
                aria-label="Default select example"
                required
              >
                <option :value="'國際'">國際</option>
                <option :value="'娛樂'">娛樂</option>
                <option :value="'商業'">商業</option>
                <option :value="'科技'">科技</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="title" class="col-form-label">標題:</label>
              <input type="text" class="form-control" v-model="post.title" required />
            </div>
            <div class="mb-3">
              <label for="detail" class="col-form-label">內容:</label>
              <textarea class="form-control" v-model="post.detail" required></textarea>
            </div>
            <div class="mb-3">
              <label for="publisher" class="col-form-label">發佈者:</label>
              <input type="text" class="form-control" v-model="post.publisher" required />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button @click="onSubmit" type="submit" class="btn btn-primary">新增</button>
        </div>
      </div>
    </div>
  </div>

  <!--TODO:修改貼文-->
  <!--修改貼文Modal-->
  <div
    class="modal fade"
    id="modifyModal"
    tabindex="-1"
    aria-labelledby="modifyModalLabel"
    aria-hidden="true"
    ref="modifyModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modifyModalLabel">修改貼文</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label for="selected" class="col-form-label">分類:</label>
              &nbsp;
              <span class="badge text-bg-info">{{ postinfo.category }}</span>
              <span style="display:none;">{{ postinfo.postId }}</span>
            </div>
            <div class="mb-3">
              <label for="title" class="col-form-label">標題:</label>
              <input type="text" class="form-control" v-model="postinfo.title" required />
            </div>
            <div class="mb-3">
              <label for="detail" class="col-form-label">內容:</label>
              <textarea class="form-control" v-model="postinfo.detail" required></textarea>
            </div>
            <div class="mb-3">
              <label for="publisher" class="col-form-label">發佈者:</label>
              <input type="text" class="form-control" v-model="postinfo.publisher" required />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button @click="modifyPost(postinfo.postId)" type="submit" class="btn btn-primary">儲存</button>
        </div>
      </div>
    </div>
  </div>
</template>
