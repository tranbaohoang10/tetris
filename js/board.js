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
// nghĩa là ban đầu vị trí của hình vuông là 4 và khi nhấn nút xuốngvị trí sẽ tăng lên 10 (vì có 10 cột) do đó hình vuông sẽ di chuyển xuống một hàng. Khi nhấn nút xuống thì cần xóa các ô vuông hiện tại và thêm các ô vuông mới ở vị trí mới.
let position = 4;
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
drawSquare();
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowDown") {
    if (position + 20 < row * col && position + 21 < row * col) {
      clearSquare();
      position += 10;
      drawSquare();
    }
  }
  // col = 10(nếu position chia col dư 0 thì hình đang sát mép trái)
  if (event.key === "ArrowLeft") {
    if (position % col !== 0) {
      clearSquare();
      position -= 1;
      drawSquare();
    }
  }
  // col = 10(nếu sát mép phải nghĩa là position đang = 8)
  if (event.key === "ArrowRight") {
    if (position % col < col - 2) {
      clearSquare();
      position += 1;
      drawSquare();
    }
  }
});
setInterval(function () {
  if (position + 20 < row * col && position + 21 < row * col) {
    clearSquare();
    position += 10;
    drawSquare();
  }
}, 800);
