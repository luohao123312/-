<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="房间编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入房间编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排序号" prop="sort">
        <el-input
          v-model="queryParams.sort"
          placeholder="请输入排序号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="房间类型名称" prop="typeName">
        <el-input
          v-model="queryParams.typeName"
          placeholder="请输入房间类型名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="楼层id" prop="floorId">
        <el-input
          v-model="queryParams.floorId"
          placeholder="请输入楼层id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否删除" prop="isDeleted">
        <el-input
          v-model="queryParams.isDeleted"
          placeholder="请输入是否删除"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['nursing:room:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['nursing:room:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['nursing:room:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['nursing:room:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="roomList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="房间编号" align="center" prop="code" />
      <el-table-column label="排序号" align="center" prop="sort" />
      <el-table-column label="房间类型名称" align="center" prop="typeName" />
      <el-table-column label="楼层id" align="center" prop="floorId" />
      <el-table-column label="是否删除" align="center" prop="isDeleted" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['nursing:room:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['nursing:room:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改房间对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="roomRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="房间编号" prop="code">
          <el-input v-model="form.code" placeholder="请输入房间编号" />
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="房间类型名称" prop="typeName">
          <el-input v-model="form.typeName" placeholder="请输入房间类型名称" />
        </el-form-item>
        <el-form-item label="楼层id" prop="floorId">
          <el-input v-model="form.floorId" placeholder="请输入楼层id" />
        </el-form-item>
        <el-form-item label="是否删除" prop="isDeleted">
          <el-input v-model="form.isDeleted" placeholder="请输入是否删除" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Room">
import { listRoom, getRoom, delRoom, addRoom, updateRoom } from "@/api/nursing/room";

const { proxy } = getCurrentInstance();

const roomList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    code: null,
    sort: null,
    typeName: null,
    floorId: null,
    isDeleted: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询房间列表 */
function getList() {
  loading.value = true;
  listRoom(queryParams.value).then(response => {
    roomList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    code: null,
    sort: null,
    typeName: null,
    floorId: null,
    createTime: null,
    updateTime: null,
    isDeleted: null,
    createBy: null,
    updateBy: null,
    remark: null
  };
  proxy.resetForm("roomRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加房间";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getRoom(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改房间";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["roomRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateRoom(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addRoom(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除房间编号为"' + _ids + '"的数据项？').then(function() {
    return delRoom(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('nursing/room/export', {
    ...queryParams.value
  }, `room_${new Date().getTime()}.xlsx`)
}

getList();
</script>
