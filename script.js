// ===== 홈 화면 추가 팝업 =====

document.addEventListener("DOMContentLoaded", function () {

  const installBtn = document.getElementById("installBtn");
  const modal = document.getElementById("installModal");
  const androidBtn = document.getElementById("androidBtn");
  const iphoneBtn = document.getElementById("iphoneBtn");
  const closeModal = document.getElementById("closeModal");

  if (!installBtn || !modal) return;

  installBtn.addEventListener("click", function () {
    modal.classList.add("show");
  });

  closeModal.addEventListener("click", function () {
    modal.classList.remove("show");
  });

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.remove("show");
    }
  });

  androidBtn.addEventListener("click", function () {

    modal.classList.remove("show");

    alert(
`🤖 갤럭시 홈 화면 추가

① 오른쪽 아래 점 세 개(⋮)

② 현재 페이지 추가

③ 홈 화면 선택`
    );

  });

  iphoneBtn.addEventListener("click", function () {

    modal.classList.remove("show");

    alert(
`🍎 아이폰 홈 화면 추가

① 오른쪽 아래 점 세 개(…)

② 공유

③ 더보기

④ 홈 화면에 추가

⑤ 추가`
    );

  });

});
