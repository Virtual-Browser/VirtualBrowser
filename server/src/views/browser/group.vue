<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-circle-plus"
          @click="handleCreate"
        >
          {{ $t('group.add') }}
        </el-button>
      </div>
      <div style="display: flex">
        <el-input
          v-model="listQuery.title"
          :placeholder="$t('browser.name')"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-button v-waves class="filter-item" icon="el-icon-search" @click="handleFilter">
          {{ $t('browser.search') }}
        </el-button>
      </div>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column :label="$t('browser.id')" prop="id" sortable align="center" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('group.name')" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('group.browser_count')" width="200px">
        <template slot-scope="{ row }">
          <span>
            {{ row.count }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('browser.date')"
        sortable
        prop="timestamp"
        width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('browser.actions')"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" @click="handleUpdate(row)">
            {{ $t('browser.edit') }}
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            {{ $t('browser.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-drawer
      :title="$t(dialogStatus == 'create' ? 'group.add' : 'browser.edit')"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      class="formDlg"
      size="800px"
    >
      <div class="drawer-content">
        <div class="form-wrap">
          <el-form ref="dataForm" :model="form" label-position="left" label-width="100px">
            <el-form-item :label="$t('group.name')" prop="name">
              <el-input v-model="form.name" :placeholder="$t('group.name_placeholder')" />
            </el-form-item>
          </el-form>
        </div>
        <div class="dialog-footer">
          <el-button size="medium" @click="dialogFormVisible = false">
            {{ $t('browser.cancel') }}
          </el-button>
          <el-button
            type="primary"
            size="medium"
            @click="dialogStatus === 'create' ? onCreateData() : onUpdateData()"
          >
            {{ $t('browser.confirm') }}
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getBrowserList, getGroupList, addGroup, updateGroup, deleteGroup } from '@/api/native'
import waves from '@/directive/waves' // waves directive

let browserList

export default {
  name: 'ComplexTable',
  components: {},
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 5,
        title: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      form: {}
    }
  },
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  watch: {},
  beforeCreate() {},
  async created() {
    browserList = await getBrowserList()
    await this.getList()
  },
  mounted() {},
  methods: {
    async _getGroupList() {
      const list = await getGroupList()
      list.forEach(item => {
        item.count = browserList.filter(b => b.group === item.name).length
      })
      return list
    },
    async getList() {
      this.listLoading = true
      this.list = await this._getGroupList()
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.searchList()
    },
    getDefaultForm() {
      return {
        id: undefined,
        name: ''
      }
    },
    resetForm() {
      this.$nextTick(() => {
        this.form = this.getDefaultForm()
      })
    },

    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    onCreateData() {
      this.$refs['dataForm'].validate(async (valid, result) => {
        if (valid) {
          this.form.timestamp = Date.now()
          await addGroup(this.form, this.$t('group.group'))

          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: this.$t('browser.success'),
            message: this.$t('browser.create') + this.$t('browser.success'),
            type: 'success',
            duration: 2000
          })
        } else {
          const arr = Object.values(result)
            .map(item => this.$t('browser.' + item[0].field) + item[0].message)
            .slice(0, 1)

          this.$message({
            type: 'error',
            dangerouslyUseHTMLString: true,
            message: '<p>' + arr.join('</p><p>') + '</p>'
          })
        }
      })
    },
    handleUpdate(row) {
      this.resetForm()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.form = Object.assign(this.form, row) // copy obj
        this.form.timestamp = new Date(this.form.timestamp)
        this.$refs['dataForm'].clearValidate()
      })
    },
    onUpdateData() {
      this.$refs['dataForm'].validate(async (valid, result) => {
        if (valid) {
          const tempData = Object.assign({}, this.form)
          console.log('submit', tempData)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          await updateGroup(tempData)
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: this.$t('browser.success'),
            message: this.$t('browser.update') + this.$t('browser.success'),
            type: 'success',
            duration: 2000
          })
        } else {
          const arr = Object.values(result)
            .map(item => this.$t('browser.' + item[0].field) + item[0].message)
            .slice(0, 1)

          this.$message({
            type: 'error',
            dangerouslyUseHTMLString: true,
            message: '<p>' + arr.join('</p><p>') + '</p>'
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm(this.$t('browser.delete_confirm').replace('${name}', row.name))
        .then(async () => {
          await deleteGroup(row.id)
          this.getList()
          this.$notify({
            title: this.$t('browser.success'),
            message: this.$t('browser.delete') + this.$t('browser.success'),
            type: 'success',
            duration: 2000
          })
        })
        .catch(() => {})
    },
    async searchList() {
      try {
        const fullList = await this._getGroupList()
        if (this.listQuery.title) {
          const searchQueryLower = this.listQuery.title.toLowerCase()
          this.list = fullList.filter(item => {
            const itemName = String(item.name)
            const itemId = String(item.id)
            return itemName.includes(searchQueryLower) || itemId.includes(searchQueryLower)
          })
        } else {
          this.list = fullList
        }
      } catch (error) {
        console.error('Search failed:', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  display: flex;
  justify-content: space-between;

  .filter-item:not(:last-child) {
    margin-right: 10px;
  }
}

.formDlg {
  ::v-deep {
    .el-dialog {
      min-width: 400px;
    }
    .tips {
      font-size: 12px;
      color: #999;
      line-height: 1.5;
      margin-top: 5px;
    }
    .el-dialog__body {
      padding-top: 5px;
      padding-bottom: 0;
    }
    .el-form-item {
      margin-bottom: 15px;
      margin-right: 5px;
    }
    .el-form-item__label {
      font-size: 12px;
      word-break: keep-all;
    }
  }

  .drawer-content {
    height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;

    .form-wrap {
      overflow-y: auto;
      padding: 10px 20px;
    }
    .dialog-footer {
      padding: 20px;
      text-align: center;

      ::v-deep {
        .el-button {
          width: 150px;
        }
      }
    }
  }
}
</style>
