let height = 0;

$("#player").on("click", function (ev) {
  height += 10;
  let backgroundString =
    "linear-gradient( to bottom,hsl(" +
    height +
    ", 100%, 80%) 0%,hsl(" +
    (height + 60) +
    ", 100%, 80%) 100%)";
  $("#live-game").css("background-image", backgroundString);
});
