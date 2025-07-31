//Spinner

class Spinner extends HTMLElement {
    connectedCallback(){
        this.innerHTML=`
            <div class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
    }
}

customElements.define('custom-spinner', Spinner)