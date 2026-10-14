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
// hiển thị level hiện tại
const levelElement = document.querySelector(".level");
// nút back và next để chuyển level
const backButton = document.querySelector(".back");
const nextButton = document.querySelector(".next");
// ngoi sao hi vong
const hopeStarButton = document.querySelector(".hope-star");
// các thành phần câu hỏi toán trong level 2
const mathQuestion = document.querySelector(".math-question");
const mathText = document.querySelector(".math-text");
const mathTime = document.querySelector(".math-time");
const mathAnswer = document.querySelector(".math-answer");
const mathSubmit = document.querySelector(".math-submit");
// phần hiển thị số Bom hiện tại
const bombElement = document.querySelector(".bomb-count");
const level2Notice = document.querySelector(".level2");
// nút sử dụng Bom
const useBombButton = document.querySelector(".use-bomb");
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
// level
let level = 0;
// đếm số hàng rác đã xóa trong level 1
let trashLine = 0;
// ngoi sao hi vong
let hopeStar = false;
// thời gian chờ xuất hiện câu hỏi
let mathSeconds = 0;
// thời gian trả lời câu hỏi là 5s, nếu hết 5s mà chưa trả lời thì câu hỏi sẽ kết thúc
let answerSeconds = 5;
// kiểm tra câu hỏi có đang xuất hiện không
let mathShowing = false;
// kết quả đúng của câu hỏi
let mathResult = 0;
// số Bom hiện tại của người chơi
let bomb = 0;
// lưu số Bom khi bắt đầu chơi một màn để nếu Game Over thì khôi phục lại
let startBomb = 0;
// lấy bom
let selectBom = false;
// danh sách con sâu cho lv3 và lv4
let worms = [];
let spinI = 0;
let spinT = 0;
let spinS = 0;
let spinZ = 0;
let spinJ = 0;
let spinL = 0;
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
  // nếu đủ 10 line và đã qua level thì dừng hàm tại đây
  if (checkRow() === true) {
    return;
  }
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
  // nếu đủ 10 line và đã qua level thì dừng hàm tại đây
  if (checkRow() === true) {
    return;
  }
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
  // nếu đủ 10 line và đã qua level thì dừng hàm tại đây
  if (checkRow() === true) {
    return;
  }
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

  // nếu đủ 10 line và đã qua level thì dừng hàm tại đây
  if (checkRow() === true) {
    return;
  }
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
  // nếu đủ 10 line và đã qua level thì dừng hàm tại đây
  if (checkRow() === true) {
    return;
  }
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

  // nếu đủ 10 line và đã qua level thì dừng hàm tại đây
  if (checkRow() === true) {
    return;
  }
  newShape();
}
// phương thức drawL() để vẽ hình L và xoay theo từng hướng
function drawL() {
  // L hướng ban đầu
  // position = 4
  //   x(6)
  // xxx(14,15,16)
  if (spinL === 0) {
    matrixs[position + 2].classList.add("block", "block-l");
    matrixs[position + 10].classList.add("block", "block-l");
    matrixs[position + 11].classList.add("block", "block-l");
    matrixs[position + 12].classList.add("block", "block-l");
  }
  // L xoay 90 độ 0->1
  // position = 4
  // x(4)
  // x(14)
  // xx(24,25)
  if (spinL === 1) {
    matrixs[position].classList.add("block", "block-l");
    matrixs[position + 10].classList.add("block", "block-l");
    matrixs[position + 20].classList.add("block", "block-l");
    matrixs[position + 21].classList.add("block", "block-l");
  }
  // L xoay 180 độ 1->2
  // position = 4
  // xxx(4,5,6)
  // x(14)
  if (spinL === 2) {
    matrixs[position].classList.add("block", "block-l");
    matrixs[position + 1].classList.add("block", "block-l");
    matrixs[position + 2].classList.add("block", "block-l");
    matrixs[position + 10].classList.add("block", "block-l");
  }
  // L xoay 270 độ 2->3
  // position = 4
  // xx(4,5)
  //  x(15)
  //  x(25)
  if (spinL === 3) {
    matrixs[position].classList.add("block", "block-l");
    matrixs[position + 1].classList.add("block", "block-l");
    matrixs[position + 11].classList.add("block", "block-l");
    matrixs[position + 21].classList.add("block", "block-l");
  }
}

// phương thức clearL() để xóa các ô L và điều kiện giống drawL() theo từng hướng xoay
function clearL() {
  // L hướng ban đầu
  // position = 4
  //   x(6)
  // xxx(14,15,16)
  if (spinL === 0) {
    matrixs[position + 2].classList.remove("block", "block-l");
    matrixs[position + 10].classList.remove("block", "block-l");
    matrixs[position + 11].classList.remove("block", "block-l");
    matrixs[position + 12].classList.remove("block", "block-l");
  }
  // L xoay 90 độ từ trái sang phải 0->1
  // position = 4
  // x(4)
  // x(14)
  // xx(24,25)
  if (spinL === 1) {
    matrixs[position].classList.remove("block", "block-l");
    matrixs[position + 10].classList.remove("block", "block-l");
    matrixs[position + 20].classList.remove("block", "block-l");
    matrixs[position + 21].classList.remove("block", "block-l");
  }
  // L xoay 180 độ 1->2
  // position = 4
  // xxx(4,5,6)
  // x(14)
  if (spinL === 2) {
    matrixs[position].classList.remove("block", "block-l");
    matrixs[position + 1].classList.remove("block", "block-l");
    matrixs[position + 2].classList.remove("block", "block-l");
    matrixs[position + 10].classList.remove("block", "block-l");
  }
  // L xoay 270 độ 2->3
  // position = 4
  // xx(4,5)
  //  x(15)
  //  x(25)
  if (spinL === 3) {
    matrixs[position].classList.remove("block", "block-l");
    matrixs[position + 1].classList.remove("block", "block-l");
    matrixs[position + 11].classList.remove("block", "block-l");
    matrixs[position + 21].classList.remove("block", "block-l");
  }
}
// phương thức rotateL() để xử lý xoay khối L cho 4 TH
function rotateL() {
  // từ 0 -> 1
  // position = 4
  // o x(6)          x(4)
  // xxx(14,15,16)=> x(14)
  // oo(24,25)       xx(24,25)
  // với position = 4 để xoay được thì các ô 4,24,25 phải trống đồng thời kiểm tra chạm đáy chưa và lấy vị trí xa nhất là 25 tức position +21
  if (spinL === 0) {
    if (
      position + 21 < row * col &&
      !matrixs[position].classList.contains("fixed") &&
      !matrixs[position + 20].classList.contains("fixed") &&
      !matrixs[position + 21].classList.contains("fixed")
    ) {
      clearL();
      spinL = 1;
      drawL();
    }
  }
  // 90 độ
  // từ 1 -> 2
  // position = 4
  // xoo(4,5,6) xxx(4,5,6)
  // x(14)   => x(14)
  // xx(24,25)
  // với position = 4 để xoay được thì các ô 5,6 phải trống đồng thời kiểm tra chạm mép phải hay chưa và lấy vị trí xa nhất bên phải là 6 tức position +2,5->7,6->8,7->9 nên xét position % col < col -2
  else if (spinL === 1) {
    if (
      position % col < col - 2 &&
      !matrixs[position + 1].classList.contains("fixed") &&
      !matrixs[position + 2].classList.contains("fixed")
    ) {
      clearL();
      spinL = 2;
      drawL();
    }
  }
  // 180 độ
  // từ 2 -> 3
  // position = 4
  // xxx(4,5,6)   xx(4,5)
  // xo(14,15) =>  x(15)
  //  o(25)        x(25)
  // với position = 4 để xoay được thì các ô 15,25 phải trống đồng thời kiểm tra chạm đáy hay chưa và lấy vị trí xa nhất là 25 tức position +21
  else if (spinL === 2) {
    if (
      position + 21 < row * col &&
      !matrixs[position + 11].classList.contains("fixed") &&
      !matrixs[position + 21].classList.contains("fixed")
    ) {
      clearL();
      spinL = 3;
      drawL();
    }
  }
  // 270 độ
  // từ 3 -> 0
  // position = 4
  // xxo(4,5,6)         x(6)
  // oxo(14,15,16) => xxx(14,15,16)
  //  x(25)
  // với position = 4 để xoay được thì các ô 6,14,16 phải trống đồng thời kiểm tra chạm mép phải và lấy vị trí xa nhất bên phải là 16 tức đang là ô 6, 5->7,6->8,7->9 -> dừng nên xét position % col < col -2
  else {
    if (
      position % col < col - 2 &&
      !matrixs[position + 2].classList.contains("fixed") &&
      !matrixs[position + 10].classList.contains("fixed") &&
      !matrixs[position + 12].classList.contains("fixed")
    ) {
      clearL();
      spinL = 0;
      drawL();
    }
  }
}
// phương thức lockL() là sau khi hình L chạm đáy hoặc chạm vật cản thì khóa khối L lại và lấy điều kiện lock giống drawL()
function lockL() {
  // L hướng ban đầu
  // position = 4
  //   x(6)
  // xxx(14,15,16)
  if (spinL === 0) {
    matrixs[position + 2].classList.add("fixed");
    matrixs[position + 10].classList.add("fixed");
    matrixs[position + 11].classList.add("fixed");
    matrixs[position + 12].classList.add("fixed");
  }
  // L xoay 90 độ 0->1
  // position = 4
  // x(4)
  // x(14)
  // xx(24,25)
  if (spinL === 1) {
    matrixs[position].classList.add("fixed");
    matrixs[position + 10].classList.add("fixed");
    matrixs[position + 20].classList.add("fixed");
    matrixs[position + 21].classList.add("fixed");
  }
  // L xoay 180 độ 1->2
  // position = 4
  // xxx(4,5,6)
  // x(14)
  if (spinL === 2) {
    matrixs[position].classList.add("fixed");
    matrixs[position + 1].classList.add("fixed");
    matrixs[position + 2].classList.add("fixed");
    matrixs[position + 10].classList.add("fixed");
  }
  // L xoay 270 độ 2->3
  // position = 4
  // xx(4,5)
  //  x(15)
  //  x(25)
  if (spinL === 3) {
    matrixs[position].classList.add("fixed");
    matrixs[position + 1].classList.add("fixed");
    matrixs[position + 11].classList.add("fixed");
    matrixs[position + 21].classList.add("fixed");
  }
  // nếu đủ 10 line và đã qua level thì dừng hàm tại đây
  if (checkRow() === true) {
    return;
  }
  newShape();
}
// hàm để restart game duyệt qua các matrix và loại bỏ các class
function restart(retry) {
  // TH chơi lại do Game Over thì khôi phục số Bom lúc bắt đầu màn ví dụ bắt đầu Lv4 có 7 Bom, dùng còn 4 Bom rồi Game Over thì khi chơi lại Lv4 sẽ có 7 Bom
  if (retry === true) {
    bomb = startBomb;
  }
  // TH chuyển màn bình thường bằng Back, Next hoặc đủ 10 Line
  else {
    // nếu chuyển vào Lv2 thì đặt lại Bom về 0 để farm lại từ đầu
    if (level === 2) {
      bomb = 0;
    }
    // lưu số Bom hiện tại khi bắt đầu màn mới ví dụ đang có 7 Bom ở Lv4 rồi Back về Lv3 thì vẫn lưu 7 Bom
    startBomb = bomb;
  }
  // cập nhật số Bom lên giao diện
  bombElement.textContent = "Bom: " + bomb;
  // khi restart hoặc chuyển level thì hủy trạng thái chọn Bom để tránh TH sang màn mới nhưng game vẫn bị đứng yên do selectBom vẫn bằng true
  selectBom = false;
  useBombButton.textContent = "Dùng Bom";
  for (let matrix of matrixs) {
    matrix.classList.remove(
      "block",
      "block-square",
      "block-i",
      "block-t",
      "block-s",
      "block-z",
      "block-j",
      "block-l",
      "block-garbage",
      "fixed",
    );
  }
  gameover = false;
  line = 0;
  trashLine = 0;
  mathSeconds = 0;
  answerSeconds = 5;
  mathShowing = false;
  mathResult = 0;
  mathAnswer.value = "";
  mathQuestion.style.display = "none";
  // restart hoặc đổi level thì sẽ đặt lại ngôi sao hi vọng
  hopeStar = false;
  hopeStarButton.querySelector("span").textContent = "Ngôi sao hy vọng";
  hopeStarButton.querySelector("i").className = "fa-regular fa-star";
  spinI = 0;
  spinT = 0;
  spinS = 0;
  spinZ = 0;
  spinJ = 0;
  spinL = 0;
  currentShape = "";
  lineElement.textContent = "Line: 0 / 10";
  for (let worm of worms) {
    worm.image.remove();
  }
  worms = [];
  if (level === 1) {
    createTrash();
  }
  newShape();
  if (level === 2 && retry !== true) {
    level2Notice.showModal();
  }
  if (level === 3) {
    createWorm();
  }
}
// xử lý nút next để qua level tiếp theo
nextButton.addEventListener("click", function () {
  // level cuối là level 7 nên nếu đang nhỏ hơn 7 thì mới cho qua tiếp
  if (level < 7) {
    level++;
    levelElement.textContent = "Level " + level;
    // qua level mới thì chơi lại board từ đầu
    restart();
  }
});
// xử lý nút back để trở về level trước
backButton.addEventListener("click", function () {
  // level đầu tiên là level 0 nên nếu đang lớn hơn 0 thì mới cho quay lại
  if (level > 0) {
    level--;
    levelElement.textContent = "Level " + level;
    // trở về level trước thì chơi lại board từ đầu
    restart();
  }
});
// dùng ngôi sao hi vọng
hopeStarButton.addEventListener("click", function () {
  hopeStar = true;
  hopeStarButton.querySelector("span").textContent = "Đã sử dụng";
  hopeStarButton.querySelector("i").className = "fa-solid fa-star";
});
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
  // để hình Z đi xuống được thì các ô 15,34 phải trống tức là position +11=15,+30=34 đồng thời kiểm tra chạm đáy và lấy vị trí xa nhất là 34 tức position là +30
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
// phương thức moveRightJ() để kiểm tra hình J có thể di chuyển sang phải không
function moveRightJ() {
  // J hướng ban đầu
  // position = 4
  // xo(4,5)
  // xxxo(14,15,16,17)
  // với 4,14,15,16 là các ô x và 5,17 là các ô xung quanh và để hình J đi sang phải được thì các ô 5,17 phải trống tức là position +1=5,+13=17 và đồng thời xét mép phải và vì hình J sau khi chạy vào if và thực hiện position +1 thì vị trí xa nhất là 17 tức là ô 7,5 thì là 8,6 thì là 9 -> dừng nên xét điều kiện col-3
  if (spinJ === 0) {
    if (
      position % col < col - 3 &&
      !matrixs[position + 1].classList.contains("fixed") &&
      !matrixs[position + 13].classList.contains("fixed")
    ) {
      clearJ();
      position += 1;
      drawJ();
    }
  }
  // J xoay 90 độ 0->1
  // position = 4
  // xxo(4,5,6)
  // xo(14,15)
  // xo(24,25)
  // với 4,5,14,24 là các ô x và 6,15,25 là các ô xung quanh và để hình J đi sang phải được thì các ô 6,15,25 phải trống tức là position +2=6,+11=15,+21=25 và đồng thời xét mép phải và vì hình J sau khi chạy vào if và thực hiện position +1 thì vị trí xa nhất là 6 tức là ô 6,5 thì là 7,6 thì là 8,7 thì là 9 -> dừng nên xét điều kiện col-2
  else if (spinJ === 1) {
    if (
      position % col < col - 2 &&
      !matrixs[position + 2].classList.contains("fixed") &&
      !matrixs[position + 11].classList.contains("fixed") &&
      !matrixs[position + 21].classList.contains("fixed")
    ) {
      clearJ();
      position += 1;
      drawJ();
    }
  }
  // J xoay 180 độ 1->2
  // position = 4
  // xxxo(4,5,6,7)
  //   xo(16,17)
  // với 4,5,6,16 là các ô x và 7,17 là các ô xung quanh và để hình J đi sang phải được thì các ô 7,17 phải trống tức là position +3=7,+13=17 và đồng thời xét mép phải và vì hình J sau khi chạy vào if và thực hiện position +1 thì vị trí xa nhất là 7 tức là ô 7,5 thì là 8,6 thì là 9 -> dừng nên xét điều kiện col-3
  else if (spinJ === 2) {
    if (
      position % col < col - 3 &&
      !matrixs[position + 3].classList.contains("fixed") &&
      !matrixs[position + 13].classList.contains("fixed")
    ) {
      clearJ();
      position += 1;
      drawJ();
    }
  }
  // J xoay 270 độ 2->3
  // position = 4
  //  xo(5,6)
  //  xo(15,16)
  // xxo(24,25,26)
  // với 5,15,24,25 là các ô x và 6,16,26 là các ô xung quanh và để hình J đi sang phải được thì các ô 6,16,26 phải trống tức là position +2=6,+12=16,+22=26 và đồng thời xét mép phải và vì hình J sau khi chạy vào if và thực hiện position +1 thì vị trí xa nhất là 6 tức là ô 6,5 thì là 7,6 thì là 8,7 thì là 9 -> dừng nên xét điều kiện col-2
  else {
    if (
      position % col < col - 2 &&
      !matrixs[position + 2].classList.contains("fixed") &&
      !matrixs[position + 12].classList.contains("fixed") &&
      !matrixs[position + 22].classList.contains("fixed")
    ) {
      clearJ();
      position += 1;
      drawJ();
    }
  }
}
// phương thức moveDownL() để kiểm tra hình L có thể đi xuống không
function moveDownL() {
  // L hướng ban đầu
  // position = 4
  //   x(6)
  // xxx(14,15,16)
  // ooo(24,25,26)
  // để hình L đi xuống được thì các ô 24,25,26 phải trống tức là position +20=24,+21=25,+22=26 và đồng thời kiểm tra chạm đáy và lấy vị trí xa nhất là 26 tức position +22
  if (spinL === 0) {
    if (
      position + 22 < row * col &&
      !matrixs[position + 20].classList.contains("fixed") &&
      !matrixs[position + 21].classList.contains("fixed") &&
      !matrixs[position + 22].classList.contains("fixed")
    ) {
      clearL();
      position += 10;
      drawL();
    } else {
      lockL();
    }
  }
  // L xoay 90 độ 0->1
  // position = 4
  // x(4)
  // x(14)
  // xx(24,25)
  // oo(34,35)
  // để hình L đi xuống được thì các ô 34,35 phải trống tức là position +30=34,+31=35 và đồng thời kiểm tra chạm đáy và lấy vị trí xa nhất là 35 tức position +31
  else if (spinL === 1) {
    if (
      position + 31 < row * col &&
      !matrixs[position + 30].classList.contains("fixed") &&
      !matrixs[position + 31].classList.contains("fixed")
    ) {
      clearL();
      position += 10;
      drawL();
    } else {
      lockL();
    }
  }
  // L xoay 180 độ 1->2
  // position = 4
  // xxx(4,5,6)
  // xoo(14,15,16)
  // o(24)
  // để hình L đi xuống được thì các ô 15,16,24 phải trống tức là position +11=15,+12=16,+20=24 và đồng thời kiểm tra chạm đáy và lấy vị trí xa nhất là 24 tức position +20
  else if (spinL === 2) {
    if (
      position + 20 < row * col &&
      !matrixs[position + 11].classList.contains("fixed") &&
      !matrixs[position + 12].classList.contains("fixed") &&
      !matrixs[position + 20].classList.contains("fixed")
    ) {
      clearL();
      position += 10;
      drawL();
    } else {
      lockL();
    }
  }
  // L xoay 270 độ 2->3
  // position = 4
  // xx(4,5)
  // ox(14,15)
  //  x(25)
  //  o(35)
  // để hình L đi xuống được thì các ô 14,35 phải trống tức là position +10=14,+31=35
  // đồng thời kiểm tra chạm đáy và lấy vị trí xa nhất là 35 tức position +31
  else {
    if (
      position + 31 < row * col &&
      !matrixs[position + 10].classList.contains("fixed") &&
      !matrixs[position + 31].classList.contains("fixed")
    ) {
      clearL();
      position += 10;
      drawL();
    } else {
      lockL();
    }
  }
}
// phương thức moveLeftL() để kiểm tra hình L có thể di chuyển sang trái không
function moveLeftL() {
  // L hướng ban đầu
  // position = 4
  //   ox(5,6)
  // oxxx(13,14,15,16)
  // với 6,14,15,16 là các ô x và 5,13 là các ô xung quanh bên trái và để hình L đi sang trái được thì các ô 5,13 phải trống tức là position +1=5,+9=13 và đồng thời xét mép trái coi thử có sang trái được không tức là position % col phải !=0
  if (spinL === 0) {
    if (
      position % col !== 0 &&
      !matrixs[position + 1].classList.contains("fixed") &&
      !matrixs[position + 9].classList.contains("fixed")
    ) {
      clearL();
      position -= 1;
      drawL();
    }
  }
  // L xoay 90 độ 0->1
  // position = 4
  // ox(3,4)
  // ox(13,14)
  // oxx(23,24,25)
  // với 4,14,24,25 là các ô x và 3,13,23 là các ô xung quanh và để hình L đi sang trái được thì các ô 3,13,23 phải trống tức là position -1=3,+9=13,+19=23 và đồng thời xét mép trái coi thử có sang trái được không tức là position % col phải !=0
  else if (spinL === 1) {
    if (
      position % col !== 0 &&
      !matrixs[position - 1].classList.contains("fixed") &&
      !matrixs[position + 9].classList.contains("fixed") &&
      !matrixs[position + 19].classList.contains("fixed")
    ) {
      clearL();
      position -= 1;
      drawL();
    }
  }
  // L xoay 180 độ 1->2
  // position = 4
  // oxxx(3,4,5,6)
  // ox(13,14)
  // với 4,5,6,14 là các ô x và 3,13 là các ô xung quanh và để hình L đi sang trái được thì các ô 3,13 phải trống tức là position -1=3,+9=13 và đồng thời xét mép trái coi thử có sang trái được không tức là position % col phải !=0
  else if (spinL === 2) {
    if (
      position % col !== 0 &&
      !matrixs[position - 1].classList.contains("fixed") &&
      !matrixs[position + 9].classList.contains("fixed")
    ) {
      clearL();
      position -= 1;
      drawL();
    }
  }
  // L xoay 270 độ 2->3
  // position = 4
  // oxx(3,4,5)
  //  ox(14,15)
  //  ox(24,25)
  // với 4,5,15,25 là các ô x và 3,14,24 là các ô xung quanh và để hình L đi sang trái được thì các ô 3,14,24 phải trống tức là position -1=3,+10=14,+20=24 và đồng thời xét mép trái coi thử có sang trái được không tức là position % col phải !=0
  else {
    if (
      position % col !== 0 &&
      !matrixs[position - 1].classList.contains("fixed") &&
      !matrixs[position + 10].classList.contains("fixed") &&
      !matrixs[position + 20].classList.contains("fixed")
    ) {
      clearL();
      position -= 1;
      drawL();
    }
  }
}

// phương thức moveRightL() để kiểm tra hình L có thể di chuyển sang phải không
function moveRightL() {
  // L hướng ban đầu
  // position = 4
  //   xo(6,7)
  // xxxo(14,15,16,17)
  // với 6,14,15,16 là các ô x và 7,17 là các ô xung quanh và để hình L đi sang phải được thì các ô 7,17 phải trống tức là position +3=7,+13=17 và đồng thời xét mép phải và vì sau khi vào if sẽ position +1 thì ô xa nhất là 7,5 thì là 8,6 thì là 9 -> dừng nên xét col-3(7)
  if (spinL === 0) {
    if (
      position % col < col - 3 &&
      !matrixs[position + 3].classList.contains("fixed") &&
      !matrixs[position + 13].classList.contains("fixed")
    ) {
      clearL();
      position += 1;
      drawL();
    }
  }

  // L xoay 90 độ 0->1
  // position = 4
  // xo(4,5)
  // xo(14,15)
  // xxo(24,25,26)
  // với 4,14,24,25 là các ô x và 5,15,26 là các ô xung quanh và để hình L đi sang phải được thì các ô 5,15,26 phải trống tức là position +1=5,+11=15,+22=26 và đồng thời xét mép phải, vì position = 4 -> ô xa nhất là 26 tức là ô 6(khi chạy vào if và thực hiện position +1), 5 thì là 7,6 thì là 8,7 thì là 9 -> dừng nên xét col-2(8)
  else if (spinL === 1) {
    if (
      position % col < col - 2 &&
      !matrixs[position + 1].classList.contains("fixed") &&
      !matrixs[position + 11].classList.contains("fixed") &&
      !matrixs[position + 22].classList.contains("fixed")
    ) {
      clearL();
      position += 1;
      drawL();
    }
  }

  // L xoay 180 độ 1->2
  // position = 4
  // xxxo(4,5,6,7)
  // xo(14,15)
  // với 4,5,6,14 là các ô x và 7,15 là các ô xung quanh và để hình L đi sang phải được thì các ô 7,15 phải trống tức là position +3=7,+11=15 và đồng thời xét mép phải vì position = 4 -> ô xa nhất là 7 tức là ô 7(khi chạy vào if và thực hiện position +1), 5 thì là 8,6 thì là 9 -> dừng nên xét col-3(7)
  else if (spinL === 2) {
    if (
      position % col < col - 3 &&
      !matrixs[position + 3].classList.contains("fixed") &&
      !matrixs[position + 11].classList.contains("fixed")
    ) {
      clearL();
      position += 1;
      drawL();
    }
  }

  // L xoay 270 độ 2->3
  // position = 4
  // xxo(4,5,6)
  //  xo(15,16)
  //  xo(25,26)
  // với 4,5,15,25 là các ô x và 6,16,26 là các ô xung quanh và để hình L đi sang phải được thì các ô 6,16,26 phải trống tức là position +2=6,+12=16,+22=26 và đồng thời xét mép phải vì position = 4 -> ô xa nhất là 6 tức là ô 6(khi chạy vào if và thực hiện position +1), 5 thì là 7,6 thì là 8,7 thì là 9 -> dừng nên xét col-2(8)
  else {
    if (
      position % col < col - 2 &&
      !matrixs[position + 2].classList.contains("fixed") &&
      !matrixs[position + 12].classList.contains("fixed") &&
      !matrixs[position + 22].classList.contains("fixed")
    ) {
      clearL();
      position += 1;
      drawL();
    }
  }
}
document.addEventListener("keydown", function (event) {
  if (gameover || level2Notice.open || selectBom === true) {
    return;
  }
  // nếu đang có câu hỏi toán thì ko cho sử dụng 4 phím mũi tên vì lúc này người chơi phải nhập đáp án trong 5s chứ ko được di chuyển khối
  if (mathShowing === true) {
    // chặn cả 4 phím để khi đang nhập số thì phím lên/xuống ko làm thay đổi giá trị input
    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowUp"
    ) {
      event.preventDefault();
    }
    return;
  }
  // đi xuống
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
    if (currentShape === "J") {
      moveDownJ();
    }
    if (currentShape === "L") {
      moveDownL();
    }
  }

  // đi sang trái
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
    if (currentShape === "J") {
      moveLeftJ();
    }
    if (currentShape === "L") {
      moveLeftL();
    }
  }

  // đi sang phải
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
    if (currentShape === "J") {
      moveRightJ();
    }
    if (currentShape === "L") {
      moveRightL();
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
    if (currentShape === "J") {
      rotateJ();
    }
    if (currentShape === "L") {
      rotateL();
    }
  }
});
setInterval(function () {
  // viết lại phần điều kiện này cho level 2. Nếu mathShowing = true thì khối sẽ đứng yên để người chơi giải toán
  if (
    !gameover &&
    mathShowing === false &&
    !level2Notice.open &&
    selectBom === false
  ) {
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
    if (currentShape === "J") {
      moveDownJ();
    }
    if (currentShape === "L") {
      moveDownL();
    }
  }
}, 800);
// setInterval này là chạy mỗi 1s để kiểm tra thời gian ở level 2 cứ đủ 15s thì tạo câu hỏi toán và khi câu hỏi xuất hiện thì đếm ngược 5s
setInterval(function () {
  // chỉ thực hiện khi đang ở level 2 và game chưa kết thúc còn ở các level khác sẽ ko xuất hiện câu hỏi toán
  if (level === 2 && !gameover && !level2Notice.open && selectBom === false) {
    // TH đang có câu hỏi toán thì ko tăng mathSeconds nữa mà chuyển sang đếm ngược 5s
    if (mathShowing === true) {
      answerSeconds--;
      // cập nhật số giây còn lại lên màn hình
      mathTime.textContent = "Còn " + answerSeconds + " giây";
      // nếu answerSeconds <= 0 tức là đã hết 5s trả lời
      if (answerSeconds <= 0) {
        mathShowing = false;
        mathQuestion.style.display = "none";
        mathSeconds = 0;
        // gọi hàm raiseFloor() để nâng các khối đã nằm lên 1 hàng
        raiseFloor();
      }
    }
    // TH chưa có câu hỏi thì cứ mỗi 1s sẽ tăng mathSeconds lên 1
    else {
      mathSeconds++;
      // nếu mathSeconds >=15 tức đã đủ 15s thì cho xuất hiện câu hỏi và câu hỏi khi xuất hiện rồi thì sẽ đặt lại thời gian chờ về 0
      if (mathSeconds >= 15) {
        mathSeconds = 0;
        createMath();
      }
    }
  }
}, 1000);
// Kiểm tra row đầy chưa ví dụ:
// r= 19 nghĩa là đang(190,191,192,193,194,195,196,197,198,199), nếu các ô này có class fixed nghĩa là row này đầy thì từng ô tăng tương ứng với countrow và nếu countrow = col thì xoá row đó và tăng line lên 1(đọc dòng 20), các row khác tương tự
function checkRow() {
  for (let r = 0; r < row; r++) {
    let start = r * col;
    let countrow = 0;
    let isTrash = false;

    // kiểm tra hàng hiện tại có đầy 10 ô không
    // đồng thời kiểm tra hàng đó có chứa rác không
    for (let i = start; i < start + col; i++) {
      if (matrixs[i].classList.contains("fixed")) {
        countrow++;
      }

      if (matrixs[i].classList.contains("block-garbage")) {
        isTrash = true;
      }
    }

    // nếu hàng đầy thì xóa hàng đó
    if (countrow === col) {
      clearRow(r);

      // xử lý riêng level 1
      if (level === 1) {
        // nếu hàng vừa xóa có rác thì tăng số hàng rác đã dọn
        if (isTrash === true) {
          trashLine++;
          line++;
        }

        // chỉ tính các hàng thường sau khi đã dọn đủ 3 hàng rác(tại vì level 1 chỉ có 3 hàng rác nên khi dọn đủ 3 hàng rác thì các hàng tiếp theo sẽ tính line như bình thường chứ ko được tính line rác x2)
        else if (trashLine >= 3) {
          if (hopeStar === true) {
            line += 2;
          } else {
            line++;
          }
        }
      } else {
        // các level khác vẫn cộng line như bình thường
        if (hopeStar === true) {
          line += 2;
        } else {
          line++;
        }
      }

      lineElement.textContent = "Line: " + line + " / 10";
      // đủ 10 line thì chuyển sang level tiếp theo
      if (line >= 10 && level < 7) {
        level++;
        levelElement.textContent = "Level " + level;
        restart();
        return true;
      }
    }
  }
  return false;
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
  let random = Math.floor(Math.random() * 7);
  // level 1 nếu vẫn còn rác thì chỉ random khối O và I(:(()
  if (level === 1 && document.querySelector(".block-garbage") !== null) {
    random = Math.floor(Math.random() * 2);
  }

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
        restart(true);
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
        restart(true);
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
        restart(true);
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
        restart(true);
      }
    } else {
      drawS();
    }
  }
  // random ra khối Z
  else if (random === 4) {
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
        restart(true);
      }
    } else {
      drawZ();
    }
  }
  // random ra khối J
  else if (random === 5) {
    currentShape = "J";
    position = 4;
    spinJ = 0;
    // kiểm tra vị trí sinh khối J có bị chiếm chưa
    // position = 4
    // x(4)
    // xxx(14,15,16)
    if (
      matrixs[position].classList.contains("fixed") ||
      matrixs[position + 10].classList.contains("fixed") ||
      matrixs[position + 11].classList.contains("fixed") ||
      matrixs[position + 12].classList.contains("fixed")
    ) {
      gameover = true;
      if (confirm("Game Over")) {
        restart(true);
      }
    } else {
      drawJ();
    }
  } else {
    currentShape = "L";
    position = 4;
    spinL = 0;
    // kiểm tra vị trí sinh khối L có bị chiếm chưa
    // position = 4
    //   x(6)
    // xxx(14,15,16)
    if (
      matrixs[position + 2].classList.contains("fixed") ||
      matrixs[position + 10].classList.contains("fixed") ||
      matrixs[position + 11].classList.contains("fixed") ||
      matrixs[position + 12].classList.contains("fixed")
    ) {
      gameover = true;
      if (confirm("Game Over")) {
        restart(true);
      }
    } else {
      drawL();
    }
  }
}
// phương thức tạo rác cho level 1(ở đây chỉ tạo 3 dòng cuối là rác)
function createTrash() {
  let empty1 = 0;
  let empty2 = 0;
  let index = 0;
  // chạy vào vòng lặp 3 dòng cuối(17->19) để random ra 2 ô trống trong 1 dòng rác và các ô còn lại sẽ là rác
  for (let r = 17; r < row; r++) {
    // 2 cái này random để xuất hiện 2 ô trống trong 1 dòng rác(từ 0->9)
    empty1 = Math.floor(Math.random() * 10);
    empty2 = Math.floor(Math.random() * 10);
    // while để xử lý trường hợp 2 ô trống random ra cùng nhau(ở đây có thể random ra giống nhiều lần nên dùng while để random lại)
    while (empty1 === empty2) {
      empty2 = Math.floor(Math.random() * 10);
    }
    // phần này là duyệt các cột của hàng 17->19 và vào vòng if để kiểm tra nếu cột đó không phải là 2 ô trống thì sẽ thêm class block, block-garbage, fixed vào các ô đó
    for (let c = 0; c < col; c++) {
      index = r * col + c;
      if (c !== empty1 && c !== empty2) {
        matrixs[index].classList.add("block", "block-garbage", "fixed");
      }
    }
  }
}
// phương thức tạo câu hỏi toán ngẫu nhiên cho level 2, gồm 4 phép tính +,-,*,/
// ở đây random 2 số a,b từ 1->10 và random thêm 1 số từ 0->3 để chọn phép tính
function createMath() {
  let a = Math.floor(Math.random() * 10) + 1;
  let b = Math.floor(Math.random() * 10) + 1;
  // random từ 0->3 tức là có 4 TH để tạo phép tính
  // 0 là cộng, 1 là trừ, 2 là nhân, 3 là chia
  let random = Math.floor(Math.random() * 4);
  // TH random = 0 thì tạo phép cộng
  if (random === 0) {
    mathResult = a + b;
    mathText.textContent = a + " + " + b + " = ?";
  }
  // TH random = 1 thì tạo phép trừ
  else if (random === 1) {
    // nếu a nhỏ hơn b thì đổi vị trí a,b để kết quả ko bị âm
    // ví dụ a=3,b=8 thì đổi lại a=8,b=3 để phép tính là 8-3 chứ ko phải 3-8
    if (a < b) {
      let temp = a;
      a = b;
      b = temp;
    }
    mathResult = a - b;
    mathText.textContent = a + " - " + b + " = ?";
  }
  // TH random = 2 thì tạo phép nhân
  else if (random === 2) {
    mathResult = a * b;
    mathText.textContent = a + " * " + b + " = ?";
  }
  // TH còn lại tức random = 3 thì tạo phép chia
  else {
    // ở đây phải xử lý riêng phép chia vì nếu random a,b bình thường thì kết quả có thể là số thập phân
    // nên random kết quả trước từ 1->10 rồi lấy b nhân ngược lại với kết quả đó để tạo a
    // ví dụ b=3,mathResult=4 thì a=3*4=12 nên câu hỏi sẽ là 12/3=?
    mathResult = Math.floor(Math.random() * 10) + 1;
    a = b * mathResult;
    mathText.textContent = a + " / " + b + " = ?";
  }
  // khi câu hỏi được tạo thì đổi mathShowing thành true để biết đang giải toán
  // đồng thời đặt thời gian trả lời lại là 5s cho mỗi câu hỏi mới
  mathShowing = true;
  answerSeconds = 5;
  // xóa đáp án của câu trước vì nếu ko xóa thì input vẫn còn số người chơi đã nhập
  mathAnswer.value = "";
  // hiển thị thời gian ban đầu và cho câu hỏi xuất hiện bên trong board
  mathTime.textContent = "Còn 5 giây";
  mathQuestion.style.display = "block";
  // khi câu hỏi xuất hiện thì tự đưa con trỏ vào input để người chơi nhập đáp án
  mathAnswer.focus();
}
// phương thức kiểm tra đáp án khi người chơi bấm nút trả lời trong level 2 thì ở đây sẽ lấy số người chơi nhập vào input rồi so sánh với mathResult đã được tính trong createMath(),ví dụ câu hỏi là 8+5=? thì mathResult=13, nếu người chơi nhập 13 thì đúng còn nhập số khác thì sai
function checkMathAnswer() {
  // nếu mathShowing = false tức là hiện tại ko có câu hỏi toán nên ko cần kiểm tra đáp án vì có thể câu hỏi đã hết 5s hoặc người chơi đã trả lời trước đó rồi
  if (mathShowing === false) {
    return;
  }
  // ép kiểu từ string -> number để so sánh vì mathResult là number còn mathAnswer.value là string nên phải ép kiểu để so sánh
  let answer = Number(mathAnswer.value);
  // TH người chơi trả lời đúng
  if (answer === mathResult) {
    // ẩn câu hỏi và cho game tiếp tục chạy
    mathShowing = false;
    mathQuestion.style.display = "none";
    mathSeconds = 0;
    // mỗi lần trả lời đúng thì nhận 1 Bom
    bomb++;
    // cập nhật số Bom lên giao diện
    bombElement.textContent = "Bom: " + bomb;
  }
  // TH người chơi trả lời sai
  else {
    // ẩn câu hỏi và cho game tiếp tục chạy
    mathShowing = false;
    mathQuestion.style.display = "none";
    // đặt lại thời gian chờ câu hỏi tiếp theo
    mathSeconds = 0;
    // nếu người chơi trả lời sai thì gọi hàm raiseFloor() để nâng các khối đã nằm lên 1 hàng, nếu chưa có khối fixed thì ko nâng
    raiseFloor();
  }
}
// xử lý khi người chơi bấm nút Trả lời
mathSubmit.addEventListener("click", function () {
  checkMathAnswer();
});
// Này là xử lý thêm nút enter có thể nhấn Enter để trả lời nhanh
mathAnswer.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    checkMathAnswer();
  }
});
// phương thức này để nâng các khối đã nằm lên 1 hàng khi trả lời sai hoặc hết 5s ở level 2 chỉ nâng các ô có class fixed nếu chưa có fixed thì ko có khối nào được nâng
function raiseFloor() {
  // kiểm tra hàng đầu tiên từ 0->9 xem có khối fixed nào chưa vì nếu có thì khi nâng lên sẽ vượt khỏi board ví dụ ô 4 đã fixed thì khi nâng lên sẽ thành 4-10=-6 nên xử lý gameover
  for (let i = 0; i < col; i++) {
    if (matrixs[i].classList.contains("fixed")) {
      gameover = true;
      if (confirm("Game Over")) {
        restart(true);
      }
      return;
    }
  }
  // kiểm tra các khối fixed khi nâng lên có đụng khối đang rơi hay ko vì chỉ nâng khối đã nằm còn khối đang rơi thì giữ nguyên ví dụ ô 174 đang có khối rơi còn ô 184 đã fixed, khi nâng thì ô 184 sẽ lên ô 174 nên 2 khối bị trùng vị trí -> gameover
  for (let i = 0; i < (row - 1) * col; i++) {
    if (
      matrixs[i + col].classList.contains("fixed") &&
      matrixs[i].classList.contains("block") &&
      !matrixs[i].classList.contains("fixed")
    ) {
      gameover = true;
      if (confirm("Game Over")) {
        restart(true);
      }
      return;
    }
  }
  // bắt đầu nâng các khối fixed lên 1 hàng, vì board có 10 cột nên lấy class của ô bên dưới i+10 đưa lên ô hiện tại i ví dụ ô 190 sẽ lên ô 180, ô 180 sẽ lên ô 170, tương tự các ô khác duyệt từ 0->189 vì hàng cuối 190->199 sẽ xử lý riêng
  for (let i = 0; i < (row - 1) * col; i++) {
    // nếu ô bên dưới có fixed thì đưa khối đó lên ô hiện tại ví dụ i=180 thì i+col=190 nên lấy class của ô 190 gán cho ô 180
    if (matrixs[i + col].classList.contains("fixed")) {
      matrixs[i].className = matrixs[i + col].className;
    }
    // nếu ô hiện tại có fixed nhưng ô bên dưới trống thì phải xóa khối cũ vì nó đã được đẩy lên hàng trên ví dụ ô 180 đã được đẩy lên 170 nhưng ô 190 trống thì ô 180 cũng phải trống
    else if (matrixs[i].classList.contains("fixed")) {
      matrixs[i].className = "matrix";
    }
  }
  // cuối cùng xóa các khối fixed ở hàng cuối từ 190->199 vì chúng đã được đẩy lên hàng 18 nếu ô ở hàng cuối là khối đang rơi thì ko xóa vì nó chưa có class fixed
  for (let i = (row - 1) * col; i < row * col; i++) {
    if (matrixs[i].classList.contains("fixed")) {
      matrixs[i].className = "matrix";
    }
  }
}
// phương thức pump() để xử lý phá các khối fixed trong phạm vi 3x3 khi người chơi chọn 1 ô bất kỳ trên board. Ví dụ người chơi chọn ô 184 thì hàng của nó là Math.floor(184/10)=18 và cột là 184%10=4, lúc này vùng phá sẽ gồm 3 hàng 17,18,19 và 3 cột 3,4,5 tương ứng với các ô 173,174,175,183,184,185,193,194,195. Chỉ phá những ô có class fixed còn khối đang rơi thì giữ nguyên. Nếu phá được ít nhất 1 ô fixed thì trừ 1 Bom và cho game tiếp tục chạy
function pump(centerIndex) {
  // vd 184 -> hàng 18, cột 4
  let centerRow = Math.floor(centerIndex / col);
  let centerCol = centerIndex % col;
  let removed = 0;
  // duyệt các hàng và cột xung quanh ô được chọn từ -1 đến +1 để tạo vùng 3x3, đồng thời kiểm tra các vị trí ko được vượt khỏi board vì nếu chọn ô ở mép thì có thể bị âm hoặc vượt quá 19 hàng và 9 cột
  for (let r = centerRow - 1; r <= centerRow + 1; r++) {
    // vd 17,18,19
    for (let c = centerCol - 1; c <= centerCol + 1; c++) {
      //vd 3,4,5
      if (r >= 0 && r < row && c >= 0 && c < col) {
        let index = r * col + c; // vd 173,174,175,183,184,185,193,194,195
        if (matrixs[index].classList.contains("fixed")) {
          matrixs[index].className = "matrix";
          removed++;
        }
      }
    }
  }
  // nếu removed > 0 tức là đã phá được ít nhất 1 ô fixed thì mới trừ bom còn nếu vùng được chọn ko có fixed thì ko trừ Bom và tiếp tục cho người chơi chọn lại
  if (removed > 0) {
    bomb--;
    bombElement.textContent = "Bom: " + bomb;
    selectBom = false;
    useBombButton.textContent = "Dùng Bom";
  }
}
// xử lý nút sử dụng Bom, nếu chưa chọn thì cho người chơi chọn vị trí phá còn nếu đang chọn thì bấm lần nữa để hủy Bom và chỉ được sử dụng khi còn Bom và chỉ được sử dụng nếu từ level 2 trở lên
useBombButton.addEventListener("click", function () {
  if (selectBom === true) {
    selectBom = false;
    useBombButton.textContent = "Dùng Bom";
    return;
  }
  if (level < 2 || bomb <= 0 || gameover || mathShowing || level2Notice.open) {
    return;
  }
  selectBom = true;
  useBombButton.textContent = "Hủy Bom";
});
// xử lý khi người chơi click vào board để chọn vị trí phá Bom ở đây sẽ duyệt qua 200 ô matrix để xác định người chơi chọn ô nào. Ví dụ người chơi click vào ô 184 thì i=184 và matrixs[184] sẽ bằng event.target, lúc này gọi pump(184) để phá vùng 3x3 xung quanh ô đó. Chỉ xử lý khi selectBom = true, còn nếu chưa chọn Bom thì click vào board sẽ ko có tác dụng
board.addEventListener("click", function (event) {
  if (selectBom === true) {
    for (let i = 0; i < matrixs.length; i++) {
      if (matrixs[i] === event.target) {
        pump(i);
        break;
      }
    }
  }
});
// phương thức tạo con sâu ở 1 vị trí ngẫu nhiên trên board
function createWorm() {
  // tạo ảnh con sâu
  let wormImage = document.createElement("img");
  // mảng 3 con sâu(đỏ,vàng,hồng)
  let wormImages = [
    "./images/worm-red.png",
    "./images/worm-yellow.png",
    "./images/worm-pink.png",
  ];
  // random từ 0->2, 0 là sâu đỏ, 1 là sâu vàng, 2 là sâu hồng
  let randomWorm = Math.floor(Math.random() * 3);
  wormImage.src = wormImages[randomWorm];
  wormImage.classList.add("worm");
  // random vị trí từ 0->199 vì board có 200 ô
  let wormPosition = Math.floor(Math.random() * row * col);
  // mỗi ô có kích thước 30px vd vị trí 184 thì cột = 184%10 = 4, hàng = Math.floor(184/10) = 18 ,left = 4*30 = 120px tính từ trái sang thì kết thúc ô số 4 bắt đầu ô số 5, top = 18*30 = 540px kết thục ô số 18 bắt đầu ô số 19
  wormImage.style.left = (wormPosition % col) * 30 + "px";
  wormImage.style.top = Math.floor(wormPosition / col) * 30 + "px";
  board.appendChild(wormImage);
  // lưu lại ảnh và vị trí của con sâu(lv4 sử dụng tiếp tại vì lv4 sẽ có nhiều sâu xuất hiện chung)
  worms.push({
    image: wormImage,
    position: wormPosition,
  });
}
// phương thức để di chuyển các con sâu trên board, mỗi lần gọi thì mỗi con sâu sẽ đi ngẫu nhiên đúng 1 ô theo 4 hướng lên, xuống, trái, phải
function moveWorm() {
  // duyệt từng con sâu trong mảng worms, lv3 thì có 1 con,lv4 sẽ có nhiều con
  for (let worm of worms) {
    // xác định hàng và cột hiện tại của con sâu vd sâu ở vị trí 184 thì hàng = Math.floor(184/10) = 18, cột = 184%10 = 4
    let wormRow = Math.floor(worm.position / col);
    let wormCol = worm.position % col;
    // lưu những hướng mà con sâu có thể di chuyển để không đi xuyên qua mép board
    let paths = [];
    // nếu sâu chưa ở hàng đầu tiên(0) thì cho phép đi lên vd vị trí 184 -> 174, còn đang ở hàng 0 thì ko cho đi lên
    if (wormRow > 0) {
      directions.push("up");
    }
    // nếu sâu chưa ở hàng cuối cùng(19) thì cho phép đi xuống vd vị trí 184 -> 194 nghĩa là di chuyển xuống 1 hàng
    if (wormRow < row - 1) {
      directions.push("down");
    }
    // nếu sâu chưa ở cột đầu tiên(0) thì cho phép đi sang trái vd vị trí 184 -> 183 nghĩa là di chuyển sang trái 1 ô
    if (wormCol > 0) {
      directions.push("left");
    }
    // nếu sâu chưa ở cột cuối cùng(9) thì cho phép đi sang phải vd vị trí 184 -> 185 nghĩa là di chuyển sang phải 1 ô
    if (wormCol < col - 1) {
      directions.push("right");
    }
    // random 1 hướng trong 4 hướng
    let random = Math.floor(Math.random() * 4);
    let path = paths[random];
    // TH đi lên -> - 10
    if (path === "up") {
      worm.position -= 10;
    }
    // TH đi xuống -> + 10
    else if (path === "down") {
      worm.position += 10;
    }
    // TH đi sang trái -> - 1
    else if (path === "left") {
      worm.position -= 1;
    }
    // TH đi sang phải -> + 1
    else if (path === "right") {
      worm.position += 1;
    }
    // sau khi thay đổi vị trí trong mảng thì phải cập nhật lại tọa độ ảnh để con sâu thực sự di chuyển trên board
    worm.image.style.left = (worm.position % col) * 30 + "px";
    worm.image.style.top = Math.floor(worm.position / col) * 30 + "px";
  }
}
