
var url = window.location.pathname;
if(url.split("/").indexOf("services",1) != -1){
      var element = document.getElementById("before_header");
      var element1 = document.getElementById("top_menu_container");
      var element2 = document.getElementById("footer");
      var element3 = document.getElementById("wrap");
      if(typeof element.classList != "undefined"){
        element.classList.remove("bg-dark");
        element.classList.add("theme_danger");
        // element1.classList.remove("bg-dark");
        element1.classList.add("theme_danger");
        element2.classList.add("theme_danger");
        element3.classList.add("theme_danger");
      }
      document.querySelectorAll('meta[name="theme-color"]')[0].setAttribute("content","#dc3545")
      document.querySelectorAll('meta[name="msapplication-navbutton-color"]')[0].setAttribute("content","#dc3545")
      document.querySelectorAll('meta[name="apple-mobile-web-app-status-bar-style"]')[0].setAttribute("content","#dc3545")
}
if(url.split("/").indexOf("contactus",1) != -1){
      var element = document.getElementById("before_header");
      var element1 = document.getElementById("top_menu_container");
      var element2 = document.getElementById("footer");
      var element3 = document.getElementById("wrap");
      if(typeof element.classList != "undefined"){
        element.classList.remove("bg-dark");
        element.classList.add("theme_blue");
        element1.classList.add("theme_blue");
        element2.classList.add("theme_blue");
        element3.classList.add("theme_blue");
      }
      document.querySelectorAll('meta[name="theme-color"]')[0].setAttribute("content","#003049")
      document.querySelectorAll('meta[name="msapplication-navbutton-color"]')[0].setAttribute("content","#003049")
      document.querySelectorAll('meta[name="apple-mobile-web-app-status-bar-style"]')[0].setAttribute("content","#003049")
}

