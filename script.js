const qSel = (elemento)=> document.querySelector(elemento);
const qsAll = (elemento)=> document.querySelectorAll(elemento);
let cart = [];
let modalQuant = 1;
let modalKey = 0;


//adicionar e listar as pizzas
pizzaJson.map((item, index)=>{
    let noPizza = qSel('.models .pizza-item').cloneNode(true); //clona o nó com o q tiver dentro

    noPizza.setAttribute('data-key', index);
    //adicionar info das pizzas no HTML
    noPizza.querySelector('.pizza-item--img img').src = item.img;
    noPizza.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    noPizza.querySelector('.pizza-item--name').innerHTML = item.name;
    noPizza.querySelector('.pizza-item--desc').innerHTML = item.description;
    noPizza.querySelector('.pizza-item--name').innerHTML = item.name;
    
    //abrir tela de informação quando clica na pizza
    noPizza.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault(); // impede o default (href=" ") de executar
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalKey = key;
        modalQuant = 1;
        
        qSel('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qSel('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        qSel('.pizzaBig img').src = pizzaJson[key].img;
        qSel('.pizzaInfo--actualPrice').innerHTML= `R$ ${pizzaJson[key].price.toFixed(2)}`;
        qSel('.pizzaInfo--size.selected').classList.remove('selected');

        qsAll('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        qSel('.pizzaInfo--qt').innerHTML = modalQuant;

        
        qSel('.pizzaWindowArea').style.opacity = 0;
        qSel('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => { // seta um delay pra ocorrer a animacao do css
            qSel('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    qSel('.pizza-area').append(noPizza); // append adiciona conteudo (inner HTML substitui)
});

//eventos do modal
function closeModal(){
    qSel('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        qSel('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

qsAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

qSel('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQuant > 1){
        modalQuant -= 1 ;
        qSel('.pizzaInfo--qt').innerHTML = modalQuant;
    }
});

qSel('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQuant+=1;
    qSel('.pizzaInfo--qt').innerHTML = modalQuant;
});

qsAll('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click',(e)=>{
        qSel('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

qSel('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(qSel('.pizzaInfo--size.selected').getAttribute('data-key'));
    
    let identifier = pizzaJson[modalKey].id +'@'+size;

    let key = cart.findIndex((item)=>item.identifier == identifier);
    
    if(key > -1){
        cart[key].qt += modalQuant;
    }else{
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQuant});
    }
    updateCart();
    closeModal(); 
});

qSel('.menu-openner').addEventListener('click',()=>{
    if(cart.length > 0){
        qSel('aside').style.left = '0';
    }
});

qSel('.menu-closer').addEventListener('click',()=>{
    qSel('aside').style.left = '100vw';    
});

qSel('.cart--finalizar').addEventListener('click',()=>{
    cart = [];
    alert("Compra finalizada com sucesso!");
    updateCart();
    closeModal();
})

function updateCart(){
    qSel('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        qSel('aside').classList.add('show');
        qSel('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id);

            subtotal += pizzaItem.price * cart[i].qt;
            
            let cartItem = qSel('.models .cart--item').cloneNode(true);
            
            let pizzaSizeName;

            switch(cart[i].size){
                case 0: pizzaSizeName = 'P';
                    break;
                case 1: pizzaSizeName = 'M';
                    break;
                case 2: pizzaSizeName = 'G';
                    break;
                
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1){
                    cart[i].qt -= 1;
                } else {
                    cart.splice(i,1);
                }
                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt += 1;
                updateCart();
            });
            

            qSel('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        qSel('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        qSel('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        qSel('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        qSel('aside').classList.remove('show');
        qSel('aside').style.left = '100vw'; 
    }
}

