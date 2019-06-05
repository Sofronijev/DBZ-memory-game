$(document).ready(function () {

    let slike = ["./db/goku.jpg", "./db/krillin.jpg", "./db/vegeta.jpeg", "./db/gohan.jpg", "./db/roshi.jpg", "./db/android18.jpg", "./db/broly.png", "./db/buu.png", "./db/frieza.webp", "./db/cell.webp", "./db/goten.jpeg", "./db/kidbuu.jpg", "./db/pikolo.jpg", "./db/tien.jpeg", "./db/trunks.png"]

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
            $("#karte").append("<div class='kartica'><img class='prednjaStrana' src=''><img class='zadnjaStrana' src='./db/kugla.png' alt='kugla'></div>");
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
            //iskljucim dugne da ne moze vise da se koristi
            $("#promesaj").prop('disabled', true);
        } else {
            window.alert("Prvo izaberite broj slika");
        }
    });

    $("#start").click(function () {
        //provera da li su izmesane karte
        if ($("#promesaj").prop('disabled') == true) {            

            //okrecem kartice na klik
            $(".kartica").click(function () {
                $(this).addClass(" rotiraj");
               
            });

            


        } else {
            window.alert("Morate prvo da izaberete i promesate karte");
        }
    });


});