$(document).ready(function () {

    let slike = ["./db/goku.jpg", "./db/krillin.jpg", "./db/vegeta.jpeg", "./db/gohan.jpg", "./db/roshi.jpg", "./db/chichi.jpg", "./db/yamcha.jpg", "./db/chautzu.jpg", "./db/frieza.jpg", "./db/cell.jpg", "./db/android18.jpg", "./db/kidbuu.jpg", "./db/pikolo.jpg", "./db/tien.jpeg", "./db/trunks.jpg"]

    //prvo dugme
    $("#prikazi").click(function () {
        let brojSlika = $("#broj").val();
        //proveravam da li je korisnik uneo dobar broj
        if (brojSlika > 15 || brojSlika < 1) {
            window.alert("Unesite broj slika izmedju 1 i 15!");
            return false;
        }
        //za unet broj, dodaje slike
        for (let i = 0; i < brojSlika * 2; i++) {
            $("#karte").append("<div class='kartica'><img class='prednjaStrana' src=''><img class='zadnjaStrana' src='./db/kugla.jpg' alt='kugla'></div>");
        }

        //ovde treba da dodajem razlicite slike, 'i' se povecava za 2 da bi na po 2 karte stavio istu sliku
        for (let i = 0, y = 0; i < brojSlika * 2, y < brojSlika; i += 2, y++) {
            $("#karte .kartica:eq(" + i + ") .prednjaStrana").attr("src", slike[y]);
            $("#karte .kartica:eq(" + (i + 1) + ") .prednjaStrana").attr("src", slike[y]);
        }

        //rotira karticu da se vidi na pocetku
        $(".kartica").addClass(" rotiraj");
        $(".prednjaStrana").addClass(" rotiraj");

        //iskljuci se da ne moze da se vise puta klikce
        $("#prikazi").prop('disabled', true);
        //iskljucim input, da ne moze da se menja
        $("#broj").prop('disabled', true);

    });

    $("#promesaj").click(function () {
        //provera da li su izabrene slike
        if ($("#prikazi").prop('disabled') == true) {

            //iskljucujem dugme da ne moze vise da se pritiska
            $("#promesaj").prop('disabled', true);
            //uvodim ponovo promenljivu broj slika
            let brojSlika = $("#broj").val();

            //okrecem karte
            $(".kartica").removeClass(" rotiraj");
            $(".prednjaStrana").removeClass(" rotiraj");

            //pravim niz sa random brojevima
            let randomBrojevi = []
            while (randomBrojevi.length < brojSlika * 2) {
                var r = Math.floor(Math.random() * brojSlika * 2) + 1;
                if (randomBrojevi.indexOf(r) === -1) randomBrojevi.push(r);
            }
            //mesam karte sa nizom random brojeva i orderom
            function mesanje() {
                for (let i = 0; i < brojSlika * 2; i++) {
                    $("#karte .kartica:eq(" + i + ")").css("order", randomBrojevi[i]);
                }
            }
            //ovo sam postavio jer kad nema timeouta, kad se okrecu karte odmah se vidi na kratko gde se koja karta rasporedila prilikom mesanja
            setTimeout(mesanje, 200);
            let okrenutaKartica = false;
            let prvaOkrenuta;
            let drugaOkrenuta;
            let pauza = false;
            let brojPogodaka = 0;

            //okrecem kartice na klik
            $(".kartica").click(function () {
                //ako postoje vec dve otkrivene ceka se da se vrate
                if (pauza) {
                    return false;
                }

                //dodaje klasu rotiraj na klikutu karticu
                $(this).addClass(" rotiraj");
                //da li je prvi klik
                if (!okrenutaKartica) {
                    okrenutaKartica = true;
                    prvaOkrenuta = $(this);

                    //ako nije onda je drugi    
                } else {
                    //ovde pazimo da se nije dva puta kliknulo na istu kartu
                    //ako je karta na koju smo kliknuli ista kao prva nakoju smo kliknuli onda false
                    if ($(this).css("order") == prvaOkrenuta.css("order")) {
                        return false;
                    }
                    okrenutaKartica = false;
                    drugaOkrenuta = $(this);
                    //proveravam da li se slike poklapaju kod okrenutih kartica
                    if (prvaOkrenuta.children(".prednjaStrana").attr("src") == drugaOkrenuta.children(".prednjaStrana").attr("src")) {
                        //iskljucujemo klik efekat da uparenim karticama
                        prvaOkrenuta.off("click");
                        drugaOkrenuta.off("click");
                        //registruje se pogodak i ispisuje na stranici
                        brojPogodaka++;
                        $("#pogodak").text(brojPogodaka);

                    } else {
                        //pauzira se funkcija da se okrecu karte dok se ove dve ne vrate
                        pauza = true;
                        //kartice se okrecu, settimeout je da bi se videle na kratko
                        setTimeout(function () {
                            prvaOkrenuta.removeClass("rotiraj");
                            drugaOkrenuta.removeClass("rotiraj");
                            pauza = false;
                        }, 1000);


                    }
                }
                if (brojPogodaka == brojSlika) {
                    $("#kraj").text("Bravo! Presli ste igru!");
                }
            });

        } else {
            window.alert("Prvo izaberite broj slika");
        }
    });
});