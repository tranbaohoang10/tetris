const board = document.querySelector(".board");
const row = 20;
const col = 10;
for (let i = 0; i < row * col; i++) {
  const matrix = document.createElement("div");
  matrix.classList.add("matrix");
  board.appendChild(matrix);
}
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
let line = 0;
// nghĩa là ban đầu vị trí của hình vuông là 4 và khi nhấn nút xuốngvị trí sẽ tăng lên 10 (vì có 10 cột) do đó hình vuông sẽ di chuyển xuống một hàng. Khi nhấn nút xuống thì cần xóa các ô vuông hiện tại và thêm các ô vuông mới ở vị trí mới và xử lý ở hàm moveDown().
function clearSquare() {
  matrixs[position].classList.remove("block", "block-square");
  matrixs[position + 1].classList.remove("block", "block-square");
  matrixs[position + 10].classList.remove("block", "block-square");
  matrixs[position + 11].classList.remove("block", "block-square");
}

function drawSquare() {
  matrixs[position].classList.add("block", "block-square");
  matrixs[position + 1].classList.add("block", "block-square");
  matrixs[position + 10].classList.add("block", "block-square");
  matrixs[position + 11].classList.add("block", "block-square");
}
// hàm để restart game duyệt qua các matrix và loại bỏ các class
function restart() {
  for (let matrix of matrixs) {
    matrix.classList.remove("block", "block-square", "fixed");
  }
  position = 4;
  gameover = false;
  drawSquare();
}
// sau khi hình vuông chạm đáy hoặc chạm vào các ô vuông đã có vật cản khác thì cần khóa các ô vuông hiện tại lại và tạo một hình vuông mới ở vị trí ban đầu.
function lockSquare() {
  matrixs[position].classList.add("fixed");
  matrixs[position + 1].classList.add("fixed");
  matrixs[position + 10].classList.add("fixed");
  matrixs[position + 11].classList.add("fixed");
  // tạo hình vuông mới ở vị trí ban đầu
  position = 4;
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
drawSquare();
// Phương thức này để để kiểm tra xem hình vuông nó có thể đi xuống ko nếu có thì làm bình thường còn nếu ko có thì gọi phương thức lockSquare() để khóa các ô vuông hiện tại lại và tạo một hình vuông mới ở vị trí ban đầu.
function moveDown() {
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
document.addEventListener("keydown", function (event) {
  if (gameover) {
    return;
  }
  if (event.key === "ArrowDown") {
    moveDown();
  }
  // col = 10(nếu position chia col dư 0 thì hình đang sát mép trái và xử lý thêm điều kiện nếu bên trái có vật cản thì ko cho di chuyển sang trái nữa)
  if (event.key === "ArrowLeft") {
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
  if (event.key === "ArrowRight") {
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
});
setInterval(function () {
  if (!gameover) {
    moveDown();
  }
}, 800);
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
    }
  }
}
