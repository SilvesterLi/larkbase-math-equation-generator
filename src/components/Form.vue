<template>
  <div class="hello">
    <a @click="openTable()">{{ $t("wiki_web_text")}}</a>
    <el-form-item label="选择数据表" size="large">
      <el-select v-model="formData.table" @change="tableChange" placeholder="请选择数据表" style="width: 100%">
        <el-option
            v-for="meta in tableMetaList"
            :key="meta.id"
            :label="meta.name"
            :value="meta.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="选择字段" size="large">
      <el-select v-model="formData.field" placeholder="请选择字段" style="width: 100%">
        <el-option
            v-for="meta in fieldMetaList"
            :key="meta.id"
            :label="meta.name"
            :value="meta.id"
        />
      </el-select>
    </el-form-item>
    <textarea v-model="formula" cols="30" rows="10" />
<!--    设置style,长宽自适应vue-mathjax-->
    <div class="container">
      <div ref="capture" style="width: fit-content;">
        <vue-mathjax  :formula="formula" ></vue-mathjax>
      </div>
    </div>

  </div>
  <button @click="capture">{{buttonText}}</button>
</template>

<script>
import html2canvas from 'html2canvas';
import { ref, onMounted } from 'vue';
import { bitable } from '@lark-base-open/js-sdk';
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
} from 'element-plus';
export default {
  name: "Form",

  data() {
    return {
      formula: '$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$',
      buttonState:true,
      buttonText:this.$i18n.t("insert"),
    }
  },

  components: {
    ElButton,
    ElForm,
    ElFormItem,
    ElSelect,
    ElOption,
  },
  setup(){
    const formData = ref({ table: '',field:"" });
    const tableMetaList = ref([]);
    const table = ref(null);
    const fieldMetaList = ref([]);
    onMounted(async () => {
      tableMetaList.value = await bitable.base.getTableMetaList();
      let selection = await bitable.base.getSelection();
      formData.value.table = selection.tableId;
      let a = await bitable.base.getTableById(selection.tableId);
      fieldMetaList.value = await a.getFieldMetaList();
    });
    return {
      formData,
      tableMetaList,
      table,
      fieldMetaList,
    };

  },
  methods: {
    openTable(){
      window.open(this.$i18n.t('wiki_web'))
    },
    async tableChange(){
      let a = await bitable.base.getTableById(this.formData.table);
      this.fieldMetaList = await a.getFieldMetaList()
    },
    async capture() {
      if(!this.buttonState){
        return;
      }
      if(this.formData.table === ""){
        alert(this.$i18n.t("choose_table"))
        return;
      }
      if(this.formData.field === ""){
        alert(this.$i18n.t("choose_field"))
        return;
      }
      this.buttonText = this.$i18n.t("inserting")
      this.buttonState = false;
      const t = await bitable.base.getTable(this.formData.table)
      const fieldMeta = await t.getFieldMetaById(this.formData.field)
      if(fieldMeta.type != 17){
        this.buttonText = this.$i18n.t("insert")
        this.buttonState = true;
        alert(this.$i18n.t("choose_attachment_field"))

        return;
      }



      const targetElement = this.$refs.capture;
      const canvas = await html2canvas(this.$refs.capture,{
        width: targetElement.scrollWidth,
            height: targetElement.scrollHeight,
      });

      // Convert the canvas to a data URL
      const dataUrl = canvas.toDataURL();
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // Convert the data URL to a Blob object

      const fileName = 'equation.png';
      const functionFile = new File([blob], fileName, { type: blob.type });
      const tokens = await bitable.base.batchUploadFile([functionFile]);
      const attachments = [
        {
          name: fileName,
          size: blob.size,
          type: blob.type,
          token: tokens[0],
          timeStamp: Date.now(),
        },
      ];

      const attachmentField = await t.getField(this.formData.field);
      const attachmentCell = await attachmentField.createCell(attachments);
      await t.addRecord(attachmentCell);
      this.buttonText = this.$i18n.t("insert")
      this.buttonState = true;

    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
