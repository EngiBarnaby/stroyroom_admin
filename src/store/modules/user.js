const user = {

    namespaced : true,

    state : {
        user : {}
    },

    mutations : {
        setUserData(state, data){
            state.user = data
        }
    },

    actions : {

    },


    getters : {
        getUserData : state => state.user
    },

}

export default user