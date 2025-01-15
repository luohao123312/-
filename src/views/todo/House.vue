<template>
    <elForm :inline="false" :hideRequiredAsterisk="false" labelPosition="right" size="default" labelWidth="125px" ref="form" :model="formData" @submit.prevent>
      <elButton>批量删除</elButton>
      <elButton>新增</elButton>
      <elDivider></elDivider>
      <elFormItem prop="Fnf4lxvqdnrrdbc" label="名称" :required="true">
        <elInput v-model="formData.Fnf4lxvqdnrrdbc" />
      </elFormItem>
      <elFormItem prop="F5cem538h3yeamc" label="床位数量" :required="true">
        <elInput v-model="formData.F5cem538h3yeamc" />
      </elFormItem>
      <elFormItem prop="F62glxvqdopkdkc" label="面积">
        <elInput type="password" v-model="formData.F62glxvqdopkdkc" />
      </elFormItem>
      <elFormItem prop="Ffxfm538hz98asc" label="联系方式">
        <elInput type="password" v-model="formData.Ffxfm538hz98asc" />
      </elFormItem>
      <elFormItem prop="F0ofm538hyr4apc" label="成立日期">
        <elInput type="password" v-model="formData.F0ofm538hyr4apc" />
      </elFormItem>
      <elFormItem prop="FpriceField" label="价格" :required="true">
        <elInputNumber v-model="formData.FpriceField" />
      </elFormItem>
      <elFormItem prop="FaddressField" label="地址" :required="true">
        <elInput placeholder="请输入地址" v-model="formData.FaddressField" />
      </elFormItem>
      <elFormItem prop="FbedCountField" label="床位数量" :required="true">
        <elInputNumber v-model="formData.FbedCountField" />
      </elFormItem>
      <elFormItem prop="FimageField" label="社区敬老院图片">
        <elUpload listType="picture-card" accept="image/*" :limit="5" v-model:fileList="formData.FimageField" />
      </elFormItem>
      <elFormItem prop="F2lzlxvqdqg0e2c" label="评分">
        <elRate v-model="formData.F2lzlxvqdqg0e2c" />
      </elFormItem>
      <elFormItem>
        <elButton type="primary" @click="submit">提交</elButton>
      </elFormItem>
    </elForm>
  </template>
  <script setup>
    import {
      ref
    } from "vue";
  
  
    const formData = ref({
      "Fnf4lxvqdnrrdbc": "",
      "F5cem538h3yeamc": "",
      "F62glxvqdopkdkc": "",
      "Ffxfm538hz98asc": "",
      "F0ofm538hyr4apc": "",
      "FpriceField": 0,
      "FaddressField": "",
      "FbedCountField": 0,
      "FimageField": [],
      "F2lzlxvqdqg0e2c": 0
    })
  
    function submit() {
      const s = r;
      this.$refs[s(444)][s(418)]()[s(394)](() => {})
    }
  
    function reset() {
      const s = r;
      this[s(397)][s(444)][s(432)]()
    }
  </script>
  <style>
  
  </style>
  