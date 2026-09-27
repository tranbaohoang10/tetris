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
// hàm để restart game duyệt qua các matrix và loại bỏ các class
function restart() {
  for (let matrix of matrixs) {
    matrix.classList.remove("block", "block-square", "block-i", "fixed");
  }
  gameover = false;
  line = 0;
  spinI = 0;
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
  }
  if (event.key === "ArrowLeft") {
    if (currentShape === "O") {
      moveLeftSquare();
    }
    if (currentShape === "I") {
      moveLeftI();
    }
  }
  if (event.key === "ArrowRight") {
    if (currentShape === "O") {
      moveRightSquare();
    }

    if (currentShape === "I") {
      moveRightI();
    }
  }
  // xoay
  if (event.key === "ArrowUp") {
    if (currentShape === "I") {
      rotateI();
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
  let random = Math.floor(Math.random() * 2);
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
  else {
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
}
