<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="床位编号" prop="bedNumber">
        <el-input
          v-model="queryParams.bedNumber"
          placeholder="请输入床位编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="床位状态" prop="bedStatus">
        <el-select v-model="queryParams.bedStatus" placeholder="请选择床位状态" clearable>
          <el-option
            v-for="dict in bed"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="床位号" prop="sort">
        <el-input
          v-model="queryParams.sort"
          placeholder="请输入床位号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="房间ID" prop="roomId">
        <el-input
          v-model="queryParams.roomId"
          placeholder="请输入房间ID"
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
          v-hasPermi="['nursing:bed:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['nursing:bed:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['nursing:bed:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['nursing:bed:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bedList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="床位ID" align="center" prop="id" />
      <el-table-column label="床位编号" align="center" prop="bedNumber" />
      <el-table-column label="床位状态" align="center" prop="bedStatus">
        <template #default="scope">
          <dict-tag :options="bed" :value="scope.row.bedStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="床位号" align="center" prop="sort" />
      <el-table-column label="房间ID" align="center" prop="roomId" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['nursing:bed:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['nursing:bed:remove']">删除</el-button>
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

    <!-- 添加或修改床位对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="bedRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="床位编号" prop="bedNumber">
          <el-input v-model="form.bedNumber" placeholder="请输入床位编号" />
        </el-form-item>
        <el-form-item label="床位状态" prop="bedStatus">
          <el-radio-group v-model="form.bedStatus">
            <el-radio
              v-for="dict in bed"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="床位号" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入床位号" />
        </el-form-item>
        <el-form-item label="房间ID" prop="roomId">
          <el-input v-model="form.roomId" placeholder="请输入房间ID" />
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

<script setup name="Bed">
import { listBed, getBed, delBed, addBed, updateBed } from "@/api/nursing/bed";

const { proxy } = getCurrentInstance();
const { bed } = proxy.useDict('bed');

const bedList = ref([]);
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
    bedNumber: null,
    bedStatus: null,
    sort: null,
    roomId: null,
  },
  rules: {
    createTime: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询床位列表 */
function getList() {
  loading.value = true;
  listBed(queryParams.value).then(response => {
    bedList.value = response.rows;
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
    bedNumber: null,
    bedStatus: null,
    sort: null,
    roomId: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    remark: null
  };
  proxy.resetForm("bedRef");
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
  title.value = "添加床位";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getBed(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改床位";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["bedRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateBed(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addBed(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除床位编号为"' + _ids + '"的数据项？').then(function() {
    return delBed(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('nursing/bed/export', {
    ...queryParams.value
  }, `bed_${new Date().getTime()}.xlsx`)
}

getList();
</script>
