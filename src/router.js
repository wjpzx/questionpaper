import Vue from 'vue'
import VueRouter from 'vue-router'
import ExamPaper from './components/UserExamDetail'
import HelloWorld from "@/components/HelloWorld";

Vue.use(VueRouter)

const router = new VueRouter({
    mode: "history",
    routes: [
        {path:'/', component: HelloWorld, name:"hello_word"},
        {path:'/exam/:eid', component: ExamPaper, name:"exam_paper"},
        {path:'/paper/:eid', component: ExamPaper, name:"owner_paper"},
    ]
})

export default router
