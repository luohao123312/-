<template>
    <elForm :inline="false" :hideRequiredAsterisk="false" labelPosition="right" size="default" labelWidth="125px" ref="form" :model="formData" @submit.prevent>
      <elButton>新增</elButton>
      <elButton>批量删除</elButton>
      <elDivider></elDivider>
      <elFormItem prop="FelderName" label="老人姓名" :required="true">
        <elInput v-model="formData.FelderName" />
      </elFormItem>
      <elFormItem prop="F5cem538h3yeamc" label="房间号" :required="true">
        <elInput v-model="formData.F5cem538h3yeamc" />
      </elFormItem>
      <elFormItem prop="Fnf4lxvqdnrrdbc" label="床位号" :required="true">
        <elInput v-model="formData.Fnf4lxvqdnrrdbc" />
      </elFormItem>
      <elFormItem prop="Fgjkm538ymdhavc" label="身份证号" :required="true">
        <elInput v-model="formData.Fgjkm538ymdhavc" />
      </elFormItem>
      <elFormItem prop="FentryDate" label="入住日期" :required="true">
        <elDatePicker valueFormat="YYYY-MM-DD" v-model="formData.FentryDate" />
      </elFormItem>
      <elFormItem prop="Ffxfm538hz98asc" label="责任护工">
        <elInput type="password" v-model="formData.Ffxfm538hz98asc" />
      </elFormItem>
      <elFormItem prop="FhealthStatus" label="健康状况">
        <elInput type="textarea" v-model="formData.FhealthStatus" />
      </elFormItem>
      <elFormItem prop="FimageField" label="老人照片">
        <elUpload listType="picture-card" accept="image/*" :limit="5" v-model:fileList="formData.FimageField" />
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
      "FelderName": "",
      "F5cem538h3yeamc": "",
      "Fnf4lxvqdnrrdbc": "",
      "Fgjkm538ymdhavc": "",
      "FentryDate": null,
      "Ffxfm538hz98asc": "",
      "FhealthStatus": "",
      "FimageField": []
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
  