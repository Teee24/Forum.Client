<script setup>
import { ref, onMounted, computed } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Modal } from 'bootstrap'
import { forumInstance } from '@/utils/forumInstance';

// TODO: 顯示所有貼文

const allPost = ref([])

async function fetchAllPost(category=null) {

  console.log(forumInstance)

  let url = category? `${forumInstance}/api/Forum/Get?category=${category}`:`${forumInstance}/api/Forum/Get`

  let res =await fetch(url)

  const data = await res.json()
  
  allPost.value = data['returnData']
}

// TODO: 新增貼文

// 貼文欄位
const newPost = ref({
  category: '',
  detail: '',
  postDate: '',
  postId: '',
  publisher: '',
  title: ''
})

const createModal = ref(null)
const addmodal = ref(null)

try {
const addPost = async () => {
  const postToAdd = {
    category: newPost.value.category,
    title: newPost.value.title,
    detail: newPost.value.detail,
    publisher: newPost.value.publisher
  }

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postToAdd)
  }

  const addpost = await fetch('https://localhost/api/Forum/Insert', requestOptions)
  //  const addresponse = await addpost.json()
  const { returnCode, returnMessage } = addpost.data;

  alert(returnMessage)

  // 刷新頁面
  fetchAllPost()

  // 關閉modal
  addmodal.value.hide()

  
  
   
  }}catch(error){
    console.error('新增失敗',error);
    alert('意外狀況');
  }
  



// TODO: 修改貼文
const modifyModalRef = ref(null)
const modifyModalInstance = ref(null)

// 先拿到單筆資料
const updatePost = ref([])

const fetchPost = async (postId) => {
  const data = await fetch(`https://localhost/api/Forum/GetById/${postId}`)
  const displayPost = await data.json()
  updatePost.value = displayPost['returnData']
}

// 修改的資料
const modifyPost = async () => {
  const postToUpdate = {
    category: updatePost.value.category,
    title: updatePost.value.title,
    detail: updatePost.value.detail,
    publisher: updatePost.value.publisher,
    postId: updatePost.value.postId
  }

  const requestOption = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postToUpdate)
  }

  const updatepost = await fetch(`https://localhost/api/Forum/Update`, requestOption)
  const afterupdate = await updatepost.json()
  const updateresult = afterupdate['returnMessage']

  // 刷新頁面
  fetchAllPost()

  // 關閉modal
  modifyModalInstance.value.hide()
}

// TODO: 刪除貼文
const deletePost = async (postId) => {
  const request = await fetch(`https://localhost/api/Forum/Delete/${postId}`, {
    method: 'DELETE'
  })

  fetchAllPost()
}

// init 在setup之前
onMounted(async () => {
  await fetchAllPost()

  // 先實例化
  addmodal.value = new Modal(createModal.value)
  modifyModalInstance.value = new Modal(modifyModalRef.value)
})
</script>

<template>
  <!--TODO:顯示貼文-->
  <div class="container-xxl">
    <!-- 上 -->
    <div class="row g-3">
      

      <ul class="nav nav-underline nav-fill">
        <li class="nav-item">
          <a class="nav-link " data-bs-toggle="modal"
          data-bs-target="#createModal"
          data-bs-whatever="@fat" href="#"  title="新增貼文"><i class="bi bi-plus-lg"></i></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" aria-current="page" @click="fetchAllPost()"  href="#">全部</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click="fetchAllPost('國際')" href="#">國際</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click="fetchAllPost('科技')" href="#">科技</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click="fetchAllPost('商業')" href="#">商業</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click="fetchAllPost('娛樂')" href="#">娛樂</a>
        </li>
      </ul>
    </div>
    <br />
    <!-- 中 -->
    <div class="list-group list-group-flush" v-for="dataitem in allPost" :key="dataitem['postId']">
      <a href="#" class="list-group-item list-group-item-action" aria-current="true">
        <div class="d-flex w-100 justify-content-between">
          <p class="mb-1">{{ dataitem['publisher'] }}</p>
          <small>{{ dataitem['postDate'] }}</small>
        </div>
        <h5 class="mb-1">{{ dataitem['title'] }}</h5>
        <small>{{ dataitem['detail'] }}</small>
        <br />
        <div class="row">
          <div class="col-6">
            <p class="badge rounded-pill bg-secondary">{{ dataitem['category'] }}</p>
          </div>
          <div class="col-6 d-flex justify-content-end">
            <button
              @click="fetchPost(dataitem['postId'])"
              type="button"
              class="btn btn-info"
              data-bs-toggle="modal"
              data-bs-target="#modifyModal"
              data-bs-whatever="@fat"
            >
            <i class="bi bi-pen"></i> 修改</button
            >&nbsp;
            <button @click="deletePost(dataitem['postId'])" type="button" class="btn btn-info">
              <i class="bi bi-trash3"></i> 刪除
            </button>
          </div>
        </div>
      </a>
      <hr />
    </div>
  </div>

  <!--TODO:新增貼文-->
  <!--新增貼文Modal-->
  <div
    class="modal fade"
    id="createModal"
    tabindex="-1"
    aria-labelledby="createModalLabel"
    aria-hidden="true"
    ref="createModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="createModalLabel">新增貼文</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addPost">
            <div class="mb-3">
              <label for="selected" class="col-form-label">分類:</label>
              <select
                v-model="newPost.category"
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
              <input type="text" class="form-control" v-model="newPost.title" required />
            </div>
            <div class="mb-3">
              <label for="detail" class="col-form-label">內容:</label>
              <textarea class="form-control" v-model="newPost.detail" required></textarea>
            </div>
            <div class="mb-3">
              <label for="publisher" class="col-form-label">發佈者:</label>
              <input type="text" class="form-control" v-model="newPost.publisher" required />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button @click="addPost" type="submit" class="btn btn-primary">新增</button>
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
    ref="modifyModalRef"
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
          <form @submit.prevent="addPost">
            <div class="mb-3">
              <label for="selected" class="col-form-label">分類:</label>
              &nbsp;
              <span class="badge text-bg-info">{{ updatePost.category }}</span>
              <span style="display: none">{{ updatePost.postId }}</span>
            </div>
            <div class="mb-3">
              <label for="title" class="col-form-label">標題:</label>
              <input type="text" class="form-control" v-model="updatePost.title" required />
            </div>
            <div class="mb-3">
              <label for="detail" class="col-form-label">內容:</label>
              <textarea class="form-control" v-model="updatePost.detail" required></textarea>
            </div>
            <div class="mb-3">
              <label for="publisher" class="col-form-label">發佈者:</label>
              <input type="text" class="form-control" v-model="updatePost.publisher" required />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button @click="modifyPost(updatePost.postId)" type="submit" class="btn btn-primary">
            儲存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.list-group-item {
  background-color: rgb(225, 241, 247);
  border-radius: 5px;
}
</style>
