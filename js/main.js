// Thông số vòng quay
let duration = 5; // Thời gian kết thúc vòng quay
let spins = 8; // Quay nhanh hay chậm 3, 8, 15
let theWheel;

var input = document.getElementById("input");
var data = [];

input.addEventListener("change", function () {
  readXlsxFile(input.files[0]).then(function (rows) {
    data = rows.map((row) => {
      return {
        fillStyle: generateLightColorHex(),
        text: row[0].toString(),
      };
    });

    if (data.length > 0) {
      theWheel = new Winwheel({
        numSegments: data.length, // Chia 8 phần bằng nhau = dữ liệu
        outerRadius: 212, // Đặt bán kính vòng quay = hình ảnh
        textFontSize: 18, // Đặt kích thước chữ
        rotationAngle: 0, // Đặt góc vòng quay từ 0 đến 360 độ.
        // Các thành phần bao gồm màu sắc và văn bản.
        segments: data,
        animation: {
          type: "spinToStop",
          duration: duration,
          spins: spins,
          callbackSound: playSound, // Hàm gọi âm thanh khi quay
          soundTrigger: "pin", // Chỉ định chân để kích hoạt âm thanh
          callbackFinished: alertPrize, // Hàm hiển thị kết quả trúng giải thưởng
        },
        pins: {
          number: data.length * 2, // Số lượng chân. Chia đều xung quanh vòng quay, sao cho chia hết cho spins
        },
      });
    }
  });
});

function generateLightColorHex() {
  let color = "#";
  for (let i = 0; i < 3; i++)
    color += (
      "0" + Math.floor(((1 + Math.random()) * Math.pow(16, 2)) / 2).toString(16)
    ).slice(-2);
  return color;
}

let audio = new Audio("tick.mp3");

function playSound() {
  audio.pause();
  audio.currentTime = 0;
  audio.play();
}

function statusButton(status) {
  switch (status) {
    case 1:
      document.getElementById("spin_start").removeAttribute("disabled");
      document.getElementById("spin_reset").classList.add("hide");
      break;
    case 2:
      document.getElementById("spin_start").setAttribute("disabled", false);
      document.getElementById("spin_reset").classList.add("hide");
      break;
    case 3:
      document.getElementById("spin_reset").classList.remove("hide");
      break;
    default:
      alert("Các giá trị của status: 1, 2, 3");
  }
}

statusButton(1);

let wheelSpinning = false;

function startSpin() {
  if (wheelSpinning == false && data.length > 0) {
    statusButton(2);
    theWheel.startAnimation(); // Hàm bắt đầu quay
    wheelSpinning = true;
  }
}

var result = document.getElementById("result");

function alertPrize(indicatedSegment) {
  result.innerText =
    "Xin chúc mừng chủ nhân số điện thoại: " + indicatedSegment.text;
  statusButton(3);
}

function resetWheel() {
  result.innerText = "";
  statusButton(1);
  theWheel.stopAnimation(false); // Hàm dừng quay, false là đối số để không gọi callback function.
  theWheel.rotationAngle = 0; // Reset góc bánh xe về 0 độ.
  theWheel.draw(); // Hàm để render các thay đổi cho bánh xe.
  wheelSpinning = false;
}
