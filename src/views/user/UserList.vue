<template>
  <div id="user-list">
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card class="box-card">
      <!--搜索区域-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!--添加用户-->
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!--用户表格-->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="日期"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="操作" width="180px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!--添加用户对话框-->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%">
        <!--内容主题区-->
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="70px"
          @close="dialogClose"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!--修改用户对话框-->
      <el-dialog
        title="编辑用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editFormClose"
      >
        <!--内容主题区-->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  // 网络请求
  import {
    getUserList,
    saveUserState,
    addUser,
    getUserInfoById,
    saveUserInfo,
    deleteUser,
  } from 'network/user'

  export default {
    name: 'UserList',
    data() {
      // 邮箱验证规则
      let checkEmail = (rule, value, callback) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_)])+/
        if (regEmail.test(value)) {
          // 合法邮箱
          return callback()
        } else {
          callback(new Error('请输入合法邮箱'))
        }
      }
      // 手机号验证规则
      let checkMobile = (rule, value, callback) => {
        const regMobile = /^(0|86|17951)?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regMobile.test(value)) {
          // 合法手机号
          return callback()
        } else {
          callback(new Error('请输入合法手机号'))
        }
      }
      return {
        queryInfo: {
          query: '',
          // 当前页数
          pagenum: 1,
          // 当前每页显示多少条数据
          pagesize: 2,
        },
        userList: [],
        total: 0,
        // 控制添加用户对话框的显示和隐藏
        addDialogVisible: false,
        // 新添加用户表单数据
        addForm: {
          username: '',
          password: ' ',
          email: '',
          mobile: '',
        },
        // 新添加用户表单数据验证规则
        addFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' },
          ],
          mobile: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' },
          ],
        },
        // 控制编辑用户对话框显示和隐藏
        editDialogVisible: false,
        // 根据id获取到的用户信息
        editForm: {},
        // 编辑表单验证
        editFormRules: {
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' },
          ],
          mobile: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' },
          ],
        },
      }
    },
    methods: {
      // 1.请求用户列表
      getUserList() {
        getUserList(this.queryInfo).then(
          res => {
            this.userList = res.data.users
            this.total = res.data.total
          },
          err => {
            this.$message.error(err)
          },
        )
      },
      // 2.每页显示条数改变事件
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },
      // 3.当前显示页码数改变事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      // 4.用户状态改变事件
      userStateChanged(newValue) {
        saveUserState(newValue.id, newValue.mg_state).then(res => {
          if (res.meta.status !== 200) {
            // 更新失败用户状态不变
            newValue.mg_state = !newValue.mg_state
            return this.$message.error('更新状态失败')
          } else {
            return this.$message.success('更新状态成功')
          }
        })
      },
      // 5.添加用户对话框关闭并重置内容
      dialogClose() {
        this.$refs.addFormRef.resetFields()
      },
      // 6.点击按钮添加用户
      addUser() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return this.$message.error('请填写正确表单内容')
          // 成功发送添加用户请求
          addUser(this.addForm).then(res => {
            if (res.meta.status !== 201) return this.$message.error('添加用户失败')
            this.$message.success('添加用户成功')
            // 隐藏添加用户列表输入框
            this.addDialogVisible = false
            // 重新获取列表数据
            this.getUserList()
          })
        })
      },
      // 7.显示编辑用户对话框事件,发送请求用户信息
      showEditDialog(id) {
        getUserInfoById(id).then(res => {
          if (res.meta.status !== 200) return this.$message.error('查询用户数据失败')
          this.editForm = res.data
          this.editDialogVisible = true
        })
      },
      // 8.当编辑输入框关闭时重置表单
      editFormClose() {
        this.$refs.editFormRef.resetFields()
      },
      // 9.修改用户信息并提交
      editUserInfo() {
        this.$refs.editFormRef.validate(valid => {
          if (!valid) return this.$message.error('编辑错误')
          saveUserInfo(this.editForm.id, this.editForm.email, this.editForm.mobile).then(res => {
            if (res.meta.status !== 200) return this.$message.error('编辑错误')
            this.$message.success('编辑成功')
            // 隐藏对话框
            this.editDialogVisible = false
            // 刷新列表重新获取数据
            this.getUserList()
          })
        })
      },
      // 10.删除用户
      removeUserById(id) {
        // 询问是否删除
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            // 删除用户
            deleteUser(id).then(res => {
              if (res.meta.status !== 200) return this.$message.error('删除失败')
              this.$message.success('删除成功')
              this.getUserList()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      },
    },
    created() {
      this.getUserList()
    },
  }
</script>

<style scoped lang="less">
  #user-list {
    .el-table {
      margin-top: 20px;
    }
    .el-pagination {
      margin-top: 20px;
    }
  }
</style>
