function UserServices() {
    this.getUsers = function () {
        return axios({
            method: 'get',
            url: 'https://61d80161e6744d0017ba88aa.mockapi.io/UsersQLTT',
        });
    }
    this.addUser = function (user) {
        return axios({
            method: 'post',
            url: 'https://61d80161e6744d0017ba88aa.mockapi.io/UsersQLTT',
            data: user
        });
    }
    this.deleteUser = function (id) {
        return axios({
            method: 'delete',
            url: `https://61d80161e6744d0017ba88aa.mockapi.io/UsersQLTT/${id}`,
        });
    }
    this.watchUser = function (id) {
        return axios({
            method: 'get',
            url: `https://61d80161e6744d0017ba88aa.mockapi.io/UsersQLTT/${id}`,
        });
    }
    this.updateUser = function (id, user) {
        return axios({
            method: 'put',
            url: `https://61d80161e6744d0017ba88aa.mockapi.io/UsersQLTT/${id}`,
            data: user
        });
    }

}