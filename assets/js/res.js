const resultText = JSON.parse(localStorage.getItem('result'));
console.log(resultText)
if(resultText[0] === 'Halal'){
    document.getElementById('res').innerHTML = `<p class="pt-3 fs-5 fw-bold">Halal Zertifiziert</p>
                        <p>Dieses Produkt entspricht den islamischen Ernährungsvorschriften und kann bedenkenlos konsumiert werden.</p>`;
    document.getElementById('resContent').style.background = '#00b25d'                     
    document.getElementById('resIcon').src = "./assets/images/check.png";
    document.getElementById('warnung').style.display = 'none';
      
}

if(resultText[0] === 'Haram'){
    document.getElementById('res').innerHTML = `<p class="pt-3 fs-5 fw-bold">Nicht Halal</p>
                        <p>Dieses Produkt enthält Inhaltsstoffe, die nicht mit islamischen Ernährungsvorschriften vereinbar sind.</p>`;
    document.getElementById('resContent').style.background = '#f2003c';
    document.getElementById('resIcon').src = "./assets/images/kreuz.png";
    document.getElementById('warnung').style.display = 'block';
    document.getElementById('reason').textContent = resultText[4]
                
}

if(resultText[0] === 'null'){
    document.getElementById('res').innerHTML = `<p class="pt-3 fs-5 fw-bold">Produkt nicht gefunden</p>`;
    document.getElementById('resContent').style.background = '#f2003c';
    document.getElementById('resIcon').src = "./assets/images/kreuz.png";                
}

document.getElementById('barcode').textContent = resultText[2];


//info-area
const data = JSON.parse(localStorage.getItem('data'));
document.getElementById('productImage').src = data.product.image_url
document.getElementById('productName').textContent = data.product.product_name;
document.getElementById('category').textContent = data.product.categories.split(',')[0]
document.getElementById('zutaten').textContent = data.product.ingredients_text

localStorage.clear()


const buttons = document.getElementsByClassName('returnBtn')

for(let btn of buttons){
    btn.addEventListener(('click'), home);
}

function home(){
    window.location.href = 'index.html';
}

window.addEventListener('load', () => {
    window.location.href="index.html";
})