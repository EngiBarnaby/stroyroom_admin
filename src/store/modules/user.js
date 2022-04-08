const user = {

    namespaced : true,

    state : {
        user : {}
    },

    mutations : {
        setUserData(state, data){
            state.user = data
        },

        logout(state){
          state.user = {}
          localStorage.removeItem("token")
        },
    },

    actions : {

    },


    getters : {
        getUserData : state => state.user
    },

}

export default user