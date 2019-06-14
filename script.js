$(document).ready(function () {

    //putanja svih slika (src)
    let pictures = ["./db/goku.jpg", "./db/krillin.jpg", "./db/vegeta.jpeg", "./db/gohan.jpg", "./db/roshi.jpg", "./db/chichi.jpg", "./db/yamcha.jpg", "./db/chautzu.jpg", "./db/frieza.jpg", "./db/cell.jpg", "./db/android18.jpg", "./db/kidbuu.jpg", "./db/pikolo.jpg", "./db/tien.jpeg", "./db/trunks.jpg"]
    //deklarisem promenljivu timer da bi mogla da se koristi u dve razlicite funkcije
    let timer;
    $("#difficulty").change(function () {

        $picturesNumber = $("#difficulty").val();
        $board = $("#board");
        //cistim prvo tablu
        $board.empty();
        //dodajem kartice
        for (let i = 0; i < $picturesNumber / 2; i++) {
            for (let y = 0; y < 2; y++) {
                $board.append("<div class='memoryCard'><img class='cardFront' src='" +
                    pictures[i] + "'><img class='cardBack' src='./db/kugla.jpg' alt='kugla'></div>");
            }
        }
        //rotira karticu da se vidi na pocetku
        $(".memoryCard").addClass(" rotate");
        $(".cardFront").addClass(" rotate");
    });

    $("#startBtn").click(function () {

        if ($("#difficulty").val() != 0) {




            //ne moze vise da se menja difficulty
            $("#difficulty").prop('disabled', true);
            //iskljucujem dugme da ne moze vise da se pritiska
            $("#startBtn").prop('disabled', true);


            //uvodim ponovo promenljivu broj slika
            let picturesNumber = $("#difficulty").val();

            //okrecem karte
            $(".memoryCard").removeClass(" rotate");
            $(".cardFront").removeClass(" rotate");

            //pravim niz sa random brojevima
            let randomNumbers = []
            while (randomNumbers.length < picturesNumber) {
                var r = Math.floor(Math.random() * picturesNumber) + 1;
                if (randomNumbers.indexOf(r) === -1) randomNumbers.push(r);
            }
            //mesam karte sa nizom random brojeva i orderom
            function suffleCards() {
                for (let i = 0; i < picturesNumber; i++) {
                    $("#board .memoryCard:eq(" + i + ")").css("order", randomNumbers[i]);
                }
            }
            //ovo sam postavio jer kad nema timeouta, kad se okrecu karte odmah se vidi na kratko gde se koja karta rasporedila prilikom mesanja
            setTimeout(suffleCards, 200);

            //Tajmer
            let disableBoard = false;
            let timeRemaining = 60;
            let timerField = $("#timer");
            timer = setInterval(() => {
                timerField.text(timeRemaining + " s");
                timeRemaining--;
                if (timeRemaining < 0) {
                    clearInterval(timer);
                    //ne moze vise da se sklikce na kartice                   
                    $("#endGame").text("DEFEAT!");
                    endTextOn();
                    disableBoard = true;
                }
            }, 1000);

            let flippedCard = false;
            let firstFlipped;
            let secondFlipped;
            let totalMoves = 0;
            let cardsMatched = 0;

            //fukncija koja pokazuje tekst kad se zavrsi igra
            function endTextOn() {
                $("#overlay").css("display", "block");
            }
            //fukncija koja sklanja tekst
            function endTextOff() {
                $("#overlay").css("display", "none");
            }
            $("#overlay").click(endTextOff);
            //okrecem kartice na klik
            $(".memoryCard").click(function () {
                //ako postoje vec dve otkrivene ceka se da se vrate ili ako je isteklo vreme
                if (disableBoard) {
                    return false;
                }

                //dodaje klasu rotate na klikutu karticu
                $(this).addClass(" rotate");
                //da li je prvi klik
                if (!flippedCard) {
                    flippedCard = true;
                    firstFlipped = $(this);

                    //ako nije onda je drugi    
                } else {
                    //ovde pazimo da se nije dva puta kliknulo na istu kartu
                    //ako je karta na koju smo kliknuli ista kao prva nakoju smo kliknuli onda false
                    if ($(this).css("order") == firstFlipped.css("order")) {
                        return false;
                    }
                    flippedCard = false;
                    secondFlipped = $(this);
                    //proveravam da li se slike poklapaju kod okrenutih kartica
                    if (firstFlipped.children(".cardFront").attr("src") ==
                        secondFlipped.children(".cardFront").attr("src")) {
                        //iskljucujemo klik efekat da uparenim karticama
                        firstFlipped.off("click");
                        secondFlipped.off("click");
                        //registruje se pogodak, broji potez i ispisuje na stranici
                        cardsMatched++;
                        totalMoves++;
                        $("#moves").text(totalMoves);

                    } else {
                        //pauzira se funkcija da se okrecu karte dok se ove dve ne vrate
                        disableBoard = true;
                        //kartice se okrecu, settimeout je da bi se videle na kratko
                        setTimeout(function () {
                            firstFlipped.removeClass("rotate");
                            secondFlipped.removeClass("rotate");
                            disableBoard = false;
                        }, 1000);
                        totalMoves++;
                        $("#moves").text(totalMoves);
                    }
                }
                if (cardsMatched * 2 == picturesNumber) {
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
        totalMoves = 0;
        $("#moves").text("0");
        cardsMatched = 0;
        timeRemaining = 60;
        $("#timer").text("");
    });

});