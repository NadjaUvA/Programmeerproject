/**
* This script contains functions such that when the user clicks on the dropwdown
* button, toggle between hiding and showing the dropdown content
*
* Nadja van 't Hoff (11030720)
*/

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {

  // select element that coincides with input of searchbar
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("dropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}
