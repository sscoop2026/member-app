// ===== 설정 =====
const API_URL = "https://script.google.com/macros/s/AKfycbx3DKfkzUCdlplSWCfIBSMZ9sXo1lDdHXqCk7dQDuub6ezPylFV3dIzeqMcW7jvsD2QXA/exec";

const NOTICE_READ_KEY_BASE = "seosan_notice_read_key_by_member_0701";
const MEMBER_CODE_STORAGE_KEY = "seosan_saved_member_code_0701";
let CURRENT_NOTICE_KEY = "";

window.addEventListener("DOMContentLoaded", function () {
  updateStoredMemberCode();
  updateNoticeBadge(false);
  loadNotices();
  loadPartners();
  loadMember();
  registerServiceWorker();

  const installBtn = document.getElementById("installBtn");
  if (installBtn) installBtn.onclick = showInstallGuide;
});

function showInstallGuide() {
  alert(
    "📱 홈 화면 추가 방법\n\n" +
    "🤖 갤럭시\n" +
    "① 오른쪽 아래 점 세 개(⋮)\n" +
    "② 현재 페이지 추가\n" +
    "③ 홈 화면 선택\n\n" +
    "🍎 아이폰\n" +
    "① 오른쪽 아래 점 세 개(…)\n" +
    "② 공유\n" +
    "③ 더보기\n" +
    "④ 홈 화면에 추가\n" +
    "⑤ 추가"
  );
}

function updateStoredMemberCode() {
  const params = new URLSearchParams(window.location.search);
  const codeFromUrl = (params.get("code") || "").trim();
  if (codeFromUrl) {
    localStorage.setItem(MEMBER_CODE_STORAGE_KEY, codeFromUrl);
    sessionStorage.setItem(MEMBER_CODE_STORAGE_KEY, codeFromUrl);
    return codeFromUrl;
  }
  return localStorage.getItem(MEMBER_CODE_STORAGE_KEY) || sessionStorage.getItem(MEMBER_CODE_STORAGE_KEY) || "";
}

function getMemberCode() {
  return updateStoredMemberCode();
}

function apiRequest(action, params) {
  params = params || {};
  return new Promise(function (resolve, reject) {
    const callbackName = "jsonp_cb_" + Date.now();
    const query = new URLSearchParams();
    query.set("action", action);
    query.set("callback", callbackName);

    Object.keys(params).forEach(function (key) {
      query.set(key, params[key]);
    });

    const script = document.createElement("script");

    window[callbackName] = function (response) {
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
      resolve(response && response.data !== undefined ? response.data : response);
    };

    script.onerror = function () {
      delete window[callbackName];
      reject(new Error("API 오류"));
    };

    script.src = API_URL + "?" + query.toString();
    document.body.appendChild(script);
  });
}

function loadNotices() {
  apiRequest("getNotices").then(function (notices) {
    const list = document.getElementById("noticeList");
    const fullList = document.getElementById("noticeListFull");
    const mainNotice = document.getElementById("mainNotice");

    if (mainNotice && notices && notices.length > 0) mainNotice.textContent = notices[0]["제목"] || "";

    let html = "";
    (notices || []).forEach(function (item) {
      html += `
        <div class="card">
          <span class="tag">${escapeHtml(item["구분"] || "공지")}</span>
          <h3>${escapeHtml(item["제목"] || "")}</h3>
          <p>${escapeHtml(item["내용"] || "")}</p>
          <button class="btn" onclick="openLink('${escapeAttr(item["링크"] || "")}')">${escapeHtml(item["버튼명"] || "자세히 보기")}</button>
        </div>`;
    });

    if (!html) html = `<div class="card"><p>등록된 공지사항이 없습니다.</p></div>`;
    if (list) list.innerHTML = html;
    if (fullList) fullList.innerHTML = html;
  });
}

function loadPartners() {
  apiRequest("getPartners").then(function (partners) {
    const partnerPage = document.getElementById("partnerPage");
    if (!partnerPage) return;

    let html = `<div class="section"><h2>제휴업체</h2></div>`;

    (partners || []).forEach(function (item) {
      html += `
        <div class="partner-card">
          <div class="partner-icon"><i class="fa-solid fa-handshake"></i></div>
          <div class="partner-body">
            <h3 class="partner-name">${escapeHtml(item["업체명"] || "")}</h3>
            <p class="partner-benefit">${escapeHtml(item["내용"] || "")}</p>
          </div>
        </div>`;
    });

    if (!partners || partners.length === 0) html += `<div class="card"><p>등록된 제휴업체가 없습니다.</p></div>`;
    partnerPage.innerHTML = html;
  });
}

function loadMember() {
  const code = getMemberCode();
  const memberName = document.getElementById("memberName");
  if (!code) {
    if (memberName) memberName.textContent = "회원정보 없음";
    return;
  }
}

function openNoticeFromBell() {
  showPage("noticePage");
}

function updateNoticeBadge(show) {
  const badge = document.querySelector(".bell .badge");
  if (badge) badge.style.display = show ? "block" : "none";
}

function showPage(pageId, btn) {
  document.querySelectorAll(".page").forEach(function (page) {
    page.classList.remove("active");
  });

  const page = document.getElementById(pageId);
  if (page) page.classList.add("active");

  document.querySelectorAll("nav button").forEach(function (button) {
    button.classList.remove("active");
  });

  if (btn) btn.classList.add("active");
}

function openLink(url) {
  if (url) window.open(url, "_blank");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(function () {});
  }
}
