<template>
    <elForm :inline="false" :hideRequiredAsterisk="false" labelPosition="right" size="default" labelWidth="125px" ref="form" :model="formData" @submit.prevent>
      <elDivider>资讯分类</elDivider>
      <elButton :circle="false">查询</elButton>
      <elButton>重置</elButton>
      <elFormItem labelWidth="0px" prop="Foufm524m4pramc">
        <elInput placeholder="请输入关键字" v-model="formData.Foufm524m4pramc" />
      </elFormItem>
      <elDivider>查询</elDivider>
      <elButton size="large">新增</elButton>
      <elButton size="large">批量删除</elButton>
      <elDivider>新增</elDivider>
      <elDescriptions :border="true" :column="1" style="width:100%;">
        <elDescriptionsItem label="1">养老动态</elDescriptionsItem>
        <elDescriptionsItem label="2">养老政策</elDescriptionsItem>
        <elDescriptionsItem label="3">养老服务</elDescriptionsItem>
        <elDescriptionsItem label="4">养老产业</elDescriptionsItem>
        <elDescriptionsItem label="5">养老模式</elDescriptionsItem>
        <elDescriptionsItem label="6">养老金</elDescriptionsItem>
        <elDescriptionsItem label="7">养老居家</elDescriptionsItem>
      </elDescriptions>
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
      "Foufm524m4pramc": ""
    })
  
    function submit() {
      const s = r;
      this[s(242)].form.validate()[s(344)](() => {})
    }
  
    function reset() {
      const s = r;
      if (s(338) !== s(328)) this[s(242)].form[s(302)]();
      else return _0x16552b ? "<" + _0x9b9abd[s(284)] + _0x49b49d(_0x536fd6) + ">" + _0x230d92 + "</" + _0x10c00b[s(284)] + ">" : "<" + _0x4bfe0c[s(284)] + _0x83b50d(_0x111494) + "/>"
    }
  </script>
  <style>
  
  </style>
  