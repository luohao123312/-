<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="星期" prop="weekDay">
        <el-select v-model="queryParams.weekDay" placeholder="请选择星期" clearable>
          <el-option
            v-for="dict in week"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="菜品名称" prop="dishName">
        <el-input
          v-model="queryParams.dishName"
          placeholder="请输入菜品名称"
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
          v-hasPermi="['nursing:diet:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['nursing:diet:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['nursing:diet:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['nursing:diet:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dietList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="星期" align="center" prop="weekDay">
        <template #default="scope">
          <dict-tag :options="week" :value="scope.row.weekDay"/>
        </template>
      </el-table-column>
      <el-table-column label="菜品名称" align="center" prop="dishName" />
      <el-table-column label="菜品图片" align="center" prop="dishImage" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.dishImage" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="开饭时间" align="center" prop="mealTime" />
      <el-table-column label="更新人" align="center" prop="updateBy" />
      <el-table-column label="烹饪时间" align="center" prop="cookingTime" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['nursing:diet:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['nursing:diet:remove']">删除</el-button>
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

    <!-- 添加或修改一周膳食对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="dietRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="星期" prop="weekDay">
          <el-select v-model="form.weekDay" placeholder="请选择星期">
            <el-option
              v-for="dict in week"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜品名称" prop="dishName">
          <el-input v-model="form.dishName" placeholder="请输入菜品名称" />
        </el-form-item>
        <el-form-item label="菜品图片" prop="dishImage">
          <image-upload v-model="form.dishImage"/>
        </el-form-item>
        <el-form-item label="开饭时间" prop="mealTime">
          <el-input v-model="form.mealTime" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="烹饪时间" prop="cookingTime">
          <el-input v-model="form.cookingTime" type="textarea" placeholder="请输入内容" />
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

<script setup name="Diet">
import { listDiet, getDiet, delDiet, addDiet, updateDiet } from "@/api/nursing/diet";

const { proxy } = getCurrentInstance();
const { week } = proxy.useDict('week');

const dietList = ref([]);
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
    weekDay: null,
    dishName: null,
    dishImage: null,
    mealTime: null,
    cookingTime: null,
  },
  rules: {
    weekDay: [
      { required: true, message: "星期不能为空", trigger: "change" }
    ],
    dishName: [
      { required: true, message: "菜品名称不能为空", trigger: "blur" }
    ],
    dishImage: [
      { required: true, message: "菜品图片不能为空", trigger: "blur" }
    ],
    mealTime: [
      { required: true, message: "开饭时间不能为空", trigger: "blur" }
    ],
    cookingTime: [
      { required: true, message: "烹饪时间不能为空", trigger: "blur" }
    ],
    createBy: [
      { required: true, message: "创建人不能为空", trigger: "blur" }
    ],
    createTime: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询一周膳食列表 */
function getList() {
  loading.value = true;
  listDiet(queryParams.value).then(response => {
    dietList.value = response.rows;
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
    weekDay: null,
    dishName: null,
    dishImage: null,
    mealTime: null,
    cookingTime: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("dietRef");
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
  title.value = "添加一周膳食";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getDiet(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改一周膳食";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["dietRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateDiet(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDiet(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除一周膳食编号为"' + _ids + '"的数据项？').then(function() {
    return delDiet(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('nursing/diet/export', {
    ...queryParams.value
  }, `diet_${new Date().getTime()}.xlsx`)
}

getList();
</script>
