//Logo la Voz 

class LogoLaVoz extends HTMLElement{
    connectedCallback(){
        this.innerHTML=`
            <div class="logo-container">
                <img src="../img/voz_argentina_transparente.png" class="img-logo" alt="Imagen logo la Voz Argentina" />
            </div>
        `;
    }
}

customElements.define('logo-lavoz', LogoLaVoz);