<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="elderName">
        <el-input
          v-model="queryParams.elderName"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="idCardNo">
        <el-input
          v-model="queryParams.idCardNo"
          placeholder="请输入身份证号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="queryParams.sex" placeholder="请选择性别" clearable>
          <el-option
            v-for="dict in sys_user_sex"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出生日期" prop="birthday">
        <el-date-picker clearable
          v-model="queryParams.birthday"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择出生日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="家庭住址" prop="address">
        <el-input
          v-model="queryParams.address"
          placeholder="请输入家庭住址"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="床位编号" prop="bedNumber">
        <el-input
          v-model="queryParams.bedNumber"
          placeholder="请输入床位编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="床位id" prop="bedId">
        <el-input
          v-model="queryParams.bedId"
          placeholder="请输入床位id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="护理项目" prop="planName">
        <el-input
          v-model="queryParams.planName"
          placeholder="请输入护理项目"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="护理等级" prop="name">
        <el-select v-model="queryParams.name" placeholder="请选择护理等级" clearable>
          <el-option
            v-for="dict in dengji"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="护理费用" prop="fee">
        <el-select v-model="queryParams.fee" placeholder="请选择护理费用" clearable>
          <el-option
            v-for="dict in feiyong"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['nursing:elder:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['nursing:elder:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['nursing:elder:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['nursing:elder:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="elderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="名称" align="center" prop="elderName" />
      <el-table-column label="照片" align="center" prop="image" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.image" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" align="center" prop="idCardNo" />
      <el-table-column label="性别" align="center" prop="sex">
        <template #default="scope">
          <dict-tag :options="sys_user_sex" :value="scope.row.sex"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="type" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column label="出生日期" align="center" prop="birthday" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.birthday, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="家庭住址" align="center" prop="address" />
      <el-table-column label="身份证国徽面" align="center" prop="idCardNationalEmblemImg" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.idCardNationalEmblemImg" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="身份证人像面" align="center" prop="idCardPortraitImg" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.idCardPortraitImg" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="床位编号" align="center" prop="bedNumber" />
      <el-table-column label="床位id" align="center" prop="bedId" />
      <el-table-column label="护理项目" align="center" prop="planName" />
      <el-table-column label="护理等级" align="center" prop="name">
        <template #default="scope">
          <dict-tag :options="dengji" :value="scope.row.name"/>
        </template>
      </el-table-column>
      <el-table-column label="护理费用" align="center" prop="fee">
        <template #default="scope">
          <dict-tag :options="feiyong" :value="scope.row.fee"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['nursing:elder:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['nursing:elder:remove']">删除</el-button>
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

    <!-- 添加或修改老人对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="elderRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="elderName">
          <el-input v-model="form.elderName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="照片" prop="image">
          <image-upload v-model="form.image"/>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCardNo">
          <el-input v-model="form.idCardNo" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option
              v-for="dict in sys_user_sex"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
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
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker clearable
            v-model="form.birthday"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择出生日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="家庭住址" prop="address">
          <el-input v-model="form.address" placeholder="请输入家庭住址" />
        </el-form-item>
        <el-form-item label="身份证国徽面" prop="idCardNationalEmblemImg">
          <image-upload v-model="form.idCardNationalEmblemImg"/>
        </el-form-item>
        <el-form-item label="身份证人像面" prop="idCardPortraitImg">
          <image-upload v-model="form.idCardPortraitImg"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="床位编号" prop="bedNumber">
          <el-input v-model="form.bedNumber" placeholder="请输入床位编号" />
        </el-form-item>
        <el-form-item label="床位id" prop="bedId">
          <el-input v-model="form.bedId" placeholder="请输入床位id" />
        </el-form-item>
        <el-form-item label="护理项目" prop="planName">
          <el-input v-model="form.planName" placeholder="请输入护理项目" />
        </el-form-item>
        <el-form-item label="护理等级" prop="name">
          <el-select v-model="form.name" placeholder="请选择护理等级">
            <el-option
              v-for="dict in dengji"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="护理费用" prop="fee">
          <el-select v-model="form.fee" placeholder="请选择护理费用">
            <el-option
              v-for="dict in feiyong"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
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

<script setup name="Elder">
import { listElder, getElder, delElder, addElder, updateElder } from "@/api/nursing/elder";

const { proxy } = getCurrentInstance();
const { feiyong, dengji, sys_user_sex, type } = proxy.useDict('feiyong', 'dengji', 'sys_user_sex', 'type');

const elderList = ref([]);
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
    image: null,
    idCardNo: null,
    sex: null,
    status: null,
    phone: null,
    birthday: null,
    address: null,
    idCardNationalEmblemImg: null,
    idCardPortraitImg: null,
    bedNumber: null,
    bedId: null,
    planName: null,
    name: null,
    fee: null
  },
  rules: {
    sex: [
      { required: true, message: "性别不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
    phone: [
      { required: true, message: "手机号不能为空", trigger: "blur" }
    ],
    createTime: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ],
    planName: [
      { required: true, message: "护理项目不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "护理等级不能为空", trigger: "change" }
    ],
    fee: [
      { required: true, message: "护理费用不能为空", trigger: "change" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询老人列表 */
function getList() {
  loading.value = true;
  listElder(queryParams.value).then(response => {
    elderList.value = response.rows;
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
    image: null,
    idCardNo: null,
    sex: null,
    status: null,
    phone: null,
    birthday: null,
    address: null,
    idCardNationalEmblemImg: null,
    idCardPortraitImg: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    remark: null,
    bedNumber: null,
    bedId: null,
    planName: null,
    name: null,
    fee: null
  };
  proxy.resetForm("elderRef");
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
  title.value = "添加老人";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getElder(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改老人";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["elderRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateElder(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addElder(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除老人编号为"' + _ids + '"的数据项？').then(function() {
    return delElder(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('nursing/elder/export', {
    ...queryParams.value
  }, `elder_${new Date().getTime()}.xlsx`)
}

getList();
</script>
