const qSel = (elemento)=> document.querySelector(elemento);
const qsAll = (elemento)=> document.querySelectorAll(elemento);
let modalQuant = 1;


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