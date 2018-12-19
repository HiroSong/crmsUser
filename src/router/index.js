import Vue from 'vue'
import Router from 'vue-router'
import store from '@/vuex/store'

Vue.use(Router)

const router = new Router({
  base: '/',
  mode: 'history',
  routes: [{
    path: '/',
    redirect: '/login'
  }, {
    path: '/login',
    name: 'LoginPage',
    meta: {
      title: '登录'
    },
    component: resolve => require(['@/components/common/LoginPage'], resolve)
  }, {
    path: '/find',
    name: 'FindPasswordPage',
    meta: {
      title: '找回密码'
    },
    component: resolve => require(['@/components/common/FindPassword'], resolve)
  }, {
    path: '/active',
    name: 'ActiveAccountPage',
    meta: {
      title: '激活账户'
    },
    component: resolve => require(['@/components/common/ActiveAccount'], resolve)
  }, {
    path: '/home',
    name: 'HomePage',
    meta: {
      title: '个人中心'
    },
    component: resolve => require(['@/components/personal/HomePage'], resolve)
  }, {
    path: '/account',
    name: 'AccountPage',
    meta: {
      title: '账户与设置'
    },
    component: resolve => require(['@/components/personal/AccountPage'], resolve)
  }, {
    path: '/account/email',
    name: 'ModifyEmailPage',
    meta: {
      title: '修改邮箱'
    },
    component: resolve => require(['@/components/personal/ModifyEmail'], resolve)
  }, {
    path: '/account/password',
    name: 'ModifyPwdPage',
    meta: {
      title: '修改密码'
    },
    component: resolve => require(['@/components/personal/ModifyPwd'], resolve)
  }, {
    path: '/account/todo',
    name: 'TodoPage',
    meta: {
      title: '待办'
    },
    component: resolve => require(['@/components/personal/TodoPage'], resolve)
  }, {
    path: '/course',
    name: 'CoursePage',
    meta: {
      title: '我的课程'
    },
    component: resolve => require(['@/components/course/CoursePage'], resolve)
  }, {
    path: '/course/create',
    name: 'CreateCoursePage',
    meta: {
      title: '新建课程'
    },
    component: resolve => require(['@/components/course/CreateCourse'], resolve)
  }, {
    path: '/course/info',
    name: 'CourseInfoPage',
    meta: {
      title: '课程信息'
    },
    component: resolve => require(['@/components/course/CourseInfoPage'], resolve)
  }, {
    path: '/course/score',
    name: 'ScorePage',
    meta: {
      title: '成绩信息'
    },
    component: resolve => require(['@/components/course/ScorePage'], resolve)
  }, {
    path: '/course/class',
    name: 'ClassPage',
    meta: {
      title: '班级信息'
    },
    component: resolve => require(['@/components/course/ClassPage'], resolve)
  }, {
    path: '/course/class/create',
    name: 'CreateClassPage',
    meta: {
      title: '新建班级'
    },
    component: resolve => require(['@/components/course/CreateClass'], resolve)
  }, {
    path: '/seminar',
    name: 'SeminarPage',
    meta: {
      title: '讨论课'
    },
    component: resolve => require(['@/components/seminar/SeminarPage'], resolve)
  }, {
    path: '/seminar/main',
    name: 'SeminarMainPage',
    meta: {
      title: '课程列表'
    },
    component: resolve => require(['@/components/seminar/SeminarMainPage'], resolve)
  }, {
    path: '/seminar/info',
    name: 'SeminarInfoPage',
    meta: {
      title: '讨论课信息'
    },
    component: resolve => require(['@/components/seminar/SeminarInfoPage'], resolve)
  }, {
    path: '/seminar/setting',
    name: 'SeminarSettingPage',
    meta: {
      title: '讨论课轮次设置'
    },
    component: resolve => require(['@/components/seminar/SeminarSettingPage'], resolve)
  }, {
    path: '/seminar/modify',
    name: 'ModifySeminarPage',
    meta: {
      title: '讨论课修改'
    },
    component: resolve => require(['@/components/seminar/ModifySeminar'], resolve)
  }, {
    path: '/seminar/create',
    name: 'CreateSeminarPage',
    meta: {
      title: '新建讨论课'
    },
    component: resolve => require(['@/components/seminar/CreateSeminar'], resolve)
  }, {
    path: '/seminar/process',
    name: 'ProcessSeminarPage',
    meta: {
      title: '讨论课进行'
    },
    component: resolve => require(['@/components/seminar/ProcessSeminar'], resolve)
  }, {
    path: '/seminar/attendance',
    name: 'SeminarAttendancePage',
    meta: {
      title: '讨论课情况'
    },
    component: resolve => require(['@/components/seminar/SeminarAttendancePage'], resolve)
  }, {
    path: '/seminar/score',
    name: 'SeminarScorePage',
    meta: {
      title: '讨论课成绩'
    },
    component: resolve => require(['@/components/seminar/SeminarScorePage'], resolve)
  }, {
    path: '/team',
    name: 'TeamPage',
    meta: {
      title: '组队'
    },
    component: resolve => require(['@/components/team/TeamPage'], resolve)
  }, {
    path: '/team/create',
    name: 'CreateTeamPage',
    meta: {
      title: '创建小组'
    },
    component: resolve => require(['@/components/team/CreateTeam'], resolve)
  }, {
    path: '/team/info',
    name: 'TeamInfoPage',
    meta: {
      title: '小组信息'
    },
    component: resolve => require(['@/components/team/TeamInfoPage'], resolve)
  }, {
    path: '/application',
    name: 'ApplicationPage',
    meta: {
      title: '共享设置'
    },
    component: resolve => require(['@/components/application/ApplicationPage'], resolve)
  }, {
    path: '/application/create',
    name: 'CreateApplicationPage',
    meta: {
      title: '新增共享'
    },
    component: resolve => require(['@/components/application/CreateApplication'], resolve)
  }, {
    path: '/*',
    name: '404Page',
    meta: {
      title: '404'
    },
    component: resolve => require(['@/components/common/404'], resolve)
  }]
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (to.matched.some(record => record.name === 'LoginPage')) {
    store.commit('CLEAR_AUTH')
    next()
  }
  const role = store.state.role ? store.state.role : window.sessionStorage.getItem('role')
  const token = store.state.token ? store.state.token : window.sessionStorage.getItem('token')
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (to.matched.some(record => record.meta.requireRole !== role) ||
      !token) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
});

export default router
