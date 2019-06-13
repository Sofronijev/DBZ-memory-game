$(document).ready(function () {


    let pictures = ["./db/goku.jpg", "./db/krillin.jpg", "./db/vegeta.jpeg", "./db/gohan.jpg", "./db/roshi.jpg", "./db/chichi.jpg", "./db/yamcha.jpg", "./db/chautzu.jpg", "./db/frieza.jpg", "./db/cell.jpg", "./db/android18.jpg", "./db/kidbuu.jpg", "./db/pikolo.jpg", "./db/tien.jpeg", "./db/trunks.jpg"]

    //prvo dugme
    $("#showBtn").click(function () {
        let picturesNumber = $("#number").val();
        //proveravam da li je korisnik uneo dobar broj
        if (picturesNumber > 15 || picturesNumber < 1) {
            window.alert("Unesite broj slika izmedju 1 i 15!");
            return false;
        }
        //za unet broj, dodaje slike
        for (let i = 0; i < picturesNumber * 2; i++) {
            $("#board").append("<div class='memoryCard'><img class='cardFront' src=''><img class='cardBack' src='./db/kugla.jpg' alt='kugla'></div>");
        }

        //ovde treba da dodajem razlicite slike, 'i' se povecava za 2 da bi na po 2 karte stavio istu sliku
        for (let i = 0, y = 0; i < picturesNumber * 2, y < picturesNumber; i += 2, y++) {
            $("#board .memoryCard:eq(" + i + ") .cardFront").attr("src", pictures[y]);
            $("#board .memoryCard:eq(" + (i + 1) + ") .cardFront").attr("src", pictures[y]);
        }

        //rotira karticu da se vidi na pocetku
        $(".memoryCard").addClass(" rotate");
        $(".cardFront").addClass(" rotate");

        //iskljuci se da ne moze da se vise puta klikce
        $("#showBtn").prop('disabled', true);
        //iskljucim input, da ne moze da se menja
        $("#number").prop('disabled', true);

    });

    $("#startBtn").click(function () {
        //provera da li su izabrene slike
        if ($("#showBtn").prop('disabled') == true) {

            //iskljucujem dugme da ne moze vise da se pritiska
            $("#startBtn").prop('disabled', true);
            //uvodim ponovo promenljivu broj slika
            let picturesNumber = $("#number").val();

            //okrecem karte
            $(".memoryCard").removeClass(" rotate");
            $(".cardFront").removeClass(" rotate");

            //pravim niz sa random brojevima
            let randomNumbers = []
            while (randomNumbers.length < picturesNumber * 2) {
                var r = Math.floor(Math.random() * picturesNumber * 2) + 1;
                if (randomNumbers.indexOf(r) === -1) randomNumbers.push(r);
            }
            //mesam karte sa nizom random brojeva i orderom
            function suffleCards() {
                for (let i = 0; i < picturesNumber * 2; i++) {
                    $("#board .memoryCard:eq(" + i + ")").css("order", randomNumbers[i]);
                }
            }
            //ovo sam postavio jer kad nema timeouta, kad se okrecu karte odmah se vidi na kratko gde se koja karta rasporedila prilikom mesanja
            setTimeout(suffleCards, 200);

            //Tajmer
            let disableBoard = false;
            let timeRemaining = 60;
            let timerField = $("#timer");
            let timer = setInterval(() => {
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
                if (cardsMatched == picturesNumber) {
                    clearInterval(timer);
                    $("#endGame").text("VICTORY!");
                    endTextOn();
                }
            });

        } else {
            window.alert("Prvo izaberite broj slika");
        }
    });
});