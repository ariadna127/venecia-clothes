let cards = [10000, 15000, 30000, 40000, 50000, 60000];

const contenedorCards = document.querySelector('#contenedor-cards');
const select = document.querySelector('#select');


function cargarCards(cards) {
    contenedorCards.innerHTML = '';

    cards.forEach((card)=>{
        const div = document.createElement('div');
        div.classList.add('div-gift-card');
        div.innerHTML = `
                <div class="gift-1">
                    <div>
                        <p><strong>Venecia</strong></p>
                        <p><i>GIFT <br> CARD</i></p>
                        <p class="p-gift">$${card}</p>
                    </div>
                </div>
                <div class="gift-2">
                    <p>Gift Card</p>
                    <p>$${card}</p>
                </div>
        `;
        contenedorCards.append(div);
    })


}


cargarCards(cards);

select.addEventListener('change', ordenarPor);

function ordenarPor() {
    const orden = select.value;
    const cardsCopia = [...cards]
    cardsCopia.sort((a, b)=>{
        if (a < b) {
            return orden === 'p:men-ma' ? -1 : 1;
        }else{
            return orden === 'p:men-ma' ? 1 : -1;
        }
    })

    cargarCards(cardsCopia);
}
