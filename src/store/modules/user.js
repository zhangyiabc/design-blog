import { login, getInfo } from '@/api/user'
import { getToken, removeToken, getItem, setItem } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'

const getDefaultState = () => {
  return {
    token: getToken(),
    author: getItem('name') || ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, author) => {
    state.author = author
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        const token = Cookies.get('token')
        commit('SET_TOKEN', token)
        commit('SET_NAME', data.author)
        setItem('name', data.author)
        // setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo(state.token).then(response => {
      //   const { data } = response

      //   if (!data) {
      //     return reject('Verification failed, please Login again.')
      //   }

      //   // const { name, avatar } = data
      //   const { author: name } = data

      //   commit('SET_NAME', name)
      //   // commit('SET_AVATAR', avatar)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
      resolve()
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      //   removeToken() // must remove  token  first
      //   resetRouter()
      //   commit('RESET_STATE')
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
      removeToken()
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

