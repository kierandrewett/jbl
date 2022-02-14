/*
  Jumblejot 0.3
  Made with ♥ by Aetinx.
  Released under Sargent Coding.
  
  Translations assited by:
  [Bot] DeepL - Spanish, Japanese
  Surapunoyousei - Japanese
*/ 

var version = [0, 3, 0];
var storedVersion = (localStorage.getItem("version") != undefined) ? JSON.parse(localStorage.getItem("version")) : [0, 0, 0];
var versionStatus = (version[0] >= storedVersion[0]) ? (version[1] >= storedVersion[1]) ? (version[2] >= storedVersion[2]) ? (version[2] == storedVersion[2]) ? 2 : 1 : 0 : 0 : 0;

// Maths setup
math = math ? math : undefined;

/*
	NOTES:
	------
	JEE in 1.1 instead of 1.0?
  Add a theme marketplace
*/

window.onload = () => {
  setup();
  math.validate = (expression) => {
  	try {
    	let answer = math.evaluate(expression);
    	return answer;
  	} catch (err) {
 	    return undefined;
  	}
	}
}

// Set up some important variables
var currentFile;
var hist = {};
var fileData;
var settings = {};

// Escaping file names in HTML
const escapeHTML = (string) => {
  return string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Loading the app!
const setup = async () => {
  byId("nav").click();
  let response;
  console.log("Giving code preview proper permissions...");
  response = await setup.previewPerms();
  console.log("Loading settings and preferences...");
  response = await setup.settings();
  console.log("Loading file data and creating file buttons...");
  response = await setup.files();
  response = await updateCustomTheme();
  console.log("Setting up storage meters...");
  response = await updateStorageBar("local", checkSpace());
  console.log("Done!");
  loading.classList.add("doneLoading");
  setTimeout(() => {
    loading.remove()
  }, 500);
  if (versionStatus) {
    localStorage.setItem("version", JSON.stringify(version));
  }
}

// Set up byId shortener
const byId = (element) => {
  return document.getElementById(element);
}

// Returning a value from language
const byLang = (obj) => {
  return obj[settings.preferences.language ? settings.preferences.language : "en"]
}

// UI Control
const loading = document.getElementById("loading");
const workspace = document.getElementById("workspace");
const textarea = document.getElementById("textarea");
const sidebar = document.getElementById("sidebar");
const preview = document.getElementById("preview");
const files = document.getElementById("files");
const storage = document.getElementById("storage");
const finder = document.getElementById("finder");

// Set up tempates
const templates = {};
templates.imgExts = ["png", "apng", "gif", "avif", "jpg", "jpeg", "tif", "tiff", "bmp", "ico", "webp"];

templates.fileIcons = (ext) => {
  let icons = {
    file: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.5 1C2.22386 1 2 1.22386 2 1.5V8.5C2 8.77614 2.22386 9 2.5 9H7.5C7.77614 9 8 8.77614 8 8.5V2.91421C8 2.78161 7.94732 2.65443 7.85355 2.56066L6.43934 1.14645C6.34557 1.05268 6.21839 1 6.08579 1H2.5ZM1 1.5C1 0.671573 1.67157 0 2.5 0H6.08579C6.48361 0 6.86514 0.158035 7.14645 0.43934L8.56066 1.85355C8.84196 2.13486 9 2.51639 9 2.91421V8.5C9 9.32843 8.32843 10 7.5 10H2.5C1.67157 10 1 9.32843 1 8.5V1.5Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 2.5V0.5H6.5V2.5H8.5V3.5H6.5C5.94772 3.5 5.5 3.05228 5.5 2.5Z"/></svg>`,
    image: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 1.5C0 0.671573 0.671573 0 1.5 0H8.5C9.32843 0 10 0.671573 10 1.5V8.5C10 9.32843 9.32843 10 8.5 10H1.5C0.671573 10 0 9.32843 0 8.5V1.5ZM1.5 1C1.22386 1 1 1.22386 1 1.5V8.5C1 8.77614 1.22386 9 1.5 9H8.5C8.77614 9 9 8.77614 9 8.5V1.5C9 1.22386 8.77614 1 8.5 1H1.5Z"></path><path d="M8 9L3.9 3.53333C3.7 3.26667 3.3 3.26667 3.1 3.53333L0.5 7V9H8Z"></path><path d="M6.58826 5.02938L3.5 9H9.5V8L7.38981 5.04573C7.19537 4.77352 6.79364 4.76532 6.58826 5.02938Z"></path></svg>`,    
		html: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.56445 1C1.27604 1 1.04744 1.24334 1.06543 1.53119L1.45482 7.76151C1.46806 7.97338 1.61364 8.15378 1.81792 8.21149L4.86407 9.07203C4.95295 9.09714 5.04705 9.09714 5.13593 9.07203L8.18208 8.21149C8.38636 8.15378 8.53194 7.97338 8.54518 7.76151L8.93458 1.53119C8.95257 1.24334 8.72396 1 8.43555 1H1.56445ZM0.067373 1.59357C0.0134013 0.73002 0.69922 0 1.56445 0H8.43555C9.30078 0 9.9866 0.730021 9.93263 1.59357L9.54323 7.82389C9.50351 8.45948 9.06679 9.0007 8.45395 9.17383L5.40779 10.0344C5.14115 10.1097 4.85885 10.1097 4.59221 10.0344L1.54606 9.17383C0.933215 9.0007 0.496492 8.45948 0.456768 7.82389L0.067373 1.59357Z"/><path d="M4.98468 7.5C4.64428 7.5 4.34081 7.43738 4.07427 7.31214C3.80934 7.1869 3.599 7.01429 3.44325 6.79432C3.2875 6.57434 3.20642 6.32225 3.2 6.03805H4.21156C4.2228 6.22913 4.30308 6.38407 4.45241 6.50289C4.60173 6.62171 4.77916 6.68112 4.98468 6.68112C5.14846 6.68112 5.29296 6.64499 5.41821 6.57274C5.54505 6.49888 5.6438 6.39692 5.71445 6.26686C5.7867 6.1352 5.82283 5.98426 5.82283 5.81407C5.82283 5.64066 5.7859 5.48812 5.71204 5.35645C5.63978 5.22479 5.53943 5.12203 5.41098 5.04817C5.28253 4.97431 5.13561 4.93658 4.97023 4.93497C4.82572 4.93497 4.68522 4.96468 4.54874 5.02408C4.41387 5.08349 4.3087 5.16458 4.23323 5.26734L3.30597 5.10116L3.53959 2.5H6.55501V3.3526H4.39942L4.27177 4.58815H4.30067C4.38738 4.46612 4.51824 4.36496 4.69325 4.28468C4.86827 4.2044 5.06416 4.16426 5.28092 4.16426C5.57797 4.16426 5.8429 4.2341 6.07572 4.3738C6.30854 4.51349 6.49239 4.70536 6.62726 4.94942C6.76214 5.19188 6.82877 5.47126 6.82716 5.78757C6.82877 6.11994 6.7517 6.41538 6.59595 6.67389C6.44181 6.9308 6.22585 7.13311 5.94807 7.28083C5.6719 7.42694 5.35077 7.5 4.98468 7.5Z"/></svg>`,
    css: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.56445 1C1.27604 1 1.04744 1.24334 1.06543 1.53119L1.45482 7.76151C1.46806 7.97338 1.61364 8.15378 1.81792 8.21149L4.86407 9.07203C4.95295 9.09714 5.04705 9.09714 5.13593 9.07203L8.18208 8.21149C8.38636 8.15378 8.53194 7.97338 8.54518 7.76151L8.93458 1.53119C8.95257 1.24334 8.72396 1 8.43555 1H1.56445ZM0.067373 1.59357C0.0134013 0.73002 0.69922 0 1.56445 0H8.43555C9.30078 0 9.9866 0.730021 9.93263 1.59357L9.54323 7.82389C9.50351 8.45948 9.06679 9.0007 8.45395 9.17383L5.40779 10.0344C5.14115 10.1097 4.85885 10.1097 4.59221 10.0344L1.54606 9.17383C0.933215 9.0007 0.496492 8.45948 0.456768 7.82389L0.067373 1.59357Z"/><path d="M4.98648 7.5C4.6316 7.5 4.31554 7.43901 4.03829 7.31702C3.76262 7.19344 3.54478 7.02392 3.38477 6.80846C3.22634 6.59141 3.14475 6.3411 3.14 6.05751H4.17612C4.18246 6.17633 4.22127 6.28089 4.29257 6.3712C4.36544 6.45992 4.46208 6.52883 4.58249 6.57795C4.7029 6.62706 4.83835 6.65162 4.98886 6.65162C5.1457 6.65162 5.28433 6.62389 5.40473 6.56844C5.52514 6.51299 5.6194 6.43615 5.68753 6.33793C5.75565 6.2397 5.78971 6.12643 5.78971 5.9981C5.78971 5.86819 5.75328 5.75333 5.6804 5.65352C5.60911 5.55212 5.50613 5.47291 5.37146 5.41587C5.23838 5.35884 5.07995 5.33032 4.89618 5.33032H4.44228V4.57462H4.89618C5.05144 4.57462 5.18848 4.54769 5.3073 4.49382C5.42771 4.43996 5.52118 4.36549 5.58772 4.27044C5.65426 4.1738 5.68753 4.06131 5.68753 3.93298C5.68753 3.811 5.65822 3.70406 5.5996 3.61217C5.54257 3.51869 5.46177 3.44582 5.3572 3.39354C5.25423 3.34125 5.13382 3.31511 4.99599 3.31511C4.85657 3.31511 4.72904 3.34046 4.61338 3.39116C4.49773 3.44027 4.40505 3.51077 4.33534 3.60266C4.26563 3.69455 4.2284 3.80228 4.22365 3.92586H3.23743C3.24219 3.64544 3.32219 3.39829 3.47745 3.18441C3.63271 2.97053 3.84184 2.80339 4.10483 2.68298C4.3694 2.56099 4.66804 2.5 5.00074 2.5C5.33661 2.5 5.63049 2.56099 5.88239 2.68298C6.1343 2.80497 6.32995 2.96974 6.46937 3.17728C6.61037 3.38324 6.68008 3.61454 6.6785 3.8712C6.68008 4.14369 6.59532 4.37104 6.42422 4.55323C6.2547 4.73542 6.03369 4.85108 5.7612 4.90019V4.93821C6.11925 4.98416 6.39174 5.10852 6.57869 5.31131C6.76722 5.51252 6.86069 5.76442 6.85911 6.06702C6.86069 6.34426 6.78068 6.59062 6.61909 6.80608C6.45907 7.02155 6.23807 7.19106 5.95606 7.31464C5.67406 7.43821 5.35087 7.5 4.98648 7.5Z"/></svg>`,
    js: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 1C1.22386 1 1 1.22386 1 1.5V8.5C1 8.77614 1.22386 9 1.5 9H8.5C8.77614 9 9 8.77614 9 8.5V1.5C9 1.22386 8.77614 1 8.5 1H1.5ZM0 1.5C0 0.671573 0.671573 0 1.5 0H8.5C9.32843 0 10 0.671573 10 1.5V8.5C10 9.32843 9.32843 10 8.5 10H1.5C0.671573 10 0 9.32843 0 8.5V1.5Z"/><path d="M3.70906 4.19134H4.4939V6.80992C4.4939 7.05197 4.4395 7.26224 4.3307 7.44072C4.22312 7.61921 4.07336 7.75674 3.88143 7.85331C3.6895 7.94989 3.4664 7.99818 3.21212 7.99818C2.98596 7.99818 2.78058 7.95845 2.59598 7.87898C2.41261 7.7983 2.26713 7.67605 2.15956 7.51224C2.05198 7.3472 1.9988 7.13999 2.00002 6.8906H2.79036C2.79281 6.98962 2.81298 7.07459 2.85087 7.14549C2.88999 7.21517 2.94317 7.26896 3.01041 7.30686C3.07887 7.34353 3.15955 7.36187 3.25246 7.36187C3.35026 7.36187 3.43278 7.34109 3.50002 7.29952C3.56847 7.25674 3.62043 7.19439 3.65588 7.11248C3.69134 7.03058 3.70906 6.92972 3.70906 6.80992V4.19134Z"/><path d="M7.18766 5.27141C7.17299 5.12349 7.11003 5.00858 6.99878 4.92667C6.88753 4.84477 6.73656 4.80381 6.54585 4.80381C6.41626 4.80381 6.30685 4.82215 6.21761 4.85882C6.12837 4.89428 6.05991 4.94379 6.01223 5.00736C5.96578 5.07093 5.94255 5.14305 5.94255 5.22374C5.9401 5.29097 5.95416 5.34965 5.98473 5.39978C6.01651 5.4499 6.05991 5.4933 6.11492 5.52997C6.16993 5.56542 6.2335 5.5966 6.30563 5.62349C6.37776 5.64916 6.45477 5.67117 6.53668 5.68951L6.87409 5.77019C7.0379 5.80686 7.18827 5.85576 7.32519 5.91689C7.4621 5.97801 7.58069 6.0532 7.68093 6.14244C7.78117 6.23168 7.8588 6.33681 7.91381 6.45784C7.97005 6.57887 7.99878 6.71762 8 6.8741C7.99878 7.10393 7.9401 7.30319 7.82396 7.4719C7.70905 7.63938 7.54279 7.76957 7.32519 7.86248C7.1088 7.95417 6.8478 8.00001 6.54218 8.00001C6.239 8.00001 5.97495 7.95356 5.75001 7.86065C5.52629 7.76774 5.35148 7.63021 5.22556 7.44806C5.10087 7.26468 5.03546 7.03791 5.02935 6.76774H5.79768C5.80624 6.89366 5.84231 6.99879 5.90588 7.08314C5.97067 7.16627 6.05685 7.22923 6.16443 7.27202C6.27323 7.31358 6.39609 7.33437 6.53301 7.33437C6.66749 7.33437 6.78423 7.31481 6.88326 7.27569C6.9835 7.23657 7.06113 7.18217 7.11614 7.11248C7.17115 7.0428 7.19866 6.96273 7.19866 6.87226C7.19866 6.78791 7.1736 6.71701 7.12347 6.65955C7.07458 6.60209 7.00245 6.55319 6.90709 6.51285C6.81296 6.47251 6.69744 6.43584 6.56052 6.40283L6.1516 6.30014C5.83497 6.22312 5.58497 6.10271 5.4016 5.93889C5.21822 5.77508 5.12715 5.55442 5.12837 5.27692C5.12715 5.04953 5.18766 4.85088 5.30991 4.68095C5.43338 4.51103 5.6027 4.37839 5.81786 4.28303C6.03301 4.18768 6.27751 4.14 6.55135 4.14C6.83008 4.14 7.07335 4.18768 7.28118 4.28303C7.49022 4.37839 7.65281 4.51103 7.76895 4.68095C7.88509 4.85088 7.94499 5.0477 7.94866 5.27141H7.18766Z"/></svg>`,
    json: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 1C2.79086 1 1 2.79086 1 5C1 7.20914 2.79086 9 5 9C7.20914 9 9 7.20914 9 5C9 2.79086 7.20914 1 5 1ZM0 5C0 2.23858 2.23858 0 5 0C7.76142 0 10 2.23858 10 5C10 7.76142 7.76142 10 5 10C2.23858 10 0 7.76142 0 5Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5.34782 3.73293C5.12886 3.62345 4.87113 3.62345 4.65217 3.73293C3.60805 4.25499 3.60805 5.74501 4.65217 6.26707C4.87113 6.37655 5.12886 6.37655 5.34782 6.26707C6.39194 5.74501 6.39194 4.25499 5.34782 3.73293ZM4.20496 2.8385C4.70545 2.58826 5.29454 2.58826 5.79503 2.8385C7.5762 3.72909 7.57621 6.27091 5.79503 7.1615C5.29454 7.41174 4.70545 7.41174 4.20496 7.1615C2.42379 6.27091 2.42379 3.72909 4.20496 2.8385Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M6.74157 3.1718L5.0889 0.784605L5.91109 0.215395L7.56376 2.60259C8.97685 4.64371 7.46642 7.42422 4.985 7.34977L5.01499 6.35022C6.6764 6.40007 7.68768 4.53841 6.74157 3.1718Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M3.25843 6.8282L4.9111 9.2154L4.08891 9.78461L2.43624 7.39741C1.02315 5.35629 2.53358 2.57578 5.015 2.65023L4.98501 3.64978C3.3236 3.59993 2.31232 5.46159 3.25843 6.8282Z"/></svg>`,
    svg: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 0C5.55228 0 6 0.447715 6 1C6 1.55228 5.55228 2 5 2C4.44772 2 4 1.55228 4 1C4 0.447715 4.44772 0 5 0Z"/><path d="M5 8C5.55228 8 6 8.44772 6 9C6 9.55228 5.55228 10 5 10C4.44772 10 4 9.55228 4 9C4 8.44772 4.44772 8 5 8Z"/><path d="M1 4C1.55228 4 2 4.44772 2 5C2 5.55228 1.55228 6 1 6C0.447715 6 0 5.55228 0 5C0 4.44772 0.447715 4 1 4Z"/><path d="M9 4C9.55228 4 10 4.44772 10 5C10 5.55228 9.55228 6 9 6C8.44772 6 8 5.55228 8 5C8 4.44772 8.44772 4 9 4Z"/><path d="M2 1C2.55228 1 3 1.44772 3 2C3 2.55228 2.55228 3 2 3C1.44772 3 1 2.55228 1 2C1 1.44772 1.44772 1 2 1Z"/><path d="M8 1C8.55228 1 9 1.44772 9 2C9 2.55228 8.55228 3 8 3C7.44772 3 7 2.55228 7 2C7 1.44772 7.44772 1 8 1Z"/><path d="M2 7C2.55228 7 3 7.44772 3 8C3 8.55228 2.55228 9 2 9C1.44772 9 1 8.55228 1 8C1 7.44772 1.44772 7 2 7Z"/><path d="M8 7C8.55228 7 9 7.44772 9 8C9 8.55228 8.55228 9 8 9C7.44772 9 7 8.55228 7 8C7 7.44772 7.44772 7 8 7Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 3.79289V1H5.5V3.79289L7.64645 1.64645L8.35355 2.35355L6.20711 4.5H9V5.5H6.20711L8.35355 7.64645L7.64645 8.35355L5.5 6.20711V9H4.5V6.20711L2.35355 8.35355L1.64645 7.64645L3.79289 5.5H1V4.5H3.79289L1.64645 2.35355L2.35355 1.64645L4.5 3.79289Z"/></svg>`,
    xml: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.15653 1.23739L3.76261 9.15653L2.84347 8.76261L6.23739 0.843468L7.15653 1.23739ZM1.14031 5L2.89043 2.81235L2.10957 2.18765L0.109566 4.68765C-0.0365219 4.87026 -0.0365219 5.12974 0.109566 5.31235L2.10957 7.81235L2.89043 7.18765L1.14031 5ZM7.89043 2.18765L9.89043 4.68765C10.0365 4.87026 10.0365 5.12974 9.89043 5.31235L7.89043 7.81235L7.10957 7.18765L8.85969 5L7.10957 2.81235L7.89043 2.18765Z"/></svg>`,
    py: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 1C3.22386 1 3 1.22386 3 1.5V2.5H5V3.5H1.5C1.22386 3.5 1 3.72386 1 4V6C1 6.27614 1.22386 6.5 1.5 6.5H2.05001C2.28164 5.35888 3.29052 4.5 4.5 4.5H5.5C6.32843 4.5 7 3.82843 7 3V2.5C7 1.67157 6.32843 1 5.5 1H3.5ZM2 7.5H1.5C0.671573 7.5 0 6.82843 0 6V4C0 3.17157 0.671573 2.5 1.5 2.5H2V1.5C2 0.671573 2.67157 0 3.5 0H5.5C6.88071 0 8 1.11929 8 2.5H8.5C9.32843 2.5 10 3.17157 10 4V6C10 6.82843 9.32843 7.5 8.5 7.5H8V8.5C8 9.32843 7.32843 10 6.5 10H4.5C3.11929 10 2 8.88071 2 7.5ZM7 7.5H5V6.5H8.5C8.77614 6.5 9 6.27614 9 6V4C9 3.72386 8.77614 3.5 8.5 3.5H7.94999C7.71836 4.64112 6.70948 5.5 5.5 5.5H4.5C3.67157 5.5 3 6.17157 3 7V7.5C3 8.32843 3.67157 9 4.5 9H6.5C6.77614 9 7 8.77614 7 8.5V7.5Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M6 2.5H5V1.5H6V2.5ZM5 8.5H4V7.5H5V8.5Z"/></svg>`,
    rs: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 1C2.79086 1 1 2.79086 1 5C1 7.20914 2.79086 9 5 9C7.20914 9 9 7.20914 9 5C9 2.79086 7.20914 1 5 1ZM0 5C0 2.23858 2.23858 0 5 0C7.76142 0 10 2.23858 10 5C10 7.76142 7.76142 10 5 10C2.23858 10 0 7.76142 0 5Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 2V0.5H5.5V2H4.5Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M3.64117 7.72094L2.75949 8.93447L1.95047 8.34668L2.83215 7.13316L3.64117 7.72094Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7.16788 7.13316L8.04956 8.34668L7.24054 8.93447L6.35887 7.72094L7.16788 7.13316Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7.69866 3.59742L9.12524 3.1339L9.43426 4.08495L8.00768 4.54848L7.69866 3.59742Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M2.5 3.75H1V2.75H6.25C6.94036 2.75 7.5 3.30964 7.5 4C7.5 4.41995 7.29291 4.79152 6.97529 5.01818L7.70711 5.75H9V6.75H7.29289L5.79289 5.25H3.5V5.75H4V6.75H1V5.75H2.5V3.75ZM3.5 3.75V4.25H6.25C6.38807 4.25 6.5 4.13807 6.5 4C6.5 3.86193 6.38807 3.75 6.25 3.75H3.5Z"/></svg>`,
    php: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 8C7.76142 8 10 6.65685 10 5C10 3.34315 7.76142 2 5 2C2.23858 2 0 3.34315 0 5C0 6.65685 2.23858 8 5 8ZM1.96895 3.92825L1.5 6.72604H2.06565L2.24581 5.63713H2.26701C2.2829 5.69365 2.31028 5.74973 2.34914 5.80537C2.388 5.86012 2.44231 5.90561 2.51208 5.94181C2.58273 5.97802 2.67281 5.99613 2.78232 5.99613C2.93687 5.99613 3.08303 5.95639 3.2208 5.8769C3.35945 5.79654 3.47824 5.67864 3.57715 5.52321C3.67694 5.36689 3.74539 5.17525 3.78248 4.94828C3.82134 4.71513 3.8156 4.52128 3.76526 4.36673C3.7158 4.2113 3.63544 4.09517 3.52416 4.01833C3.41288 3.94062 3.28262 3.90176 3.13337 3.90176C3.02033 3.90176 2.92186 3.92119 2.83796 3.96005C2.75406 3.99802 2.68385 4.04571 2.62733 4.10311C2.57169 4.15964 2.52709 4.21527 2.49353 4.27003H2.46836L2.52533 3.92825H1.96895ZM2.35179 4.94563C2.33236 5.06662 2.33148 5.17216 2.34914 5.26224C2.36769 5.35232 2.40478 5.42253 2.46042 5.47287C2.51605 5.52232 2.58935 5.54705 2.68032 5.54705C2.77217 5.54705 2.85386 5.52188 2.92539 5.47154C2.99692 5.42032 3.05654 5.34967 3.10423 5.25959C3.15192 5.16862 3.18592 5.06397 3.20623 4.94563C3.22477 4.82817 3.22522 4.72485 3.20755 4.63565C3.18989 4.54645 3.15368 4.47668 3.09893 4.42634C3.04417 4.37601 2.96999 4.35084 2.87638 4.35084C2.78541 4.35084 2.70372 4.37512 2.6313 4.42369C2.55977 4.47227 2.50016 4.54115 2.45247 4.63035C2.40478 4.71955 2.37122 4.82464 2.35179 4.94563ZM4.75051 4.78667L4.55445 5.96301H3.99145L4.44185 3.25H4.98896L4.8194 4.28725H4.84192C4.90727 4.16714 4.99691 4.07309 5.11083 4.00509C5.22476 3.9362 5.35944 3.90176 5.51487 3.90176C5.65617 3.90176 5.77407 3.93267 5.86857 3.99449C5.96395 4.05542 6.03151 4.1433 6.07125 4.25811C6.11099 4.37203 6.11761 4.50848 6.09112 4.66744L5.87387 5.96301H5.31086L5.50957 4.76812C5.52988 4.64271 5.51355 4.54513 5.46056 4.47536C5.40845 4.40559 5.32544 4.37071 5.21151 4.37071C5.13468 4.37071 5.06403 4.38704 4.99956 4.41972C4.93509 4.4524 4.88078 4.50009 4.83662 4.56279C4.79334 4.62461 4.76464 4.69923 4.75051 4.78667ZM6.66108 3.92825L6.19213 6.72604H6.75778L6.93794 5.63713H6.95914C6.97503 5.69365 7.00241 5.74973 7.04127 5.80537C7.08013 5.86012 7.13444 5.90561 7.20421 5.94181C7.27486 5.97802 7.36494 5.99613 7.47445 5.99613C7.629 5.99613 7.77516 5.95639 7.91293 5.8769C8.05158 5.79654 8.17037 5.67864 8.26928 5.52321C8.36907 5.36689 8.43752 5.17525 8.47461 4.94828C8.51347 4.71513 8.50772 4.52128 8.45739 4.36673C8.40793 4.2113 8.32756 4.09517 8.21629 4.01833C8.10501 3.94062 7.97475 3.90176 7.8255 3.90176C7.71246 3.90176 7.61399 3.92119 7.53009 3.96005C7.44619 3.99802 7.37598 4.04571 7.31946 4.10311C7.26382 4.15964 7.21922 4.21527 7.18566 4.27003H7.16049L7.21746 3.92825H6.66108ZM7.04392 4.94563C7.02449 5.06662 7.02361 5.17216 7.04127 5.26224C7.05982 5.35232 7.09691 5.42253 7.15255 5.47287C7.20818 5.52232 7.28148 5.54705 7.37245 5.54705C7.46429 5.54705 7.54598 5.52188 7.61752 5.47154C7.68905 5.42032 7.74867 5.34967 7.79636 5.25959C7.84404 5.16862 7.87805 5.06397 7.89836 4.94563C7.9169 4.82817 7.91735 4.72485 7.89968 4.63565C7.88202 4.54645 7.84581 4.47668 7.79106 4.42634C7.7363 4.37601 7.66212 4.35084 7.5685 4.35084C7.47754 4.35084 7.39585 4.37512 7.32343 4.42369C7.2519 4.47227 7.19229 4.54115 7.1446 4.63035C7.09691 4.71955 7.06335 4.82464 7.04392 4.94563Z"/></svg>`,
    rb: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.75 1H8.25L9.9 3.2C10.0433 3.39111 10.0315 3.65692 9.87165 3.83448L5.37165 8.83448C5.27683 8.93984 5.14175 9 5 9C4.85826 9 4.72318 8.93984 4.62836 8.83448L0.128355 3.83448C-0.0314534 3.65692 -0.0433314 3.39111 0.100002 3.2L1.75 1ZM2 2.33333L2.5 3H1.5L2 2.33333ZM1.62268 4L3.88064 6.50884L3.12799 4H1.62268ZM4.17202 4L5 6.75995L5.82799 4H4.17202ZM6.87202 4L6.11937 6.50884L8.37732 4H6.87202ZM8.5 3H7.5L8 2.33333L8.5 3ZM7 2H6L6.5 2.66667L7 2ZM5.5 3L5 2.33333L4.5 3H5.5ZM3.5 2.66667L4 2H3L3.5 2.66667Z"/></svg>`,
    c: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.24988 0.356257C4.71377 0.0879403 5.28557 0.087488 5.74989 0.355071L8.6532 2.02825C9.11788 2.29604 9.40423 2.79156 9.40423 3.32788V6.67265C9.40423 7.20855 9.11833 7.70374 8.65423 7.97169L5.75711 9.64434C5.29301 9.91229 4.72122 9.91229 4.25711 9.64434L1.36 7.97169C0.895899 7.70374 0.610001 7.20855 0.610001 6.67265V3.32682C0.610001 2.79135 0.89545 2.29648 1.35897 2.02838L4.24988 0.356257ZM5.25057 1.22149C5.0958 1.1323 4.9052 1.13245 4.75057 1.22189L1.85966 2.89401C1.70515 2.98338 1.61 3.14833 1.61 3.32682V6.67265C1.61 6.85128 1.7053 7.01635 1.86 7.10566L4.75711 8.77831C4.91182 8.86763 5.10241 8.86763 5.25711 8.77831L8.15423 7.10566C8.30893 7.01635 8.40423 6.85128 8.40423 6.67265V3.32788C8.40423 3.1491 8.30878 2.98393 8.15389 2.89467L5.25057 1.22149Z"/><path d="M6.76777 6.76777C6.41814 7.1174 5.97268 7.3555 5.48773 7.45196C5.00277 7.54843 4.50011 7.49892 4.04329 7.3097C3.58648 7.12048 3.19603 6.80005 2.92133 6.38893C2.64662 5.9778 2.5 5.49445 2.5 5C2.5 4.50555 2.64662 4.0222 2.92133 3.61107C3.19603 3.19995 3.58648 2.87952 4.04329 2.6903C4.50011 2.50108 5.00277 2.45157 5.48773 2.54804C5.97268 2.6445 6.41814 2.8826 6.76777 3.23223L5.88431 4.11568C5.70941 3.94078 5.48658 3.82168 5.24398 3.77342C5.00139 3.72516 4.74993 3.74993 4.52141 3.84459C4.29289 3.93924 4.09757 4.09954 3.96016 4.3052C3.82274 4.51086 3.74939 4.75265 3.74939 5C3.74939 5.24735 3.82274 5.48914 3.96016 5.6948C4.09757 5.90046 4.29289 6.06076 4.52141 6.15541C4.74993 6.25007 5.00139 6.27484 5.24398 6.22658C5.48658 6.17833 5.70941 6.05922 5.88432 5.88432L6.76777 6.76777Z"/></svg>`,
    cpp: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.24988 0.356257C4.71377 0.0879403 5.28557 0.087488 5.74989 0.355071L8.6532 2.02825C9.11788 2.29604 9.40423 2.79156 9.40423 3.32788V6.67265C9.40423 7.20855 9.11833 7.70374 8.65423 7.97169L5.75711 9.64434C5.29301 9.91229 4.72122 9.91229 4.25711 9.64434L1.36 7.97169C0.895899 7.70374 0.610001 7.20855 0.610001 6.67265V3.32682C0.610001 2.79135 0.89545 2.29648 1.35897 2.02838L4.24988 0.356257ZM5.25057 1.22149C5.0958 1.1323 4.9052 1.13245 4.75057 1.22189L1.85966 2.89401C1.70515 2.98338 1.61 3.14833 1.61 3.32682V6.67265C1.61 6.85128 1.7053 7.01635 1.86 7.10566L4.75711 8.77831C4.91182 8.86763 5.10241 8.86763 5.25711 8.77831L8.15423 7.10566C8.30893 7.01635 8.40423 6.85128 8.40423 6.67265V3.32788C8.40423 3.1491 8.30878 2.98393 8.15389 2.89467L5.25057 1.22149Z"/><path d="M6.76777 6.76777C6.41814 7.1174 5.97268 7.3555 5.48773 7.45196C5.00277 7.54843 4.50011 7.49892 4.04329 7.3097C3.58648 7.12048 3.19603 6.80005 2.92133 6.38893C2.64662 5.9778 2.5 5.49445 2.5 5C2.5 4.50555 2.64662 4.0222 2.92133 3.61107C3.19603 3.19995 3.58648 2.87952 4.04329 2.6903C4.50011 2.50108 5.00277 2.45157 5.48773 2.54804C5.97268 2.6445 6.41814 2.8826 6.76777 3.23223L5.88431 4.11568C5.70941 3.94078 5.48658 3.82168 5.24398 3.77342C5.00139 3.72516 4.74993 3.74993 4.52141 3.84459C4.29289 3.93924 4.09757 4.09954 3.96016 4.3052C3.82274 4.51086 3.74939 4.75265 3.74939 5C3.74939 5.24735 3.82274 5.48914 3.96016 5.6948C4.09757 5.90046 4.29289 6.06076 4.52141 6.15541C4.74993 6.25007 5.00139 6.27484 5.24398 6.22658C5.48658 6.17833 5.70941 6.05922 5.88432 5.88432L6.76777 6.76777Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5.38656 5.11344V5.5H5.61344V5.11344H6V4.88656H5.61344V4.5H5.38656V4.88656H5V5.11344H5.38656ZM5.38656 5.11344H5.61344V4.88656H5.38656V5.11344Z"/><path d="M5.38656 5.11344H5.61344V4.88656H5.38656V5.11344Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M6.7556 5.11344V5.5H6.98248V5.11344H7.36904V4.88656H6.98248V4.5H6.7556V4.88656H6.36904V5.11344H6.7556ZM6.7556 5.11344H6.98248V4.88656H6.7556V5.11344Z"/><path d="M6.7556 5.11344H6.98248V4.88656H6.7556V5.11344Z"/></svg>`,
    cs: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.24987 0.356257C4.71376 0.0879403 5.28556 0.087488 5.74987 0.355071L8.65319 2.02825C9.11787 2.29604 9.40421 2.79156 9.40421 3.32788V6.67265C9.40421 7.20855 9.11831 7.70374 8.65421 7.97169L5.7571 9.64434C5.293 9.91229 4.7212 9.91229 4.2571 9.64434L1.35999 7.97169C0.895883 7.70374 0.609985 7.20855 0.609985 6.67265V3.32682C0.609985 2.79135 0.895435 2.29648 1.35896 2.02838L4.24987 0.356257ZM5.25056 1.22149C5.09578 1.1323 4.90518 1.13245 4.75055 1.22189L1.85964 2.89401C1.70514 2.98338 1.60999 3.14833 1.60999 3.32682V6.67265C1.60999 6.85128 1.70528 7.01635 1.85999 7.10566L4.7571 8.77831C4.9118 8.86763 5.1024 8.86763 5.2571 8.77831L8.15421 7.10566C8.30891 7.01635 8.40421 6.85128 8.40421 6.67265V3.32788C8.40421 3.1491 8.30876 2.98393 8.15387 2.89467L5.25056 1.22149Z"/><path d="M6.76777 6.76777C6.41814 7.1174 5.97268 7.3555 5.48773 7.45196C5.00277 7.54843 4.50011 7.49892 4.04329 7.3097C3.58648 7.12048 3.19603 6.80005 2.92133 6.38893C2.64662 5.9778 2.5 5.49445 2.5 5C2.5 4.50555 2.64662 4.0222 2.92133 3.61107C3.19603 3.19995 3.58648 2.87952 4.04329 2.6903C4.50011 2.50108 5.00277 2.45157 5.48773 2.54804C5.97268 2.6445 6.41814 2.8826 6.76777 3.23223L5.88431 4.11568C5.70941 3.94078 5.48658 3.82168 5.24398 3.77342C5.00139 3.72516 4.74993 3.74993 4.52141 3.84459C4.29289 3.93924 4.09757 4.09954 3.96016 4.3052C3.82274 4.51086 3.74939 4.75265 3.74939 5C3.74939 5.24735 3.82274 5.48914 3.96016 5.6948C4.09757 5.90046 4.29289 6.06076 4.52141 6.15541C4.74993 6.25007 5.00139 6.27484 5.24398 6.22658C5.48658 6.17833 5.70941 6.05922 5.88432 5.88432L6.76777 6.76777Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M6.73947 5.36328L6.67603 5.75H6.8811L6.94455 5.36328H7.1543L7.18872 5.1582H6.9782L7.03011 4.8418H7.24146L7.27515 4.63672H7.06375L7.1272 4.25H6.92212L6.85867 4.63672H6.53641L6.59985 4.25H6.39478L6.33133 4.63672H6.12085L6.08716 4.8418H6.29768L6.24577 5.1582H6.03442L6 5.36328H6.21213L6.14868 5.75H6.35376L6.41721 5.36328H6.73947ZM6.77312 5.1582L6.82503 4.8418H6.50276L6.53641 4.63672H6.33133L6.29768 4.8418H6.50276L6.45085 5.1582H6.77312Z"/><path d="M6.50276 4.8418L6.53641 4.63672H6.33133L6.29768 4.8418H6.50276Z"/></svg>`,
    lol: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H10V10H0V0ZM1 1V9H9V1H1Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M3 4V2H4V4H3ZM6 4V2H7V4H6Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M2 5.25V5H3V5.25C3 6.35457 3.89543 7.25 5 7.25C6.10457 7.25 7 6.35457 7 5.25V5H8V5.25C8 6.90685 6.65685 8.25 5 8.25C3.34315 8.25 2 6.90685 2 5.25Z"/></svg>`,
    sh: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.32918 0.276394C4.75147 0.0652481 5.24853 0.0652479 5.67082 0.276394L8.67082 1.77639C9.179 2.03048 9.5 2.54988 9.5 3.11803V6.88197C9.5 7.45012 9.179 7.96952 8.67082 8.22361L5.67082 9.72361C5.24853 9.93475 4.75147 9.93475 4.32918 9.72361L1.32918 8.22361C0.821004 7.96952 0.5 7.45012 0.5 6.88197V3.11803C0.5 2.54988 0.821003 2.03048 1.32918 1.77639L4.32918 0.276394ZM5.22361 1.17082C5.08284 1.10044 4.91716 1.10044 4.77639 1.17082L1.77639 2.67082C1.607 2.75552 1.5 2.92865 1.5 3.11803V6.88197C1.5 7.07135 1.607 7.24448 1.77639 7.32918L4.77639 8.82918C4.91716 8.89956 5.08284 8.89956 5.22361 8.82918L8.22361 7.32918C8.393 7.24448 8.5 7.07135 8.5 6.88197V3.11803C8.5 2.92865 8.393 2.75552 8.22361 2.67082L5.22361 1.17082Z"/><path d="M5 5.11803V7.88197C5 8.62535 5.78231 9.10884 6.44721 8.77639L8.44721 7.77639C8.786 7.607 9 7.26074 9 6.88197V4.11803C9 3.37465 8.21769 2.89116 7.55279 3.22361L5.55279 4.22361C5.214 4.393 5 4.73926 5 5.11803Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8.5 4.11803C8.5 3.74634 8.10884 3.5046 7.77639 3.67082L5.77639 4.67082C5.607 4.75552 5.5 4.92865 5.5 5.11803V7.88197C5.5 8.25366 5.89116 8.49541 6.22361 8.32918L8.22361 7.32918C8.393 7.24448 8.5 7.07135 8.5 6.88197V4.11803ZM7.32918 2.77639C8.32653 2.27772 9.5 3.00296 9.5 4.11803V6.88197C9.5 7.45012 9.179 7.96952 8.67082 8.22361L6.67082 9.22361C5.67347 9.72228 4.5 8.99704 4.5 7.88197V5.11803C4.5 4.54988 4.821 4.03048 5.32918 3.77639L7.32918 2.77639Z"/></svg>`,
    md: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 3.5C0 2.67157 0.671573 2 1.5 2H8.5C9.32843 2 10 2.67157 10 3.5V6.5C10 7.32843 9.32843 8 8.5 8H1.5C0.671573 8 0 7.32843 0 6.5V3.5ZM1.5 3.5H2.51367L3.21094 5.19922H3.24609L3.94336 3.5H4.95703V6.5H4.16016V4.76562H4.13672L3.46875 6.47656H2.98828L2.32031 4.75391H2.29688V6.5H1.5V3.5ZM7 6.5L5.5 5H6.5V3.5H7.5V5H8.5L7 6.5Z"/></svg>`,
    drawlet: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.4856 2.55982C6.96457 2.02347 6.15583 1.66667 5 1.66667L4.59789 3.27512C3.16776 2.91759 2.51291 3.30583 2.18365 3.66849C1.78754 4.10478 1.66667 4.72269 1.66667 5C1.66667 6.06063 2.01657 6.87973 2.56842 7.43158C3.12027 7.98343 3.93937 8.33333 5 8.33333C6.06063 8.33333 6.87973 7.98343 7.43158 7.43158C7.98343 6.87973 8.33333 6.06063 8.33333 5C8.33333 3.91546 8.01048 3.10014 7.4856 2.55982ZM5 1.65769C3.09792 1.18275 1.77012 1.64451 0.949683 2.54818C0.195789 3.37855 0 4.44398 0 5C0 6.43937 0.483428 7.70361 1.38991 8.61009C2.29639 9.51657 3.56063 10 5 10C6.43937 10 7.70361 9.51657 8.61009 8.61009C9.51657 7.70361 10 6.43937 10 5C10 3.58454 9.57285 2.31653 8.68107 1.39851C7.78543 0.476531 6.51083 0 5 0V1.65769Z"/></svg>`
  }
  if (templates.imgExts.includes(ext)) {
    return icons.image;
  }
  if (icons[ext]) {
  	return icons[ext];
  }
  switch (ext) {
    case "htm":
      return icons.html
      break;
    case "bry":
      return icons.py
      break;
    case "rlib":
      return icons.rs
      break;
    case "lols":
      return icons.lol
      break;
    case "markdown":
      return icons.md
      break;
    default:
      return icons.file
      break;
  }
}

templates.finderFile = (name) => {
  return `<li onclick='selectFile("${name}");finder.close()' tabindex='0'>${name}</li>`
}

templates.maths = (answer) => {
  return `<li onclick='navigator.clipboard.writeText("${answer}").then(()=>{alert("Copied!")}).catch((err)=>{alert(\`Copy failed!\n\${err}\`)});finder.close()' tabindex='0'>${answer}</li>`
}

templates.settingsOption = (icon, click, title, desc, action) => {
  return `<div class="option" onclick='if(this==event.target){${click}}'><span class="option-icon">${icon}</span><span class="option-info"><h3>${title}</h3><p>${desc}</p></span><span class="option-action">${action}</span></div>`
}

templates.toTree = (obj) => {
  let newer = {};
  Object.keys(obj).forEach((path) => {
    let split = path.replace(/^\/+/g, "").replace(/\/+$/g, "").split(/\/+/mg);
    split.reduce((gen, name) => {
      return gen[name] || (name, split[split.length - 1] != name ? gen[name] = {} : gen[name] = obj[path]);
    }, newer);
  });
  return newer;
}

// Init settings and preferences
setup.settings = async () => {
  console.log("[SETTINGS] Setting up settings interface...")
  settings = {
    preferences: {
      theme: "light",
      customTheme: {
        baseTheme: "light",
        background: ["colour", "#ffffff"],
        accent: "#ff5c85",
        uiFont: "'Inter', Inter, sans, sans-serif",
        textareaFont: "'DM Mono', DM Mono, mono, monospace",
        radiiStyle: "soft", // Soft, Sharp
        statusColours: {
          success: "#44cc66",
          caution: "#ffcc00",
          warning: "#ff3344"
        }
      },
      tabSize: 2,
      fontScaling: 1,
      allowAnimations: true,
      colonEmojis: true,
      fileHistoryCap: 25,
      defaultContextMenu: 0,
      previewWidth: 50,
      language: "en",
      textOverflow: "wrap",
      previewRefresh: true
    },
    sections: {
      main: byId("settingsArea-main").cloneNode(true),
      personalisation: byId("settingsArea-personalisation").cloneNode(true),
      aa: byId("settingsArea-aa").cloneNode(true),
      custom: byId("settingsArea-custom").cloneNode(true),
      shortcuts: byId("settingsArea-shortcuts").cloneNode(true),
      marketplace: byId("settingsArea-marketplace").cloneNode(true)
    }
  };
  if (localStorage.getItem("preferences") != undefined) {
    let json = JSON.parse(localStorage.getItem("preferences"))
    for (let i in json) {
      if (typeof json[i] == "Object") {
        for (let i2 in json[i]) {
          settings.preferences[i][i2] = json[i][i2]
        }
      } else {
        settings.preferences[i] = json[i];
      }
    }
  }

  console.log("[SETTINGS] Setting up section selection...")
  settings.setSection = async (section) => {
    byId("settingsArea").innerHTML = "";
    byId("settingsArea").append(settings.sections[section]);
    let purposeList = {
      main: [
        ["language", settings.preferences.language]
      ],
      personalisation: [
        ["theme", settings.preferences.theme]
      ],
      aa: [
        ["tabSize", settings.preferences.tabSize],
        ["fontScaling", settings.preferences.fontScaling * 100],
        ["allowAnimations", settings.preferences.allowAnimations],
        ["colonEmojis", settings.preferences.colonEmojis],
        ["fileHistoryCap", settings.preferences.fileHistoryCap],
        ["defaultContextMenu", settings.preferences.defaultContextMenu],
        ["previewWidth", settings.preferences.previewWidth],
        ["textOverflow", settings.preferences.textOverflow],
        ["previewRefresh", settings.preferences.previewRefresh ? "auto" : "manual"]
      ],
      custom: [
        ["baseTheme", settings.preferences.customTheme.baseTheme],
        ["background", settings.preferences.customTheme.background[0]],
        ["uiFont", settings.preferences.customTheme.uiFont],
        ["textareaFont", settings.preferences.customTheme.textareaFont],
        ["radiiStyle", settings.preferences.customTheme.radiiStyle],
        ["accentColour", settings.preferences.customTheme.accent],
        ["successColour", settings.preferences.customTheme.statusColours.success],
        ["cautionColour", settings.preferences.customTheme.statusColours.caution],
        ["warningColour", settings.preferences.customTheme.statusColours.warning]
      ],
    }

    if (purposeList[section] != undefined) {
      purposeList[section].forEach((purpose) => {
        document.querySelectorAll(`[data-purpose="${purpose[0]}"]`).forEach((input) => {
          if (!(input.matches("[type='checkbox']"))) {
            input.value = purpose[1];
          } else {
            input.checked = purpose[1];
          }
        });
      });
    }

    if (section == "custom") {
      changeBackgroundTypeSelection = () => {
        document.body.querySelectorAll("#settingsArea-custom .option-double style")[0].innerHTML = `[data-backgroundType]:not([data-backgroundType="${settings.preferences.customTheme.background[0]}"]) { display: none }`;
        document.body.querySelectorAll(`#settingsArea-custom .option-double [data-backgroundType="${settings.preferences.customTheme.background[0]}"]`)[0].value = settings.preferences.customTheme.background[1];
      };
      changeBackgroundTypeSelection();
    }
  }

  console.log("[SETTINGS] Setting up theme and language selection...")
  settings.setTheme = (option) => {
    let list = ["light", "dark", "system", "custom"]
    if (list.includes(option)) {
      for (let i in list) {
        document.body.classList.remove(list[i].toUpperCase());
      }
      document.body.classList.add(option.toUpperCase());
      systemThemes = {
        highContrast: matchMedia("(forced-colors: active)"),
        darkMode: matchMedia("(prefers-color-scheme: dark)")
      }
      systemThemes.check = () => {
        if (settings.preferences.theme == "system") {
          settings.setTheme("system");
        }
      }
      systemThemes.highContrast.addListener(systemThemes.check);
      systemThemes.darkMode.addListener(systemThemes.check);
      if (option == "system") {
        document.body.classList.add(systemThemes.darkMode.matches ? "DARK" : "LIGHT");
        document.body.style = null;
      } else if (option == "custom") {
        let getContrast = (one, two) => {
          let oneList = one.match(/.{1,2}/g),
            twoList = two.match(/.{1,2}/g),
            getLum = (r, g, b) => {
              let array = [r, g, b].map((value) => {
                value = value / 255;
                return (value <= 0.03928) ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
              });
              return array[0] * 0.2126 + array[1] * 0.7152 + array[2] * 0.0722;
            },
            uno = getLum(parseInt(oneList[0], 16), parseInt(oneList[1], 16), parseInt(oneList[2], 16)),
            dos = getLum(parseInt(twoList[0], 16), parseInt(twoList[1], 16), parseInt(twoList[2], 16));
          return (Math.max(uno, dos) + 0.05) / (Math.min(uno, dos) + 0.05);
        }

        let equivalents = {
          "--background": (settings.preferences.customTheme.background[0] == "file") ? settings.preferences.customTheme.background[1] : (settings.preferences.customTheme.background[0] == "url") ? ((settings.preferences.customTheme.baseTheme == "light") ? `linear-gradient(#ffffffcf, #ffffffcf), url("${settings.preferences.customTheme.background[1]}")` : `linear-gradient(#000000cf, #000000cf), url("${settings.preferences.customTheme.background[1]}")`) : settings.preferences.customTheme.background[1],
          "--hover": settings.preferences.customTheme.background[0] == "url" ? settings.preferences.customTheme.baseTheme == "light" ? "#00000016" : "#ffffff16" : settings.preferences.customTheme.baseTheme == "light" ? "#00000008" : "#ffffff19",
          "--border-colour": settings.preferences.customTheme.background[0] == "url" ? settings.preferences.customTheme.baseTheme == "light" ? "#0000007f" : "#ffffff7f" : settings.preferences.customTheme.baseTheme == "light" ? "#00000016" : "#ffffff7f",
          "--font-colour": settings.preferences.customTheme.baseTheme == "light" ? "black" : "white",
          "--font-colour-sub": settings.preferences.customTheme.baseTheme == "light" ? "#0000007f" : "#ffffffbf",
          "--accent": settings.preferences.customTheme.accent,
          "--accent-semi": settings.preferences.customTheme.accent.slice(0, 7) + "32",
          "--status-success": settings.preferences.customTheme.statusColours.success,
          "--status-caution": settings.preferences.customTheme.statusColours.caution,
          "--status-warning": settings.preferences.customTheme.statusColours.warning,
          "--font-family": settings.preferences.customTheme.uiFont,
          "--font-family-textarea": settings.preferences.customTheme.textareaFont,
          "--radii": (settings.preferences.customTheme.radiiStyle == "soft") ? null : "0px",
          "--radii-pfp": (settings.preferences.customTheme.radiiStyle == "soft") ? null : "0px",
          "--radii-status": (settings.preferences.customTheme.radiiStyle == "soft") ? null : "0px",
          "--radii-meters": (settings.preferences.customTheme.radiiStyle == "soft") ? null : "0px",
          "--radii-checkboxes": (settings.preferences.customTheme.radiiStyle == "soft") ? null : "0px"
        }

        if (settings.preferences.customTheme.background[0] == "colour") {
          if (getContrast(settings.preferences.customTheme.background[1].split("#")[1], (settings.preferences.customTheme.baseTheme == "light") ? "000000" : "FFFFFF") < 2) {
            settings.setTheme("light");
            workspace.setPage("settingsArea");
            settings.setSection("custom");
            window.alert("Woah, your theme doesn't have enough contrast and you won't be able to find stuff!");
            return false;
          }
        }

        for (let [key, value] of Object.entries(equivalents)) {
          document.querySelector(".CUSTOM").style.setProperty(key, value)
        }
      } else {
        document.body.style = null;
      }
    } else {
      settings.setTheme("light")
    }
    settings.preferences.theme = option;
    localStorage.setItem("preferences", JSON.stringify(settings.preferences));
  }
  settings.setTheme(settings.preferences.theme)
  settings.setLanguage = (option) => {
    let list = ["en", "es", "jp", "tr"]
    if (list.includes(option)) {
      for (let i in list) {
        document.body.classList.remove(list[i].toUpperCase());
      }
      document.body.classList.add(option.toUpperCase());
    } else {
      settings.setLanguage("en");
      return false;
    }
    settings.preferences.language = option;
    localStorage.setItem("preferences", JSON.stringify(settings.preferences));
    if (byId("settingsArea").children[0].id.split("-")[1] == "custom") {
      document.body.querySelectorAll("#settingsArea-custom .option-double .option select").forEach((element) => {
        element.value = settings.preferences.customTheme.background[0]
      });
    }
    textarea.placeholder = byLang({en: "Write something beautiful, just like you. :)", es: "Escribe algo hermoso, como tú. :)", jp: "あなたらしく、美しいものを書いてください。(●'◡'●)"});
    // Repeat 2 times to resize the storage area correctly
    byId("storageTitle").click();
    byId("storageTitle").click();
    
    try {
    	if (byId("settingsArea").style.display != "none") {
        settings.setSection(byId("settingsArea").children[0].id.split("-")[1]);
   		}
    } catch (err) {}
  }
  settings.setLanguage(settings.preferences.language)
  settings.setAaSettings = () => {
    document.body.style.setProperty("--font-scaling", settings.preferences.fontScaling)
    try {
      settings.preferences.allowAnimations ? document.body.classList.remove("NO-ANIM") : document.body.classList.add("NO-ANIM")
    } catch (err) {}
    textarea.style.whiteSpace = settings.preferences.textOverflow == "scroll" ? "nowrap" : null;
    textarea.style.overflowX = settings.preferences.textOverflow == "scroll" ? "auto" : null;
  }
  settings.setAaSettings();

  settings.optClickCheck = (element) => {
    return ((element == event.target || element.contains(event.target)) && event.target.className != ("option-action")) && !(element.getElementsByClassName("option-action")[0].contains(event.target)) ? true : false
  }
}

// Set up file data and create file buttons
setup.files = async () => {
  files.makeTree = (target, parent) => {
    let tree = templates.toTree(target);
    for (let [key, value] of Object.entries(tree)) {
      let button = document.createElement("button");
      let ext = key.substring(key.lastIndexOf(".") + 1, key.length);
      if (key.lastIndexOf(".") == -1) {
        ext = undefined;
      }
      button.innerText = key;
      button.id = parent ? `FILE:${parent}/${key}` : `FILE:${key}`;
      let lastSection = document.getElementById("FOLDER:" + parent);
      if (parent) {
        lastSection.append(button)
      } else {
        files.append(button)
      }
      if (typeof value == "object") {
        button.classList.add("folder");
        button.innerHTML = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.91421 2C1.78161 2 1.65443 2.05268 1.56066 2.14645L1.14645 2.56066C1.05268 2.65443 1 2.78161 1 2.91421V7.5C1 7.77614 1.22386 8 1.5 8H8.5C8.77614 8 9 7.77614 9 7.5V3.5C9 3.22386 8.77614 3 8.5 3H4.91421C4.51639 3 4.13486 2.84197 3.85355 2.56066L3.43934 2.14645C3.34557 2.05268 3.21839 2 3.08579 2H1.91421ZM0.853554 1.43934C1.13486 1.15803 1.51639 1 1.91421 1H3.08579C3.48361 1 3.86514 1.15804 4.14645 1.43934L4.56066 1.85355C4.65443 1.94732 4.78161 2 4.91421 2H8.5C9.32843 2 10 2.67157 10 3.5V7.5C10 8.32843 9.32843 9 8.5 9H1.5C0.671573 9 0 8.32843 0 7.5V2.91421C0 2.51639 0.158035 2.13486 0.43934 1.85355L0.853554 1.43934Z"/></svg>` + button.innerText;
        button.onclick = (event) => {
          button.nextElementSibling.style.display = button.nextElementSibling.style.display == "flex" ? null : "flex";
        }
        let div = document.createElement("div");
        div.id = parent ? `FOLDER:${parent}/${key}` : `FOLDER:${key}`;
        if (parent) {
          lastSection.append(div);
          files.makeTree(value, parent + "/" + key);
        } else {
          files.append(div)
          files.makeTree(value, key);
        }
      } else {
        if (ext == "jee") {
          button.innerHTML = `${templates.fileIcons(ext)}${key.slice(0, key.lastIndexOf('.'))}`;
        } else {
          button.innerHTML = `${templates.fileIcons(ext)}${key}`;
        }
        button.onclick = (event) => {
        	selectFile(button.id.replace("FILE:", ""));
          if ((window.innerWidth < 650 || window.innerHeight < 500) && !filesShown) {
            byId("currentFile").click()
          }
        }
      }
    }
  }
  files.refresh = () => {
  	let prevOpened = [];
    files.querySelectorAll("button + div").forEach((item) => {
      if (item.style.display == "flex") {
        prevOpened.push(item.id)
      }
    })
    files.querySelectorAll("button, button + div").forEach((item) => {
      item.remove();
    });
    files.makeTree(fileData)
    prevOpened.forEach((item) => {
      if (document.getElementById(item)) {
        document.getElementById(item).style.display = "flex"
      }
    })
  }
  if (localStorage.getItem("fileData") != null) {
    fileData = JSON.parse(localStorage.getItem("fileData"));
    files.makeTree(fileData);
    selectFile(Object.keys(fileData)[0]);
  } else {
    fileData = "{}";
    fileData = JSON.parse(fileData);
    workspace.setPage("newFile");
  }
  {
    let older = fileData;
    fileData = {};
    for (let i in older) {
      fileData[i.replace(/^\/+/g, "").replace(/\/+$/g, "").split(/\/+/mg).join("/")] = older[i];
    }
  }
  updateStorageBar("local", checkSpace());
}

// Set up preview iframe permissions
setup.previewPerms = () => {
  preview.perms = ["downloads", "forms", "modals", "pointer-lock", "popups", "presentation", "scripts", "top-navigation", "clipboard-read", "clipboard-write"]
  for (let i in preview.perms) {
    try {
    	preview.sandbox.add("allow-" + preview.perms[i]);
    } catch (err) {}
  }
}

// Set page in the workspace
workspace.setPage = (page) => {
  if (page != "textarea") {
    try {
      byId("FILE:" + currentFile).classList.remove("selected");
    } catch (err) {}
    selectFile();
  }
  for (let i = 0; i < workspace.children.length; i++) {
    if (page != workspace.children[i].id) {
      workspace.children[i].style.display = "none";
    } else {
      workspace.children[i].style.display = null;
    }
  }
}

// Changing the files button text
const changeFileButtonText = () => {
  if (currentFile != undefined) {
    byId("currentFile").innerHTML = escapeHTML(currentFile);
  } else {
    byId("currentFile").innerHTML = `<span class="placeholder">${byLang({en: "Select something...", es: "Selecciona algo...", jp: "何かを選択する..."})}</span>`
  }
}

// Current file and file selection
const selectFile = (file, start, end) => {
  try {
    byId("FILE:" + currentFile).classList.remove("selected");
  } catch (err) {
    console.log(`There wasn't a file selected before the selection of ${file}, more info:\n${err}`);
  }
  if (hist[file] == undefined) {
  	updateHistory(file);
	}
  currentFile = file;
  changeFileButtonText();
  localStorage.setItem("currentFile", currentFile);
  if (file) {
    let order = {};
    order[file] = null;
    fileData = Object.assign(order, fileData);
    files.refresh();
    byId("FILE:" + file).classList.add("selected");
    localStorage.setItem("fileData", JSON.stringify(fileData));
  } else {
    console.log("User selected a non-file.");
  }
  workspace.setPage("textarea");
  textarea.value = fileData[file];
  preview.update();
  flyUp(textarea);
  textarea.focus();
  if (start != undefined) {
    let full = fileData[file];
    textarea.value = full.substring(0, end);
    textarea.scrollTop = textarea.scrollHeight;
    textarea.value = full;
    textarea.setSelectionRange(start, end);
  } else {
    textarea.scrollTop = 0;
  }
}

// Toggle files
var filesShown = true;
byId("currentFile").onclick = () => {
  filesShown = !filesShown;
  if (filesShown) {
    byId("main").classList.remove("focused")
  } else {
  	byId("main").classList.add("focused")
  }
}

// Toggle storage
var storageShown = true;
byId("storageTitle").onclick = () => {
  storageShown = !storageShown;
  storage.style.transform = storageShown ? null : `translateY(${storage.getBoundingClientRect().height - byId("storageTitle").getBoundingClientRect().height - 20}px)`;
  storage.style.marginTop = storageShown ? null : `-${storage.getBoundingClientRect().height - byId("storageTitle").getBoundingClientRect().height - 20}px`;
}

/* Updating the theme */
const updateCustomTheme = () => {
  try {
    let customTheme = JSON.parse(fileData["theme.jumble"]);
    let cssNameExceptions = {
      "colours.background.main": "colours-background",
      "radii.main": "radii"
    }
    let getObjects = (obj, origin) => {
      for (let [key, value] of Object.entries(obj)) {
        let path = (origin != undefined) ? `${origin}.${key}` : key;
        if (value && typeof value == "object" && !Array.isArray(value)) {
          getObjects(value, path)
        } else {
          if (Array.isArray(value)) {
            obj[key] = value.join(", ");
          }
          if (cssNameExceptions.hasOwnProperty(path)) {
            document.querySelector(".CUSTOM").style.setProperty("--" + cssNameExceptions[path], obj[key])
          } else {
            document.querySelector(".CUSTOM").style.setProperty("--" + path.replace(/\./g, "-"), obj[key])
          }
        }
      }
    }
    if (theme == "custom") {
      getObjects(customTheme);
    } else {
      try {
        document.body.removeAttribute("style");
      } catch (err) {}
    }
  } catch (err) {
    if (fileData["theme.jumble"] != undefined) {
      alert(`There's an issue with your custom theme...\n` + err);
    }
  }
}

// When textarea is edited
textarea.oninput = (event, noHist) => {
  if (settings.preferences.colonEmojis) {
    let val = textarea.value;
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;
    try {
      val.match(/(:(?![\n])[()#$@+-\w]+:)/g).forEach((item) => {
        if (emoji.json[item.split(":")[1]] == undefined) {
          return false;
        }
        start -= item.length - 2;
        end = start;
        val = val.replace(item, emoji.json[item.split(":")[1]]);
      });
    } catch (err) {}
    textarea.value = val;
    textarea.selectionStart = start;
    textarea.selectionEnd = end;
  }

  fileData[currentFile] = textarea.value;
  localStorage.setItem("fileData", JSON.stringify(fileData));
  if (!noHist) {
    updateHistory(currentFile);
  }
  updateStorageBar("local", checkSpace());
  if (settings.preferences.previewRefresh) {
    preview.update();
  }
}

// Remake undo and redo
const updateHistory = (file) => {
  if (hist[file] == undefined) {
    hist[file] = {};
    hist[file].data = [];
    hist[file].index = -1;
  }
  hist[file].data.push(fileData[file]);
  if (hist[file].data.length > settings.preferences.fileHistoryCap) {
    hist[file].data.shift();
  }
  if (hist[file].index < settings.preferences.fileHistoryCap) {
    hist[file].index++;
  }
  if ((hist[file].data.length - 1) != hist[file].index) {
    hist[file].data.length = hist[file].index;
    hist[file].data.push(fileData[file]);
  }
}

const undo = () => {
  if (hist[currentFile].data[hist[currentFile].index - 1] != undefined) {
    textarea.value = hist[currentFile].data[hist[currentFile].index - 1];
    hist[currentFile].index--;
  }
  textarea.oninput(undefined, true);
}

const redo = () => {
  if (hist[currentFile].data[hist[currentFile].index + 1] != undefined) {
    textarea.value = hist[currentFile].data[hist[currentFile].index + 1];
    hist[currentFile].index++;
  }
  textarea.oninput(undefined, true);
}

// Code preview
preview.update = () => {
  let extension;
  try {
    extension = currentFile.substring(currentFile.lastIndexOf('.') + 1, currentFile.length);
  } catch (err) {}
  if (extension == "html") {
    preview.srcdoc = `<script>
    var __jjFileData__ = ${JSON.stringify(fileData).replaceAll("<\/script>", `</scr" + "ipt>`)};
window.addEventListener('load', (event) => {
  for (let element of document.getElementsByTagName("script")) {
    let src = element.getAttribute("src");
    if (src == undefined) {
      continue;
    }
    if (!(src.startsWith("//") || src.startsWith("http:") || src.startsWith(
"https://") || src.startsWith("data:") || src.startsWith("file:"))) {
      let newer = document.createElement("script");
      newer.type = 'text/javascript';
      newer.text = __jjFileData__[src.replace(\/(\\\/+)\/mg, \"\/\").replace(\/(^\\\/|\\\/$)\/mg, \"\")];
      document.body.appendChild(newer)
      element.parentNode.replaceChild(newer, element)
    }
  }

  for (let element of document.getElementsByTagName("img")) {
    let src = element.getAttribute("src");
    src = src ? src : "local file"
    if (!(src.startsWith("//") || src.startsWith("http:") || src.startsWith(
"https://") || src.startsWith("data:") || src.startsWith("file:"))) {
      element.src = __jjFileData__[src.replace(\/(\\\/+)\/mg, \"\/\").replace(\/(^\\\/|\\\/$)\/mg, \"\")]
    }
  }

  for (let element of document.getElementsByTagName("link")) {
    let src = element.getAttribute("href");
    src = src ? src : "local file"
    if (!(src.startsWith("//") || src.startsWith("http:") || src.startsWith(
"https://") || src.startsWith("data:") || src.startsWith("file:"))) {
      let newer = document.createElement("style")
      newer.innerHTML = __jjFileData__[src.replace(\/(\\\/+)\/mg, \"\/\").replace(\/(^\\\/|\\\/$)\/mg, \"\")]
      element.parentNode.replaceChild(newer, element)
    }
  }
});
<\/script>` + fileData[currentFile];

    preview.style.display = "initial";
    preview.style.width = settings.preferences.previewWidth + "%";
    workspace.style.width = (100 - settings.preferences.previewWidth) + "%";
  } else if (extension == "svg") {
    preview.srcdoc = fileData[currentFile] + `<style>body{background:repeating-conic-gradient(#f5f5f5 0% 25%, #d7d7d7 0% 50%) 50% / 15px 15px;height: 100vh;width:100vw;margin:0;display:flex;align-items:center;justify-content:center} svg{max-height:100vh;max-width:100vw;}</style>`;
    preview.style.display = "initial";
    preview.style.width = settings.preferences.previewWidth + "%";
    workspace.style.width = (100 - settings.preferences.previewWidth) + "%";
  } else if (extension == "py" || extension == "bry") {
  	preview.srcdoc = `<script src="https://brython.info/src/brython.js"><\/script><script type="text/javascript" src="https://brython.info/src/brython_stdlib.js"><\/script><body onload="brython()"><script type="text/python">${fileData[currentFile]}<\/script></body>`;
    preview.style.display = "initial";
    preview.style.width = settings.preferences.previewWidth + "%";
    workspace.style.width = (100 - settings.preferences.previewWidth) + "%";
  } else if (templates.imgExts.includes(extension)) {
    preview.srcdoc = `<img src="${fileData[currentFile]}"><style>body{height: 100vh;width:100vw;margin:0;display:flex;align-items:center;justify-content:center;background:${getComputedStyle(document.body).getPropertyValue("--background")}} img{max-height:100vh;max-width:100vw;}</style>`;
    preview.style.display = "initial";
    preview.style.width = settings.preferences.previewWidth + "%";
    workspace.style.width = (100 - settings.preferences.previewWidth) + "%";
  } else {
  	preview.srcdoc = "";
    preview.style.display = "none";
    if (preview.tab) {
      preview.tab.close();
    }
    workspace.style.width = null;
  }
  if (preview.style.display != "none" && preview.tab) {
    preview.tab.document.documentElement.innerHTML = preview.getAttribute("srcdoc");
    preview.tab.document.title = preview.tab.document.title ? preview.tab.document.title : currentFile;
    preview.tab.document.documentElement.querySelectorAll("script").forEach((older) => {
    newer = preview.tab.document.createElement("script");
    Array.from(older.attributes).forEach((attr) => {
      newer.setAttribute(attr.name, attr.value)
    });
    newer.appendChild(preview.tab.document.createTextNode(older.innerHTML));
    older.parentNode.replaceChild(newer, older);
  });
    preview.focus();
  }
}

// Opening the preview in a new tab
preview.openInNewTab = () => {
  if (preview.tab) {
    preview.tab.close();
  }
  preview.tab = window.open();
  preview.update();
}

// New file
byId("new").onclick = () => {
  workspace.setPage("newFile");
}

// New file
const newFile = (name, content) => {
	name = name.replace(/^\/+/g, "").replace(/\/+$/g, "").split(/\/+/mg).join("/");
  if (fileData[name] == undefined && templates.toTree(fileData)[name] == undefined) {
    fileData[name] = content;
    files.refresh();
    selectFile(name);
  } else {
    alert(`${name} already exists.`);
  }
  localStorage.setItem("fileData", JSON.stringify(fileData));
  updateStorageBar("local", checkSpace());
}

// Detect "new" button click
byId("new-createNew").onclick = () => {
  let name = prompt("What do you want to name your file?");
  name = name.replace(/^\/+/g, "").replace(/\/+$/g, "").split(/\/+/mg).join("/");
  if (name != null && name != "undefined") {
    if (name == undefined || name == "") {
      name = `${new Date().toISOString()}.txt`;
    }
    newFile(name, "");
  } else if (name == "undefined") {
    window.alert("What the fuck?!");
  }
};

// Duplicate files
const duplicateFile = (file) => {
  if (file != undefined) {
    let copy = 1;
    while (fileData[`${file} (${copy})`] != undefined) {
     	copy++
    }
    newFile(`${file} (${copy})`, fileData[file]);
  } else {
    alert("You can not duplicate what does not exist.");
  }
}

// Upload files
const loadReader = (file, reader) => {
	if (checkSpace() + file.size + file.name.length >= 4000000) {
    alert(`You don't have enough space to upload ${file.name}, try clearing up space or uploading a smaller file.`);
    return;
  }
  if (fileData[file.name] == undefined && file.name != "undefined") {
    newFile(file.name, reader.result);
  } else if (file.name == "undefined") {
    window.alert("What the fuck are you doing? Good grief...");
  } else if (confirm(`Do you want to overwrite ${file.name}?`)) {
    deleteFile(file.name);
    newFile(file.name, reader.result);
  } else {
    alert(`${file.name} already exists.`);
  }
}

const uploadFile = (input) => {
  for (let i in input.files) {
    let file = input.files[i];
    let reader = new FileReader();
    try {
      if (file["type"].split("/")[0] == "image" && file["type"] != "image/svg" && file["type"] != "image/svg+xml") {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    } catch (err) {}
    reader.onload = () => {
      loadReader(file, reader);
    }
  }
}

// Detect "upload" button click
byId("new-upload").onclick = () => {
  byId("fileReader").click();
}

// Upload files via drop
window.ondrop = (event) => {
  if (event.dataTransfer.types.includes("Files")) {
    event.preventDefault();
    event.stopPropagation();
    byId("fileDrop").classList.remove("ready");
    let transfer = event.dataTransfer;
    for (let i in transfer.files) {
      if (transfer.files[i].type != undefined) {
        let file = transfer.files[i];
        let reader = new FileReader();
        if (file["type"].split("/")[0] == "image" && file["type"] != "image/svg" && file["type"] != "image/svg+xml" || templates.imgExts.includes(file.name.substring(file.name.lastIndexOf(".") + 1, file.name.length))) {
          reader.readAsDataURL(file);
        } else {
          reader.readAsText(file)
        }
        reader.onload = () => {
          loadReader(file, reader);
        }
      }
    }
  }
}

window.ondragover = (event) => {
  if (event.dataTransfer.types.includes("Files")) {
    byId("fileDrop").classList.add("ready");
    event.preventDefault();
    event.stopPropagation();
  }
}

window.ondragend = byId("fileDrop").ondragleave = (event) => {
  byId("fileDrop").classList.remove("ready");
  event.preventDefault();
}

// Upload from URL
byId("new-url").onclick = async () => {
  let url = await prompt("What's the URL of the file you want to add?");
  if (url == undefined) {
  	return false;
  }
  let response;
  try {
  	response = await fetch(url);
  } catch (err) {
    alert(`A problem occured when getting that file.`);
    throw(err);
  }
  console.log(response)
  if (response.status == 200) {
  	let data = await response.text();
    newFile(url, String(data));
  } else {
    alert(`Oops! We couldn't upload that file because we encounted a ${response.status} error. Maybe you didn't type in the correct URL or the site isn't working.`)
  }
}

// Renaming files
const renameFile = async (before, after) => {
  let temp = fileData[before];
  deleteFile(before);
  newFile(after, temp);
}

// Detect "delete" button click
byId("rename").onclick = () => {
  if (currentFile != undefined) {
    let name = prompt("What should your file's new name be?");
    if (name != null && name != undefined && name != "" && currentFile != undefined && name != "undefined") {
      renameFile(currentFile, name);
    } else if (name == "undefined") {
      window.alert("What the fuck?!");
    }
  } else {
    alert("You can't rename something that's nonexistent.");
  }
};

// Export files
const exportFile = (name, content) => {
  let ext = name.substring(name.lastIndexOf(".") + 1, name.length);
  let blob = new Blob([content], {
    type: "text/plain"
  });
  let dl = document.createElement("a");
  dl.download = name;
  dl.href = templates.imgExts.includes(ext) ? content : window.URL.createObjectURL(blob);
  dl.target = "_blank";
  dl.click();
  dl.remove();
}

// Detect "export" button click
byId("export").onclick = () => {
  if (currentFile != undefined) {
    exportFile(currentFile, textarea.value);
  } else {
    alert("You can't export the empty void.");
  }
}

// Deleting files
const deleteFile = (name) => {
  currentFile = undefined;
  try {
    delete fileData[name];
    files.refresh();
  } catch (err) {
    alert("You can't delete a file that doesn't exist.");
  }
  localStorage.setItem("fileData", JSON.stringify(fileData));
  updateStorageBar("local", checkSpace());
}

// Detect "delete" button click
byId("delete").onclick = () => {
  if (currentFile != undefined) {
    if (confirm(`Are you sure you want to delete ${currentFile}?`)) {
      deleteFile(currentFile);
      workspace.setPage("newFile")
    }
  } else {
    alert("You can't delete the abyssal nothingness.");
  }
}

// Detect "settings" button click
byId("settings").onclick = () => {
  workspace.setPage("settingsArea");
  settings.setSection("main");
}

const checkSpace = () => {
  let data = "";
  for (let i in localStorage) {
    if (localStorage.hasOwnProperty(i)) {
      data += localStorage[i];
    }
  }
  return data.length;
};

const getSizeType = (bytes, decimals = 2) => {
  if (bytes === 0) {
    return '0B';
  }
  let k = 1000;
  let dm = decimals < 0 ? 0 : decimals;
  let sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
}

let updateStorageBar = (name, size) => {
  let percent = (size / 4000000) * 100;
  percent = Math.ceil(percent * 10) / 10;
  byId(`meter-${name}-amount`).style.width = percent + "%";
  byId(`meter-${name}-count`).innerHTML = getSizeType(size);
  if (percent >= 50) {
    if (percent >= 75) {
      byId(`meter-${name}`).classList.remove("caution");
      byId(`meter-${name}`).classList.add("warning");
    } else {
      byId(`meter-${name}`).classList.add("caution");
      byId(`meter-${name}`).classList.remove("warning");
    }
  } else {
    byId(`meter-${name}`).classList.remove("caution");
    byId(`meter-${name}`).classList.remove("warning");
  }
}

// Quick search aka finder
finder.open = () => {
  if (finder.style.display != "flex") {
    let actions = {
      new: {
        name: {
          en: "Create a new file",
          es: "Crear un nuevo archivo"
        },
        func: `byId("new-createNew").click();finder.close()`,
        alt: {
          en: ["make", "build"],
          es: ["nuevo", "crea", "cree", "hacer", "nueva", "nuevo"]
        }
      },
      ee: {
        name: {
          en: "Create a new file using the Easy Editor",
          es: "Crear un nuevo archivo con el Easy Editor"
        },
        func: `byId("new-ee").click()`,
        alt: {
          en: ["make", "build", "ee", "jee"],
          es: ["nuevo", "crea", "cree", "hacer", "nueva", "nuevo", "ee", "jee"]
        }
      },
      upload: {
        name: {
          en: "Upload a file from your computer",
          es: "Cargar un archivo desde su computadora"
        },
        func: `byId("new-upload").click()`,
        alt: {
          en: ["import", "transfer"],
          es: ["importar", "transferencia", "transferencio"]
        }
      },
      uploadViaUrl: {
        name: {
          en: "Upload a file from the internet via URL",
          es: "Cargar un archivo desde Internet a través de una URL"
        },
        func: `byId("new-url").click()`,
        alt: {
          en: ["import", "transfer", "internet", "net", "online", "uri", "https", "server", "api"],
          es: ["importar", "transferencia", "transferencio", "internet", "net", "línea", "uri", "https", "servidor", "api"]
        }
      },
      duplicate: {
        name: {
          en: `Duplicate ${currentFile}`,
          es: `Duplicado ${currentFile}`
        },
        func: `duplicateFile("${currentFile}")`,
        alt: {
          en: ["another", "same", "dupe", "double", "copy", "mirror"],
          es: ["otro", "otra", "mismo", "misma", "duplicado", "duplicada", "duplicar", "duplicidad", "doble", "copia", "copio", "copiar", "espejo", "espeja"]
        }
      },
      rename: {
        name: {
          en: `Rename ${currentFile}`,
          es: `Renombrar ${currentFile}`
        },
        func: `byId("rename").click()`,
        alt: {
          en: ["new", "file name", "filename"],
          es: ["nueva", "nuevo", "nombre"]
        }
      },
      export: {
        name: {
          en: `Download ${currentFile} to your computer`,
          es: `Descargue ${currentFile} en su ordenador`
        },
        func: `byId("export").click()`,
        alt: {
          en: ["export", "dl"],
          es: ["exportar", "exportación", "exporte", "descargar"]
        }
      },
      delete: {
        name: {
          en: `Delete ${currentFile}`,
          es: `Eliminar ${currentFile}`
        },
        func: `byId("delete").click()`,
        alt: {
          en: ["remove", "rubbish", "trash", "explode", "incinerate", "kill", "murder", "destroy", "eat", "devour"],
          es: ["borra", "borre", "borro", "quitar", "basura", "tirar", "explotar", "incinerar", "incinere", "matar", "asesinato", "destruir", "destruya", "destruye", "comer", "devorar", "devora", "devoren"]
        }
      },
      settings: {
        name: {
          en: "Open settings",
          es: "Abrir la configuración"
        },
        func: `workspace.setPage("settingsArea")`,
        alt: {
          en: ["options", "preferences", "toggles", "switch"],
          es: ["opciones", "preferencias", "alternar", "palanca", "interruptor"]
        }
      },
      personalisation: {
        name: {
          en: "Open personalisation settings",
          es: "Abrir la configuración de personalisation"
        },
        func: `workspace.setPage("settingsArea"); settings.setSection("personalisation")`,
        alt: {
          en: ["custom", "customisation", "customization", "theme"],
          es: ["personalizada", "personalizado", "personalización", "tema"]
        }
      },
      aa: {
        name: {
          en: "Open adjustments and accessibility settings",
          es: "Abrir la configuración de ajustes y accesibilidad"
        },
        func: `workspace.setPage("settingsArea"); settings.setSection("aa")`,
        alt: {
          en: ["a11y", "options"],
          es: ["a11y", "opciones"]
        }
      },
      shortcuts: {
        name: {
          en: "Open shortcut reference",
          es: "Abrir referencia de accesos directos"
        },
        func: `workspace.setPage("settingsArea"); settings.setSection("shortcuts")`,
        alt: {
          en: ["command", "ctrl", "cmd", "shortcuts"],
          es: ["comando", "ctrl", "cmd", "acceso", "directo", "rápidos", "atajos"]
        }
      },
      lang_en: {
        name: {
          en: "Change language to English",
          es: "Cambiar el idioma al inglés"
        },
        func: `settings.setLanguage("en")`,
        alt: {
          en: ["british", "britain", "america", "american"],
          es: ["británico", "británica", "británicos", "américa", "americano"]
        }
      },
      lang_es: {
        name: {
          en: "Change language to Spanish",
          es: "Cambiar el idioma al español"
        },
        func: `settings.setLanguage("es")`,
        alt: {
          en: ["mexican", "mexico", "spanish", "spain", "espanol", "español"],
          es: ["mexicana", "mexicano", "méxico", "españa"]
        }
      },
      sidebar: {
        name: {
          en: `${filesShown ? "Close" : "Open"} the sidebar`,
          es: `${filesShown ? "Cerrar" : "Abrir"} la barra lateral`
        },
        func: `byId("currentFile").click()`,
        alt: {
          en: ["collapse", "toggle"],
          es: ["colapso", "colapsar", "alternar"]
        }
      },
      lightMode: {
        name: {
          en: "Turn on light mode",
          es: "Activar el modo de luz"
        },
        func: `settings.setTheme("light")`,
        alt: {
          en: ["white", "lamps", "lightbulbs"],
          es: ["blanca", "blanco", "lámparas", "lámparos", "bombillas", "bombillos"]
        }
      },
      darkMode: {
        name: {
          en: "Turn on dark mode",
          es: "Activar el modo de oscuro"
        },
        func: `settings.setTheme("dark")`,
        alt: {
          en: ["black", "darkness", "shadow"],
          es: ["negra", "negro", "oscuridad", "sombra", "oscura"]
        }
      },
      customTheme: {
        name: {
          en: "Enable your custom theme",
          es: "Activar su tema personalizado"
        },
        func: `settings.setTheme("custom")`,
        alt: {
          en: ["customisation", "customization", "theme"],
          es: ["habilite", "personalizada", "personalizado", "personalización", "tema"]
        }
      },
    }
    byId("search").placeholder = byLang({
      en: "Search for a file or an action...",
      es: "Buscar un archivo o una acción..."
    });
    byId("results").innerHTML += `<div id="noResultsFound"><span lang="en">We couldn't find anything based on your search!</span><span lang="es">¡No hemos podido encontrar nada en su búsqueda!</span></div>`;
    byId("results").innerHTML += `<h4 id="finder-maths-title"><span lang="en">Calculator</span><span lang="es">Calculadora</span></h4>`;
    let list = document.createElement("ul");
    list.id = "finder-maths";
    byId("results").appendChild(list);
    byId("results").innerHTML += `<h4 id="finder-files-title"><span lang="en">Files</span><span lang="es">Archivos</span></h4>`;
    list = document.createElement("ul");
    list.id = "finder-files";
    for (let [key, value] of Object.entries(fileData)) {
      list.innerHTML += templates.finderFile(key);
    }
    byId("results").appendChild(list);
    byId("results").innerHTML += `<h4 id="finder-actions-title"><span lang="en">Actions</span><span lang="es">Acciones</span></h4>`;
    list = document.createElement("ul");
    list.id = "finder-actions";
    for (let i in actions) {
      list.innerHTML += `<li onclick='${actions[i].func};finder.close()' tabindex='0' alt='${actions[i].alt[settings.preferences.language ? settings.preferences.language : "en"]}'>${actions[i].name[settings.preferences.language ? settings.preferences.language : "en"]}</li>`;
    }
    byId("results").appendChild(list);
    byId("results").innerHTML += `<h4 id="finder-find-title"></h4>`;
    list = document.createElement("ul");
    list.id = "finder-find";
    byId("results").appendChild(list);
    finder.style.display = "flex";
    byId("search").focus();
    byId("search").select();
    for (i = 0; i < finder.getElementsByTagName("li").length; i++) {
      finder.getElementsByTagName("li")[i].onkeydown = (event) => {
        if (event.keyCode == 13) {
          event.target.click();
        }
      }
    }

    let narrowList = () => {
      // Find files which names contain search query
      let inThis = 0;
      for (i = 0; i < byId("finder-files").children.length; i++) {
        let item = byId("finder-files").children[i];
        item.style.display = item.innerText.toUpperCase().indexOf(byId("search").value.toUpperCase()) > -1 ? null : "none";
        if (item.innerText.toUpperCase().indexOf(byId("search").value.toUpperCase()) > -1) {
          inThis++
        }
      }
      for (i = 0; i < byId("finder-files").getElementsByTagName("li").length; i++) {
        byId("finder-files").getElementsByTagName("li")[i].onkeydown = (event) => {
          if (event.keyCode == 13) {
            event.preventDefault();
            event.target.click();
          }
        }
      }
      byId("finder-files").style.display = byId("finder-files-title").style.display = (inThis < 1) ? "none" : null;
      // Find actions which names contain search query
      inThis = 0;
      for (i = 0; i < byId("finder-actions").children.length; i++) {
        let item = byId("finder-actions").children[i];
        let altContains = (element, query) => {
          let alt = element.getAttribute("alt")
          let s = [alt.split(","), query.split(" ")]
          for (let i in s[0]) {
            for (let i2 in s[1]) {
              if (s[0][i].includes(s[1][i2]) && s[1][i2].length > 2 || s[1][i2] == s[0][i]) {
                return true;
              }
            }
          }
          return false;
        }
        item.style.display = item.innerText.toUpperCase().indexOf(byId("search").value.toUpperCase()) > -1 || altContains(item, byId("search").value.toLowerCase()) ? null : "none";
        if (item.innerText.toUpperCase().indexOf(byId("search").value.toUpperCase()) > -1 || altContains(item, byId("search").value.toLowerCase())) {
          inThis++
        }
      }
      for (i = 0; i < byId("finder-actions").getElementsByTagName("li").length; i++) {
        byId("finder-actions").getElementsByTagName("li")[i].onkeydown = (event) => {
          if (event.keyCode == 13) {
            event.preventDefault();
            event.target.click();
          }
        }
      }
      byId("finder-actions").style.display = byId("finder-actions-title").style.display = (inThis < 1) ? "none" : null;
      // Find indices of search query
      let getIndices = (search, string) => {
        if (search.length == 0) {
          return;
        }
        let i = 0;
        let index, indices = [];
        string = string.toLowerCase();
        search = search.toLowerCase();
        while ((index = string.indexOf(search, i)) > -1) {
          indices.push(index);
          i = index + search.length;
        }
        return indices;
      }
      byId("finder-maths").style.display = byId("finder-maths-title").style.display = (byId("search").value == "") ? "none" : null;
      inThis = 0;
      byId("finder-maths").innerHTML = ""
      let equation = math.validate(byId("search").value)
      if (equation) {
    		equation = equation.value ? equation.value : equation
    		if (equation.type == "ResultSet") {
      		equation.entries.forEach((item) => {
        		byId("finder-maths").innerHTML += templates.maths(item);
            inThis++
      		});
    		} else if (typeof equation != "function") {
      		byId("finder-maths").innerHTML += templates.maths(equation);
          inThis++
    		}
  		}
      for (i = 0; i < byId("finder-maths").getElementsByTagName("li").length; i++) {
        byId("finder-maths").getElementsByTagName("li")[i].onkeydown = (event) => {
          if (event.keyCode == 13) {
            event.preventDefault();
            event.target.click();
          }
        }
      }
      byId("finder-maths").style.display = byId("finder-maths-title").style.display = (inThis < 1) ? "none" : null;
      byId("finder-find-title").innerHTML = `<span lang="en">Occurences of ${byId("search").value}</span><span lang="es">Ocurrencias de ${byId("search").value}</span>`;
      byId("finder-find").style.display = byId("finder-find-title").style.display = (byId("search").value == "") ? "none" : null;
      inThis = 0;
      byId("finder-find").innerHTML = "";
      for (let [key, value] of Object.entries(fileData)) {
        let resInFile = 0;
        if (byId("search").value.length < 3) {
          break;
        }
        let indices = getIndices(byId("search").value, value);
        for (let i in indices) {
          if (i == 0) {
            resInFile = 0;
          }
          byId("finder-find").innerHTML += `<li onclick="selectFile('${key}', ${indices[i]}, ${indices[i] + byId("search").value.length}); finder.close()" tabindex="0">${key}<span class="tag">${indices[i]}</span></li>`;
          inThis++;
          resInFile++;
        }
      }
      for (i = 0; i < byId("finder-find").getElementsByTagName("li").length; i++) {
        byId("finder-find").getElementsByTagName("li")[i].onkeydown = (event) => {
          if (event.keyCode == 13) {
            event.preventDefault();
            event.target.click();
          }
        }
      }
      byId("finder-find").style.display = byId("finder-find-title").style.display = (inThis < 1) ? "none" : null;
      byId("noResultsFound").style.display = (byId("finder-find").style.display == "none" && byId("finder-files").style.display == "none" && byId("finder-actions").style.display == "none" && byId("finder-maths").style.display == "none") ? "block" : null;
    }
    narrowList();

    byId("search").oninput = narrowList;
  } else {
    finder.close();
  }
}

finder.close = (event) => {
  try {
    if (finder == event.target) {
      finder.style.display = null;
      byId("results").innerHTML = "";
    }
  } catch (err) {
    finder.style.display = null;
    byId("results").innerHTML = "";
  }
}

finder.onclick = finder.close;
finder.onkeydown = (event) => {
  if (event.key == "Escape") {
    finder.close();
  } else if (event.key != "Tab" && !event.shiftKey) {
    byId("search").focus();
    if (event.target != byId("search")) {
      byId("search").select();
    }
  }
}

// Getting emojis
let emoji = {};
emoji.try = 0;
emoji.get = async () => {
  if (emoji.json != undefined) {
    return true;
  }
  emoji.try++
  try {
    let response = await fetch("https://raw.githubusercontent.com/ArkinSolomon/discord-emoji-converter/master/emojis.json");
    if (response.status == 200) {
      emoji.json = await response.json();
      console.log(`Emojis have been loaded on try #${emoji.try}.`)
    }
  } catch (err) {
    return false;
  }
};

emoji.get();
emoji.check = setInterval(() => {
  if (navigator.onLine) {
    emoji.get();
  }
  if (emoji.json != undefined) {
    clearInterval(emoji.check);
  }
}, 5000);

// Shortcuts
window.onkeydown = (event) => {
  if (event.key == "Tab") {
    if (finder.style.display != "none") {
      let selector = `#finder [tabindex]:not([tabindex="-1"]):not([style="display: none;"]), #finder input`;
      let focusableContent = document.querySelectorAll(selector);
      let firstFocusableElement = focusableContent[0];
      let lastFocusableElement = focusableContent[focusableContent.length - 1];
      if (event.shiftKey) {
        if (document.activeElement == firstFocusableElement) {
          event.preventDefault();
          lastFocusableElement.focus();
        }
      } else if (document.activeElement == lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
        event.preventDefault();
      }
    }
  } else if (event.ctrlKey && event.altKey && event.key == "n") {
    event.preventDefault();
    document.getElementById("new").click();
  } else if (event.ctrlKey && (event.keyCode == 192 || event.keyCode == 223)) {
    event.preventDefault();
    document.getElementById("new").click();
  } else if (event.ctrlKey && event.key == "d") {
    event.preventDefault();
    duplicateFile(currentFile);
  } else if (event.ctrlKey && event.key == "\\") {
    event.preventDefault();
    document.getElementById("rename").click();
  } else if (event.ctrlKey && event.key == "e") {
    event.preventDefault();
    document.getElementById("export").click();
  } else if (event.ctrlKey && event.shiftKey && event.keyCode == "40") {
    event.preventDefault();
    document.getElementById("export").click();
  } else if (event.ctrlKey && event.shiftKey && event.keyCode == "8" ||
    event.ctrlKey && event.shiftKey && event.keyCode == "46") {
    event.preventDefault();
    document.getElementById("delete").click();
  } else if (event.ctrlKey && event.shiftKey && event.keyCode == "8" ||
    event.ctrlKey && event.keyCode == "13") {
    event.preventDefault();
    preview.update();
    if (event.shiftKey) {
    	preview.openInNewTab();
    }
  } else if (textarea == document.activeElement && (event.ctrlKey && event.key == "z") && !event.shiftKey) {
    event.preventDefault();
    undo();
  } else if (textarea == document.activeElement && event.ctrlKey && (event.shiftKey && event.key == "z" || event.key == "y")) {
    event.preventDefault();
    redo();
  } else if (event.ctrlKey && event.key == "k") {
    event.preventDefault();
    finder.open();
  } else if (event.ctrlKey && event.shiftKey && (event.which >= 49 && event.which <= 57)) {
    event.preventDefault();
    list = [];
    files.querySelectorAll("button").forEach((item) => {
      if (item.nextElementSibling) {
        if (item.nextElementSibling.tagName == "DIV") {
          return;
        }
      }
      list.push(item.id.replace("FILE:", ""))
    });
    if (event.which == 57) {
      selectFile(list[list.length - 1]);
      return true;
    }
    [1, 2, 3, 4, 5, 6, 7, 8].forEach((i) => {
      if (event.which == i + 48) {
        if (list[i - 1]) {
          selectFile(list[i - 1])
          return true;
        }
      }
    });
  }
};

// Smartkeys
textarea.onkeydown = (event) => {
	if (event.ctrlKey) {
  	return;
  }
  
  let pv = () => {
    event.preventDefault();
  }

  let start = textarea.selectionStart;
  let end = textarea.selectionEnd;

  switch (event.key) {
    case "Tab":
      pv();
      textarea.value = textarea.value.substring(0, start) + ` `.repeat(settings.preferences.tabSize) + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + Number(settings.preferences.tabSize);
      break;
    case "{":
      pv();
      if (Math.abs(textarea.value.substring(start, end).length) != 0) {
        textarea.value = `${textarea.value.substring(0, start)}{${textarea.value.substring(start, end)}}${textarea.value.substring(end)}`;
        textarea.selectionStart = start + 1;
        textarea.selectionEnd = end + 1;
      } else {
        textarea.value = textarea.value.substring(0, start) + `{}` + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }
      break;
    case "}":
      if (Math.abs(textarea.value.substring(start, end).length) == 0) {
        if (textarea.value.substring(end).slice(0, 1) == `}`) {
          pv();
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }
      }
      break;
    case "(":
      pv();
      if (Math.abs(textarea.value.substring(start, end).length) != 0) {
        textarea.value = `${textarea.value.substring(0, start)}(${textarea.value.substring(start, end)})${textarea.value.substring(end)}`;
        textarea.selectionStart = start + 1;
        textarea.selectionEnd = end + 1;
      } else {
        textarea.value = textarea.value.substring(0, start) + `()` + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }
      break;
    case ")":
      if (Math.abs(textarea.value.substring(start, end).length) == 0) {
        if (textarea.value.substring(end).slice(0, 1) == `)`) {
          pv();
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }
      }
      break;
    case "[":
      pv();
      if (Math.abs(textarea.value.substring(start, end).length) != 0) {
        textarea.value = `${textarea.value.substring(0, start)}[${textarea.value.substring(start, end)}]${textarea.value.substring(end)}`;
        textarea.selectionStart = start + 1;
        textarea.selectionEnd = end + 1;
      } else {
        textarea.value = textarea.value.substring(0, start) + `[]` + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }
      break;
    case "]":
      if (Math.abs(textarea.value.substring(start, end).length) == 0) {
        if (textarea.value.substring(end).slice(0, 1) == `]`) {
          pv();
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }
      }
      break;
    case "<":
      pv();
      if (Math.abs(textarea.value.substring(start, end).length) != 0) {
        textarea.value = `${textarea.value.substring(0, start)}<${textarea.value.substring(start, end)}>${textarea.value.substring(end)}`;
        textarea.selectionStart = start + 1;
        textarea.selectionEnd = end + 1;
      } else {
        textarea.value = textarea.value.substring(0, start) + `<>` + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }
      break;
    case ">":
      if (Math.abs(textarea.value.substring(start, end).length) == 0) {
        if (textarea.value.substring(end).slice(0, 1) == `>`) {
          pv();
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }
      }
      break;
  }
  if ("(){}[]<>".includes(event.key) || event.key == "Tab") {
    textarea.oninput(event);
  }
}







document.oncontextmenu = (event) => {
  let extension = currentFile.substring(currentFile.lastIndexOf('.') + 1, currentFile.length);
  if (!Number(settings.preferences.defaultContextMenu) || (extension != "jee" && Number(settings.preferences.defaultContextMenu) == 1)) {
    return;
  }
  event.preventDefault();
  if (event.target == textarea || event.target.id.includes("FILE:")) {
    byId("undo").disabled = hist[currentFile] ? hist[currentFile].index == 0 : true;
    byId("redo").disabled = hist[currentFile] ? hist[currentFile].index + 1 == hist[currentFile].data.length : true;
    byId("cut").disabled = byId("copy").disabled = textarea.selectionStart - textarea.selectionEnd == 0;
    let menu = byId("contextMenu");
    menu.style.display = "block";
    menu.style.left = event.pageX + "px";
    menu.style.top = event.pageY + "px";
    if (menu.getBoundingClientRect().x + menu.getBoundingClientRect().width > window.innerWidth) {
      menu.style.left = window.innerWidth - menu.getBoundingClientRect().width + "px";
    }
    if (menu.getBoundingClientRect().y + menu.getBoundingClientRect().height > window.innerHeight) {
      menu.style.top = event.pageY - menu.getBoundingClientRect().height + "px";
    }
  } else {
    document.documentElement.click();
  }
};

window.onclick = (event) => {
  if (event.target.id != "contextMenu" && !(byId("contextMenu").contains(event.target))) {
    byId("contextMenu").style.display = null;
  }
}

byId("undo").onclick = () => {
	undo();
  document.documentElement.click();
}

byId("redo").onclick = () => {
	redo();
  document.documentElement.click();
}

// Flyup animation
const flyUp = (element) => {
  element.classList.remove("animation-flyUp");
  element.classList.add("animation-flyUp");
  setTimeout(() => {
    element.classList.remove("animation-flyUp");
  }, 500)
}
