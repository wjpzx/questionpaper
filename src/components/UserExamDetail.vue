<template>
  <div>
    <div v-if="!needLogin">
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
            <!--            ⚠️注意：（1）到达截止时间后，试卷将不可提交，请及时保存；（2）提交试卷后，试卷将不可修改，请谨慎提交。-->
            ⚠️注意：（1）到达截止时间后，试卷将自动提交，请及时保存。
          </div>
        </el-col>
      </el-row>
      <el-divider/>
      <el-row style="height: 20px">
        <el-col :span="24" style="">
          <div style="color: black; font-size: 1.5em;float: left; margin-left: 10px">
            <!--          距离结束:{{ countDown.day }}天{{ countDown.hr }}:{{ countDown.min }}:{{ countDown.sec }}-->
            距离结束: {{ countDown.min }}:{{ countDown.sec }}
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
      <el-button size="mini" type="primary" @click="save('save')">保存</el-button>
      <el-button size="mini" type="primary" @click="save_submit()">提交试卷</el-button>
    </div>
    <div v-if="needLogin">
      <el-row class="login">
        <div class="data-input">
          <p>姓&nbsp;&nbsp;&nbsp;&nbsp;名：
            <el-input style="width: 300px" type="text" v-model="name" placeholder="请输入姓名" clearable/>
          </p>
          <p>手机号：
            <el-input style="width: 300px" type="phone" v-model="phone" placeholder="请输入手机号" clearable/>
          </p>
          <p>
            <el-button type="primary">提交</el-button>
          </p>
        </div>
      </el-row>
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
    return {
      id: this.$route.params.eid,
      type: this.$route.query.type,
      title: '',
      name: "",
      phone: "",
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
      }
    },
    detail() {
      const self = this
      $.ajax({
        url: Conf.url.v1.paper.detail(this.id).path,
        type: Conf.url.v1.paper.detail(this.id).method,
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
          if (Utils.apiStatusDeal(self, data)) {
            // console.log("data is :", data)
            self.questionList = data.question_list
            self.title = data.title
            // self.countdown(data.end_time)
            self.setTime()
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
        url: Conf.url.v1.paper.save(this.id).path,
        type: Conf.url.v1.paper.save(this.id).method,
        data: JSON.stringify({
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
            self.$message('保存成功')
            self.detail()
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
    // countdown(endTime) {
    //   const end = Date.parse(new Date(endTime))
    //   const now = Date.parse(new Date())
    //   const msec = end - now
    //   let day = 0
    //   let hr = 0
    //   let min = 0
    //   let sec = 0
    //   if (msec > 0) {
    //     day = parseInt(msec / 1000 / 60 / 60 / 24)
    //     hr = parseInt(msec / 1000 / 60 / 60 % 24)
    //     min = parseInt(msec / 1000 / 60 % 60)
    //     sec = parseInt(msec / 1000 % 60)
    //   } else {
    //     this.save('submit')
    //     this.canAnswer = false
    //     this.$alert('考试已结束', '考试通知', {
    //       confirmButtonText: '确定'
    //     })
    //   }
    //   this.countDown.day = day
    //   this.countDown.hr = hr > 9 ? hr : '0' + hr
    //   this.countDown.min = min > 9 ? min : '0' + min
    //   this.countDown.sec = sec > 9 ? sec : '0' + sec
    //   if (this.canAnswer === false) {
    //     return
    //   }
    //   const that = this
    //   clearTimeout(this._interval)
    //   this._interval = setTimeout(function () {
    //     that.countdown(endTime)
    //   }, 1000)
    // },
    setTime() {
      const self = this
      let min = 45
      let sec = 0
      this._interval = setInterval(function () {
        // console.log("sec===",sec)
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
    this.detail()
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

.right-answer /deep/ .el-textarea__inner {
  color: red;

}

.login {
  height: 500px;
  width: 600px;
  background: #42b983;
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.data-input {
  height: 500px;
  width: 600px;
  display: table-cell;
  vertical-align: middle;
}

</style>
