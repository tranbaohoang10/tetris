const board = document.querySelector(".board");
const row = 20;
const col = 10;
for (let i = 0; i < row * col; i++) {
  const matrix = document.createElement("div");
  matrix.classList.add("matrix");
  board.appendChild(matrix);
}
// đếm dòng
const lineElement = document.querySelector(".line");
// xu ly mau hinh vuong(test hình trước)
const matrixs = document.querySelectorAll(".matrix");
// matrixs[4].classList.add("block", "block-square");
// matrixs[5].classList.add("block", "block-square");
// matrixs[14].classList.add("block", "block-square");
// matrixs[15].classList.add("block", "block-square");
//
// xu ly nut di xuong

let position = 4;
let gameover = false;
// đồ án sử dụng line ko sử dụng score, line = 10 thì qua level khác
let line = 0;
let spinI = 0;
let spinT = 0;
let spinS = 0;
let spinZ = 0;
let spinJ = 0;
let currentShape = "";
function drawSquare() {
  matrixs[position].classList.add("block", "block-square");
  matrixs[position + 1].classList.add("block", "block-square");
  matrixs[position + 10].classList.add("block", "block-square");
  matrixs[position + 11].classList.add("block", "block-square");
}
// nghĩa là ban đầu vị trí của hình vuông là 4 và khi nhấn nút xuốngvị trí sẽ tăng lên 10 (vì có 10 cột) do đó hình vuông sẽ di chuyển xuống một hàng. Khi nhấn nút xuống thì cần xóa các ô vuông hiện tại và thêm các ô vuông mới ở vị trí mới và xử lý ở hàm moveDown().
function clearSquare() {
  matrixs[position].classList.remove("block", "block-square");
  matrixs[position + 1].classList.remove("block", "block-square");
  matrixs[position + 10].classList.remove("block", "block-square");
  matrixs[position + 11].classList.remove("block", "block-square");
}
// sau khi hình vuông chạm đáy hoặc chạm vào các ô vuông đã có vật cản khác thì cần khóa các ô vuông hiện tại lại và tạo một hình vuông mới ở vị trí ban đầu.
function lockSquare() {
  matrixs[position].classList.add("fixed");
  matrixs[position + 1].classList.add("fixed");
  matrixs[position + 10].classList.add("fixed");
  matrixs[position + 11].classList.add("fixed");
  checkRow();
  // random
  newShape();
}
function drawI() {
  if (spinI === 0) {
    matrixs[position].classList.add("block", "block-i");
    matrixs[position + 1].classList.add("block", "block-i");
    matrixs[position + 2].classList.add("block", "block-i");
    matrixs[position + 3].classList.add("block", "block-i");
  }
  if (spinI === 1) {
    matrixs[position].classList.add("block", "block-i");
    matrixs[position + 10].classList.add("block", "block-i");
    matrixs[position + 20].classList.add("block", "block-i");
    matrixs[position + 30].classList.add("block", "block-i");
  }
}
// nghĩa là ban đầu vị trí của hình chữ I là 3(để nó nằm ở giữa)và khi nhấn nút xuốngvị trí sẽ tăng lên 10 (vì có 10 cột) do đó hình vuông sẽ di chuyển xuống một hàng. Khi nhấn nút xuống thì cần xóa các ô vuông hiện tại và thêm các ô vuông mới ở vị trí mới và xử lý ở hàm moveDown().
function clearI() {
  if (spinI === 0) {
    matrixs[position].classList.remove("block", "block-i");
    matrixs[position + 1].classList.remove("block", "block-i");
    matrixs[position + 2].classList.remove("block", "block-i");
    matrixs[position + 3].classList.remove("block", "block-i");
  }
  if (spinI === 1) {
    matrixs[position].classList.remove("block", "block-i");
    matrixs[position + 10].classList.remove("block", "block-i");
    matrixs[position + 20].classList.remove("block", "block-i");
    matrixs[position + 30].classList.remove("block", "block-i");
  }
}
// Hàm này để xử lý khi nhấn nút xoay hình chữ I, nếu hình đang nằm ngang thì xoay sang dọc và ngược lại. Khi xoay cần kiểm tra các ô xung quanh có vật cản hay không nếu có thì ko cho xoay.
function rotateI() {
  // từ ngang sang dọc
  if (spinI === 0) {
    if (
      position + 30 < row * col &&
      !matrixs[position + 10].classList.contains("fixed") &&
      !matrixs[position + 20].classList.contains("fixed") &&
      !matrixs[position + 30].classList.contains("fixed")
    ) {
      clearI();
      spinI = 1;
      drawI();
    }
  }
  // từ dọc sang ngang
  else {
    if (
      position % col <= col - 4 &&
      !matrixs[position + 1].classList.contains("fixed") &&
      !matrixs[position + 2].classList.contains("fixed") &&
      !matrixs[position + 3].classList.contains("fixed")
    ) {
      clearI();
      spinI = 0;
      drawI();
    }
  }
}
// sau khi hình I chạm đáy hoặc chạm vào các ô đã có vật cản khác thì cần khóa các ô hiện tại lại và tạo một hình I mới ở vị trí ban đầu.
function lockI() {
  if (spinI === 0) {
    matrixs[position].classList.add("fixed");
    matrixs[position + 1].classList.add("fixed");
    matrixs[position + 2].classList.add("fixed");
    matrixs[position + 3].classList.add("fixed");
  }
  if (spinI === 1) {
    matrixs[position].classList.add("fixed");
    matrixs[position + 10].classList.add("fixed");
    matrixs[position + 20].classList.add("fixed");
    matrixs[position + 30].classList.add("fixed");
  }
  checkRow();
  // random
  newShape();
}
function drawT() {
  // T hướng ban đầu(ví dụ position = 4 thì các ô T sẽ là 4,5,6,15 tức:
  // xxx(4,5,6)
  //  x(15))
  if (spinT === 0) {
    matrixs[position].classList.add("block", "block-t");
    matrixs[position + 1].classList.add("block", "block-t");
    matrixs[position + 2].classList.add("block", "block-t");
    matrixs[position + 11].classList.add("block", "block-t");
  }
  // T xoay 90 độ (ví dụ position = 4 thì sẽ lấy 5 là vị trí ban đầu tức position + 1 và các ô sẽ là 5,15,25,14 tức:
  //  x(5)
  // xx(14,15)
  //  x(25))
  if (spinT === 1) {
    matrixs[position + 1].classList.add("block", "block-t");
    matrixs[position + 10].classList.add("block", "block-t");
    matrixs[position + 11].classList.add("block", "block-t");
    matrixs[position + 21].classList.add("block", "block-t");
  }
  // T xoay 180 độ (ví dụ position = 4 thì sẽ lấy 5 là vị trí ban đầu tức position + 1 và các ô sẽ là 5,15,14,16 tức:
  //  x(5)
  // xxx(14,15,16)
  if (spinT === 2) {
    matrixs[position + 1].classList.add("block", "block-t");
    matrixs[position + 10].classList.add("block", "block-t");
    matrixs[position + 11].classList.add("block", "block-t");
    matrixs[position + 12].classList.add("block", "block-t");
  }
  // T xoay 270 độ (ví dụ position = 4 thì sẽ lấy 4 là vị trí ban đầu thì các ô sẽ là 4,14,24,15 tức:
  //  x(4)
  //  xx(14,15)
  //  x(24))
  if (spinT === 3) {
    matrixs[position].classList.add("block", "block-t");
    matrixs[position + 10].classList.add("block", "block-t");
    matrixs[position + 11].classList.add("block", "block-t");
    matrixs[position + 20].classList.add("block", "block-t");
  }
}
// hàm clearT để xoá các ô T hiện tại và điều kiện như drawT theo từng hướng xoay T
function clearT() {
  // T hướng ban đầu
  if (spinT === 0) {
    matrixs[position].classList.remove("block", "block-t");
    matrixs[position + 1].classList.remove("block", "block-t");
    matrixs[position + 2].classList.remove("block", "block-t");
    matrixs[position + 11].classList.remove("block", "block-t");
  }
  // T xoay 90 độ
  if (spinT === 1) {
    matrixs[position + 1].classList.remove("block", "block-t");
    matrixs[position + 10].classList.remove("block", "block-t");
    matrixs[position + 11].classList.remove("block", "block-t");
    matrixs[position + 21].classList.remove("block", "block-t");
  }
  // T xoay 180 độ
  if (spinT === 2) {
    matrixs[position + 1].classList.remove("block", "block-t");
    matrixs[position + 10].classList.remove("block", "block-t");
    matrixs[position + 11].classList.remove("block", "block-t");
    matrixs[position + 12].classList.remove("block", "block-t");
  }
  // T xoay 270 độ
  if (spinT === 3) {
    matrixs[position].classList.remove("block", "block-t");
    matrixs[position + 10].classList.remove("block", "block-t");
    matrixs[position + 11].classList.remove("block", "block-t");
    matrixs[position + 20].classList.remove("block", "block-t");
  }
}
// phương thức rotateT này để xử lý sự kiện khi xoay hình T và kiểm tra điều kiện các ô xung quanh(điều kiện thì lấy như drawT) và kiểm tra thêm điều kiện chạm đáy đối với TH 0->1 và 2->3 còn TH 1->2 và 3->0
function rotateT() {
  // từ 0 -> 1   x
  // xxx =>     xx
  //  x          x
  if (spinT === 0) {
    if (
      position + 21 < row * col &&
      !matrixs[position + 1].classList.contains("fixed") &&
      !matrixs[position + 10].classList.contains("fixed") &&
      !matrixs[position + 11].classList.contains("fixed") &&
      !matrixs[position + 21].classList.contains("fixed")
    ) {
      clearT();
      spinT = 1;
      drawT();
    }
  }
  // từ 1 -> 2
  else if (spinT === 1) {
    if (
      position % col < col - 2 &&
      !matrixs[position + 1].classList.contains("fixed") &&
      !matrixs[position + 10].classList.contains("fixed") &&
      !matrixs[position + 11].classList.contains("fixed") &&
      !matrixs[position + 12].classList.contains("fixed")
    ) {
      clearT();
      spinT = 2;
      drawT();
    }
  }
  // từ 2 -> 3
  else if (spinT === 2) {
    if (
      position + 20 < row * col &&
      !matrixs[position].classList.contains("fixed") &&
      !matrixs[position + 10].classList.contains("fixed") &&
      !matrixs[position + 11].classList.contains("fixed") &&
      !matrixs[position + 20].classList.contains("fixed")
    ) {
      clearT();
      spinT = 3;
      drawT();
    }
  }
  // từ 3 -> 0
  else {
    if (
      position % col < col - 2 &&
      !matrixs[position].classList.contains("fixed") &&
      !matrixs[position + 1].classList.contains("fixed") &&
      !matrixs[position + 2].classList.contains("fixed") &&
      !matrixs[position + 11].classList.contains("fixed")
    ) {
      clearT();
      spinT = 0;
      drawT();
    }
  }
}
// sau khi hình T chạm đáy hoặc chạm vào các ô đã có vật cản khác thì khóa khối T lại
function lockT() {
  // T hướng ban đầu(0)
  if (spinT === 0) {
    matrixs[position].classList.add("fixed");
    matrixs[position + 1].classList.add("fixed");
    matrixs[position + 2].classList.add("fixed");
    matrixs[position + 11].classList.add("fixed");
  }
  // 0->1
  if (spinT === 1) {
    matrixs[position + 1].classList.add("fixed");
    matrixs[position + 10].classList.add("fixed");
    matrixs[position + 11].classList.add("fixed");
    matrixs[position + 21].classList.add("fixed");
  }
  // 1->2
  if (spinT === 2) {
    matrixs[position + 1].classList.add("fixed");
    matrixs[position + 10].classList.add("fixed");
    matrixs[position + 11].classList.add("fixed");
    matrixs[position + 12].classList.add("fixed");
  }
  //  2->3
  if (spinT === 3) {
    matrixs[position].classList.add("fixed");
    matrixs[position + 10].classList.add("fixed");
    matrixs[position + 11].classList.add("fixed");
    matrixs[position + 20].classList.add("fixed");
  }
  checkRow();
  newShape();
}
// phương thức drawS() để vẽ hình S và xoay theo từng hướng
function drawS() {
  // S hướng ban đầu
  // position = 4
  //  xx(5,6)
  // xx(14,15)
  if (spinS === 0) {
    matrixs[position + 1].classList.add("block", "block-s");
    matrixs[position + 2].classList.add("block", "block-s");
    matrixs[position + 10].classList.add("block", "block-s");
    matrixs[position + 11].classList.add("block", "block-s");
  }
  // S xoay 90 độ
  // position = 4
  // x(4)
  // xx(14,15)
  //  x(25)
  if (spinS === 1) {
    matrixs[position].classList.add("block", "block-s");
    matrixs[position + 10].classList.add("block", "block-s");
    matrixs[position + 11].classList.add("block", "block-s");
    matrixs[position + 21].classList.add("block", "block-s");
  }
}
// phương thức clearS() để xóa các ô S và điều kiện như phương thức drawS() theo từng hướng xoay
function clearS() {
  // S hướng ban đầu
  // position = 4
  //  xx(5,6)
  // xx(14,15)
  if (spinS === 0) {
    matrixs[position + 1].classList.remove("block", "block-s");
    matrixs[position + 2].classList.remove("block", "block-s");
    matrixs[position + 10].classList.remove("block", "block-s");
    matrixs[position + 11].classList.remove("block", "block-s");
  }

  // S xoay 90 độ
  // position = 4
  // x(4)
  // xx(14,15)
  //  x(25)
  if (spinS === 1) {
    matrixs[position].classList.remove("block", "block-s");
    matrixs[position + 10].classList.remove("block", "block-s");
    matrixs[position + 11].classList.remove("block", "block-s");
    matrixs[position + 21].classList.remove("block", "block-s");
  }
}
// phương thức rotateS() để xử lý xoay khối S
function rotateS() {
  // từ 0 -> 1
  //  xx (5,6)   x(4)
  // xx(14,15)=> xx(14,15)
  //              x(25)
  // với position = 4 để xoay được thì các ô 4,14,15,25 phải trống và ko chạm đáy(xét vị trí dài nhất là 25(dựa vào board))
  if (spinS === 0) {
    if (
      position + 21 < row * col &&
      !matrixs[position].classList.contains("fixed") &&
      !matrixs[position + 10].classList.contains("fixed") &&
      !matrixs[position + 11].classList.contains("fixed") &&
      !matrixs[position + 21].classList.contains("fixed")
    ) {
      clearS();
      spinS = 1;
      drawS();
    }
  }
  // từ 1 -> 0
  // x(4)          xx(5,6)
  // xx(14,15) => xx(14,15)
  //  x(25)
  // với position = 4 để xoay được thì các ô 5,6,14,15 phải trống và ko chạm đáy(xét vị trí dài nhất là 6(dựa vào mép phải của board))
  else {
    if (
      position % col < col - 2 &&
      !matrixs[position + 1].classList.contains("fixed") &&
      !matrixs[position + 2].classList.contains("fixed") &&
      !matrixs[position + 10].classList.contains("fixed") &&
      !matrixs[position + 11].classList.contains("fixed")
    ) {
      clearS();
      spinS = 0;
      drawS();
    }
  }
}
// sau khi hình S chạm đáy hoặc chạm vật cản thì khóa khối S lại, lấy điều kiện lock như drawS
function lockS() {
  // S hướng ban đầu
  //  xx
  // xx
  if (spinS === 0) {
    matrixs[position + 1].classList.add("fixed");
    matrixs[position + 2].classList.add("fixed");
    matrixs[position + 10].classList.add("fixed");
    matrixs[position + 11].classList.add("fixed");
  }

  // S xoay 90 độ
  // x
  // xx
  //  x
  if (spinS === 1) {
    matrixs[position].classList.add("fixed");
    matrixs[position + 10].classList.add("fixed");
    matrixs[position + 11].classList.add("fixed");
    matrixs[position + 21].classList.add("fixed");
  }

  checkRow();
  newShape();
}
// phương thức drawZ() để vẽ hình Z và xoay theo từng hướng
function drawZ() {
  // Z hướng ban đầu
  // position = 4
  // xx(4,5)
  //  xx(15,16)
  if (spinZ === 0) {
    matrixs[position].classList.add("block", "block-z");
    matrixs[position + 1].classList.add("block", "block-z");
    matrixs[position + 11].classList.add("block", "block-z");
    matrixs[position + 12].classList.add("block", "block-z");
  }

  // Z xoay 90 độ
  // position = 4
  //  x(5)
  // xx(14,15)
  // x(24)
  if (spinZ === 1) {
    matrixs[position + 1].classList.add("block", "block-z");
    matrixs[position + 10].classList.add("block", "block-z");
    matrixs[position + 11].classList.add("block", "block-z");
    matrixs[position + 20].classList.add("block", "block-z");
  }
}
// phương thức clearZ() để xóa các ô Z và điều kiện như phương thức drawZ() theo từng hướng xoay
function clearZ() {
  // Z hướng ban đầu
  // position = 4
  // xx(4,5)
  //  xx(15,16)
  if (spinZ === 0) {
    matrixs[position].classList.remove("block", "block-z");
    matrixs[position + 1].classList.remove("block", "block-z");
    matrixs[position + 11].classList.remove("block", "block-z");
    matrixs[position + 12].classList.remove("block", "block-z");
  }

  // Z xoay 90 độ
  // position = 4
  //  x(5)
  // xx(14,15)
  // x(24)
  if (spinZ === 1) {
    matrixs[position + 1].classList.remove("block", "block-z");
    matrixs[position + 10].classList.remove("block", "block-z");
    matrixs[position + 11].classList.remove("block", "block-z");
    matrixs[position + 20].classList.remove("block", "block-z");
  }
}
// phương thức rotateZ() để xử lý xoay khối Z
function rotateZ() {
  // từ 0 -> 1
  // xx(4,5)          x(5)
  // oxx(14,15,16) =>xx(14,15)
  // o(24)           x(24)
  // với position = 4 để xoay được thì các ô 14,24 phải trống và đồng thời kiểm tra chạm đáy, lấy vị trí xa nhất là 24 tức position +20
  if (spinZ === 0) {
    if (
      position + 20 < row * col &&
      !matrixs[position + 1].classList.contains("fixed") &&
      !matrixs[position + 10].classList.contains("fixed") &&
      !matrixs[position + 11].classList.contains("fixed") &&
      !matrixs[position + 20].classList.contains("fixed")
    ) {
      clearZ();
      spinZ = 1;
      drawZ();
    }
  }

  // từ 1 -> 0
  // ox(5)       xx(4,5)
  // xxo(14,15,16) => xx(15,16)
  // x(24)
  // với position = 4 để xoay được thì các ô 5,16 phải trống và ô xa nhất bên phải là position +12 nên xét position % col < col - 2
  else {
    if (
      position % col < col - 2 &&
      !matrixs[position].classList.contains("fixed") &&
      !matrixs[position + 1].classList.contains("fixed") &&
      !matrixs[position + 11].classList.contains("fixed") &&
      !matrixs[position + 12].classList.contains("fixed")
    ) {
      clearZ();
      spinZ = 0;
      drawZ();
    }
  }
}
// sau khi hình Z chạm đáy hoặc chạm vật cản thì khóa khối Z lại, lấy điều kiện lock như drawZ
function lockZ() {
  // Z hướng ban đầu
  // xx(4,5)
  //  xx(15,16)
  if (spinZ === 0) {
    matrixs[position].classList.add("fixed");
    matrixs[position + 1].classList.add("fixed");
    matrixs[position + 11].classList.add("fixed");
    matrixs[position + 12].classList.add("fixed");
  }

  // Z xoay 90 độ
  //  x(5)
  // xx(14,15)
  // x(24)
  if (spinZ === 1) {
    matrixs[position + 1].classList.add("fixed");
    matrixs[position + 10].classList.add("fixed");
    matrixs[position + 11].classList.add("fixed");
    matrixs[position + 20].classList.add("fixed");
  }
  checkRow();
  newShape();
}
// phương thức drawJ() để vẽ hình J và xoay theo từng hướng
function drawJ() {
  // J hướng ban đầu
  // position = 4
  // x(4)
  // xxx(14,15,16)
  if (spinJ === 0) {
    matrixs[position].classList.add("block", "block-j");
    matrixs[position + 10].classList.add("block", "block-j");
    matrixs[position + 11].classList.add("block", "block-j");
    matrixs[position + 12].classList.add("block", "block-j");
  }
  // J xoay 90 độ
  // position = 4
  // xx(4,5)
  // x(14)
  // x(24)
  if (spinJ === 1) {
    matrixs[position].classList.add("block", "block-j");
    matrixs[position + 1].classList.add("block", "block-j");
    matrixs[position + 10].classList.add("block", "block-j");
    matrixs[position + 20].classList.add("block", "block-j");
  }
  // J xoay 180 độ
  // position = 4
  // xxx(4,5,6)
  //   x(16)
  if (spinJ === 2) {
    matrixs[position].classList.add("block", "block-j");
    matrixs[position + 1].classList.add("block", "block-j");
    matrixs[position + 2].classList.add("block", "block-j");
    matrixs[position + 12].classList.add("block", "block-j");
  }
  // J xoay 270 độ
  // position = 4
  //  x(5)
  //  x(15)
  // xx(24,25)
  if (spinJ === 3) {
    matrixs[position + 1].classList.add("block", "block-j");
    matrixs[position + 11].classList.add("block", "block-j");
    matrixs[position + 20].classList.add("block", "block-j");
    matrixs[position + 21].classList.add("block", "block-j");
  }
}
// phương thức clearJ() để xóa các ô J và điều kiện giống drawJ() theo từng hướng xoay
function clearJ() {
  // J hướng ban đầu
  // position = 4
  // x(4)
  // xxx(14,15,16)
  if (spinJ === 0) {
    matrixs[position].classList.remove("block", "block-j");
    matrixs[position + 10].classList.remove("block", "block-j");
    matrixs[position + 11].classList.remove("block", "block-j");
    matrixs[position + 12].classList.remove("block", "block-j");
  }
  // J xoay 90 độ
  // position = 4
  // xx(4,5)
  // x(14)
  // x(24)
  if (spinJ === 1) {
    matrixs[position].classList.remove("block", "block-j");
    matrixs[position + 1].classList.remove("block", "block-j");
    matrixs[position + 10].classList.remove("block", "block-j");
    matrixs[position + 20].classList.remove("block", "block-j");
  }
  // J xoay 180 độ
  // position = 4
  // xxx(4,5,6)
  //   x(16)
  if (spinJ === 2) {
    matrixs[position].classList.remove("block", "block-j");
    matrixs[position + 1].classList.remove("block", "block-j");
    matrixs[position + 2].classList.remove("block", "block-j");
    matrixs[position + 12].classList.remove("block", "block-j");
  }
  // J xoay 270 độ
  // position = 4
  //  x(5)
  //  x(15)
  // xx(24,25)
  if (spinJ === 3) {
    matrixs[position + 1].classList.remove("block", "block-j");
    matrixs[position + 11].classList.remove("block", "block-j");
    matrixs[position + 20].classList.remove("block", "block-j");
    matrixs[position + 21].classList.remove("block", "block-j");
  }
}
// phương thức rotateJ() để xử lý xoay khối J
function rotateJ() {
  // từ 0 -> 1
  // xo(4,5)         xx(4,5)
  // xxx(14,15,16) =>x(14)
  // o(24)           x(24)
  // với position = 4 để xoay được thì các ô 5,24 phải trống và đồng thời kiểm tra chạm đáy, lấy vị trí xa nhất là 24 tức position +20
  if (spinJ === 0) {
    if (
      position + 20 < row * col &&
      !matrixs[position].classList.contains("fixed") &&
      !matrixs[position + 1].classList.contains("fixed") &&
      !matrixs[position + 10].classList.contains("fixed") &&
      !matrixs[position + 20].classList.contains("fixed")
    ) {
      clearJ();
      spinJ = 1;
      drawJ();
    }
  }
  // từ 1 -> 2
  // xxo(4,5,6)  xxx(4,5,6)
  // x o(14,16) => x(16)
  // x(24)
  // với position = 4 để xoay được thì các ô 6,16 phải trống đồng thời kiểm tra chạm mép phải, ô xa nhất bên phải là 6 tức position +2,5->7,6->8,7->9 nên xét position % col < col - 2
  else if (spinJ === 1) {
    if (
      position % col < col - 2 &&
      !matrixs[position].classList.contains("fixed") &&
      !matrixs[position + 1].classList.contains("fixed") &&
      !matrixs[position + 2].classList.contains("fixed") &&
      !matrixs[position + 12].classList.contains("fixed")
    ) {
      clearJ();
      spinJ = 2;
      drawJ();
    }
  }
  // từ 2 -> 3
  // xxx(4,5,6)   x(5)
  //  ox(15,16)=> x(15)
  // oo(24,25)   xx(24,25)
  // với position = 4 để xoay được thì các ô 15,24,25 phải trống đồng thời kiểm tra chạm đáy, lấy vị trí xa nhất là 25 tức position +21
  else if (spinJ === 2) {
    if (
      position + 21 < row * col &&
      !matrixs[position + 1].classList.contains("fixed") &&
      !matrixs[position + 11].classList.contains("fixed") &&
      !matrixs[position + 20].classList.contains("fixed") &&
      !matrixs[position + 21].classList.contains("fixed")
    ) {
      clearJ();
      spinJ = 3;
      drawJ();
    }
  }
  // từ 3 -> 0
  // ox(4,5)           x(4)
  // oxo(14,15,16)  => xxx(14,15,16)
  // xx(24,25)
  // với position = 4 để xoay được thì các ô 4,14,16 phải trống đồng thời kiểm tra chạm mép phải, ô xa nhất bên phải là 16 tức position +12(lấy vị trí đang 6),5->7,6->8,7->9 nên xét position % col < col - 2
  else {
    if (
      position % col < col - 2 &&
      !matrixs[position].classList.contains("fixed") &&
      !matrixs[position + 10].classList.contains("fixed") &&
      !matrixs[position + 11].classList.contains("fixed") &&
      !matrixs[position + 12].classList.contains("fixed")
    ) {
      clearJ();
      spinJ = 0;
      drawJ();
    }
  }
}
// phương thức lock J là sau khi hình J chạm đáy hoặc chạm vật cản thì khóa khối J lại, lấy điều kiện lock giống drawJ
function lockJ() {
  // J hướng ban đầu
  // x(4)
  // xxx(14,15,16)
  if (spinJ === 0) {
    matrixs[position].classList.add("fixed");
    matrixs[position + 10].classList.add("fixed");
    matrixs[position + 11].classList.add("fixed");
    matrixs[position + 12].classList.add("fixed");
  }

  // J xoay 90 độ
  // xx(4,5)
  // x(14)
  // x(24)
  if (spinJ === 1) {
    matrixs[position].classList.add("fixed");
    matrixs[position + 1].classList.add("fixed");
    matrixs[position + 10].classList.add("fixed");
    matrixs[position + 20].classList.add("fixed");
  }

  // J xoay 180 độ
  // xxx(4,5,6)
  //   x(16)
  if (spinJ === 2) {
    matrixs[position].classList.add("fixed");
    matrixs[position + 1].classList.add("fixed");
    matrixs[position + 2].classList.add("fixed");
    matrixs[position + 12].classList.add("fixed");
  }

  // J xoay 270 độ
  //  x(5)
  //  x(15)
  // xx(24,25)
  if (spinJ === 3) {
    matrixs[position + 1].classList.add("fixed");
    matrixs[position + 11].classList.add("fixed");
    matrixs[position + 20].classList.add("fixed");
    matrixs[position + 21].classList.add("fixed");
  }

  checkRow();
  newShape();
}
// hàm để restart game duyệt qua các matrix và loại bỏ các class
function restart() {
  for (let matrix of matrixs) {
    matrix.classList.remove(
      "block",
      "block-square",
      "block-i",
      "block-t",
      "block-s",
      "block-z",
      "fixed",
    );
  }
  gameover = false;
  line = 0;
  spinI = 0;
  spinT = 0;
  spinS = 0;
  currentShape = "";
  lineElement.textContent = "Line: 0 / 10";
  newShape();
}
newShape();
// Phương thức này để để kiểm tra xem hình vuông nó có thể đi xuống ko nếu có thì làm bình thường còn nếu ko có thì gọi phương thức lockSquare() để khóa các ô vuông hiện tại lại và tạo một hình vuông mới ở vị trí ban đầu.
function moveDownSquare() {
  if (position + 20 < row * col && position + 21 < row * col) {
    if (
      !matrixs[position + 20].classList.contains("fixed") &&
      !matrixs[position + 21].classList.contains("fixed")
    ) {
      clearSquare();
      position += 10;
      drawSquare();
    } else {
      lockSquare();
    }
  } else {
    lockSquare();
  }
}
// col = 10(nếu position chia col dư 0 thì hình đang sát mép trái và xử lý thêm điều kiện nếu bên trái có vật cản thì ko cho di chuyển sang trái nữa)
function moveLeftSquare() {
  if (
    position % col !== 0 &&
    !matrixs[position - 1].classList.contains("fixed") &&
    !matrixs[position + 9].classList.contains("fixed")
  ) {
    clearSquare();
    position -= 1;
    drawSquare();
  }
}
// col = 10(nếu sát mép phải nghĩa là position đang = 8 và xử lý thêm điều kiện nếu bên phải có vật cản thì ko cho di chuyển sang phải nữa)
function moveRightSquare() {
  if (
    position % col < col - 2 &&
    !matrixs[position + 2].classList.contains("fixed") &&
    !matrixs[position + 12].classList.contains("fixed")
  ) {
    clearSquare();
    position += 1;
    drawSquare();
  }
}
// Phương thức này để để kiểm tra xem hình I nó có thể đi xuống ko nếu có thì làm bình thường còn nếu ko có thì gọi phương thức lockI() để khóa các ô I hiện tại lại và tạo một hình I mới ở vị trí ban đầu.
function moveDownI() {
  // I nằm ngang
  if (spinI === 0) {
    if (position + 13 < row * col) {
      if (
        !matrixs[position + 10].classList.contains("fixed") &&
        !matrixs[position + 11].classList.contains("fixed") &&
        !matrixs[position + 12].classList.contains("fixed") &&
        !matrixs[position + 13].classList.contains("fixed")
      ) {
        clearI();
        position += 10;
        drawI();
      } else {
        lockI();
      }
    } else {
      lockI();
    }
  }
  // I nằm dọc, xét + 40 vì I nếu nằm đầu tiên thì nó sẽ là vị trí +10,+20,+30 rồi và +40 là vị trí tiếp theo nếu +40 mà có vật cản thì ko cho di chuyển xuống nữa
  else {
    if (
      position + 40 < row * col &&
      !matrixs[position + 40].classList.contains("fixed")
    ) {
      clearI();
      position += 10;
      drawI();
    } else {
      lockI();
    }
  }
}
// phương thức moveLeftI() để kiểm tra có thể sang trái không nếu có thì làm bình thường còn ko thì tiếp tục khối
function moveLeftI() {
  // I nằm ngang
  if (spinI === 0) {
    if (
      position % col !== 0 &&
      !matrixs[position - 1].classList.contains("fixed")
    ) {
      clearI();
      position -= 1;
      drawI();
    }
  }
  // I nằm dọc xét 4 vị trí dọc bên trái nếu có vật cản thì ko cho di chuyển sang trái nữa, còn I nằm ngang thì chỉ cần xét 1 vị trí bên trái tại vì I nằm ngang nó đã chứa 3 ô bên phải rồi nên chỉ cần xét 1 ô bên trái là đủ
  else {
    if (
      position % col !== 0 &&
      !matrixs[position - 1].classList.contains("fixed") &&
      !matrixs[position + 9].classList.contains("fixed") &&
      !matrixs[position + 19].classList.contains("fixed") &&
      !matrixs[position + 29].classList.contains("fixed")
    ) {
      clearI();
      position -= 1;
      drawI();
    }
  }
}
// phương thức moveRightI() để kiểm tra có thể sang phải không nếu có thì làm bình thường còn ko thì tiếp tục khối. Col -4 ở đây nghĩa là nếu muốn ô I nằm full ngang thì position nó đang = 6(6,7,8,9 cùng 1 hàng và có 10 cột từ 0->9) nếu position = 7 thì ô I sẽ vượt ra ngoài khung nên cần xử lý điều kiện này.
function moveRightI() {
  // I nằm ngang
  if (spinI === 0) {
    if (
      position % col < col - 4 &&
      !matrixs[position + 4].classList.contains("fixed")
    ) {
      clearI();
      position += 1;
      drawI();
    }
  }
  // I nằm dọc xét 4 vị trí dọc bên phải nếu có vật cản thì ko cho di chuyển sang phải nữa, còn I nằm ngang thì chỉ cần xét 1 vị trí bên phải(-4 là do nếu position đang = 6 thì nó sẽ chiếm 6,7,8,9)
  else {
    if (
      position % col < col - 1 &&
      !matrixs[position + 1].classList.contains("fixed") &&
      !matrixs[position + 11].classList.contains("fixed") &&
      !matrixs[position + 21].classList.contains("fixed") &&
      !matrixs[position + 31].classList.contains("fixed")
    ) {
      clearI();
      position += 1;
      drawI();
    }
  }
}
// phương thức moveDownT() để kiểm tra hình T có thể đi xuống không
function moveDownT() {
  // T =0 túc là đang
  // xxx(4,5,6)
  // oxo(15),(14,16) là các ô xung quanh
  //  o(25)
  // để mà xuống được thì các ô 14,16,25 phải trống nên là xét điều kiện(ở đây position đang = 4) thì các ô trống phải là +10=14,+12=16 và +21=25 đồng thời xét thêm điều kiện nó vẫn nằm trong grid nếu chạm đáy(lấy vị trí cao nhất là 21)
  if (spinT === 0) {
    if (
      position + 21 < row * col &&
      !matrixs[position + 10].classList.contains("fixed") &&
      !matrixs[position + 12].classList.contains("fixed") &&
      !matrixs[position + 21].classList.contains("fixed")
    ) {
      clearT();
      position += 10;
      drawT();
    } else {
      lockT();
    }
  }
  // T xoay 90 độ
  // T =1 túc là đang
  //  x(5) với position = 4
  // xx(14,15)
  // ox(24,25)
  //  o(35)
  // để mà xuống được thì các ô 24,35 phải trống nên là xét điều kiện(ở đây position đang = 4) thì các ô trống phải là +20=24,+31=35 đồng thời xét thêm điều kiện nó vẫn nằm trong grid nếu chạm đáy(lấy vị trí cao nhất là 35)
  else if (spinT === 1) {
    if (
      position + 31 < row * col &&
      !matrixs[position + 20].classList.contains("fixed") &&
      !matrixs[position + 31].classList.contains("fixed")
    ) {
      clearT();
      position += 10;
      drawT();
    } else {
      lockT();
    }
  }
  // T xoay 180 độ
  // T =2 túc là đang
  //  x(5) với position = 4
  // xxx(14,15,16)
  // ooo(24,25,26)
  // để mà xuống được thì các ô 24,25,26 phải trống nên là xét điều kiện(ở đây position đang = 4) thì các ô trống phải là +20=24,+21=25,+22=26 đồng thời xét thêm điều kiện nó vẫn nằm trong grid nếu chạm đáy(lấy vị trí cao nhất là 22)
  else if (spinT === 2) {
    if (
      position + 22 < row * col &&
      !matrixs[position + 20].classList.contains("fixed") &&
      !matrixs[position + 21].classList.contains("fixed") &&
      !matrixs[position + 22].classList.contains("fixed")
    ) {
      clearT();
      position += 10;
      drawT();
    } else {
      lockT();
    }
  }
  // T xoay 270 độ
  // T =3 túc là đang
  //  x(4) với position = 4
  //  xx(14,15)
  //  xo(24,25)
  //  o(34)
  // để mà xuống được thì các ô 25,34 phải trống nên là xét điều kiện(ở đây position đang = 4) thì các ô trống phải là +21=25,+30=34,đồng thời xét thêm điều kiện nó vẫn nằm trong grid nếu chạm đáy(lấy vị trí cao nhất là 30)
  else {
    if (
      position + 30 < row * col &&
      !matrixs[position + 21].classList.contains("fixed") &&
      !matrixs[position + 30].classList.contains("fixed")
    ) {
      clearT();
      position += 10;
      drawT();
    } else {
      lockT();
    }
  }
}
// phương thức moveLeftT() để kiểm tra hình T có thể di chuyển sang trái không
function moveLeftT() {
  // T hướng ban đầu
  // lấy position = 4
  // oxxx(4,5,6) là x,(3) là ô
  //  ox(15 là x),(14) là các ô xung quanh
  // để mà qua trái được thì các ô 3,14 phải trống nên là xét điều kiện(ở đây position đang = 4) thì các ô trống phải là -1=3,+10=14,đồng thời xét thêm điều kiện nó vẫn nằm trong grid nếu chạm trái
  if (spinT === 0) {
    if (
      position % col !== 0 &&
      !matrixs[position - 1].classList.contains("fixed") &&
      !matrixs[position + 10].classList.contains("fixed")
    ) {
      clearT();
      position -= 1;
      drawT();
    }
  }
  // T xoay 90 độ
  // T =1 túc là đang
  // ox(5) với position = 4
  //oxx(13,14,15)
  // ox(24,25)
  // với 5,14,15,25 là các ô x và 4,13,24 là các ô xung quanh
  // để mà qua trái được thì các ô 4,13,24 phải trống nên là xét điều kiện(ở đây position đang = 4) thì các ô trống phải là 0=4,+9=13,+20=24,đồng thời xét thêm điều kiện nó vẫn nằm trong grid nếu chạm trái
  else if (spinT === 1) {
    if (
      position % col !== 0 &&
      !matrixs[position].classList.contains("fixed") &&
      !matrixs[position + 9].classList.contains("fixed") &&
      !matrixs[position + 20].classList.contains("fixed")
    ) {
      clearT();
      position -= 1;
      drawT();
    }
  }
  // T xoay 180 độ
  // T =2 túc là đang
  // ox(4,5) với position = 4
  //oxxx(13,14,15,16)
  // với 5,14,15,16 là các ô x và 4,13 là các ô xung quanh
  // để mà qua trái được thì các ô 4,13 phải trống nên là xét điều kiện(ở đây position đang = 4) thì các ô trống phải là 0=4,+9=13 đồng thời xét thêm điều kiện nó vẫn nằm trong grid nếu chạm trái
  else if (spinT === 2) {
    if (
      position % col !== 0 &&
      !matrixs[position].classList.contains("fixed") &&
      !matrixs[position + 9].classList.contains("fixed")
    ) {
      clearT();
      position -= 1;
      drawT();
    }
  }
  // T xoay 270 độ
  // T =3 túc là đang
  // ox(3,4) với position = 4
  // oxx(13,14,15)
  // ox(23,24)
  // với 4,14,15,24 là các ô x và 3,13,23 là các ô xung quanh
  // để mà qua trái được thì các ô 3,13,23 phải trống nên là xét điều kiện(ở đây position đang = 4) thì các ô trống phải là -1=3,+9=13,+19=23 đồng thời xét thêm điều kiện nó vẫn nằm trong grid nếu chạm trái
  else {
    if (
      position % col !== 0 &&
      !matrixs[position - 1].classList.contains("fixed") &&
      !matrixs[position + 9].classList.contains("fixed") &&
      !matrixs[position + 19].classList.contains("fixed")
    ) {
      clearT();
      position -= 1;
      drawT();
    }
  }
}
// phương thức moveRightT() để kiểm tra hình T có thể di chuyển sang phải không
function moveRightT() {
  // T hướng ban đầu
  // lấy position = 4
  // xxxo(4,5,6,7) là x,(7) là o
  //  xo(15 là x),(16) là các ô xung quanh
  // để mà qua phải được thì các ô 7,16 phải trống nên là xét điều kiện(ở đây position đang = 4) thì các ô trống phải là +3=7,+12=16,đồng thời xét thêm điều kiện nó vẫn nằm trong grid nếu chạm phải(ở đây col-3 vì khi position = 6 nó sẽ vô if và đúng điều kiện thì +1 tức position =7 và nó sẽ chiếm 7,8,9 -> dừng)
  // 4 sẽ là 7,5 sẽ là 8,6 sẽ là 9(này là đang tính nó đã vào vòng if và position+1 nên nó bị đẩy qua 1 ô sang phải)
  if (spinT === 0) {
    if (
      position % col < col - 3 &&
      !matrixs[position + 3].classList.contains("fixed") &&
      !matrixs[position + 12].classList.contains("fixed")
    ) {
      clearT();
      position += 1;
      drawT();
    }
  }
  // T xoay 90 độ
  // T =1 túc là đang
  // xo(5,6) với position = 4
  //xxo(14,15,16)
  // xo(25,26)
  // với 5,14,15,25 là các ô x và 6,16,26 là các ô xung quanh
  // để mà qua phải được thì các ô 6,16,26 phải trống nên là xét điều kiện(ở đây position đang = 4) thì các ô trống phải là +2=6,+12=16,+22=26,đồng thời xét thêm điều kiện nó vẫn nằm trong grid nếu chạm phải(ở đây col-2(8) vì khi position = 4 thì x đang ở vị trí 5 và đến khi position = 7 thì x đang ở vị trí 8 và sẽ vô vòng if -> position +1 = 8 lúc này x nó sẽ chiêm 9 -> dừng)
  // 4 sẽ là 6,5 sẽ là 7,6 sẽ là 8,7 sẽ là 9(này là đang tính nó đã vào vòng if và position+1 nên nó bị đẩy qua 1 ô sang phải)
  else if (spinT === 1) {
    if (
      position % col < col - 2 &&
      !matrixs[position + 2].classList.contains("fixed") &&
      !matrixs[position + 12].classList.contains("fixed") &&
      !matrixs[position + 22].classList.contains("fixed")
    ) {
      clearT();
      position += 1;
      drawT();
    }
  }
  // T xoay 180 độ
  // T =2 túc là đang
  // xo(5,6) với position = 4
  //xxxo(14,15,16,17)
  // với 5,14,15,16 là các ô x và 6,17 là các ô xung quanh
  // để mà qua phải được thì các ô 6,17 phải trống nên là xét điều kiện(ở đây position đang = 4) thì các ô trống phải là +2=6,+13=17,đồng thời xét thêm điều kiện nó vẫn nằm trong grid nếu chạm phải(ở đây col-3(7) vì khi position = 4 thì x đang ở vị trí 5 và đến khi position = 6 thì x đang ở vị trí 7 và sẽ chạy vào vòng if và position +1 tức position = 7 ,x=8 và nó sẽ chiếm 7,8,9 -> dừng)
  // 4 sẽ là 7,5 sẽ là 8,6 sẽ là 9(này là đang tính nó đã vào vòng if và position+1 nên nó bị đẩy qua 1 ô sang phải)
  else if (spinT === 2) {
    if (
      position % col < col - 3 &&
      !matrixs[position + 2].classList.contains("fixed") &&
      !matrixs[position + 13].classList.contains("fixed")
    ) {
      clearT();
      position += 1;
      drawT();
    }
  }

  // T xoay 270 độ
  // T =3 túc là đang
  // xo(4,5) với position = 4
  // xxo(14,15,16)
  // xo(24,25)
  // với 4,14,15,24 là các ô x và 5,16,25 là các ô xung quanh
  // để mà qua trái được thì các ô 5,16,25 phải trống nên là xét điều kiện(ở đây position đang = 4) thì các ô trống phải là +1=5,+12=16,+21=25 đồng thời xét thêm điều kiện nó vẫn nằm trong grid nếu chạm phải(ở đây col-2(8) vì khi position = 4 thì x đang ở vị trí 4 và đến khi position = 7 thì x đang ở vị trí 7(x xa nhất tức đang là vị trí thứ 8) và sẽ chạy vào vòng if và position +1 tức position = 8 ,x=8(x xa nhất đang vị trí thứ 9) và nó sẽ chiếm 8,9 -> dừng)
  // 4 sẽ là 6,5 sẽ là 7,6 sẽ là 8,7 sẽ là 9(này là đang tính nó đã vào vòng if và position+1 nên nó bị đẩy qua 1 ô sang phải)
  else {
    if (
      position % col < col - 2 &&
      !matrixs[position + 1].classList.contains("fixed") &&
      !matrixs[position + 12].classList.contains("fixed") &&
      !matrixs[position + 21].classList.contains("fixed")
    ) {
      clearT();
      position += 1;
      drawT();
    }
  }
}
// phương thức moveDownS() để kiểm tra hình S có thể đi xuống không
function moveDownS() {
  // S hướng ban đầu
  // position = 4 nên:
  //  xx(5,6)
  // xxo(14,15,16)
  // oo(24,25)
  // để hình S đi xuống được thì các ô 16,24,25 phải trống tức là position +12=16, +20=24, +21=25 đồng thời xét thêm điều kiện nó vẫn nằm trong grid nếu chạm đáy(lấy vị trí cao nhất là 25)
  if (spinS === 0) {
    if (
      position + 21 < row * col &&
      !matrixs[position + 12].classList.contains("fixed") &&
      !matrixs[position + 20].classList.contains("fixed") &&
      !matrixs[position + 21].classList.contains("fixed")
    ) {
      clearS();
      position += 10;
      drawS();
    } else {
      lockS();
    }
  }

  // S xoay 90 độ
  // position = 4
  // x(4)
  // xx(14,15)
  // ox(24,25)
  //  o(35)
  // để hình S đi xuống được thì các ô 24,35 phải trống tức là position +20=24,+31=35 đồng thời xét thêm điều kiện nó vẫn nằm trong grid nếu chạm đáy(lấy vị trí cao nhất là 35)
  else {
    if (
      position + 31 < row * col &&
      !matrixs[position + 20].classList.contains("fixed") &&
      !matrixs[position + 31].classList.contains("fixed")
    ) {
      clearS();
      position += 10;
      drawS();
    } else {
      lockS();
    }
  }
}
// phương thức moveLeftS() để kiểm tra hình S có thể di chuyển sang trái không
function moveLeftS() {
  // S hướng ban đầu
  // position = 4 nên:
  //  oxx(4,5,6)
  // oxx(13,14,15)
  //
  // để hình S đi đi sang trái được được thì các ô 4,13 phải trống tức là position +0=4, +9=13, đồng thời xét thêm điều kiện nó chưa chạm bên trái board(nếu position % col = 0 thì hình S đang sát mép trái -> dừng)
  if (spinS === 0) {
    if (
      position % col !== 0 &&
      !matrixs[position].classList.contains("fixed") &&
      !matrixs[position + 9].classList.contains("fixed")
    ) {
      clearS();
      position -= 1;
      drawS();
    }
  }
  // S xoay 90 độ
  // position = 4
  // ox(3,4)
  // oxx(13,14,15)
  //  ox(24,25)
  // để hình S đi sang trái được thì các ô 3,13,24 phải trống tức là position -1=3,+9=13,+20=24 đồng thời xét thêm điều kiện nó vẫn chưa chạm bên trái board(nếu position % col = 0 thì hình S đang sát mép trái -> dừng)
  else {
    if (
      position % col !== 0 &&
      !matrixs[position - 1].classList.contains("fixed") &&
      !matrixs[position + 9].classList.contains("fixed") &&
      !matrixs[position + 20].classList.contains("fixed")
    ) {
      clearS();
      position -= 1;
      drawS();
    }
  }
}
// phương thức moveRightS() để kiểm tra hình S có thể di chuyển sang phải không
function moveRightS() {
  // S hướng ban đầu
  // position = 4 nên:
  //  xxo(5,6,7)
  // xxo(14,15,16)
  // để hình S đi sang phải được thì các ô 7,16 phải trống tức là position +3=7,+12=16 đồng thời xét thêm điều kiện nó vẫn chưa chạm bên phải board(nếu position =4->ô xa nhất = 7(vì nó chạy vào if và thực hiện),position=5->8,position=6->9 tức position%col < col-3 -> dừng)
  if (spinS === 0) {
    if (
      position % col < col - 3 &&
      !matrixs[position + 3].classList.contains("fixed") &&
      !matrixs[position + 12].classList.contains("fixed")
    ) {
      clearS();
      position += 1;
      drawS();
    }
  }
  // S xoay 90 độ
  // position = 4
  // xo(4,5)
  // xxo(14,15,16)
  //  xo(25,26)
  // để hình S đi sang phải được thì các ô 5,16,26 phải trống tức là position +1=5,+12=16,+22=26 đồng thời xét thêm điều kiện nó vẫn chưa chạm bên phải board(nếu position =4->ô xa nhất = 6(vì nó chạy vào if và thực hiện),position=5->7,position=6->8,position=7->9 tức position%col < col-2 -> dừng)
  else {
    if (
      position % col < col - 2 &&
      !matrixs[position + 1].classList.contains("fixed") &&
      !matrixs[position + 12].classList.contains("fixed") &&
      !matrixs[position + 22].classList.contains("fixed")
    ) {
      clearS();
      position += 1;
      drawS();
    }
  }
}
// phương thức moveDownZ() để kiểm tra hình Z có thể đi xuống không
function moveDownZ() {
  // Z hướng ban đầu
  // position = 4
  // xx(4,5)
  // oxx(14,15,16)
  //  oo(25,26)
  // để hình Z đi xuống được thì các ô 14,25,26 phải trống tức là position +10=14,+21=25,+22=26 đồng thời kiểm tra chạm đáy, lấy vị trí xa nhất là 26 tức position +22
  if (spinZ === 0) {
    if (
      position + 22 < row * col &&
      !matrixs[position + 10].classList.contains("fixed") &&
      !matrixs[position + 21].classList.contains("fixed") &&
      !matrixs[position + 22].classList.contains("fixed")
    ) {
      clearZ();
      position += 10;
      drawZ();
    } else {
      lockZ();
    }
  }
  // Z xoay 90 độ
  // position = 4
  //  x(5)
  // xx(14,15)
  // xo(24,25)
  // o(34)
  // để hình Z đi xuống được thì các ô 25,34 phải trống tức là position +21=25,+30=34
  // đồng thời kiểm tra chạm đáy, lấy vị trí xa nhất là 34 tức position +30
  else {
    if (
      position + 30 < row * col &&
      !matrixs[position + 21].classList.contains("fixed") &&
      !matrixs[position + 30].classList.contains("fixed")
    ) {
      clearZ();
      position += 10;
      drawZ();
    } else {
      lockZ();
    }
  }
}
// phương thức moveLeftZ() để kiểm tra hình Z có thể di chuyển sang trái không
function moveLeftZ() {
  // Z hướng ban đầu
  // position = 4
  // oxx(3,4,5)
  //  oxx(14,15,16)
  // để hình Z đi sang trái được thì các ô 3,14 phải trống tức là position -1=3,+10=14 đồng thời kiểm tra hình Z chưa chạm mép trái(tức position % col phải !=0)
  if (spinZ === 0) {
    if (
      position % col !== 0 &&
      !matrixs[position - 1].classList.contains("fixed") &&
      !matrixs[position + 10].classList.contains("fixed")
    ) {
      clearZ();
      position -= 1;
      drawZ();
    }
  }

  // Z xoay 90 độ
  // position = 4
  //  ox(4,5)
  // oxx(13,14,15)
  // ox(23,24)
  // để hình Z đi sang trái được thì các ô 4,13,23 phải trống tức là +0=4,+9=13,+19=23 đồng thời kiểm tra hình Z chưa chạm mép trái(tức position % col phải !=0)
  else {
    if (
      position % col !== 0 &&
      !matrixs[position].classList.contains("fixed") &&
      !matrixs[position + 9].classList.contains("fixed") &&
      !matrixs[position + 19].classList.contains("fixed")
    ) {
      clearZ();
      position -= 1;
      drawZ();
    }
  }
}
// phương thức moveRightZ() để kiểm tra hình Z có thể di chuyển sang phải không
function moveRightZ() {
  // Z hướng ban đầu
  // position = 4
  // xxo(4,5,6)
  //  xxo(15,16,17)
  // để hình Z đi sang phải được thì các ô 6,17 phải trống tức là +2=6,+13=17 đồng thời xét mép phải coi thử có sang phải được không(position = 4 thì chạy vào if và thực hiện position+1 và vị trí xa nhất lúc này là 17(tức là ô 7),5 thì là 8,6 thì là 9 -> dừng nên xét điều kiện col-3)
  if (spinZ === 0) {
    if (
      position % col < col - 3 &&
      !matrixs[position + 2].classList.contains("fixed") &&
      !matrixs[position + 13].classList.contains("fixed")
    ) {
      clearZ();
      position += 1;
      drawZ();
    }
  }
  // Z xoay 90 độ
  // position = 4
  //  xo(5,6)
  // xxo(14,15,16)
  // xo(24,25)
  // để hình Z đi sang phải được thì các ô 6,16,25 phải trống tức là position +2=6,+12=16,+21=25 đồng thời xét mép phải coi thử có sang phải được không(position = 4 thì chạy vào if và thực hiện position+1 và vị trí xa nhất lúc này là 16(tức là ô 6),5 thì là 7,6 thì là 8,7 thì là 9 -> dừng nên xét điều kiện col-2)
  else {
    if (
      position % col < col - 2 &&
      !matrixs[position + 2].classList.contains("fixed") &&
      !matrixs[position + 12].classList.contains("fixed") &&
      !matrixs[position + 21].classList.contains("fixed")
    ) {
      clearZ();
      position += 1;
      drawZ();
    }
  }
}
function moveDownJ() {
  // J hướng ban đầu
  // position = 4
  // x(4)
  // xxx(14,15,16)
  // ooo(24,25,26)
  // để hình Z đi xuống được thì các ô 24,25,26 phải trống tức là position +20=24,+21=25,+22=26 đồng thời kiểm tra chạm đáyvà lấy vị trí xa nhất là 26 tức position lấy +22
  if (spinJ === 0) {
    if (
      position + 22 < row * col &&
      !matrixs[position + 20].classList.contains("fixed") &&
      !matrixs[position + 21].classList.contains("fixed") &&
      !matrixs[position + 22].classList.contains("fixed")
    ) {
      clearJ();
      position += 10;
      drawJ();
    } else {
      lockJ();
    }
  }
  // J xoay 90 độ 0 ->1
  // position = 4
  // xx(4,5)
  // xo(14,15)
  // x(24)
  // o(34)
  // để hình Z đi xuống được thì các ô 15,34 phải trống tức là position +11=15,+30=25 đồng thời kiểm tra chạm đáy và lấy vị trí xa nhất là 34 tức position là +30
  else if (spinJ === 1) {
    if (
      position + 30 < row * col &&
      !matrixs[position + 11].classList.contains("fixed") &&
      !matrixs[position + 30].classList.contains("fixed")
    ) {
      clearJ();
      position += 10;
      drawJ();
    } else {
      lockJ();
    }
  }
  // J xoay 180 độ 1 ->2
  // position = 4
  // xxx(4,5,6)
  // oox(14,15,16)
  //   o(26)
  // để hình Z đi xuống được thì các ô 14,15,26 phải trống tức là position +10=14,+11=15,+22=26 đồng thời kiểm tra chạm đáy và lấy vị trí xa nhất là 26 tức position là +22
  else if (spinJ === 2) {
    if (
      position + 22 < row * col &&
      !matrixs[position + 10].classList.contains("fixed") &&
      !matrixs[position + 11].classList.contains("fixed") &&
      !matrixs[position + 22].classList.contains("fixed")
    ) {
      clearJ();
      position += 10;
      drawJ();
    } else {
      lockJ();
    }
  }
  // J xoay 270 độ 2 ->3
  // position = 4
  //  x(5)
  //  x(15)
  // xx(24,25)
  // oo(34,35)
  // để hình Z đi xuống được thì các ô 34,35 phải trống tức là position +30=34,+31=35 đồng thời kiểm tra chạm đáy và lấy vị trí xa nhất là 35 tức position là +31
  else {
    if (
      position + 31 < row * col &&
      !matrixs[position + 30].classList.contains("fixed") &&
      !matrixs[position + 31].classList.contains("fixed")
    ) {
      clearJ();
      position += 10;
      drawJ();
    } else {
      lockJ();
    }
  }
}
// phương thức moveLeftJ() để kiểm tra hình J có thể di chuyển sang trái không
function moveLeftJ() {
  // J hướng ban đầu
  // position = 4
  // ox(3,4)
  // oxxx(13,14,15,16)
  // với 4,14,15,16 là các ô x và 3,13 là các ô xung quanh và để hình J đi sang trái được thì các ô 3,13 phải trống tức là position -1=3,+9=13 đồng thời xét mép trái coi thử có sang trái được không tức là position % col phải !=0
  if (spinJ === 0) {
    if (
      position % col !== 0 &&
      !matrixs[position - 1].classList.contains("fixed") &&
      !matrixs[position + 9].classList.contains("fixed")
    ) {
      clearJ();
      position -= 1;
      drawJ();
    }
  }
  // J xoay 90 độ 0->1
  // position = 4
  // oxx(3,4,5)
  // ox(13,14)
  // ox(23,24)
  // với 4,5,14,24 là các ô x và 3,13,23 là các ô xung quanh và để hình J đi sang trái được thì các ô 3,13,23 phải trống tức là position -1=3,+9=13,+19=23 đồng thời xét mép trái được không tức là position % col phải !=0
  else if (spinJ === 1) {
    if (
      position % col !== 0 &&
      !matrixs[position - 1].classList.contains("fixed") &&
      !matrixs[position + 9].classList.contains("fixed") &&
      !matrixs[position + 19].classList.contains("fixed")
    ) {
      clearJ();
      position -= 1;
      drawJ();
    }
  }
  // J xoay 180 độ 1->2
  // position = 4
  // oxxx(3,4,5,6)
  //   ox(15,16)
  // với 4,5,6,16 là các ô x và 3,15 là các ô xung quanh và để hình J đi sang trái được thì các ô 3,15 phải trống tức là position -1=3,+11=15 đồng thời xét mép trái được không tức là position % col phải !=0
  else if (spinJ === 2) {
    if (
      position % col !== 0 &&
      !matrixs[position - 1].classList.contains("fixed") &&
      !matrixs[position + 11].classList.contains("fixed")
    ) {
      clearJ();
      position -= 1;
      drawJ();
    }
  }
  // J xoay 270 độ 2->3
  // position = 4
  // ox(4,5)
  // ox(14,15)
  //oxx(23,24,25)
  // với 5,15,24,25 là các ô x và 4,14,23 là các ô xung quan và để hình J đi sang trái được thì các ô 4,14,23 phải trống tức là position =4,+10=14,+19=23 đồng thời xét mép trái được không tức là position % col phải !=0
  else {
    if (
      position % col !== 0 &&
      !matrixs[position].classList.contains("fixed") &&
      !matrixs[position + 10].classList.contains("fixed") &&
      !matrixs[position + 19].classList.contains("fixed")
    ) {
      clearJ();
      position -= 1;
      drawJ();
    }
  }
}
document.addEventListener("keydown", function (event) {
  if (gameover) {
    return;
  }
  if (event.key === "ArrowDown") {
    if (currentShape === "O") {
      moveDownSquare();
    }
    if (currentShape === "I") {
      moveDownI();
    }
    if (currentShape === "T") {
      moveDownT();
    }
    if (currentShape === "S") {
      moveDownS();
    }

    if (currentShape === "Z") {
      moveDownZ();
    }
  }

  if (event.key === "ArrowLeft") {
    if (currentShape === "O") {
      moveLeftSquare();
    }
    if (currentShape === "I") {
      moveLeftI();
    }
    if (currentShape === "T") {
      moveLeftT();
    }
    if (currentShape === "S") {
      moveLeftS();
    }

    if (currentShape === "Z") {
      moveLeftZ();
    }
  }

  if (event.key === "ArrowRight") {
    if (currentShape === "O") {
      moveRightSquare();
    }
    if (currentShape === "I") {
      moveRightI();
    }
    if (currentShape === "T") {
      moveRightT();
    }
    if (currentShape === "S") {
      moveRightS();
    }

    if (currentShape === "Z") {
      moveRightZ();
    }
  }

  // xoay
  if (event.key === "ArrowUp") {
    if (currentShape === "I") {
      rotateI();
    }
    if (currentShape === "T") {
      rotateT();
    }
    if (currentShape === "S") {
      rotateS();
    }
    if (currentShape === "Z") {
      rotateZ();
    }
  }
});
setInterval(function () {
  if (!gameover) {
    if (currentShape === "O") {
      moveDownSquare();
    }

    if (currentShape === "I") {
      moveDownI();
    }
    if (currentShape === "T") {
      moveDownT();
    }
    if (currentShape === "S") {
      moveDownS();
    }
    if (currentShape === "Z") {
      moveDownZ();
    }
  }
}, 800);
// Kiểm tra row đầy chưa ví dụ:
// r= 19 nghĩa là đang(190,191,192,193,194,195,196,197,198,199), nếu các ô này có class fixed nghĩa là row này đầy thì từng ô tăng tương ứng với countrow và nếu countrow = col thì xoá row đó và tăng line lên 1(đọc dòng 20), các row khác tương tự
function checkRow() {
  for (let r = 0; r < row; r++) {
    let start = r * col;
    let countrow = 0;
    for (let i = start; i < start + col; i++) {
      if (matrixs[i].classList.contains("fixed")) {
        countrow++;
      }
    }
    if (countrow === col) {
      clearRow(r);
      line++;
      lineElement.textContent = "Line: " + line + " / 10";
    }
  }
}
// hàm này là để xoá row đầy và kéo các tất cả row phía trên xuống 1 hàng và row đầu tiên(1) sẽ là row trống
function clearRow(r) {
  let start = r * col;
  for (let i = start; i < start + col; i++) {
    matrixs[i].className = "matrix";
  }
  // kéo row trên xuống
  for (let i = start - 1; i >= 0; i--) {
    matrixs[i + col].className = matrixs[i].className;
  }
  // xử lý row đầu tiên
  for (let i = 0; i < col; i++) {
    matrixs[i].className = "matrix";
  }
}
function newShape() {
  let random = Math.floor(Math.random() * 5);

  // random ra khối O
  if (random === 0) {
    currentShape = "O";
    position = 4;
    // kiểm tra vị trí sinh khối O có bị chiếm chưa
    if (
      matrixs[position].classList.contains("fixed") ||
      matrixs[position + 1].classList.contains("fixed") ||
      matrixs[position + 10].classList.contains("fixed") ||
      matrixs[position + 11].classList.contains("fixed")
    ) {
      gameover = true;
      if (confirm("Game Over")) {
        restart();
      }
    } else {
      drawSquare();
    }
  }
  // random ra khối I
  else if (random === 1) {
    currentShape = "I";
    position = 3;
    spinI = 0;
    // kiểm tra vị trí sinh khối I có bị chiếm chưa
    if (
      matrixs[position].classList.contains("fixed") ||
      matrixs[position + 1].classList.contains("fixed") ||
      matrixs[position + 2].classList.contains("fixed") ||
      matrixs[position + 3].classList.contains("fixed")
    ) {
      gameover = true;
      if (confirm("Game Over")) {
        restart();
      }
    } else {
      drawI();
    }
  }
  // random ra khối T
  else if (random === 2) {
    currentShape = "T";
    position = 4;
    spinT = 0;

    // kiểm tra vị trí sinh khối T có bị chiếm chưa
    if (
      matrixs[position].classList.contains("fixed") ||
      matrixs[position + 1].classList.contains("fixed") ||
      matrixs[position + 2].classList.contains("fixed") ||
      matrixs[position + 11].classList.contains("fixed")
    ) {
      gameover = true;

      if (confirm("Game Over")) {
        restart();
      }
    } else {
      drawT();
    }
  }
  // random ra khối S
  else if (random === 3) {
    currentShape = "S";
    position = 4;
    spinS = 0;
    // kiểm tra vị trí sinh khối S có bị chiếm chưa
    if (
      matrixs[position + 1].classList.contains("fixed") ||
      matrixs[position + 2].classList.contains("fixed") ||
      matrixs[position + 10].classList.contains("fixed") ||
      matrixs[position + 11].classList.contains("fixed")
    ) {
      gameover = true;
      if (confirm("Game Over")) {
        restart();
      }
    } else {
      drawS();
    }
  }
  // random ra khối Z
  else {
    currentShape = "Z";
    position = 4;
    spinZ = 0;

    // kiểm tra vị trí sinh khối Z có bị chiếm chưa
    if (
      matrixs[position].classList.contains("fixed") ||
      matrixs[position + 1].classList.contains("fixed") ||
      matrixs[position + 11].classList.contains("fixed") ||
      matrixs[position + 12].classList.contains("fixed")
    ) {
      gameover = true;

      if (confirm("Game Over")) {
        restart();
      }
    } else {
      drawZ();
    }
  }
}
