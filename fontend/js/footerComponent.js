//Componenete Footer

class MiFooter extends HTMLElement{
    connectedCallback(){
        this.innerHTML=`
            <footer class="mt-5 mb-5">
                <div class="d-flex justify-content-center">
                <img src="../img/logo_playtown.png" alt="Imagen logo playtown" class="imgFooter">
                </div>
            </footer>
        `;
    }
}

customElements.define('footer-custom', MiFooter);



