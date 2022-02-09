const responsiveContents = document.getElementById("responsive-contents");
const KEY_IOS = "ios";
const KEY_ANDROID = "android";
const KEY_PC = "pc";

const PC_HTML = `<img src="images/qrcode.svg" alt="" height="30%" width="30%" />
<ul>
 <img src="images/app-store-badge.svg" alt="" >
 <img id="play-store" src="images/google-play-badge.png" alt="" >
</ul>`;

const ANDROID_HTML = `<a href="https://play.google.com/store/apps/details?id=com.future_connect.liv_farm"  style="text-decoration: none; color: white;">
<img id="play-store" src="images/google-play-badge.png" alt="" style="width: 100%;" >
</a>`;

const IOS_HTML = `<a href="https://apps.apple.com/kr/app/livfarm/id1550565167"  style="text-decoration: none; color: white;">
<img src="images/app-store-badge.svg" alt=""style="width: 200%; transform: translateX(-22.5%)">
</a>`;

function getDeviceInfo() {
  var filter = "win16|win32|win64|macintel|mac|";
  if (navigator.platform) {
    if (filter.indexOf(navigator.platform.toLowerCase()) < 0) {
      if (navigator.userAgent.indexOf("iPhone") != -1) {
        return KEY_IOS;
      } else if (navigator.userAgent.indexOf("iPad") != -1) {
        return KEY_PC;
      } else {
        return KEY_ANDROID;
      }
    } else {
      return KEY_PC;
    }
  }
}
const deviceInfo = getDeviceInfo();

switch (deviceInfo) {
  case KEY_IOS:
    responsiveContents.innerHTML = IOS_HTML;
    break;
  case KEY_ANDROID:
    responsiveContents.innerHTML = ANDROID_HTML;
    break;
  default:
    responsiveContents.innerHTML = PC_HTML;
}
