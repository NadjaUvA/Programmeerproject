/**
* This script contains functions that toggle between hiding and showing the
* dropdown content when the user clicks on the dropwdown button.
*
* Nadja van 't Hoff (11030720)
*/

/*
* show search bar in dropdown menu
*/
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
};

/*
* search for the right country entered in the search bar
*/
function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("dropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    }
    else {
      a[i].style.display = "none";
    };
  };
};
