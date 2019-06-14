$(document).ready(() => {

    //putanja svih slika (src)
    let pictures =
        [
            "./db/goku.jpg", "./db/krillin.jpg", "./db/vegeta.jpeg", "./db/gohan.jpg", "./db/roshi.jpg",
            "./db/chichi.jpg", "./db/yamcha.jpg", "./db/chautzu.jpg", "./db/frieza.jpg", "./db/cell.jpg",
            "./db/android18.jpg", "./db/kidbuu.jpg", "./db/pikolo.jpg", "./db/tien.jpeg", "./db/trunks.jpg"
        ];
    //deklarisem promenljivu timer da bi mogla da se koristi u dve razlicite funkcije
    let timer;

    $("#difficulty").change(() => {

        let numOfPictures = $("#difficulty").val();
        let board = $("#board");
        //prvo se cisti tabla svaki put kad se promeni difficulty
        board.empty();
        //dodajem kartice
        for (let i = 0; i < numOfPictures / 2; i++) {
            for (let y = 0; y < 2; y++) {
                board.append("<div class='memoryCard'><img class='cardFront' src='" +
                    pictures[i] + "'><img class='cardBack' src='./db/kugla.jpg' alt='kugla'></div>");
            }
        }
        //rotira karticu da se vidi na pocetku
        $(".memoryCard").addClass(" rotate");
    });



    $("#startBtn").click(() => {

        let numOfPictures = $("#difficulty").val();
        let randomNumbers = [];
        let disableBoard = false;
        let timeRemaining = 59;
        let timerField = $("#timer");
        let endGameText = $("#overlay");
        let flippedCard = false;
        let firstFlipped;
        let secondFlipped;
        let totalMoves = 0;
        let cardsMatched = 0;
        let counter = $("#moves");

        if (numOfPictures != 0) {

            //ne moze vise da se menja difficulty
            $("#difficulty").prop('disabled', true);
            //iskljucujem start dugme da ne moze vise da se pritiska
            $("#startBtn").prop('disabled', true);
            //okrecem karte
            $(".memoryCard").removeClass(" rotate");

            //pravim niz sa random brojevima
            while (randomNumbers.length < numOfPictures) {
                var number = Math.floor(Math.random() * numOfPictures) + 1;
                if (randomNumbers.indexOf(number) === -1) randomNumbers.push(number);
            }
            //mesam karte sa nizom random brojeva i orderom     
            function suffleCards() {
                for (let i = 0; i < numOfPictures; i++) {
                    $("#board .memoryCard:eq(" + i + ")").css("order", randomNumbers[i]);
                }
            }
            //settimeout je da se karte ne bi videle na kratko kad se promesaju
            setTimeout(suffleCards, 200);

            //Tajmer
            function countdown() {
                timerField.text(timeRemaining);
                timeRemaining--;
                if (timeRemaining < 0) {
                    clearInterval(timer);
                    $("#endGame").text("DEFEAT!");
                    endTextOn();
                    //ne moze vise da se klikce na kartice 
                    disableBoard = true;
                }
            }
            timer = setInterval(countdown, 1000);

            //fukncije koje pokazuju i sklanjaju tekst
            function endTextOn() {
                endGameText.css("display", "block");
            }
            function endTextOff() {
                endGameText.css("display", "none");           
            }
            //kad se pojavi tekst, na klik se sklanja
            endGameText.click(endTextOff);

            //okrecem kartice na klik
            $(".memoryCard").click(function () {
                //ako postoje vec dve otkrivene ceka se da se vrate ili ako je isteklo vreme
                if (disableBoard) {
                    return false;
                }
                //dodaje klasu rotate na kliknutu karticu
                $(this).addClass(" rotate");

                //da li je prvi klik, ako ne postoje okrenute karte
                if (!flippedCard) {
                    flippedCard = true;
                    firstFlipped = $(this);

                    //ako nije onda je drugi    
                } else {
                    //ovde pazimo da se nije dva puta kliknulo na istu kartu
                    //ako je karta na koju smo kliknuli ista kao prva na koju smo kliknuli onda false
                    if ($(this).css("order") == firstFlipped.css("order")) {
                        return false;
                    }
                    secondFlipped = $(this);
                    flippedCard = false;

                    //proveravam da li se slike poklapaju kod okrenutih kartica
                    if (firstFlipped.children(".cardFront").attr("src") ==
                        secondFlipped.children(".cardFront").attr("src")) {
                        //iskljucujemo klik efekat na uparenim karticama
                        firstFlipped.off("click");
                        secondFlipped.off("click");
                        //registruje se pogodak, broji potez i ispisuje na stranici
                        cardsMatched++;
                        totalMoves++;
                        counter.text(totalMoves);

                    } else {
                        //iskljucuje se tabla da se ne okrecu karte dok se ove dve ne vrate
                        disableBoard = true;
                        //kartice se okrecu, settimeout je da bi se videle na kratko
                        function turnCards() {
                            firstFlipped.removeClass("rotate");
                            secondFlipped.removeClass("rotate");
                            disableBoard = false;
                        }
                        setTimeout(turnCards, 1000);
                        totalMoves++;
                        counter.text(totalMoves);
                    }
                }
                if (cardsMatched * 2 == numOfPictures) {
                    clearInterval(timer);
                    $("#endGame").text("VICTORY!");
                    endTextOn();
                }
            });

        } else {
            window.alert("Please choose difficulty level!");
        }


    });
    //dugme za restart igre
    $("#restartBtn").click(function () {
        $("#board").empty();
        $("#difficulty").prop('disabled', false);
        $("#difficulty").val("0");
        $("#startBtn").prop('disabled', false);
        clearInterval(timer);
        $("#moves").text("0");
        $("#timer").text("60");
    });

});