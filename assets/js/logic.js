


let isCameraOn = false;
let stream = null;
const camera = document.getElementById('camera');
const btn = document.getElementById('btn');

var html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", { fps: 10, qrbox: 250 });
        
function onScanSuccess(decodedText, decodedResult) {
    document.getElementById('reader').textContent = decodedText
    scannenSelected(decodedText);

    console.log(`Scan result: ${decodedText}`, decodedResult);
    html5QrcodeScanner.clear();
}

html5QrcodeScanner.render(onScanSuccess);
//btn.addEventListener('click', cameraClicked);
/*
async function cameraClicked() { //wird nicht mehr gebraucht
    const cameraNote = document.getElementById('cameraNote');

    if (!isCameraOn) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        camera.style.display = 'block';
        cameraNote.style.display = 'none';
        camera.srcObject = stream;
        btn.textContent = 'Kamera schließen';
        isCameraOn = true;
        scannenSelected();
    }
    else {
        if(stream){
            camera.srcObject = null;
            stream.getTracks().forEach(track => track.stop())
            stream = null;
        }

        isCameraOn = false;
        btn.textContent = 'Kamera starten';
        camera.style.display = 'none';
        cameraNote.style.display = 'block';
    }

}
*/
//window.myfunction = async function scannenSelected(barcode) {
    async function scannenSelected(barcode) {
        console.log(`Scan result:`);

        barcode = 20706876;

    await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`).then(
        (response) => {
            return response.json()
        }).then((data) => {
            try {

                let product = data.product;
                let haramZutat = null;

                let zutaten = product.ingredients_text_de
                    || product.ingredients_text
                    || product.ingredients_text_en;

                let result = '';

                if (zutaten) {
                    let zutatenListe = zutaten.split(',').map(z => z.trim()).map(z => z.toLowerCase());
                    haramZutat = checkZutaten(zutatenListe)
                }

                /*if (!haramZutat && product._keywords) {
                    haramZutat = checkZutaten(product._keywords);
                }*/

                if (haramZutat) {
                    //document.getElementById("res").textContent = 'Haram'
                    result = ['Haram', zutaten, barcode, haramZutat]
                }
                else if(!zutaten){
                    result = ['null', 'null', barcode]

                }
                else {
                    //document.getElementById("res").textContent = 'Halal'
                    result = ['Halal',zutaten, barcode]
                }
                localStorage.setItem('result',JSON.stringify(result))
                localStorage.setItem('data', JSON.stringify(data))
                window.location.href =`result.html`

            } catch (error) {
                document.getElementById("res").textContent = 'Etwas ist schief gelaufen. Versuchen Sie es später erneut!';

                console.log(error)
            }
        })
}

function checkZutaten(zutaten) {
    let haramInhaltstoffeLowe = haramInhaltstoffe.map(e => e.toLowerCase())
    return zutaten.find(z => haramInhaltstoffeLowe.includes(z))
}

let haramInhaltstoffe = [
    // 1. SCHWEIN & DERIVATE (Haram)
    'Schwein',
    'Schweinefleisch',
    'Speck',
    'Lard',
    'Schweineschmalz',
    'Schweinegelatine',
    'Schweineenzyme',
    'Wildschweinfleisch',
    'Schweinefett',
    'Schweineborsten',
    'Schweinederivate',
    'Schweineprotein',
    'Porcin', // Lateinisch/Englisch für Schwein

    // 2. TIERISCHE PRODUKTE & VERBOTENE TIERE (Haram)
    'Blut', // Als Zutat
    'Aas',
    'Nicht-Halal geschlachtet',
    'Gelatine', // Kritisch, wenn nicht Halal/Pflanzlich
    'Lab', // Kritisch, wenn Tierlab
    'Kasein', // Kritisch, wenn nicht-Halal Lab verwendet
    'Molkenpulver', // Kritisch, wenn nicht-Halal Lab verwendet
    'Kollagen', // Kritisch, wenn nicht Halal/Pflanzlich
    'Chondroitin', // Kritisch, wenn nicht Halal/Pflanzlich
    'L-Cystein', // E920, E921 - Kritisch (aus Schwein/Haar)
    'Hundefleisch',
    'Schlangenfleisch',
    'Affen',
    'Löwe', // Stellvertretend für alle fleischfressenden Raubtiere
    'Tiger',
    'Bär',
    'Adler', // Stellvertretend für alle Raubvögel
    'Geier',
    'Ratte',
    'Skorpion',
    'Reptilien',
    'Amphibien',
    'Pferdefleisch',
    'Eselfleisch',

    // 3. ALKOHOL & RAUSCHMITTEL (Haram)
    'Ethanol',
    'Ethylalkohol',
    'Alkohol',
    'Whisky',
    'Bier',
    'Alkoholische Getränke',
    'Berauschend',
    'Toxisch',
    'Weinessig', // Kritisch, wenn Alkohol nicht vollständig umgewandelt

    // 4. KRITISCHE ZUSATZSTOFFE (E-Nummern & Synonyme)
    'Mono- und Diglyceride von Speisefettsäuren', // E471
    'Diglyceride',
    'Speisefettsäuren',
    'Fettsäureester', // E472 (a-f)
    'Glycerin', // E422
    'Glyzerin',
    'Stearinsäure', // E570
    'Polysorbat', // E432-E436
    'Lecithin', // E322 - Kritisch, wenn aus Tierfett
    'Lactat', // Kritisch, wenn tierischen Ursprungs (E325, E326)
    'Magnesiumstearat', // Kritisch, wenn tierischen Ursprungs

    // 5. KRITISCHE FARBSTOFFE & ÜBERZÜGE
    'Cochenille', // E120
    'Echtes Karmin', // E120
    'Schellack', // E904
    'Klärstoffe', // Oft Gelatine oder Fischblase

    // 6. AROMEN & GESCHMACKSVERSTÄRKER
    'Aromen', // Kritisch, wenn mit Ethanol extrahiert
    'Inosinat', // E627 - Kritisch (tierisch möglich)
    'Guanylat', // E631 - Kritisch (tierisch möglich)
    'Ribonucleotid', // E635 - Kritisch (tierisch möglich)

    // 7. WEITERE HARAM QUELLEN
    'Nicht halal zertifiziert', // Allgemein für Maschbūh Produkte
    'Tierfett', // Ohne Angabe der Tierart
    'Knochenmehl' // Kritisch, wenn nicht-Halal Tierknochen
];