$(document).ready(function () {
  const SIDE_SIZE = 4;
  initWindow();
  const elems = $('.cell');
  fillCell();// first init value
  fillCell();// second init value

  let flagActionCell = false;// no actions in cells
  let flagEndGame = false;// game over
  let flagGameWinner = false;// game winner
  let row = [];// massiv row
  let column = [];//massiv column

  for (let i = 0; i < $('#Game').children().length; i++) {
    let cell = $($('#Game').children()[i]).children();
    row[row.length] = cell;
  }

  for (let i = 0; i < $('#Game').children().length; i++) {
    let column1 = [];
    for (let j = 0; j < $('#Game').children().length; j++) {
      let column2 = row[j][i];
      column1[column1.length] = column2;
    }
    column[column.length] = column1;
  }

  $("body").keyup(function (event) {
    if (event.keyCode == 39) {
      for (let i = 0; i < row.length; i++) {
        actionRightUp(row[i]);
      }
      if (flagActionCell) { fillCell(); flagActionCell = false }
      checkWinner();
      gameOver()
    }
  });

  $("body").keyup(function (event) {
    if (event.keyCode == 37) {
      for (let i = 0; i < row.length; i++) {
        actionLeftDown(row[i]);
      }
      if (flagActionCell) { fillCell(); flagActionCell = false }
      checkWinner();
      gameOver()
    }
  });

  $("body").keyup(function (event) {
    if (event.keyCode == 40) {
      for (let i = 0; i < column.length; i++) {
        actionRightUp(column[i]);
      }
      if (flagActionCell) { fillCell(); flagActionCell = false }
      checkWinner();
      gameOver()
    }
  });

  $("body").keyup(function (event) {
    if (event.keyCode == 38) {
      for (let i = 0; i < column.length; i++) {
        actionLeftDown(column[i]);
      }
      if (flagActionCell) { fillCell(); flagActionCell = false }
      checkWinner();
      gameOver()
    }
  });

  $('#button').click(function () {
    $($($('#Game').children()).children()).empty();
    fillCell();// fitst init value
    fillCell();// second init value
    $('#points').html('0');
  })

  function initWindow() {
    let countCell = 1;
    for (let i = 1; i <= SIDE_SIZE; i++) {
      $("<div>", { id: "row" + i }).appendTo("#Game");

      for (let j = 1; j <= SIDE_SIZE; j++) {
        $("<div>", { id: "cell" + countCell, class: "cell" }).appendTo("#row" + i);
        countCell = countCell + 1;
      }
    }
  }

  function randCell(elems) {
    let randCell = Math.floor(Math.random() * elems.length);
    return randCell;
  }

  function checkWinner() {
    if (!flagGameWinner) {
      for (let i = 1; i <= SIDE_SIZE * SIDE_SIZE; i++) {
        if (+$("#cell" + i).text() == 2048) {
          alert('Winer');
          flagGameWinner = true;
        }
      }
    }
  }

  function gameOver() {
    let checkEmptyCell = createMasEmptyCell();
    if (checkEmptyCell.length == 0) {
      console.log(flagEndGame);
      flagEndGame = false;
      for (let i = 0; i < row.length; i++) {
        for (let j = 0; j < row[i].length; j++) {
          if ($(row[i][j]).text() == $(row[i][j - 1]).text()) {
            flagEndGame = true;
          }
        }
      }
      if (!flagEndGame) {
        for (let i = 0; i < column.length; i++) {
          for (let j = 0; j < column[i].length; j++) {
            if ($(column[i][j]).text() == $(column[i][j - 1]).text()) {
              flagEndGame = true;
            }

          }
        }
      }
      if (!flagEndGame) {
        alert('Game over');
        if (confirm("Играем заново?")) {
          $("#button").click();
        }
      }
    }
  }

  function createMasEmptyCell() {
    let emptyCell = [];
    for (let i = 0; i < elems.length; i++) {
      if ($(elems[i]).is(':empty')) {
        emptyCell[emptyCell.length] = elems[i];
      }
    }
    return emptyCell;
  }

  // fill random empty cell
  function fillCell() {
    let emptyCell = createMasEmptyCell();
    // chance falling out number
    let arr = ["2", "4"];
    let elemMas = 0;
    let r = Math.random();
    switch (true) {
      case (r < 0.09): elemMas = 1; break; // 9%
      case (r >= 0.09 && r < 1): elemMas = 0; break;  // 91%     
    }
    //
    let InitValIndex = randCell(emptyCell);
    $(emptyCell[InitValIndex]).html("<span class='cell-" + arr[elemMas] + "'>" + arr[elemMas] + "</span>")
  }

  function checkCellsEmptyActionRightUp(el) {
    for (let i = el.length - 1; i >= 0; i--) {
      if ($(el[i]).is(':empty')) {
        for (let j = i - 1; j >= 0; j--) {
          if ($(el[j]).is(':empty')) { continue; }
          else {
            $(el[i]).html(("<span class='cell-" + +$(el[j]).text() + "'>" + $(el[j]).text() + "</span>"));
            $(el[j]).empty();
            i--;
            flagActionCell = true;
          }
        }
      }
    }
  };

  function actionRightUp(el) {
    checkCellsEmptyActionRightUp(el);
    for (let i = el.length - 1; i > 0; i--) {
      let prevCell = $(el[i - 1]).text();
      let currSell = $(el[i]).text();
      if (prevCell == 0 & currSell == 0) { continue }
      if (prevCell == currSell) {
        $('#points').html(+$('#points').text() + (prevCell * 2));
        $(el[i]).html("<span class='cell-" + (prevCell * 2) + "'>" + (prevCell * 2) + "</span>");
        $(el[i - 1]).empty();
        flagActionCell = true;
      }
    }
    checkCellsEmptyActionRightUp(el);
  }

  function checkCellsEmptyActionLeftDown(el) {
    for (let i = 0; i <= el.length - 1; i++) {
      if ($(el[i]).is(':empty') == true) {
        //alert("элемент пустой");
        for (let j = i + 1; j <= el.length - 1; j++) {
          if ($(el[j]).is(':empty') == true) { continue; }
          else {
            $(el[i]).html(("<span class='cell-" + (+$(el[j]).text()) + "'>" + $(el[j]).text() + "</span>"));
            $(el[j]).empty();
            i++;
            flagActionCell = true;
          }
        }
      }
    }
  };

  function actionLeftDown(el) {
    checkCellsEmptyActionLeftDown(el);
    for (let i = 0; i <= el.length - 1; i++) {
      let currCell = $(el[i + 1]).text();
      let followCell = $(el[i]).text();
      if (currCell == 0 & followCell == 0) { continue }
      if (currCell == followCell) {
        $('#points').html(+$('#points').text() + (currCell * 2));
        $(el[i]).html("<span class='cell-" + (currCell * 2) + "'>" + (currCell * 2) + "</span>");
        $(el[i + 1]).empty();
        flagActionCell = true;
      }
    }
    checkCellsEmptyActionLeftDown(el);
  }
})



