var us = new UserServices();
var validation = new Validation();
//Lấy dữ liệu từ API
function getUsersData() {
    us.getUsers()
        .then(function (result) {
            postTable(result.data)
        })
        .catch(function (error) {
            console.log(error);
        })
}
getUsersData();
//Hiển thị lên table
function postTable(data) {
    var number = 1;
    var content = "";
    data.map(function (user) {
        content += `
        <tr>
        <td>${number}</td>
        <td>${user.taiKhoan}</td>
        <td>${user.matKhau}</td>
        <td>${user.hoTen}</td>
        <td>${user.email}</td>
        <td>${user.ngonNgu}</td>
        <td>${user.loaiND}</td>
        <td>
            <button onclick="deleteUserData(${user.id})" class="btn btn-danger">Xóa</button>
            <button onclick="watchUserData(${user.id})" class="btn btn-info">Xem</button>
        </td>
        </tr>
        `;
        number++;
    });
    document.querySelector("#tblDanhSachNguoiDung").innerHTML = content;
}
//Tạo button add
document.querySelector("#btnThemNguoiDung").addEventListener("click", function () {
    document.querySelector(".modal-footer").innerHTML = `<button onclick="addUsersData()" class="btn btn-success">Add</button>`;
});
//Thêm dữ liệu người dùng
function addUsersData() {
    var tKhoan = document.querySelector("#TaiKhoan").value;
    var ten = document.querySelector("#HoTen").value;
    var pass = document.querySelector("#MatKhau").value;
    var mail = document.querySelector("#Email").value;
    var loai = document.querySelector("#loaiNguoiDung").value;
    var ngonNgu = document.querySelector("#loaiNgonNgu").value;
    var moTa = document.querySelector("#MoTa").value;
    var hinh = document.querySelector("#HinhAnh").value;

    var isValid = true;
    //Tài Khoản: không được để trống, không được trùng
    isValid &= validation.checkEmpty(tKhoan, "tbTK", "Hãy nhập tài khoản của bạn") && us.getUsers()
        .then(function (result) {
            validation.checkTK(tKhoan, "tbTK", "Tài khoản này đã được sử dụng", result.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    isValid = checkValidation(ten, pass, mail, hinh, moTa);
    if (isValid) {
        var user = new User(tKhoan, ten, pass, mail, loai, ngonNgu, moTa, hinh);
        us.addUser(user)
            .then(function () {
                getUsersData();
                document.querySelector(".modal-header .close").click();
            })
            .catch(function (error) {
                console.log(error);
            })
    }

}
//Xóa dữ liệu người dùng
function deleteUserData(id) {
    us.deleteUser(id)
        .then(function () {
            getUsersData();
        })
        .catch(function (error) {
            console.log(error);
        })
}
//Xem dữ liệu người dùng
function watchUserData(id) {
    us.watchUser(id)
        .then(function (result) {
            document.querySelector("#TaiKhoan").value = result.data.taiKhoan;
            document.querySelector("#TaiKhoan").disabled = true;
            document.querySelector("#HoTen").value = result.data.hoTen;
            document.querySelector("#MatKhau").value = result.data.matKhau;
            document.querySelector("#Email").value = result.data.email;
            document.querySelector("#loaiNguoiDung").value = result.data.loaiND;
            document.querySelector("#loaiNgonNgu").value = result.data.ngonNgu;
            document.querySelector("#MoTa").value = result.data.moTa;
            document.querySelector("#HinhAnh").value = result.data.hinhAnh;

            document.querySelector("#btnThemNguoiDung").click();
            //Tạo button update
            document.querySelector(".modal-footer").innerHTML = `<button onclick="updateUserData(${id})" class="btn btn-success">Update</button>`;
        })
        .catch(function (error) {
            console.log(error);
        })
}
//Cập nhật dữ liệu người dùng
function updateUserData(id) {
    var tKhoan = document.querySelector("#TaiKhoan").value;
    var ten = document.querySelector("#HoTen").value;
    var pass = document.querySelector("#MatKhau").value;
    var mail = document.querySelector("#Email").value;
    var loai = document.querySelector("#loaiNguoiDung").value;
    var ngonNgu = document.querySelector("#loaiNgonNgu").value;
    var moTa = document.querySelector("#MoTa").value;
    var hinh = document.querySelector("#HinhAnh").value;

    var isValid = checkValidation(ten, pass, mail, hinh, moTa);
    if (isValid) {
        var user = new User(tKhoan, ten, pass, mail, loai, ngonNgu, moTa, hinh);
        us.updateUser(id, user)
            .then(function () {
                getUsersData();
                document.querySelector(".modal-header .close").click();
            })
            .catch(function (error) {
                console.log(error);
            })
    }

}
//Reset form
function resetForm() {
    document.querySelector(".modal-body").reset();
    document.querySelector("#TaiKhoan").disabled = false;

}
//Đóng modal
document.querySelector(".close").addEventListener("click", resetForm)
document.querySelector("#myModal").addEventListener("click", function (e) {
    if (e.target == e.currentTarget) {
        resetForm();
    }
});
//Kiểm tra thông tin
function checkValidation(ten, pass, mail, hinh, moTa) {
    var isValid = true;
    //Họ tên: không được để trống, không chứa số và ký tự đặc biệt 
    isValid &= validation.checkEmpty(ten, "tbTen", "Hãy nhập tên của bạn") && validation.checkName(ten, "tbTen", "Tên không chứa số và ký tự đặc biệt");
    //Mật khẩu: không được để trống, dúng format (có ít nhất 1 ký tự hoa, 1 ký tự đặc biệt, 1 ký tựsố, độ dài 6-8)
    isValid &= validation.checkEmpty(pass, "tbPass", "Hãy nhập mật khẩu của bạn") && validation.checkPass(pass, "tbPass", "Mật khẩu có ít nhất 1 ký tự hoa, 1 ký tự đặc biệt, 1 ký tự số, độ dài 6-8");
    //Email: không được để trống, đúng format email
    isValid &= validation.checkEmpty(mail, "tbMail", "Hãy nhập email của bạn") && validation.checkMail(mail, "tbMail", "Hãy nhập đúng format email");
    //Hinh anh: không được để trống
    isValid &= validation.checkEmpty(hinh, "tbHinh", "Hãy nhập hình ảnh của bạn");
    //Loại người dùng: phải chọn loại
    isValid &= validation.checkSelect("loaiNguoiDung", "tbLoai", "Bạn chưa chọn loại người dùng");
    //Loại ngôn ngữ: phải chọn loại
    isValid &= validation.checkSelect("loaiNgonNgu", "tbNN", "Bạn chưa chọn ngôn ngữ");
    //Mô tả: không được để trống, không vượt quá 60 ký tự
    isValid &= validation.checkEmpty(moTa, "tbMota", "Hãy nhập mô tả của bạn") && validation.checkMota(moTa, "tbMota", "Bạn đã nhập quá 60 ký tự");
    return isValid;
}