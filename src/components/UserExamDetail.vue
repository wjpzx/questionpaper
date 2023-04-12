<template>
  <div>
    <div id="detail" style="display: none;">
      <el-row style="height: 20px">
        <el-col :span="24" style="background-color: #303133">
          <div style="color: #F2F6FC; font-size: 1.5em;margin-top: 5px;">
            {{ title }}
          </div>
        </el-col>
      </el-row>
      <el-divider/>
      <el-row style="height: 10px">
        <el-col :span="24" style="">
          <div style="color: darkred; font-size: 0.5em;float: left;margin-left: 10px">
            ⚠️注意：（1）到达截止时间后，试卷将自动提交，请及时保存。
          </div>
        </el-col>
      </el-row>
      <el-divider/>
      <el-row style="height: 20px">
        <el-col :span="24" style="">
          <div style="color: black; font-size: 1.5em;float: left; margin-left: 10px">
            <!--          距离结束:{{ countDown.day }}天{{ countDown.hr }}:{{ countDown.min }}:{{ countDown.sec }}-->
            <span v-if="canAnswer">距离结束: {{ countDown.min }}:{{ countDown.sec }}</span>
            <span v-else>答题时间已结束</span>
          </div>
        </el-col>
      </el-row>
      <template v-if="questionList.completion.length > 0">
        <el-divider/>
        <el-row style="background-color: #99a9bf">
          <el-col :span="24">
            <div class="question-type">填空题</div>
          </el-col>
        </el-row>
        <template v-for="(item, index) in questionList.completion">
          <el-row :key="item.id" style="background-color: #e5e9f2">
            <el-col :span="24">
              <div class="question">{{ index + 1 }}
                、{{ item.content }}({{ item.answer_words_limit }}字内)
              </div>
            </el-col>
            <el-col :span="24">
              <div class="question">
                <el-input size="large" style="width: 700px" :disabled=!canAnswer :maxlength="item.answer_words_limit"
                          show-word-limit
                          placeholder="请输入答案" v-model="item.answer"/>
              </div>
            </el-col>

          </el-row>
        </template>
      </template>
      <template v-if="questionList.short_answer.length > 0">
        <el-divider/>
        <el-row style="background-color: #99a9bf">
          <el-col :span="24">
            <div class="question-type">问答题</div>
          </el-col>
        </el-row>
        <template v-for="(item, index) in questionList.short_answer">
          <el-row :key="item.id" style="background-color: #e5e9f2">
            <el-col :span="24">
              <div class="question">{{ index + 1 }}
                、{{ item.content }}({{ item.answer_words_limit }}字内)
              </div>
            </el-col>
            <el-col :span="24">
              <div class="question">
                <el-input type="textarea" style="width: 700px" :disabled=!canAnswer :maxlength="item.answer_words_limit"
                          show-word-limit
                          :autosize="{ minRows: 2, maxRows: 10}" placeholder="请输入答案" v-model="item.answer"/>
              </div>
            </el-col>
          </el-row>
        </template>
      </template>
      <el-divider/>
      <el-button size="mini" type="primary" :disabled=!canAnswer @click="save('save')">保存</el-button>
      <el-button size="mini" type="primary" :disabled=!canAnswer @click="save_submit()">提交试卷</el-button>
    </div>
    <div class="login" id="login">
      <el-form :model="userModel" :rules="rules" size="medium" label-width="80px" :label-position=labelPosition
               class="form" ref="userModel">
        <el-form-item label="姓名" class="form-label" prop="name">
          <el-input style="width: 300px;" v-model="userModel.name" placeholder="请输入姓名" clearable/>
        </el-form-item>
        <el-form-item label="手机号" class="form-label" prop="phone">
          <el-input style="width: 300px" v-model="userModel.phone" placeholder="请输入手机号" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="form-button" @click="InfoSubmit('userModel')">提交</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import Conf from '../conf'
import Utils from '../utils'

export default {
  name: 'UserExamDetail',
  data() {
    const validatePhone = (rule, value, callback) => {
      const reg = /^1[3-9][0-9]{9}$/
      if (reg.test(value)) {
        callback()
      } else {
        rule.message = "手机号格式错误"
        callback(new Error("手机号格式错误"))
      }
    }
    return {
      id: this.$route.params.eid,
      labelPosition: "left",
      startTime: "",
      title: '',
      userModel: {
        "id": this.$route.params.eid,
        "name": "",
        "phone": "",
      },
      rules: {
        name: [
          {required: true, message: "姓名为必填", trigger: "blur"}
        ],
        phone: [
          {validator: validatePhone, required: true, message: "手机号为必填", trigger: "blur", len: 11},
        ]
      },
      needLogin: true,
      canAnswer: true,
      questionList: {
        "completion": [],
        "short_answer": [],
      },
      countDown: {
        day: 0,
        hr: 0,
        min: 0,
        sec: 0
      },
    }
  },
  methods: {
    login() {
      const path = this.$route.path.split("/")[1]
      if (path === "exam") {
        this.needLogin = true;
      } else if (path === "paper") {
        this.needLogin = false;
        this.canAnswer = false;
        this.userModel.name = this.$route.query.name
        this.userModel.phone = this.$route.query.phone
        $('#login').css("display", "none");
        $('#detail').css("display", "block");
        this.detail("paper");
      }
    },
    InfoSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const self = this
          $.ajax({
            url: Conf.url.v1.paper.user().path,
            type: Conf.url.v1.paper.user().method,
            data: {"info": JSON.stringify(self.userModel)},
            dataType: "json",
            success: function (data) {
              if (Utils.apiStatusDeal(self, data)) {
                console.log("data===:", data)
                self.startTime = data.start_time;
                self.detail("exam");
                $('#login').css("display", "none");
                $('#detail').css("display", "block");
              }
            },
            error: function (error) {
              console.log("ajax error", error)
              alert("请求失败，请刷新后重试")
            }
          })
        } else {
          console.log('error submit!!')
          alert("请将信息填充完整！")
        }
      })
    },
    detail(method) {
      const self = this
      $.ajax({
        url: Conf.url.v1.paper.detail(this.id).path,
        type: Conf.url.v1.paper.detail(this.id).method,
        data: {"name": self.userModel.name, "phone": self.userModel.phone},
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
          if (Utils.apiStatusDeal(self, data)) {
            console.log("data is :", data)
            self.questionList = data.question_list
            self.title = data.title
            const paper_status = data.paper_status
            if (paper_status === "normal" && method === "exam") {
              self.canAnswer = true;
            } else if (paper_status === "over") {
              self.canAnswer = false;
            }
            if (method === "exam") {
              self.countdown(self.startTime)
            }
          }
        },
        error: function (xhr, errorType, error) {
          console.log('xhr:' + JSON.stringify(xhr))
          alert('Ajax request error, errorType: ' + errorType + ', error: ' + error)
        }
      })
    },
    save(operation) {
      const self = this
      $.ajax({
        url: Conf.url.v1.paper.save().path,
        type: Conf.url.v1.paper.save().method,
        data: JSON.stringify({
          user_info: this.userModel,
          new_answer_info: this.questionList,
          operation: operation,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
          if (Utils.apiStatusDeal(self, data)) {
            if (operation === "save") {
              self.$message('保存成功')
            } else {
              self.canAnswer = false

              self.detail("exam")
            }
          }
        },
        error: function (xhr, errorType, error) {
          console.log('xhr:' + JSON.stringify(xhr))
          alert('Ajax request error, errorType: ' + errorType + ', error: ' + error)
        }
      })
    },
    save_submit() {
      this.$confirm('此操作将永久提交，不可再修改, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.save('submit')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    },
    countdown(startTime) {
      const start = Date.parse(new Date(startTime))
      const now = Date.parse(new Date())
      let min = 0
      let sec = 0
      const time = now - start
      if (time < 45 * 60000) {
        const msec = 45 * 60000 - time - 1000   // 设置1000ms容错率
        if (msec > 0) {
          min = parseInt(msec / 1000 / 60 % 60)
          sec = parseInt(msec / 1000 % 60)
        }
      } else {
        if (this.canAnswer) {
          this.save('submit')
          this.canAnswer = false
          this.$alert('答题已结束', '通知', {
            confirmButtonText: '确定'
          })
        }
      }
      this.countDown.min = min > 9 ? min : '0' + min
      this.countDown.sec = sec > 9 ? sec : '0' + sec
      if (this.canAnswer === false) {
        return
      }
      const that = this
      clearTimeout(this._interval)
      this._interval = setTimeout(function () {
        that.countdown(startTime)
      }, 1000)
    },
    setTime() {
      const self = this
      let min = 45
      let sec = 0
      this._interval = setInterval(function () {
        if (sec === 0) {
          if (min === 0) {
            self.save("submit")
            clearInterval(self._interval)
          } else {
            min -= 1;
            sec = 59;
          }
        } else {
          sec -= 1
        }
        self.countDown.min = min > 9 ? min : '0' + min
        self.countDown.sec = sec > 9 ? sec : '0' + sec

      }, 1000)
    }
  },
  mounted() {
    this.login()
  },
  beforeDestroy() {
    clearInterval(this._interval)
  }
}
</script>

<style scoped>
.question-type {
  font-size: 25px;
  font-weight: bold;
  margin-top: 10px;
  margin-left: 100px;
  float: left;
  border-radius: 4px;
  min-height: 42px;
}

.question {
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
  margin-left: 100px;
  float: left;
  border-radius: 4px;
  min-height: 42px;
  text-align: left;
}

.login {
  height: 500px;
  width: 600px;
  background: #08b5fa;
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: block;
}

.form {
  width: 600px;
  height: 300px;
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
}

.form-label {
  margin: 50px 0;
  width: 480px;
}

.form-label /deep/ .el-form-item__label {
  margin-left: 80px;
}

.form-button {
  margin-left: -80px;
}

</style>
