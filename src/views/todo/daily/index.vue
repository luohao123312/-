<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="老人名称" prop="elderName"width="200">
        <el-input
          v-model="queryParams.elderName"
          placeholder="请输入老人名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="体温" prop="bodyTemperature">
        <el-input
          v-model="queryParams.bodyTemperature"
          placeholder="请输入体温"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="血压" prop="bloodPressure">
        <el-input
          v-model="queryParams.bloodPressure"
          placeholder="请输入血压"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="血脂" prop="bloodLipid">
        <el-input
          v-model="queryParams.bloodLipid"
          placeholder="请输入血脂"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="血糖" prop="bloodSugar">
        <el-input
          v-model="queryParams.bloodSugar"
          placeholder="请输入血糖"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="更新时间" prop="updateTime">
        <el-date-picker clearable
          v-model="queryParams.updateTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择更新时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="更新人" prop="updateBy">
        <el-input
          v-model="queryParams.updateBy"
          placeholder="请输入更新人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status"width="200">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三餐情况" prop="mealSituation"width="200">
        <el-select v-model="queryParams.mealSituation" placeholder="请选择三餐情况" clearable>
          <el-option
            v-for="dict in sanchan"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用药情况" prop="medication"width="200">
        <el-input
          v-model="queryParams.medication"
          placeholder="请输入用药情况"
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
          v-hasPermi="['nursing:daily:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['nursing:daily:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['nursing:daily:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['nursing:daily:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dailyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="老人名称" align="center" prop="elderName" />
      <el-table-column label="体温" align="center" prop="bodyTemperature" />
      <el-table-column label="血压" align="center" prop="bloodPressure" />
      <el-table-column label="血脂" align="center" prop="bloodLipid" />
      <el-table-column label="血糖" align="center" prop="bloodSugar" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人" align="center" prop="updateBy" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="type" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="三餐情况" align="center" prop="mealSituation">
        <template #default="scope">
          <dict-tag :options="sanchan" :value="scope.row.mealSituation"/>
        </template>
      </el-table-column>
      <el-table-column label="历史病例" align="center" prop="medicalHistory" width="200"/>
      <el-table-column label="用药情况" align="center" prop="medication" width="200"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['nursing:daily:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['nursing:daily:remove']">删除</el-button>
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

    <!-- 添加或修改日常信息上传对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="dailyRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="老人名称" prop="elderName"width="200">
          <el-input v-model="form.elderName" placeholder="请输入老人名称" />
        </el-form-item>
        <el-form-item label="体温" prop="bodyTemperature">
          <el-input v-model="form.bodyTemperature" placeholder="请输入体温" />
        </el-form-item>
        <el-form-item label="血压" prop="bloodPressure">
          <el-input v-model="form.bloodPressure" placeholder="请输入血压" />
        </el-form-item>
        <el-form-item label="血脂" prop="bloodLipid">
          <el-input v-model="form.bloodLipid" placeholder="请输入血脂" />
        </el-form-item>
        <el-form-item label="血糖" prop="bloodSugar">
          <el-input v-model="form.bloodSugar" placeholder="请输入血糖" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option
              v-for="dict in type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三餐情况" prop="mealSituation">
          <el-select v-model="form.mealSituation" placeholder="请选择三餐情况">
            <el-option
              v-for="dict in sanchan"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="历史病例" prop="medicalHistory">
          <el-input v-model="form.medicalHistory" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="用药情况" prop="medication">
          <el-input v-model="form.medication" placeholder="请输入用药情况" />
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

<script setup name="Daily">
import { listDaily, getDaily, delDaily, addDaily, updateDaily } from "@/api/nursing/daily";

const { proxy } = getCurrentInstance();
const { sanchan, type } = proxy.useDict('sanchan', 'type');

const dailyList = ref([]);
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
    elderName: null,
    bodyTemperature: null,
    bloodPressure: null,
    bloodLipid: null,
    bloodSugar: null,
    updateTime: null,
    updateBy: null,
    status: null,
    mealSituation: null,
    medicalHistory: null,
    medication: null
  },
  rules: {
    elderName: [
      { required: true, message: "老人名称不能为空", trigger: "blur" }
    ],
    bodyTemperature: [
      { required: true, message: "体温不能为空", trigger: "blur" }
    ],
    bloodPressure: [
      { required: true, message: "血压不能为空", trigger: "blur" }
    ],
    bloodLipid: [
      { required: true, message: "血脂不能为空", trigger: "blur" }
    ],
    bloodSugar: [
      { required: true, message: "血糖不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
    mealSituation: [
      { required: true, message: "三餐情况不能为空", trigger: "change" }
    ],
    medicalHistory: [
      { required: true, message: "历史病例不能为空", trigger: "blur" }
    ],
    medication: [
      { required: true, message: "用药情况不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询日常信息上传列表 */
function getList() {
  loading.value = true;
  listDaily(queryParams.value).then(response => {
    dailyList.value = response.rows;
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
    elderName: null,
    bodyTemperature: null,
    bloodPressure: null,
    bloodLipid: null,
    bloodSugar: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    status: null,
    mealSituation: null,
    medicalHistory: null,
    medication: null
  };
  proxy.resetForm("dailyRef");
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
  title.value = "添加日常信息上传";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getDaily(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改日常信息上传";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["dailyRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateDaily(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDaily(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除日常信息上传编号为"' + _ids + '"的数据项？').then(function() {
    return delDaily(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('nursing/daily/export', {
    ...queryParams.value
  }, `daily_${new Date().getTime()}.xlsx`)
}

getList();
</script>
